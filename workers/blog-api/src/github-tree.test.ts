import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commitTree, type FileEntry } from './github-tree';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const token = 'test-github-token';
const repo = 'TestOrg/TestRepo';

function githubUrl(path: string): string {
  return `https://api.github.com/repos/${repo}/${path}`;
}

describe('commitTree', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('creates blobs, tree, commit, and updates ref', async () => {
    const files: FileEntry[] = [
      { path: 'blog/posts.json', content: '[]' },
    ];

    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      const u = url as string;
      const method = init?.method || 'GET';

      // GET ref
      if (u.includes('git/ref/heads/main') && method === 'GET') {
        return Response.json({ object: { sha: 'ref-sha-1' } });
      }
      // GET commit
      if (u.includes('git/commits/ref-sha-1') && method === 'GET') {
        return Response.json({ tree: { sha: 'tree-sha-1' } });
      }
      // GET current tree (for diff check)
      if (u.includes('git/trees/tree-sha-1') && method === 'GET') {
        return Response.json({ tree: [] });
      }
      // POST blob
      if (u.includes('git/blobs') && method === 'POST') {
        return Response.json({ sha: 'blob-sha-1' });
      }
      // POST tree
      if (u.includes('git/trees') && method === 'POST') {
        return Response.json({ sha: 'new-tree-sha' });
      }
      // POST commit
      if (u.includes('git/commits') && method === 'POST') {
        return Response.json({ sha: 'new-commit-sha' });
      }
      // PATCH ref
      if (u.includes('git/ref/heads/main') && method === 'PATCH') {
        return Response.json({ object: { sha: 'new-commit-sha' } });
      }
      return Response.json({}, { status: 404 });
    });

    const result = await commitTree(files, 'chore: test commit', token, repo);
    expect(result.committed).toBe(true);

    // Verify PATCH was called to update ref
    const patchCall = mockFetch.mock.calls.find(
      (c: [string, RequestInit?]) => c[1]?.method === 'PATCH'
    );
    expect(patchCall).toBeDefined();
  });

  it('skips commit when all blob SHAs match existing tree', async () => {
    const files: FileEntry[] = [
      { path: 'blog/posts.json', content: '[]' },
    ];

    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      const u = url as string;
      const method = init?.method || 'GET';

      if (u.includes('git/ref/heads/main') && method === 'GET') {
        return Response.json({ object: { sha: 'ref-sha-1' } });
      }
      if (u.includes('git/commits/ref-sha-1') && method === 'GET') {
        return Response.json({ tree: { sha: 'tree-sha-1' } });
      }
      // Current tree already has the same blob
      if (u.includes('git/trees/tree-sha-1') && method === 'GET') {
        return Response.json({
          tree: [{ path: 'blog/posts.json', sha: 'blob-sha-1' }],
        });
      }
      // POST blob returns same SHA as existing
      if (u.includes('git/blobs') && method === 'POST') {
        return Response.json({ sha: 'blob-sha-1' });
      }
      return Response.json({}, { status: 404 });
    });

    const result = await commitTree(files, 'chore: test', token, repo);
    expect(result.committed).toBe(false);

    // No tree, commit, or ref calls
    const postTreeCalls = mockFetch.mock.calls.filter(
      (c: [string, RequestInit?]) => (c[0] as string).includes('git/trees') && c[1]?.method === 'POST'
    );
    expect(postTreeCalls).toHaveLength(0);
  });

  it('throws on GitHub API error', async () => {
    mockFetch.mockImplementation(() => {
      return new Response('Server Error', { status: 500 });
    });

    const files: FileEntry[] = [{ path: 'test.json', content: '{}' }];
    await expect(commitTree(files, 'test', token, repo)).rejects.toThrow();
  });
});
