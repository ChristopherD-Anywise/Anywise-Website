# Application-to-ClickUp Pipeline Design

## Goal

When someone submits a job application or EOI on the careers page, create a ClickUp task in the Talent Community people list, attach their CV directly to the task, link applicants to the relevant role task, tag EOIs, and clean up the R2 staging file.

## Architecture

The existing Cloudflare Worker (`careers-api`) already handles `/apply` and `/eoi` form submissions. This design modifies those handlers and adds two new modules for ClickUp attachment and task linking.

**Two ClickUp lists in play:**
- **Roles list** (`901614527130`) — job ads synced from ClickUp to the website
- **People list** (`901614536542`) — where applicant/EOI tasks are created

## Data Flow

```
Form submit → Worker receives multipart form data
  → Upload CV to R2 (staging)
  → Create ClickUp task in People list (901614536542)
  → If application: find matching role task → create task link relationship
  → If EOI: add "EOI" tag to the task
  → Fetch CV from R2 → attach to ClickUp task via attachment API
  → Confirm attachment succeeded → delete CV from R2
  → Return success response to browser
```

## New Modules

### `clickup-attachment.ts`

Handles CV file attachment to ClickUp tasks and R2 cleanup.

- `attachFileToTask(taskId: string, fileBuffer: ArrayBuffer, fileName: string, contentType: string, env: Env): Promise<boolean>` — uploads file to ClickUp via `POST /api/v2/task/{task_id}/attachment` using multipart/form-data. Returns true if attachment succeeded.
- R2 cleanup: after confirmed attachment, delete the staging file from R2 via `env.CV_BUCKET.delete(key)`.

### `clickup-link.ts`

Handles linking applicant tasks to role tasks.

- `linkToRole(applicantTaskId: string, roleSlug: string, env: Env): Promise<void>` — fetches published tasks from the Roles list, finds the matching role by slug (slugifying the task name and comparing), then calls `POST /api/v2/task/{applicant_task_id}/link/{role_task_id}` to create the relationship.

## Changes to Existing Code

### `index.ts`

**`createClickUpTask` must return the new task ID** (ClickUp's `POST /task` response includes `id`). This is needed for both attachment and linking.

**`handleApply` changes:**
1. Upload CV to R2 (unchanged — this becomes staging)
2. Create ClickUp task in People list — remove `ROLE_VACANCY` and `RECEIVED_RESUME` custom fields from payload
3. After task creation: call `linkToRole(taskId, roleSlug, env)` to create relationship to role
4. After task creation: call `attachFileToTask(taskId, cvBuffer, fileName, contentType, env)` to attach CV
5. If attachment confirmed: delete CV from R2
6. CV URL remains in task description as fallback text

**`handleEOI` changes:**
1. Upload CV to R2 if provided (unchanged — staging)
2. Create ClickUp task with `tags: ["EOI"]` in the payload
3. After task creation: attach CV if provided, clean up R2
4. No role linking (EOIs are general interest)

**Custom field cleanup:**
- Remove `ROLE_VACANCY` constant and usage (replaced by task relationship)
- Remove `RECEIVED_RESUME` constant and usage (replaced by direct attachment)

### `wrangler.toml`

- Update `CLICKUP_LIST_ID` from `901614515941` to `901614536542`

## Error Handling

The critical path is task creation in ClickUp. All secondary operations are best-effort:

| Operation | On failure | Safety net |
|-----------|-----------|------------|
| ClickUp task creation | Return error to user, CV stays in R2 | User can resubmit |
| Role task lookup/link | Log error, continue | Role title still in task description |
| CV attachment to ClickUp | Log error, continue, keep R2 file | CV URL in description, file persists in R2 |
| R2 deletion | Log error, continue | Orphaned file — no user impact, manual cleanup |

## ClickUp API Endpoints Used

- `POST /api/v2/list/{list_id}/task` — create task (existing, modified)
- `POST /api/v2/task/{task_id}/attachment` — attach file (new)
- `POST /api/v2/task/{task_id}/link/{links_to}` — create task link (new)
- `GET /api/v2/list/{list_id}/task?statuses[]=published` — find role tasks (new)

## Testing

- Unit tests for `clickup-attachment.ts` — mock ClickUp attachment API, verify multipart form construction, verify R2 delete on success, verify R2 kept on failure
- Unit tests for `clickup-link.ts` — mock role list fetch, verify slug matching, verify link API call, verify graceful failure on no match
- Update existing `handleApply` and `handleEOI` tests to verify new flow (attachment, linking, tagging)
- E2E: submit a test application via the website, verify task appears in People list with CV attached and linked to role
