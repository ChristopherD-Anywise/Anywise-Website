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

  it('returns false when fetch throws (network error)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('DNS failure'));

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

    await cleanupR2('cv/123-john-doe.pdf', env as any);
  });
});
