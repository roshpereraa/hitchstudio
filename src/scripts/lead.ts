// Lead capture: validation on the page, invisible spam protection, UTM attached, then scheduling.
type Track = (e: string, p?: object) => void;
const track: Track = (e, p) => (window as unknown as { hitchTrack?: Track }).hitchTrack?.(e, p);

const startedAt = Date.now();
const utm = (() => { try { return JSON.parse(sessionStorage.getItem('hitch_utm') || '{}'); } catch { return {}; } })();

function validate(form: HTMLFormElement) {
  let firstBad: HTMLElement | null = null;
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required]:not([type=radio]):not([type=checkbox]), textarea[required]').forEach((el) => {
    let ok = el.value.trim() !== '';
    if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
    if (ok && el.type === 'tel') ok = el.value.replace(/\D/g, '').length >= 7;
    el.closest('.field')?.classList.toggle('has-error', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    if (!ok && !firstBad) firstBad = el;
  });
  form.querySelectorAll<HTMLInputElement>('input[type=url]').forEach((el) => {
    const v = el.value.trim();
    const ok = !v || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v);
    el.closest('.field')?.classList.toggle('has-error', !ok);
    if (!ok && !firstBad) firstBad = el;
  });
  form.querySelectorAll<HTMLElement>('[data-required-group]').forEach((g) => {
    const ok = !!g.querySelector('input:checked');
    g.classList.toggle('has-error', !ok);
    if (!ok && !firstBad) firstBad = g.querySelector('input');
  });
  (firstBad as HTMLElement | null)?.focus();
  return !firstBad;
}

async function send(payload: Record<string, unknown>) {
  try {
    const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.ok;
  } catch {
    return false;
  }
}

function collect(form: HTMLFormElement) {
  const fd = new FormData(form);
  const data: Record<string, unknown> = {};
  fd.forEach((v, k) => {
    if (k in data) data[k] = ([] as unknown[]).concat(data[k], v);
    else data[k] = k === 'needs' ? [v] : v;
  });
  return { ...data, ...utm, page: location.pathname, elapsed_ms: Date.now() - startedAt, tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
}

document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach((form) => {
  const type = form.dataset.formType!;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  let started = false;
  form.addEventListener('input', (e) => {
    if (!started) { started = true; track('form_start', { form: type }); }
    const field = (e.target as HTMLElement).closest('.field');
    if (field?.classList.contains('has-error')) field.classList.remove('has-error');
  });
  form.addEventListener('change', (e) => (e.target as HTMLElement).closest('[data-required-group]')?.classList.remove('has-error'));

  const pkg = new URLSearchParams(location.search).get('package');
  const pkgInput = form.querySelector<HTMLInputElement>('input[name=package]');
  if (pkg && pkgInput) pkgInput.value = pkg;
  if (new URLSearchParams(location.search).get('service') === 'ai') {
    const ai = form.querySelector<HTMLInputElement>('input[data-need="AI for my business"]');
    if (ai) ai.checked = true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(form)) { if (status) status.textContent = 'Check the highlighted fields.'; return; }
    const payload = collect(form);
    // Spam protection without a visible CAPTCHA: honeypot plus a minimum fill time.
    if (payload.company_url || (payload.elapsed_ms as number) < 2500) { if (status) status.textContent = 'Sent.'; return; }
    const btn = form.querySelector<HTMLButtonElement>('button[type=submit]');
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'Sending…';
    await send(payload);
    track('form_submit', { form: type, sector: payload.sector, market: payload.market });
    try { sessionStorage.setItem('hitch_lead', JSON.stringify({ name: payload.name, business: payload.business, email: payload.email })); } catch { /* ignore */ }
    if (btn) btn.disabled = false;
    if (type === 'book_call') { showCalendar(payload); if (status) status.textContent = ''; }
    else { form.reset(); if (status) status.textContent = 'Sent. We’ll reply within 4 business hours.'; }
  });
});

/* ---------- Step 2: scheduling ---------- */
function showCalendar(lead: Record<string, unknown>) {
  const form = document.querySelector<HTMLFormElement>('[data-book-form]')!;
  const cal = document.querySelector<HTMLElement>('[data-book-calendar]')!;
  form.hidden = true;
  cal.hidden = false;
  document.querySelectorAll('[data-bstep-bar]').forEach((b) => b.classList.add('on'));
  const label = document.querySelector('[data-bstep-label]');
  if (label) label.textContent = 'Step 2 of 2 · Pick a time';
  cal.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const picker = cal.querySelector<HTMLElement>('[data-slots]');
  if (!picker) return; // Cal.com embed handles booking
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  picker.querySelector('[data-tz]')!.textContent = tz.replace(/_/g, ' ');
  const daysEl = picker.querySelector<HTMLElement>('[data-days]')!;
  const timesEl = picker.querySelector<HTMLElement>('[data-times]')!;
  const confirm = picker.querySelector<HTMLButtonElement>('[data-confirm]')!;
  let chosen: Date | null = null;

  const days: Date[] = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  while (days.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d)); }
  const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

  const renderTimes = (day: Date) => {
    timesEl.innerHTML = '';
    chosen = null; confirm.disabled = true;
    for (let m = 8 * 60; m <= 17 * 60; m += 20) {
      const t = new Date(day); t.setMinutes(m);
      const seed = (t.getDate() * 31 + m) % 7;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot'; b.textContent = timeFmt.format(t);
      b.setAttribute('aria-pressed', 'false');
      if (seed === 0 || seed === 3) { b.disabled = true; b.setAttribute('aria-label', `${timeFmt.format(t)}, taken`); }
      b.addEventListener('click', () => {
        timesEl.querySelectorAll('.slot').forEach((x) => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true'); chosen = t; confirm.disabled = false;
      });
      timesEl.appendChild(b);
    }
  };
  days.forEach((day, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'slot-day'; b.textContent = dayFmt.format(day);
    b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(i === 0));
    b.addEventListener('click', () => { daysEl.querySelectorAll('.slot-day').forEach((x) => x.setAttribute('aria-selected', 'false')); b.setAttribute('aria-selected', 'true'); renderTimes(day); });
    daysEl.appendChild(b);
  });
  renderTimes(days[0]);

  picker.querySelector('[data-back]')!.addEventListener('click', () => { cal.hidden = true; form.hidden = false; const l = document.querySelector('[data-bstep-label]'); if (l) l.textContent = 'Step 1 of 2 · About you'; });
  confirm.addEventListener('click', async () => {
    if (!chosen) return;
    confirm.disabled = true;
    const slot = { slot_iso: chosen.toISOString(), slot_local: `${dayFmt.format(chosen)}, ${timeFmt.format(chosen)}`, tz };
    await send({ ...lead, form: 'call_booked', ...slot });
    track('call_booked', { sector: lead.sector, market: lead.market });
    try { sessionStorage.setItem('hitch_slot', JSON.stringify(slot)); } catch { /* ignore */ }
    location.href = '/book/thanks';
  });
}
