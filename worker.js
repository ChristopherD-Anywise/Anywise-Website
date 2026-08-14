/**
 * Anywise Website Worker
 * Handles /api/engage form submissions via MailChannels,
 * all other requests are served from static assets by the asset handler.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ── /api/engage endpoint ── */
    if (url.pathname === '/api/engage') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleEngageForm(request);
    }

    /* ── Everything else: serve static assets ── */
    return env.ASSETS.fetch(request);
  }
};

async function handleEngageForm(request) {
  // Parse JSON body
  let data;
  try {
    data = await request.json();
  } catch (err) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  // Validate required fields
  const required = ['name', 'email', 'organisation', 'enquiry', 'message'];
  for (const field of required) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      return jsonResponse({ success: false, error: `Missing field: ${field}` }, 400);
    }
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return jsonResponse({ success: false, error: 'Invalid email address' }, 400);
  }

  // Build email body
  const body = [
    `New enquiry from ${data.name}`,
    `Email: ${data.email}`,
    `Organisation: ${data.organisation}`,
    data.role && data.role.trim() ? `Role: ${data.role}` : null,
    `Enquiry type: ${data.enquiry}`,
    data.product ? `Product: ${data.product}` : null,
    ``,
    `Message:`,
    data.message
  ].filter(Boolean).join('\n');

  // Send via MailChannels
  try {
    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'sales@anywise.com.au', name: 'Anywise Sales' }]
          }
        ],
        from: {
          email: 'noreply@anywise.com.au',
          name: 'Anywise Website'
        },
        reply_to: {
          email: data.email,
          name: data.name
        },
        subject: `Engage Us: ${data.enquiry} enquiry from ${data.name} (${data.organisation})`,
        content: [
          {
            type: 'text/plain',
            value: body
          }
        ]
      })
    });

    if (mailResponse.status === 202 || mailResponse.status === 200) {
      return jsonResponse({ success: true });
    } else {
      const errText = await mailResponse.text();
      console.error('MailChannels error:', mailResponse.status, errText);
      return jsonResponse({ success: false, error: 'Email delivery failed' }, 502);
    }
  } catch (err) {
    console.error('Worker error:', err);
    return jsonResponse({ success: false, error: 'Server error' }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
