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
      if (url.includes('/link/')) {
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    await linkToRole('applicant-task-1', 'senior-data-engineer', env as any);

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

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not throw when roles list fetch fails', async () => {
    mockFetch.mockResolvedValueOnce(new Response('Error', { status: 500 }));

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
      return Promise.resolve(new Response('Error', { status: 500 }));
    });

    await linkToRole('applicant-task-1', 'senior-data-engineer', env as any);
  });
});
