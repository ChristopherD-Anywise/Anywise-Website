# Application-to-ClickUp Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When someone submits a job application or EOI, create a ClickUp task in the Talent Community people list, attach the CV directly to the task, link applicants to the matching role, tag EOIs, and clean up the R2 staging file.

**Architecture:** Two new modules (`clickup-attachment.ts`, `clickup-link.ts`) handle ClickUp file attachment and task linking. The existing `createClickUpTask` in `index.ts` is modified to return the task ID. The `handleApply` and `handleEOI` handlers are updated to call these modules after task creation. R2 remains as a staging area — files are deleted only after confirmed ClickUp attachment.

**Tech Stack:** Cloudflare Workers (TypeScript), ClickUp API v2, R2, Vitest

---

## File Structure

| File | Responsibility |
|------|---------------|
| `workers/careers-api/src/clickup-attachment.ts` | **Create.** Attach file to ClickUp task via attachment API, delete from R2 on success. |
| `workers/careers-api/src/clickup-attachment.test.ts` | **Create.** Tests for attachment and R2 cleanup. |
| `workers/careers-api/src/clickup-link.ts` | **Create.** Find role task by slug, create task link relationship. |
| `workers/careers-api/src/clickup-link.test.ts` | **Create.** Tests for role lookup and linking. |
| `workers/careers-api/src/sync-jobs.ts` | **Modify.** Export `slugify` function (currently private). |
| `workers/careers-api/src/index.ts` | **Modify.** Update `createClickUpTask` to return task ID, update handlers to use new modules, remove `ROLE_VACANCY`/`RECEIVED_RESUME` fields, add EOI tag. |
| `workers/careers-api/wrangler.toml` | **Modify.** Update `CLICKUP_LIST_ID`. |

---

### Task 1: ClickUp Attachment Module (TDD)

**Files:**
- Create: `workers/careers-api/src/clickup-attachment.ts`
- Create: `workers/careers-api/src/clickup-attachment.test.ts`

- [ ] **Step 1: Write failing tests**

Create `workers/careers-api/src/clickup-attachment.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { attachFileToTask, cleanupR2 } from './clickup-attachment';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockR2Bucket = {
  delete: vi.fn(),
};

const env = {
  CLICKUP_API_KEY: 'test-clickup-key',
  CV_BUCKET: mockR2Bucket,
};

describe('attachFileToTask', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockR2Bucket.delete.mockReset();
  });

  it('uploads file to ClickUp attachment API', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

    const buffer = new ArrayBuffer(8);
    const result = await attachFileToTask(
      'task123',
      buffer,
      'resume.pdf',
      'application/pdf',
      env as any
    );

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.clickup.com/api/v2/task/task123/attachment');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Authorization']).toBe('test-clickup-key');
    /* Body should be FormData with the file */
    expect(opts.body).toBeInstanceOf(FormData);
  });

  it('returns false when ClickUp API fails', async () => {
    mockFetch.mockResolvedValueOnce(new Response('Server Error', { status: 500 }));

    const buffer = new ArrayBuffer(8);
    const result = await attachFileToTask(
      'task123',
      buffer,
      'resume.pdf',
      'application/pdf',
      env as any
    );

    expect(result).toBe(false);
  });

  it('constructs FormData with correct filename', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

    const buffer = new TextEncoder().encode('fake pdf content').buffer;
    await attachFileToTask('task123', buffer, 'john-doe.pdf', 'application/pdf', env as any);

    const body = mockFetch.mock.calls[0][1].body as FormData;
    const file = body.get('attachment') as File;
    expect(file).toBeTruthy();
    expect(file.name).toBe('john-doe.pdf');
  });
});

describe('cleanupR2', () => {
  beforeEach(() => {
    mockR2Bucket.delete.mockReset();
  });

  it('deletes file from R2 bucket', async () => {
    mockR2Bucket.delete.mockResolvedValueOnce(undefined);

    await cleanupR2('cv/123-john-doe.pdf', env as any);

    expect(mockR2Bucket.delete).toHaveBeenCalledWith('cv/123-john-doe.pdf');
  });

  it('does not throw when R2 delete fails', async () => {
    mockR2Bucket.delete.mockRejectedValueOnce(new Error('R2 error'));

    /* Should not throw */
    await cleanupR2('cv/123-john-doe.pdf', env as any);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd workers/careers-api && npx vitest run src/clickup-attachment.test.ts`
Expected: FAIL — module `./clickup-attachment` does not exist

- [ ] **Step 3: Implement the module**

Create `workers/careers-api/src/clickup-attachment.ts`:

```typescript
import type { Env } from './index';

export async function attachFileToTask(
  taskId: string,
  fileBuffer: ArrayBuffer,
  fileName: string,
  contentType: string,
  env: Env
): Promise<boolean> {
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: contentType });
  formData.append('attachment', new File([blob], fileName, { type: contentType }));

  const response = await fetch(
    `https://api.clickup.com/api/v2/task/${taskId}/attachment`,
    {
      method: 'POST',
      headers: {
        Authorization: env.CLICKUP_API_KEY,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error(`ClickUp attachment failed for task ${taskId}:`, err);
    return false;
  }

  return true;
}

export async function cleanupR2(key: string, env: Env): Promise<void> {
  try {
    await env.CV_BUCKET.delete(key);
  } catch (err) {
    console.error(`R2 cleanup failed for key ${key}:`, err);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd workers/careers-api && npx vitest run src/clickup-attachment.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add workers/careers-api/src/clickup-attachment.ts workers/careers-api/src/clickup-attachment.test.ts
git commit -m "feat: add ClickUp file attachment and R2 cleanup module"
```

---

### Task 2: ClickUp Task Linking Module (TDD)

**Files:**
- Create: `workers/careers-api/src/clickup-link.ts`
- Create: `workers/careers-api/src/clickup-link.test.ts`
- Modify: `workers/careers-api/src/sync-jobs.ts:26-31` (export `slugify`)

- [ ] **Step 1: Export `slugify` from sync-jobs.ts**

In `workers/careers-api/src/sync-jobs.ts`, change line 26 from:

```typescript
function slugify(title: string): string {
```

to:

```typescript
export function slugify(title: string): string {
```

- [ ] **Step 2: Write failing tests**

Create `workers/careers-api/src/clickup-link.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { linkToRole } from './clickup-link';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const env = {
  CLICKUP_API_KEY: 'test-clickup-key',
  CLICKUP_ROLES_LIST_ID: '901614527130',
};

describe('linkToRole', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('finds role by slug and creates task link', async () => {
    /* Mock: roles list returns one task */
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes('api.clickup.com') && url.includes('list/901614527130/task')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              tasks: [
                { id: 'role-task-99', name: 'Senior Data Engineer', custom_fields: [] },
              ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      }
      /* Mock: link creation */
      if (url.includes('/link/')) {
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    await linkToRole('applicant-task-1', 'senior-data-engineer', env as any);

    /* Verify link API was called */
    const linkCall = mockFetch.mock.calls.find(
      (c: [string, RequestInit?]) => c[0].includes('/link/')
    );
    expect(linkCall).toBeDefined();
    expect(linkCall![0]).toBe(
      'https://api.clickup.com/api/v2/task/applicant-task-1/link/role-task-99'
    );
    expect(linkCall![1]?.method).toBe('POST');
  });

  it('does not create link when no matching role found', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('list/901614527130/task')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              tasks: [
                { id: 'role-1', name: 'Software Engineer', custom_fields: [] },
              ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      }
      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    await linkToRole('applicant-task-1', 'senior-data-engineer', env as any);

    /* Only the roles list fetch should have been called, no link call */
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not throw when roles list fetch fails', async () => {
    mockFetch.mockResolvedValueOnce(new Response('Error', { status: 500 }));

    /* Should not throw */
    await linkToRole('applicant-task-1', 'senior-data-engineer', env as any);
  });

  it('does not throw when link creation fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('list/901614527130/task')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              tasks: [
                { id: 'role-1', name: 'Senior Data Engineer', custom_fields: [] },
              ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      }
      /* Link call fails */
      return Promise.resolve(new Response('Error', { status: 500 }));
    });

    /* Should not throw */
    await linkToRole('applicant-task-1', 'senior-data-engineer', env as any);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd workers/careers-api && npx vitest run src/clickup-link.test.ts`
Expected: FAIL — module `./clickup-link` does not exist

- [ ] **Step 4: Implement the module**

Create `workers/careers-api/src/clickup-link.ts`:

```typescript
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
    /* Fetch published roles */
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

    /* Find matching role by slug */
    const roleTask = data.tasks.find(
      (t) => slugify(t.name) === roleSlug
    );

    if (!roleTask) {
      console.warn(`No matching role found for slug "${roleSlug}"`);
      return;
    }

    /* Create task link */
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd workers/careers-api && npx vitest run src/clickup-link.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 6: Run all tests to verify no regressions**

Run: `cd workers/careers-api && npx vitest run`
Expected: All tests PASS (existing sync-jobs and parse-description tests unaffected)

- [ ] **Step 7: Commit**

```bash
git add workers/careers-api/src/clickup-link.ts workers/careers-api/src/clickup-link.test.ts workers/careers-api/src/sync-jobs.ts
git commit -m "feat: add ClickUp task linking module with role lookup by slug"
```

---

### Task 3: Update `createClickUpTask` to Return Task ID

**Files:**
- Modify: `workers/careers-api/src/index.ts:284-313`

- [ ] **Step 1: Modify `createClickUpTask` to return the task ID**

In `workers/careers-api/src/index.ts`, change the function signature and body at lines 284–313 from:

```typescript
async function createClickUpTask(
  env: Env,
  name: string,
  description: string,
  fieldData: CustomFieldData = {}
): Promise<void> {
  const custom_fields = buildCustomFields(fieldData);

  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': env.CLICKUP_API_KEY,
      },
      body: JSON.stringify({
        name,
        markdown_description: description,
        custom_fields,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('ClickUp error:', err);
    /* Don't throw — application was received even if ClickUp fails */
  }
}
```

to:

```typescript
async function createClickUpTask(
  env: Env,
  name: string,
  description: string,
  fieldData: CustomFieldData = {},
  tags: string[] = []
): Promise<string | null> {
  const custom_fields = buildCustomFields(fieldData);

  const body: Record<string, unknown> = {
    name,
    markdown_description: description,
    custom_fields,
  };
  if (tags.length > 0) {
    body.tags = tags;
  }

  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': env.CLICKUP_API_KEY,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('ClickUp error:', err);
    return null;
  }

  const data = (await response.json()) as { id: string };
  return data.id;
}
```

- [ ] **Step 2: Remove `ROLE_VACANCY` and `RECEIVED_RESUME` from custom fields**

In `workers/careers-api/src/index.ts`, remove these two lines from the `CF` object (lines 228–230):

```typescript
  ROLE_VACANCY: '73f748dd-3363-4b9f-a41f-4bd596b2ee9c',
```

and:

```typescript
  RECEIVED_RESUME: '7d48995c-502c-4c76-bc2f-e63842592036',
```

Remove the `roleTitle` field from `CustomFieldData` interface (line 216):

```typescript
  roleTitle?: string;
```

Remove the `cvUrl` field from `CustomFieldData` interface (line 218):

```typescript
  cvUrl?: string;
```

Remove these lines from `buildCustomFields` (lines 268–270):

```typescript
  if (data.roleTitle) fields.push({ id: CF.ROLE_VACANCY, value: data.roleTitle });
```

and:

```typescript
  if (data.cvUrl) fields.push({ id: CF.RECEIVED_RESUME, value: data.cvUrl });
```

- [ ] **Step 3: Run all tests to verify no regressions**

Run: `cd workers/careers-api && npx vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add workers/careers-api/src/index.ts
git commit -m "refactor: createClickUpTask returns task ID, remove obsolete custom fields"
```

---

### Task 4: Update `handleApply` for Attachment and Linking

**Files:**
- Modify: `workers/careers-api/src/index.ts:63-144`

- [ ] **Step 1: Add imports at top of `index.ts`**

After the existing import on line 13, add:

```typescript
import { attachFileToTask, cleanupR2 } from './clickup-attachment';
import { linkToRole } from './clickup-link';
```

- [ ] **Step 2: Update `handleApply` to use new modules**

Replace the section from the `/* Create ClickUp task */` comment through the return statement (lines 108–143) with:

```typescript
  /* Create ClickUp task */
  const taskDescription = [
    `## Application: ${roleTitle}`,
    '',
    '### Contact',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Phone:** ${phone}`,
    linkedin ? `- **LinkedIn:** ${linkedin}` : '',
    '',
    '### Eligibility',
    `- **Work Rights:** ${citizenship}`,
    citizenshipDetail ? `- **Details:** ${citizenshipDetail}` : '',
    '',
    '### Experience',
    `- **Notice Period:** ${noticePeriod}`,
    salaryExpectation ? `- **Salary Expectations:** ${salaryExpectation}` : '',
    cvUrl ? `- **CV:** [Download CV](${cvUrl})` : '- **CV:** Not uploaded',
    '',
    '### Cover Letter',
    coverLetter,
  ].filter(Boolean).join('\n');

  const taskId = await createClickUpTask(env, `${roleTitle} — ${name}`, taskDescription, {
    email,
    phone,
    linkedin,
    specialistField,
    location,
    noticePeriod,
    source: 'Application',
  });

  /* Best-effort: link to role and attach CV */
  if (taskId) {
    await linkToRole(taskId, role, env);

    if (cvFile && r2Key) {
      const fileBuffer = await env.CV_BUCKET.get(r2Key);
      if (fileBuffer) {
        const arrayBuffer = await fileBuffer.arrayBuffer();
        const attached = await attachFileToTask(taskId, arrayBuffer, cvFile.name, cvFile.type, env);
        if (attached) {
          await cleanupR2(r2Key, env);
        }
      }
    }
  }

  return Response.json({ success: true, message: 'Application submitted' }, { headers });
```

- [ ] **Step 3: Track the R2 key for later cleanup**

In the CV upload section (around line 98–106), add a variable to track the R2 key. Change:

```typescript
  /* Upload CV to R2 */
  let cvUrl = '';
  if (cvFile && cvFile.size > 0) {
```

to:

```typescript
  /* Upload CV to R2 (staging — will be attached to ClickUp task and deleted) */
  let cvUrl = '';
  let r2Key = '';
  if (cvFile && cvFile.size > 0) {
```

And after the `env.CV_BUCKET.put(...)` line, add:

```typescript
    r2Key = key;
```

So lines 86–106 become:

```typescript
  /* Upload CV to R2 (staging — will be attached to ClickUp task and deleted) */
  let cvUrl = '';
  let r2Key = '';
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const key = `cv/${timestamp}-${safeName}.${ext}`;
    await env.CV_BUCKET.put(key, cvFile.stream(), {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, role: role },
    });
    r2Key = key;
    cvUrl = `${env.R2_PUBLIC_URL}/${key}`;
  }
```

- [ ] **Step 4: Remove `roleTitle` and `cvUrl` from the field data passed to `createClickUpTask`**

Already done in the Step 2 replacement — the `createClickUpTask` call no longer passes `roleTitle` or `cvUrl` in the field data object.

- [ ] **Step 5: Run all tests**

Run: `cd workers/careers-api && npx vitest run`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add workers/careers-api/src/index.ts
git commit -m "feat: handleApply attaches CV to ClickUp task and links to role"
```

---

### Task 5: Update `handleEOI` for Tagging and Attachment

**Files:**
- Modify: `workers/careers-api/src/index.ts:148-205`

- [ ] **Step 1: Update `handleEOI` to tag and attach**

Replace lines 162–204 (from `/* Optional CV upload */` through the return) with:

```typescript
  /* Optional CV upload to R2 (staging) */
  let cvUrl = '';
  let r2Key = '';
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const key = `cv/eoi-${timestamp}-${safeName}.${ext}`;
    await env.CV_BUCKET.put(key, cvFile.stream(), {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, type: 'eoi' },
    });
    r2Key = key;
    cvUrl = `${env.R2_PUBLIC_URL}/${key}`;
  }

  const taskDescription = [
    '## Expression of Interest',
    '',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Area of Interest:** ${discipline}`,
    cvUrl ? `- **CV:** [Download CV](${cvUrl})` : '',
    '',
    '### Message',
    message,
  ].filter(Boolean).join('\n');

  const taskId = await createClickUpTask(
    env,
    `EOI — ${name} (${discipline})`,
    taskDescription,
    {
      email,
      specialistField: discipline,
      location,
      source: 'EOI',
    },
    ['EOI']
  );

  /* Best-effort: attach CV if provided */
  if (taskId && cvFile && r2Key) {
    const fileBuffer = await env.CV_BUCKET.get(r2Key);
    if (fileBuffer) {
      const arrayBuffer = await fileBuffer.arrayBuffer();
      const attached = await attachFileToTask(taskId, arrayBuffer, cvFile.name, cvFile.type, env);
      if (attached) {
        await cleanupR2(r2Key, env);
      }
    }
  }

  return Response.json({ success: true, message: 'Expression of interest submitted' }, { headers });
```

- [ ] **Step 2: Run all tests**

Run: `cd workers/careers-api && npx vitest run`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add workers/careers-api/src/index.ts
git commit -m "feat: handleEOI adds EOI tag and attaches CV to ClickUp task"
```

---

### Task 6: Update `CLICKUP_LIST_ID` and Deploy

**Files:**
- Modify: `workers/careers-api/wrangler.toml:11`

- [ ] **Step 1: Update the list ID**

In `workers/careers-api/wrangler.toml`, change line 11 from:

```toml
CLICKUP_LIST_ID = "901614515941"
```

to:

```toml
CLICKUP_LIST_ID = "901614536542"
```

- [ ] **Step 2: Run all tests one final time**

Run: `cd workers/careers-api && npx vitest run`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add workers/careers-api/wrangler.toml
git commit -m "chore: update CLICKUP_LIST_ID to Talent Community people list"
```

- [ ] **Step 4: Deploy Worker**

Run: `cd workers/careers-api && npx wrangler deploy`
Expected: Deployment succeeds

- [ ] **Step 5: E2E test — submit a test application on the live site**

Verify:
1. Task appears in ClickUp People list (`901614536542`)
2. CV is attached directly to the task (not just a URL)
3. Task is linked to the matching role in the Roles list
4. R2 bucket no longer contains the staging file

- [ ] **Step 6: E2E test — submit a test EOI on the live site**

Verify:
1. Task appears in ClickUp People list with "EOI" tag
2. CV is attached if one was uploaded
3. No role link (EOIs are general interest)
4. R2 cleanup happened
