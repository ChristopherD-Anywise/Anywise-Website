/**
 * Cloudflare Pages Function: /api/engage
 * Handles Engage Us form submissions and sends emails via MailChannels
 */

export async function onRequestPost(context) {
  // Parse JSON body
  let data;
  try {
    data = await context.request.json();
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate required fields
  const required = ['name', 'email', 'organisation', 'enquiry', 'message'];
  for (const field of required) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      return new Response(JSON.stringify({ success: false, error: `Missing field: ${field}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Build email body (plain text)
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

    // Check response status
    if (mailResponse.status === 202 || mailResponse.status === 200) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const errText = await mailResponse.text();
      console.error('MailChannels error:', mailResponse.status, errText);
      return new Response(JSON.stringify({ success: false, error: 'Email delivery failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    console.error('Worker error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Reject non-POST methods
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  return onRequestPost(context);
}
