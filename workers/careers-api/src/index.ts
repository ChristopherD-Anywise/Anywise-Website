export interface Env {
  CV_BUCKET: R2Bucket;
  ALLOWED_ORIGINS: string;
  CLICKUP_API_KEY: string;
  CLICKUP_LIST_ID: string;
  CLICKUP_ROLES_LIST_ID: string;
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
  const securityClearance = formData.get('securityClearance') as string || '';
  const cvFile = formData.get('cv') as File | null;

  /* Validate required fields */
  if (!name || !email || !phone || !citizenship || !coverLetter || !noticePeriod || !role) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Upload CV to R2 (staging — will be attached to ClickUp task and deleted) */
  let r2Key = '';
  let cvBuffer: ArrayBuffer | null = null;
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    r2Key = `cv/${crypto.randomUUID()}.${ext}`;
    cvBuffer = await cvFile.arrayBuffer();
    await env.CV_BUCKET.put(r2Key, cvBuffer, {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, role: role },
    });
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
    securityClearance ? `- **Security Clearance:** ${securityClearance}` : '',
    '',
    '### Experience',
    `- **Notice Period:** ${noticePeriod}`,
    salaryExpectation ? `- **Salary Expectations:** ${salaryExpectation}` : '',
    '- **CV:** See attachment',
    '',
    '### Cover Letter',
    coverLetter,
  ].filter(Boolean).join('\n');

  let taskId: string | null = null;
  try {
    taskId = await createClickUpTask(env, `${roleTitle} — ${name}`, taskDescription, {
      email,
      phone,
      linkedin,
      specialistField,
      location,
      noticePeriod,
      securityClearance,
      source: 'Application',
    }, [roleTitle]);

    if (!taskId) {
      return Response.json({ success: false, message: 'Failed to create application. Please try again.' }, { status: 502, headers });
    }

    /* Best-effort: link to role and attach CV */
    await linkToRole(taskId, role, env);

    if (cvFile && r2Key && cvBuffer) {
      await attachFileToTask(taskId, cvBuffer, cvFile.name, cvFile.type, env);
    }

    return Response.json({ success: true, message: 'Application submitted' }, { headers });
  } finally {
    if (r2Key) {
      await cleanupR2(r2Key, env);
    }
  }
}

/* ── EOI handler ── */

async function handleEOI(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const discipline = formData.get('discipline') as string;
  const location = formData.get('location') as string || '';
  const securityClearance = formData.get('securityClearance') as string || '';
  const message = formData.get('message') as string;
  const cvFile = formData.get('cv') as File | null;

  if (!name || !email || !discipline || !message) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Optional CV upload to R2 (staging) */
  let r2Key = '';
  let cvBuffer: ArrayBuffer | null = null;
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      return Response.json({ success: false, message: 'Invalid file type. Accepted: .pdf, .doc, .docx' }, { status: 400, headers });
    }
    if (cvFile.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large. Maximum 10MB.' }, { status: 400, headers });
    }

    r2Key = `cv/eoi-${crypto.randomUUID()}.${ext}`;
    cvBuffer = await cvFile.arrayBuffer();
    await env.CV_BUCKET.put(r2Key, cvBuffer, {
      httpMetadata: { contentType: cvFile.type },
      customMetadata: { applicantName: name, type: 'eoi' },
    });
  }

  const taskDescription = [
    '## Expression of Interest',
    '',
    `- **Name:** ${name}`,
    `- **Email:** ${email}`,
    `- **Area of Interest:** ${discipline}`,
    securityClearance ? `- **Security Clearance:** ${securityClearance}` : '',
    cvFile && r2Key ? '- **CV:** See attachment' : '',
    '',
    '### Message',
    message,
  ].filter(Boolean).join('\n');

  let taskId: string | null = null;
  try {
    taskId = await createClickUpTask(
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

    if (!taskId) {
      return Response.json({ success: false, message: 'Failed to submit expression of interest. Please try again.' }, { status: 502, headers });
    }

    /* Best-effort: attach CV if provided */
    if (cvFile && r2Key && cvBuffer) {
      await attachFileToTask(taskId, cvBuffer, cvFile.name, cvFile.type, env);
    }

    return Response.json({ success: true, message: 'Expression of interest submitted' }, { headers });
  } finally {
    if (r2Key) {
      await cleanupR2(r2Key, env);
    }
  }
}

/* ── Helpers ── */

interface CustomFieldData {
  email?: string;
  phone?: string;
  linkedin?: string;
  specialistField?: string;
  location?: string;
  noticePeriod?: string;
  securityClearance?: string;
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
  'Engineering': '7510c0cb-1671-4d26-8b01-737e3750ab26',
  'ILS': '4bbc3a0f-c8f4-495f-99f3-7b609dadb948',
  'Project Management': '86a96e27-9b1c-4230-bd54-034517acebca',
  'Software Development': 'a1413237-fec7-48a5-8c70-c24c5abe37db',
  'Business Support': '96a96ead-3210-4139-94f4-155969e80a58',
  'Business Development & Strategy': '0537d6aa-0095-4fe9-90c9-162e45b2f168',
  'ICT & Comms': '9ebf5e82-db36-4b82-8e5d-26f4de9b6679',
  'Data Science': '675a1d4d-e900-45d3-90aa-c91711a426c7',
  'Business Analyst': '3b905627-8c96-4ab1-94d7-66af08666b8e',
};

/* Location dropdown option UUIDs */
const LOCATION_OPTIONS: Record<string, string> = {
  'Melbourne': '7fdb3bf2-5545-4542-afaf-c920a4f97e6d',
  'Perth': '0decee74-ad9c-4449-87da-64d3ed2d15f8',
  'Sydney': '4d472759-3496-46e3-9ec1-43b14cb8628e',
  'Canberra': 'b25295ca-b0f1-4889-addb-c6c48645f424',
  'Brisbane': '9b195a20-eb4e-4cb8-9255-5bf093cc8dc7',
  'Adelaide': '0f37a8c8-331d-4505-9b76-3203217a4251',
  'Australia - Other': 'bf1dc92b-10f9-4528-b5f6-aebe7620c9dc',
  'Will commute or relocate': '5dfbb4ce-3e48-49e1-a286-28d4da326b28',
  'Other': '1b354cb7-2ec1-46ac-aa9a-59cb83ef2a08',
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
