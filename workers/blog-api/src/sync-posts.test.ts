import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSyncPosts, taskToPost } from './sync-posts';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);
vi.stubGlobal('btoa', (s: string) => Buffer.from(s, 'binary').toString('base64'));
vi.stubGlobal('TextEncoder', globalThis.TextEncoder);

const env = {
  CLICKUP_API_KEY: 'test-clickup-key',
  CLICKUP_BLOG_LIST_ID: '999888777',
  WEBHOOK_SECRET: 'test-secret',
  GITHUB_TOKEN: 'test-github-token',
  GITHUB_REPO: 'TestOrg/TestRepo',
  ALLOWED_ORIGINS: 'https://anywise.com.au',
};

function makeRequest(secret?: string, headerName = 'X-Webhook-Secret'): Request {
  const headers: Record<string, string> = {};
  if (secret) headers[headerName] = secret;
  return new Request('https://blog-api.anywise.com.au/sync-posts', {
    method: 'POST',
    headers,
  });
}

/* Note: The list endpoint does NOT return attachments. Attachments come from
   a separate GET /task/{taskId} call. The test mocks reflect this two-step fetch. */

const sampleClickUpListTask = {
  id: 'blog-task-1',
  name: 'Test Blog Post Title',
  description: 'This is the **full markdown** body of the blog post.\n\n> A pullquote here.\n\n- List item one\n- List item two',
  tags: [{ name: 'Defence' }, { name: 'AI' }],
  /* No attachments field — list endpoint omits it */
  custom_fields: [
    {
      id: 'slug1',
      name: 'Slug',
      type: 'short_text',
      value: 'test-blog-post-title',
    },
    {
      id: 'author1',
      name: 'Author',
      type: 'short_text',
      value: 'Christopher Dennis',
    },
    {
      id: 'cat1',
      name: 'Category',
      type: 'drop_down',
      value: 0,
      type_config: {
        options: [
          { id: 'opt1', name: 'Thought Leadership', orderindex: 0 },
          { id: 'opt2', name: 'Case Study', orderindex: 1 },
          { id: 'opt3', name: 'News', orderindex: 2 },
        ],
      },
    },
    {
      id: 'excerpt1',
      name: 'Excerpt',
      type: 'short_text',
      value: 'A test excerpt for the blog post.',
    },
    {
      id: 'date1',
      name: 'Publish Date',
      type: 'date',
      value: '1739577600000',
      type_config: {},
    },
  ],
};

/* Per-task detail response (includes attachments with fresh signed URLs) */
const sampleTaskDetail = {
  ...sampleClickUpListTask,
  attachments: [
    {
      id: 'att-123',
      title: 'hero.jpg',
      extension: 'jpg',
      url: 'https://clickup-attachments.example.com/hero.jpg?signed=fresh',
    },
  ],
};

/* Helper: stub GitHub Tree API calls to succeed */
function stubGitHubTree() {
  return (url: string, init?: RequestInit) => {
    const u = url as string;
    const method = init?.method || 'GET';
    if (u.includes('git/ref/heads/main') && method === 'GET')
      return Response.json({ object: { sha: 'ref-sha' } });
    if (u.includes('git/commits/ref-sha') && method === 'GET')
      return Response.json({ tree: { sha: 'tree-sha' } });
    if (u.includes('git/trees/tree-sha') && method === 'GET')
      return Response.json({ tree: [] });
    if (u.includes('git/blobs') && method === 'POST')
      return Response.json({ sha: 'new-blob-sha' });
    if (u.includes('git/trees') && method === 'POST')
      return Response.json({ sha: 'new-tree-sha' });
    if (u.includes('git/commits') && method === 'POST')
      return Response.json({ sha: 'new-commit-sha' });
    if (u.includes('git/ref/heads/main') && method === 'PATCH')
      return Response.json({ object: { sha: 'new-commit-sha' } });
    return null;
  };
}

describe('taskToPost', () => {
  it('transforms a ClickUp task to BlogPost with correct field mapping', () => {
    const post = taskToPost(sampleClickUpListTask as any);
    expect(post.slug).toBe('test-blog-post-title');
    expect(post.title).toBe('Test Blog Post Title');
    expect(post.author).toBe('Christopher Dennis');
    expect(post.category).toBe('Thought Leadership');
    expect(post.tags).toEqual(['Defence', 'AI']);
    expect(post.excerpt).toBe('A test excerpt for the blog post.');
    expect(post.readTime).toBeGreaterThanOrEqual(1);
  });

  it('generates slug from title when Slug custom field is empty', () => {
    const task = { ...sampleClickUpListTask, custom_fields: [] };
    const post = taskToPost(task as any);
    expect(post.slug).toBe('test-blog-post-title');
  });

  it('resolves dropdown by UUID string when value is a string', () => {
    const task = {
      ...sampleClickUpListTask,
      custom_fields: [
        {
          id: 'cat1', name: 'Category', type: 'drop_down',
          value: 'opt2', /* UUID string instead of orderindex number */
          type_config: {
            options: [
              { id: 'opt1', name: 'Thought Leadership', orderindex: 0 },
              { id: 'opt2', name: 'Case Study', orderindex: 1 },
            ],
          },
        },
      ],
    };
    const post = taskToPost(task as any);
    expect(post.category).toBe('Case Study');
  });
});

describe('handleSyncPosts', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('rejects requests without webhook secret', async () => {
    const resp = await handleSyncPosts(makeRequest(), env as any);
    expect(resp.status).toBe(401);
    const body = await resp.json();
    expect(body.success).toBe(false);
  });

  it('rejects requests with wrong webhook secret', async () => {
    const resp = await handleSyncPosts(makeRequest('wrong'), env as any);
    expect(resp.status).toBe(401);
  });

  it('accepts Authorization header as fallback', async () => {
    const gitHub = stubGitHubTree();
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if ((url as string).includes('api.clickup.com')) {
        return Response.json({ tasks: [] });
      }
      return gitHub(url, init) || Response.json({}, { status: 404 });
    });

    const resp = await handleSyncPosts(makeRequest('test-secret', 'Authorization'), env as any);
    expect(resp.status).toBe(200);
  });

  it('fetches published tasks, gets per-task detail for attachments, and transforms to BlogPost', async () => {
    const gitHub = stubGitHubTree();
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      const u = url as string;
      // List endpoint (no attachments)
      if (u.includes('api.clickup.com/api/v2/list/')) {
        return Response.json({ tasks: [sampleClickUpListTask] });
      }
      // Per-task detail endpoint (includes attachments with fresh signed URLs)
      if (u.includes('api.clickup.com/api/v2/task/blog-task-1')) {
        return Response.json(sampleTaskDetail);
      }
      // Image download from fresh signed URL
      if (u.includes('clickup-attachments.example.com')) {
        return new Response(new ArrayBuffer(100), {
          status: 200,
          headers: { 'Content-Type': 'image/jpeg' },
        });
      }
      return gitHub(url, init) || Response.json({}, { status: 404 });
    });

    const resp = await handleSyncPosts(makeRequest('test-secret'), env as any);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.postCount).toBe(1);

    // Verify ClickUp API called correctly
    const clickupCall = mockFetch.mock.calls.find(
      (c: [string]) => (c[0] as string).includes('api.clickup.com')
    );
    expect(clickupCall![0]).toContain('999888777');
    expect(clickupCall![0]).toContain('statuses[]=published');
    expect(clickupCall![0]).toContain('include_custom_fields=true');
  });

  it('returns 502 when ClickUp API fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if ((url as string).includes('api.clickup.com')) {
        return new Response('Error', { status: 500 });
      }
      return Response.json({});
    });

    const resp = await handleSyncPosts(makeRequest('test-secret'), env as any);
    expect(resp.status).toBe(502);
  });

  it('continues sync when image download fails', async () => {
    const gitHub = stubGitHubTree();
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      const u = url as string;
      if (u.includes('api.clickup.com/api/v2/list/')) {
        return Response.json({ tasks: [sampleClickUpListTask] });
      }
      if (u.includes('api.clickup.com/api/v2/task/blog-task-1')) {
        return Response.json(sampleTaskDetail);
      }
      // Image download fails
      if (u.includes('clickup-attachments.example.com')) {
        return new Response('Not Found', { status: 404 });
      }
      return gitHub(url, init) || Response.json({}, { status: 404 });
    });

    const resp = await handleSyncPosts(makeRequest('test-secret'), env as any);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.postCount).toBe(1);
  });
});
