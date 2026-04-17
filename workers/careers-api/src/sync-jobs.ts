import { parseDescription } from './parse-description';
import { commitJobsJson, type JobEntry } from './github';

/* Env is exported from index.ts (Task 5 adds the export) */
import type { Env } from './index';

interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  custom_fields: Array<{
    id: string;
    name: string;
    type: string;
    value?: unknown;
    type_config?: {
      options?: Array<{ id: string; name?: string; label?: string; orderindex: number }>;
    };
  }>;
}

interface ClickUpTasksResponse {
  tasks: ClickUpTask[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCustomFieldValue(task: ClickUpTask, fieldName: string): string {
  const field = task.custom_fields.find(
    (f) => f.name.toLowerCase() === fieldName.toLowerCase()
  );
  if (!field || field.value === undefined || field.value === null) return '';

  /* Dropdown fields store a numeric orderindex as value — resolve to the option name */
  if (field.type === 'drop_down' && field.type_config?.options) {
    const option = field.type_config.options.find(
      (o) => o.orderindex === field.value
    );
    return option?.name || '';
  }

  /* Labels fields store an array of label option indices */
  if (field.type === 'labels' && Array.isArray(field.value) && field.type_config?.options) {
    return (field.value as number[])
      .map((idx) => {
        const option = field.type_config!.options!.find((o) => o.orderindex === idx);
        return option?.label || option?.name || '';
      })
      .filter(Boolean)
      .join(',');
  }

  /* Date fields store a unix timestamp in ms — ClickUp uses the user's local midnight,
     so we add 12h before extracting the UTC date to avoid off-by-one across timezones */
  if (field.type === 'date' && field.value) {
    const ts = Number(field.value);
    if (!isNaN(ts)) {
      const d = new Date(ts + 12 * 60 * 60 * 1000);
      return d.toISOString().split('T')[0]; /* YYYY-MM-DD */
    }
  }

  return String(field.value);
}

function getLocationArray(task: ClickUpTask): string[] {
  /* Prefer the labels-type Location field (there are multiple fields named "Location") */
  const labelsField = task.custom_fields.find(
    (f) => f.name.toLowerCase() === 'location' && f.type === 'labels'
  );
  if (labelsField && Array.isArray(labelsField.value) && labelsField.type_config?.options) {
    return (labelsField.value as (string | number)[])
      .map((val) => {
        /* ClickUp labels value can be option IDs (strings) or orderindex (numbers) */
        const opt = typeof val === 'string'
          ? labelsField.type_config!.options!.find((o) => o.id === val)
          : labelsField.type_config!.options!.find((o) => o.orderindex === val);
        return opt?.label || opt?.name || '';
      })
      .filter(Boolean);
  }
  /* Fallback to generic resolver */
  const raw = getCustomFieldValue(task, 'Location');
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function taskToJob(task: ClickUpTask): JobEntry {
  const parsed = parseDescription(task.description || '');

  return {
    slug: slugify(task.name),
    title: task.name,
    location: getLocationArray(task),
    type: getCustomFieldValue(task, 'Type') || 'Full-time',
    closingDate: getCustomFieldValue(task, 'Closing Date') || '',
    active: true,
    shortDescription: parsed.shortDescription || task.name,
    opportunity: parsed.opportunity,
    whatYoullBeDoing: parsed.whatYoullBeDoing,
    whatWereLookingFor: parsed.whatWereLookingFor,
    bonusPoints: parsed.bonusPoints,
    securityClearance: parsed.securityClearance,
  };
}

export async function handleSyncJobs(
  request: Request,
  env: Env
): Promise<Response> {
  /* Authenticate webhook */
  const secret =
    request.headers.get('X-Webhook-Secret') ||
    request.headers.get('Authorization');
  if (!secret || secret !== env.WEBHOOK_SECRET) {
    return Response.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  /* Fetch all Published tasks from Roles list */
  const clickupUrl =
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_ROLES_LIST_ID}/task` +
    `?statuses[]=published&include_closed=false&subtasks=false&include_custom_fields=true`;

  const clickupResp = await fetch(clickupUrl, {
    headers: {
      Authorization: env.CLICKUP_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!clickupResp.ok) {
    const errText = await clickupResp.text();
    console.error('ClickUp API error:', errText);
    return Response.json(
      { success: false, message: `ClickUp API error: ${clickupResp.status}` },
      { status: 502 }
    );
  }

  const data = (await clickupResp.json()) as ClickUpTasksResponse;

  /* Parse each task into a job entry, skip tasks that fail to parse */
  const jobs: JobEntry[] = [];
  for (const task of data.tasks) {
    try {
      jobs.push(taskToJob(task));
    } catch (err) {
      console.error(`Failed to parse task ${task.id} (${task.name}):`, err);
    }
  }

  /* Sort alphabetically by title */
  jobs.sort((a, b) => a.title.localeCompare(b.title));

  /* Commit to GitHub */
  try {
    const result = await commitJobsJson(
      jobs,
      env.GITHUB_TOKEN,
      env.GITHUB_REPO
    );
    return Response.json({
      success: true,
      committed: result.committed,
      jobCount: result.jobCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'GitHub commit failed';
    console.error('GitHub error:', message);
    return Response.json(
      { success: false, message },
      { status: 502 }
    );
  }
}
