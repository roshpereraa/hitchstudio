// Lead intake for hitch.build. Receives book-a-call, quick enquiry and call-booked events.
// Hands every lead to the CRM and alerts the sales lead. Configure with environment variables:
//   LEAD_WEBHOOK_URL   CRM or automation webhook (Stealth OS, HubSpot, Make, Zapier...) - receives the full JSON
//   SLACK_WEBHOOK_URL  optional Slack incoming webhook for the instant alert
//   RESEND_API_KEY + LEAD_ALERT_EMAIL + LEAD_FROM_EMAIL   optional email alert via Resend
const FIELDS = ['form', 'name', 'email', 'phone', 'business', 'sector', 'market', 'website', 'needs', 'message', 'package',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'landing_page', 'referrer', 'page', 'tz',
  'slot_iso', 'slot_local'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Spam: honeypot and minimum fill time. Answer OK so bots learn nothing.
  if (body.company_url || Number(body.elapsed_ms) < 2500) return res.status(200).json({ ok: true });
  const email = String(body.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !String(body.name || '').trim()) {
    return res.status(400).json({ ok: false, error: 'Missing name or email.' });
  }

  const lead = { received_at: new Date().toISOString(), source: 'hitch.build' };
  for (const k of FIELDS) if (body[k] !== undefined && body[k] !== '') lead[k] = Array.isArray(body[k]) ? body[k].map(String).slice(0, 10) : String(body[k]).slice(0, 2000);

  const tasks = [];
  if (process.env.LEAD_WEBHOOK_URL) {
    tasks.push(fetch(process.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }));
  }
  const summary = `${lead.form === 'call_booked' ? 'Call booked' : lead.form === 'quick_enquiry' ? 'Quick enquiry' : 'New lead'}: ${lead.name}${lead.business ? ` (${lead.business})` : ''} · ${lead.sector || '-'} · ${lead.market || '-'}${lead.slot_local ? ` · ${lead.slot_local} ${lead.tz || ''}` : ''} · ${lead.utm_source || 'direct'}/${lead.utm_campaign || '-'}`;
  if (process.env.SLACK_WEBHOOK_URL) {
    tasks.push(fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: summary }) }));
  }
  if (process.env.RESEND_API_KEY && process.env.LEAD_ALERT_EMAIL) {
    tasks.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || 'Hitch Studio <leads@hitch.build>',
        to: [process.env.LEAD_ALERT_EMAIL],
        reply_to: email,
        subject: summary,
        text: Object.entries(lead).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n'),
      }),
    }));
  }
  const results = await Promise.allSettled(tasks);
  const failed = results.filter((r) => r.status === 'rejected' || (r.value && !r.value.ok)).length;
  if (failed) console.error('lead handoff failures', failed, summary);
  else console.log('lead', summary);
  return res.status(200).json({ ok: true, delivered: tasks.length - failed });
}
