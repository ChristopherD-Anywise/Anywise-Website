import type { Env } from './index';
import { slugify } from './sync-jobs';

interface ClickUpTaskStub {
  id: string;
  name: string;
}

interface ClickUpTasksResponse {
  tasks: ClickUpTaskStub[];
}

export async function linkToRole(
  applicantTaskId: string,
  roleSlug: string,
  env: Env
): Promise<void> {
  try {
    const rolesUrl =
      `https://api.clickup.com/api/v2/list/${env.CLICKUP_ROLES_LIST_ID}/task` +
      `?statuses[]=published&include_closed=false&subtasks=false`;

    const rolesResp = await fetch(rolesUrl, {
      headers: {
        Authorization: env.CLICKUP_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!rolesResp.ok) {
      console.error('Failed to fetch roles for linking:', await rolesResp.text());
      return;
    }

    const data = (await rolesResp.json()) as ClickUpTasksResponse;

    const roleTask = data.tasks.find(
      (t) => slugify(t.name) === roleSlug
    );

    if (!roleTask) {
      console.warn(`No matching role found for slug "${roleSlug}"`);
      return;
    }

    const linkResp = await fetch(
      `https://api.clickup.com/api/v2/task/${applicantTaskId}/link/${roleTask.id}`,
      {
        method: 'POST',
        headers: {
          Authorization: env.CLICKUP_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!linkResp.ok) {
      console.error('Failed to create task link:', await linkResp.text());
    }
  } catch (err) {
    console.error('linkToRole error:', err);
  }
}
