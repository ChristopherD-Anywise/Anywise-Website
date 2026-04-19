export interface FileEntry {
  path: string;
  content: string | ArrayBuffer;
}

interface TreeEntry {
  path: string;
  sha: string;
}

const API = 'https://api.github.com';

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'anywise-blog-api',
    'Content-Type': 'application/json',
  };
}

async function githubFetch(url: string, token: string, init?: RequestInit): Promise<Response> {
  const resp = await fetch(url, {
    ...init,
    headers: { ...authHeaders(token), ...(init?.headers || {}) },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`GitHub API ${resp.status}: ${text}`);
  }
  return resp;
}

export async function commitTree(
  files: FileEntry[],
  message: string,
  token: string,
  repo: string,
): Promise<{ committed: boolean }> {
  const base = `${API}/repos/${repo}`;

  // 1. Get current commit SHA
  const refResp = await githubFetch(`${base}/git/ref/heads/main`, token);
  const refData = (await refResp.json()) as { object: { sha: string } };
  const commitSha = refData.object.sha;

  // 2. Get current tree SHA
  const commitResp = await githubFetch(`${base}/git/commits/${commitSha}`, token);
  const commitData = (await commitResp.json()) as { tree: { sha: string } };
  const treeSha = commitData.tree.sha;

  // 3. Get current tree entries for diff check
  const treeResp = await githubFetch(`${base}/git/trees/${treeSha}?recursive=1`, token);
  const treeData = (await treeResp.json()) as { tree: TreeEntry[] };
  const existingEntries = new Map(treeData.tree.map(e => [e.path, e.sha]));

  // 4. Create blobs and check for changes
  const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];
  let hasChanges = false;

  for (const file of files) {
    let body: Record<string, string>;
    if (file.content instanceof ArrayBuffer) {
      const bytes = new Uint8Array(file.content);
      let binary = '';
      for (const byte of bytes) binary += String.fromCharCode(byte);
      body = { content: btoa(binary), encoding: 'base64' };
    } else {
      body = { content: file.content, encoding: 'utf-8' };
    }

    const blobResp = await githubFetch(`${base}/git/blobs`, token, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const blobData = (await blobResp.json()) as { sha: string };

    treeItems.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha,
    });

    if (existingEntries.get(file.path) !== blobData.sha) {
      hasChanges = true;
    }
  }

  // 5. Skip if nothing changed
  if (!hasChanges) {
    return { committed: false };
  }

  // 6. Create new tree
  const newTreeResp = await githubFetch(`${base}/git/trees`, token, {
    method: 'POST',
    body: JSON.stringify({ base_tree: treeSha, tree: treeItems }),
  });
  const newTreeData = (await newTreeResp.json()) as { sha: string };

  // 7. Create commit
  const newCommitResp = await githubFetch(`${base}/git/commits`, token, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: newTreeData.sha,
      parents: [commitSha],
    }),
  });
  const newCommitData = (await newCommitResp.json()) as { sha: string };

  // 8. Update ref
  await githubFetch(`${base}/git/ref/heads/main`, token, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommitData.sha }),
  });

  return { committed: true };
}
