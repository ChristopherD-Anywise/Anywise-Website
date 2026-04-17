export interface Env {
  CV_BUCKET: R2Bucket;
  ALLOWED_ORIGINS: string;
  CLICKUP_API_KEY: string;
  CLICKUP_LIST_ID: string;
  CLICKUP_ROLES_LIST_ID: string;
  R2_PUBLIC_URL: string;
  WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
}

import { handleSyncJobs } from './sync-jobs';
import { attachFileToTask, cleanupR2 } from './clickup-attachment';
import { linkToRole } from './clickup-link';

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

    /* CORS preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    /* Only allow POST */
    if (request.method !== 'POST') {
      return Response.json({ success: false, message: 'Method not allowed' }, { status: 405, headers });
    }

    /* Rate limiting handled by Cloudflare WAF rules — no Worker-level check needed */

    try {
      if (url.pathname === '/apply') {
        return await handleApply(request, env, headers);
      } else if (url.pathname === '/eoi') {
        return await handleEOI(request, env, headers);
      } else if (url.pathname === '/sync-jobs') {
        return await handleSyncJobs(request, env);
      } else {
        return Response.json({ success: false, message: 'Not found' }, { status: 404, headers });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return Response.json({ success: false, message }, { status: 500, headers });
    }
  },
} satisfies ExportedHandler<Env>;

/* ── Apply handler ── */

async function handleApply(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const linkedin = formData.get('linkedin') as string || '';
  const citizenship = formData.get('citizenship') as string;
  const citizenshipDetail = formData.get('citizenshipDetail') as string || '';
  const coverLetter = formData.get('coverLetter') as string;
  const noticePeriod = formData.get('noticePeriod') as string;
  const salaryExpectation = formData.get('salaryExpectation') as string || '';
  const role = formData.get('role') as string;
  const roleTitle = formData.get('roleTitle') as string || role;
  const specialistField = formData.get('specialistField') as string || '';
  const location = formData.get('location') as string || '';
  const cvFile = formData.get('cv') as File | null;

  /* Validate required fields */
  if (!name || !email || !phone || !citizenship || !coverLetter || !noticePeriod || !role) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Upload CV to R2 (staging — will be attached to ClickUp task and deleted) */
  let cvUrl = '';
  let r2Key = '';
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const key = `cv/${timestamp}-${safeName}.${ext}`;
    await env.CV_BUCKET.put(key, cvFile.stream(), {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, role: role },
    });
    r2Key = key;
    cvUrl = `${env.R2_PUBLIC_URL}/${key}`;
  }

  /* Create ClickUp task */
  const taskDescription = [
    `## Application: ${roleTitle}`,
    '',
    '### Contact',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Phone:** ${phone}`,
    linkedin ? `- **LinkedIn:** ${linkedin}` : '',
    '',
    '### Eligibility',
    `- **Work Rights:** ${citizenship}`,
    citizenshipDetail ? `- **Details:** ${citizenshipDetail}` : '',
    '',
    '### Experience',
    `- **Notice Period:** ${noticePeriod}`,
    salaryExpectation ? `- **Salary Expectations:** ${salaryExpectation}` : '',
    cvUrl ? `- **CV:** [Download CV](${cvUrl})` : '- **CV:** Not uploaded',
    '',
    '### Cover Letter',
    coverLetter,
  ].filter(Boolean).join('\n');

  const taskId = await createClickUpTask(env, `${roleTitle} — ${name}`, taskDescription, {
    email,
    phone,
    linkedin,
    specialistField,
    location,
    noticePeriod,
    source: 'Application',
  });

  /* Best-effort: link to role and attach CV */
  if (taskId) {
    await linkToRole(taskId, role, env);

    if (cvFile && r2Key) {
      const arrayBuffer = await cvFile.arrayBuffer();
      const attached = await attachFileToTask(taskId, arrayBuffer, cvFile.name, cvFile.type, env);
      if (attached) {
        await cleanupR2(r2Key, env);
      }
    }
  }

  return Response.json({ success: true, message: 'Application submitted' }, { headers });
}

/* ── EOI handler ── */

async function handleEOI(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const discipline = formData.get('discipline') as string;
  const location = formData.get('location') as string || '';
  const message = formData.get('message') as string;
  const cvFile = formData.get('cv') as File | null;

  if (!name || !email || !discipline || !message) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Optional CV upload to R2 (staging) */
  let cvUrl = '';
  let r2Key = '';
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const key = `cv/eoi-${timestamp}-${safeName}.${ext}`;
    await env.CV_BUCKET.put(key, cvFile.stream(), {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, type: 'eoi' },
    });
    r2Key = key;
    cvUrl = `${env.R2_PUBLIC_URL}/${key}`;
  }

  const taskDescription = [
    '## Expression of Interest',
    '',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Area of Interest:** ${discipline}`,
    cvUrl ? `- **CV:** [Download CV](${cvUrl})` : '',
    '',
    '### Message',
    message,
  ].filter(Boolean).join('\n');

  const taskId = await createClickUpTask(
    env,
    `EOI — ${name} (${discipline})`,
    taskDescription,
    {
      email,
      specialistField: discipline,
      location,
      source: 'EOI',
    },
    ['EOI']
  );

  /* Best-effort: attach CV if provided */
  if (taskId && cvFile && r2Key) {
    const arrayBuffer = await cvFile.arrayBuffer();
    const attached = await attachFileToTask(taskId, arrayBuffer, cvFile.name, cvFile.type, env);
    if (attached) {
      await cleanupR2(r2Key, env);
    }
  }

  return Response.json({ success: true, message: 'Expression of interest submitted' }, { headers });
}

/* ── Helpers ── */

interface CustomFieldData {
  email?: string;
  phone?: string;
  linkedin?: string;
  specialistField?: string;
  location?: string;
  noticePeriod?: string;
  source?: string;
}

/* ClickUp custom field IDs */
const CF = {
  EMAIL: '24de3348-c5a4-44be-97d2-bf11ce077af6',
  PHONE: '2a42c8f9-e979-40a6-b339-6916b90a445a',
  CONTACT_LINK: 'bc454465-0896-4815-aae9-ad62f956de4d',
  SPECIALIST_FIELD: 'cf3bfbe7-50ea-4327-b3d0-08fd9940092d',
  LOCATION: 'df130be4-92f8-4534-b386-d3364e01aafe',
  AVAILABILITY: '25a5459a-1b6e-479b-9999-26f17865af07',
  SUBMITTED_AT: 'f4411d87-55d3-47d5-9c06-b30e514d382c',
  SOURCE: 'ddd1e5d1-9bd6-4cc5-bcb3-7a4882f3f043',
} as const;

/* Specialist Field dropdown option UUIDs */
const SPECIALIST_OPTIONS: Record<string, string> = {
  'Engineering': '7510c0cb',
  'ILS': '4bbc3a0f',
  'Project Management': '86a96e27',
  'Software Development': 'a1413237',
  'Business Support': '96a96ead',
  'Business Development & Strategy': '0537d6aa',
  'ICT & Comms': '9ebf5e82',
  'Data Science': '675a1d4d',
  'Business Analyst': '3b905627',
};

/* Location dropdown option UUIDs */
const LOCATION_OPTIONS: Record<string, string> = {
  'Melbourne': '7fdb3bf2',
  'Perth': '0decee74',
  'Sydney': '4d472759',
  'Canberra': 'b25295ca',
  'Brisbane': '9b195a20',
  'Adelaide': '0f37a8c8',
  'Australia - Other': 'bf1dc92b',
  'Will commute or relocate': '5dfbb4ce',
  'Other': '1b354cb7',
};

function buildCustomFields(data: CustomFieldData): Array<Record<string, unknown>> {
  const fields: Array<Record<string, unknown>> = [];
  const now = new Date().toISOString();

  if (data.email) fields.push({ id: CF.EMAIL, value: data.email });
  if (data.phone) fields.push({ id: CF.PHONE, value: data.phone });
  if (data.linkedin) fields.push({ id: CF.CONTACT_LINK, value: data.linkedin });
  if (data.noticePeriod) fields.push({ id: CF.AVAILABILITY, value: data.noticePeriod });
  if (data.source) fields.push({ id: CF.SOURCE, value: data.source });
  fields.push({ id: CF.SUBMITTED_AT, value: now });

  if (data.specialistField && SPECIALIST_OPTIONS[data.specialistField]) {
    fields.push({ id: CF.SPECIALIST_FIELD, value: SPECIALIST_OPTIONS[data.specialistField] });
  }
  if (data.location && LOCATION_OPTIONS[data.location]) {
    fields.push({ id: CF.LOCATION, value: LOCATION_OPTIONS[data.location] });
  }

  return fields;
}

async function createClickUpTask(
  env: Env,
  name: string,
  description: string,
  fieldData: CustomFieldData = {},
  tags: string[] = []
): Promise<string | null> {
  const custom_fields = buildCustomFields(fieldData);

  const body: Record<string, unknown> = {
    name,
    markdown_description: description,
    custom_fields,
  };
  if (tags.length > 0) {
    body.tags = tags;
  }

  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': env.CLICKUP_API_KEY,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('ClickUp error:', err);
    return null;
  }

  const data = (await response.json()) as { id: string };
  return data.id;
}
