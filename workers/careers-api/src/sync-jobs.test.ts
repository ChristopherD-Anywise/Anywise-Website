import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSyncJobs } from './sync-jobs';

/* Mock fetch globally */
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);
vi.stubGlobal('btoa', (s: string) => Buffer.from(s, 'binary').toString('base64'));
vi.stubGlobal('TextEncoder', globalThis.TextEncoder);

const env = {
  CLICKUP_API_KEY: 'test-clickup-key',
  CLICKUP_ROLES_LIST_ID: '901614524275',
  WEBHOOK_SECRET: 'test-secret',
  GITHUB_TOKEN: 'test-github-token',
  GITHUB_REPO: 'Anywise-au/Anywise-Website',
};

function makeRequest(secret?: string): Request {
  const headers: Record<string, string> = {};
  if (secret) headers['X-Webhook-Secret'] = secret;
  return new Request('https://careers-api.anywise.com.au/sync-jobs', {
    method: 'POST',
    headers,
  });
}

const sampleClickUpTask = {
  id: 'abc123',
  name: 'Senior Data Engineer',
  description: [
    'Design and build sovereign data pipelines.',
    '',
    '## Responsibilities',
    '- Design scalable data pipelines',
    '- Build ETL workflows',
    '',
    '## Requirements',
    '- 5+ years experience',
    '- Australian citizenship',
  ].join('\n'),
  custom_fields: [
    {
      id: 'loc1',
      name: 'Location',
      type: 'labels',
      value: [0],
      type_config: {
        options: [
          { id: 'opt1', name: 'Melbourne', orderindex: 0 },
          { id: 'opt2', name: 'Canberra', orderindex: 1 },
        ],
      },
    },
    {
      id: 'type1',
      name: 'Type',
      type: 'drop_down',
      value: 0,
      type_config: {
        options: [
          { id: 'opt1', name: 'Full-time', orderindex: 0 },
          { id: 'opt2', name: 'Contract', orderindex: 1 },
        ],
      },
    },
    {
      id: 'date1',
      name: 'Closing Date',
      type: 'date',
      value: '1748649600000',
      type_config: {},
    },
  ],
};

describe('handleSyncJobs', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('rejects requests without webhook secret', async () => {
    const resp = await handleSyncJobs(makeRequest(), env as any);
    expect(resp.status).toBe(401);
    const body = await resp.json();
    expect(body.success).toBe(false);
  });

  it('rejects requests with wrong webhook secret', async () => {
    const resp = await handleSyncJobs(makeRequest('wrong-secret'), env as any);
    expect(resp.status).toBe(401);
  });

  it('fetches published tasks and commits to GitHub', async () => {
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes('api.clickup.com')) {
        return Promise.resolve(
          new Response(JSON.stringify({ tasks: [sampleClickUpTask] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      /* GitHub PUT (commit) */
      if (url.includes('api.github.com') && init?.method === 'PUT') {
        return Promise.resolve(
          new Response(JSON.stringify({ content: { sha: 'newsha' } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      /* GitHub GET (current file SHA) */
      return Promise.resolve(
        new Response(JSON.stringify({ sha: 'abc123sha', content: '' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    const resp = await handleSyncJobs(makeRequest('test-secret'), env as any);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.jobCount).toBe(1);

    /* Verify ClickUp was called with correct params */
    const clickupCall = mockFetch.mock.calls.find(
      (c: [string]) => c[0].includes('api.clickup.com')
    );
    expect(clickupCall).toBeDefined();
    expect(clickupCall![0]).toContain('statuses[]=Published');
    expect(clickupCall![0]).toContain('901614524275');
  });

  it('returns empty jobs array when no published tasks', async () => {
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes('api.clickup.com')) {
        return Promise.resolve(
          new Response(JSON.stringify({ tasks: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      /* GitHub PUT */
      if (url.includes('api.github.com') && init?.method === 'PUT') {
        return Promise.resolve(
          new Response(JSON.stringify({ content: { sha: 'newsha' } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      /* GitHub GET */
      return Promise.resolve(
        new Response(JSON.stringify({ sha: 'abc123sha', content: '' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    const resp = await handleSyncJobs(makeRequest('test-secret'), env as any);
    const body = await resp.json();
    expect(body.success).toBe(true);
    expect(body.jobCount).toBe(0);
  });

  it('returns 502 when ClickUp API fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('api.clickup.com')) {
        return Promise.resolve(
          new Response('Internal Server Error', { status: 500 })
        );
      }
      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    const resp = await handleSyncJobs(makeRequest('test-secret'), env as any);
    expect(resp.status).toBe(502);
  });

  it('returns 502 when GitHub API fails', async () => {
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes('api.clickup.com')) {
        return Promise.resolve(
          new Response(JSON.stringify({ tasks: [sampleClickUpTask] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      /* GitHub PUT fails */
      if (url.includes('api.github.com') && init?.method === 'PUT') {
        return Promise.resolve(
          new Response('Server Error', { status: 500 })
        );
      }
      /* GitHub GET succeeds */
      return Promise.resolve(
        new Response(JSON.stringify({ sha: 'abc123sha', content: '' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    const resp = await handleSyncJobs(makeRequest('test-secret'), env as any);
    expect(resp.status).toBe(502);
    const body = await resp.json();
    expect(body.success).toBe(false);
  });
});
