import type { Env } from './index';

export async function attachFileToTask(
  taskId: string,
  fileBuffer: ArrayBuffer,
  fileName: string,
  contentType: string,
  env: Env
): Promise<boolean> {
  try {
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
  } catch (err) {
    console.error(`ClickUp attachment threw for task ${taskId}:`, err);
    return false;
  }
}

export async function cleanupR2(key: string, env: Env): Promise<void> {
  try {
    await env.CV_BUCKET.delete(key);
  } catch (err) {
    console.error(`R2 cleanup failed for key ${key}:`, err);
  }
}
