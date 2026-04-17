export interface JobEntry {
  slug: string;
  title: string;
  location: string[];
  type: string;
  closingDate: string;
  active: boolean;
  shortDescription: string;
  opportunity: string;
  whatYoullBeDoing: string;
  whatWereLookingFor: string[];
  bonusPoints: string[];
  securityClearance: string;
}

interface GitHubFileResponse {
  sha: string;
  content: string;
}

export async function commitJobsJson(
  jobs: JobEntry[],
  githubToken: string,
  githubRepo: string
): Promise<{ committed: boolean; jobCount: number }> {
  const filePath = 'jobs.json';
  const apiBase = `https://api.github.com/repos/${githubRepo}/contents/${filePath}`;
  const authHeaders = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'anywise-careers-api',
  };

  /* Get current file SHA and content (needed for update and diff check) */
  let currentSha: string | null = null;
  let currentContent: string | null = null;
  const getResp = await fetch(apiBase, { headers: authHeaders });
  if (getResp.ok) {
    const data = (await getResp.json()) as GitHubFileResponse;
    currentSha = data.sha;
    currentContent = data.content;
  }
  /* 404 means file doesn't exist yet — that's fine, we'll create it */

  const newContent = JSON.stringify(jobs, null, 2) + '\n';
  const bytes = new TextEncoder().encode(newContent);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const newEncoded = btoa(binary);

  /* Skip commit if content is unchanged */
  if (currentContent && currentContent.replace(/\n/g, '') === newEncoded) {
    return { committed: false, jobCount: jobs.length };
  }

  /* Build the PUT body */
  const body: Record<string, string> = {
    message: 'chore: sync job listings from ClickUp',
    content: newEncoded,
  };
  if (currentSha) {
    body.sha = currentSha;
  }

  const putResp = await fetch(apiBase, {
    method: 'PUT',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!putResp.ok) {
    const errText = await putResp.text();
    throw new Error(`GitHub API error ${putResp.status}: ${errText}`);
  }

  return { committed: true, jobCount: jobs.length };
}
