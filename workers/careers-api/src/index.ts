interface Env {
  CV_BUCKET: R2Bucket;
  ALLOWED_ORIGINS: string;
  CLICKUP_API_KEY: string;
  CLICKUP_LIST_ID: string;
  WEB3FORMS_ACCESS_KEY: string;
  R2_PUBLIC_URL: string;
}

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
  const cvFile = formData.get('cv') as File | null;

  /* Validate required fields */
  if (!name || !email || !phone || !citizenship || !coverLetter || !noticePeriod || !role) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Upload CV to R2 */
  let cvUrl = '';
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

  await createClickUpTask(env, `${roleTitle} — ${name}`, taskDescription, ['application']);

  /* Send email via Web3Forms */
  await sendEmail(env, {
    subject: `New Application: ${roleTitle} — ${name}`,
    message: `New application received for ${roleTitle}.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nWork Rights: ${citizenship}\nNotice Period: ${noticePeriod}\n\nCheck ClickUp for full details.`,
    from_name: 'Anywise Careers',
  });

  return Response.json({ success: true, message: 'Application submitted' }, { headers });
}

/* ── EOI handler ── */

async function handleEOI(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const discipline = formData.get('discipline') as string;
  const message = formData.get('message') as string;
  const cvFile = formData.get('cv') as File | null;

  if (!name || !email || !discipline || !message) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400, headers });
  }

  /* Optional CV upload */
  let cvUrl = '';
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

  await createClickUpTask(env, `EOI — ${name} (${discipline})`, taskDescription, ['eoi']);

  await sendEmail(env, {
    subject: `New EOI: ${name} — ${discipline}`,
    message: `New expression of interest received.\n\nName: ${name}\nEmail: ${email}\nArea: ${discipline}\n\nMessage:\n${message}`,
    from_name: 'Anywise Careers',
  });

  return Response.json({ success: true, message: 'Expression of interest submitted' }, { headers });
}

/* ── Helpers ── */

async function createClickUpTask(
  env: Env,
  name: string,
  description: string,
  tags: string[]
): Promise<void> {
  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': env.CLICKUP_API_KEY,
      },
      body: JSON.stringify({
        name,
        description,
        tags,
        status: 'to do',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('ClickUp error:', err);
    /* Don't throw — application was received even if ClickUp fails */
  }
}

async function sendEmail(
  env: Env,
  opts: { subject: string; message: string; from_name: string }
): Promise<void> {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: opts.subject,
      message: opts.message,
      from_name: opts.from_name,
      botcheck: '',
    }),
  });

  if (!response.ok) {
    console.error('Web3Forms error:', await response.text());
  }
}
