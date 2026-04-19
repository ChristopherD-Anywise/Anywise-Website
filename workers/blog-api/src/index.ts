export interface Env {
  ALLOWED_ORIGINS: string;
  CLICKUP_API_KEY: string;
  CLICKUP_BLOG_LIST_ID: string;
  WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
}

import { handleSyncPosts } from './sync-posts';

function getCorsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map(s => s.trim());
  const allowedOrigin = allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const headers = getCorsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return Response.json({ success: false, message: 'Method not allowed' }, { status: 405, headers });
    }

    try {
      if (url.pathname === '/sync-posts') {
        return await handleSyncPosts(request, env);
      }
      return Response.json({ success: false, message: 'Not found' }, { status: 404, headers });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return Response.json({ success: false, message }, { status: 500, headers });
    }
  },
} satisfies ExportedHandler<Env>;
