// Hitch Tools demos. Reusable, dependency-free components.
// Demo use is tracked as `tool_demo_used` and is never sent as a lead.

const fmt = (n: number) => 'US$' + Math.round(n).toLocaleString('en-US');
const used = new Set<string>();
function demoUsed(tool: string) {
  if (used.has(tool)) return;
  used.add(tool);
  (window as unknown as { hitchTrack?: (e: string, p?: object) => void }).hitchTrack?.('tool_demo_used', { tool, demo: true });
}

/* ---------- Tabs ---------- */
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
function select(tab: HTMLButtonElement, focus = false) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')!)!.hidden = !on;
  });
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'ArrowRight') select(tabs[(i + 1) % tabs.length], true);
    if (k === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length], true);
  });
});
const hash = location.hash.replace('#', '');
const fromHash = tabs.find((t) => t.getAttribute('aria-controls') === hash);
if (fromHash) select(fromHash);

/* ---------- S: Cost calculator ---------- */
const calc = document.querySelector<HTMLElement>('[data-calc]');
if (calc) {
  const form = calc.querySelector('form')!;
  const out = calc.querySelector('[data-calc-out]')!;
  const rowsEl = calc.querySelector('[data-calc-rows]')!;
  const areaOut = calc.querySelector('[data-area-out]')!;
  const base: Record<string, number> = { bathroom: 2600, kitchen: 1900, deck: 420, extension: 2300 };
  const finish: Record<string, number> = { standard: 1, premium: 1.35, luxury: 1.8 };
  const extras: Record<string, number> = { demolition: 1800, plumbing: 3200, electrical: 2400, permits: 1500 };
  const update = () => {
    const fd = new FormData(form);
    const project = String(fd.get('project'));
    const area = Number(fd.get('area'));
    const f = String(fd.get('finish'));
    const ex = fd.getAll('extra').map(String);
    areaOut.textContent = `${area} m²`;
    const work = base[project] * area * finish[f];
    const extra = ex.reduce((s, k) => s + extras[k], 0);
    const total = work + extra;
    out.textContent = `${fmt(total * 0.9)}–${fmt(total * 1.1).replace('US$', '')}`;
    rowsEl.innerHTML = '';
    const rows: [string, string][] = [
      ['Labour and materials', fmt(work)],
      ...ex.map((k) => [k[0].toUpperCase() + k.slice(1), fmt(extras[k])] as [string, string]),
      ['Typical duration', `${Math.max(1, Math.round(area / (project === 'deck' ? 10 : 4)))}–${Math.max(2, Math.round(area / (project === 'deck' ? 6 : 2.5)))} weeks`],
    ];
    rows.forEach(([a, b]) => { const li = document.createElement('li'); li.innerHTML = `<span></span><span></span>`; li.children[0].textContent = a; li.children[1].textContent = b; rowsEl.appendChild(li); });
  };
  form.addEventListener('input', () => { update(); demoUsed('cost_calculator'); });
  update();
}

/* ---------- Minimal PDF writer (one page, Helvetica) ---------- */
function makePdf(lines: { text: string; size: number; y: number; x?: number; bold?: boolean; gray?: boolean }[], rects: { x: number; y: number; w: number; h: number; rgb: [number, number, number] }[] = []) {
  const esc = (s: string) => s.replace(/[\\()]/g, (m) => '\\' + m).replace(/[^\x20-\x7e]/g, (c) => ({ '–': '-', '—': '-', '’': "'", '·': '-', '²': '2' } as Record<string, string>)[c] ?? '');
  let content = '';
  rects.forEach((r) => { content += `${r.rgb.map((v) => (v / 255).toFixed(3)).join(' ')} rg ${r.x} ${r.y} ${r.w} ${r.h} re f\n`; });
  lines.forEach((l) => {
    content += `${l.gray ? '0.42 0.42 0.42' : '0.04 0.04 0.04'} rg BT /${l.bold ? 'F2' : 'F1'} ${l.size} Tf ${l.x ?? 56} ${l.y} Td (${esc(l.text)}) Tj ET\n`;
  });
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

/* ---------- M: Quote builder ---------- */
const qb = document.querySelector<HTMLElement>('[data-quote]');
if (qb) {
  const form = qb.querySelector<HTMLFormElement>('[data-qb-form]')!;
  const steps = Array.from(qb.querySelectorAll<HTMLElement>('.qb-step'));
  const bars = Array.from(qb.querySelectorAll('.steps-bar i'));
  const label = qb.querySelector('[data-qb-step-label]')!;
  const next = qb.querySelector<HTMLButtonElement>('[data-qb-next]')!;
  const back = qb.querySelector<HTMLButtonElement>('[data-qb-back]')!;
  const submit = qb.querySelector<HTMLButtonElement>('[data-qb-submit]')!;
  const totalEl = qb.querySelector('[data-qb-total]')!;
  const rowsEl = qb.querySelector('[data-qb-rows]')!;
  const done = qb.querySelector<HTMLElement>('[data-qb-done]')!;
  let step = 0;
  const jobBase: Record<string, number> = { 'Roof repair': 1400, Fence: 1100, Painting: 1600, Landscaping: 2200 };
  const sizeMul: Record<string, number> = { small: 0.5, medium: 1, large: 2.4 };
  const optCost: Record<string, number> = { 'Remove and dispose of old materials': 350, 'Premium materials': 0.25, 'Weekend work': 0.15 };

  const compute = () => {
    const fd = new FormData(form);
    const job = String(fd.get('job'));
    const size = String(fd.get('size'));
    const opts = fd.getAll('opt').map(String);
    const base = jobBase[job] * sizeMul[size];
    const items: [string, number][] = [[`${job} (${size})`, base]];
    opts.forEach((o) => { const c = optCost[o]; items.push([o, c < 1 ? base * c : c]); });
    if (String(fd.get('when')) === 'As soon as possible') items.push(['Priority scheduling', 120]);
    const sub = items.reduce((s, [, v]) => s + v, 0);
    return { job, size, when: String(fd.get('when')), items, sub, name: String(fd.get('name') || ''), email: String(fd.get('email') || ''), suburb: String(fd.get('suburb') || '') };
  };
  const render = () => {
    const q = compute();
    totalEl.textContent = fmt(q.sub);
    rowsEl.innerHTML = '';
    q.items.forEach(([a, b]) => { const li = document.createElement('li'); li.append(Object.assign(document.createElement('span'), { textContent: a }), Object.assign(document.createElement('span'), { textContent: fmt(b) })); rowsEl.appendChild(li); });
  };
  const show = (i: number) => {
    step = i;
    steps.forEach((s, k) => (s.hidden = k !== i));
    bars.forEach((b, k) => b.classList.toggle('on', k <= i));
    label.textContent = `Step ${i + 1} of ${steps.length}`;
    back.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
  };
  const validate = () => {
    let ok = true;
    steps[step].querySelectorAll<HTMLInputElement>('input[required]').forEach((inp) => {
      const valid = inp.value.trim() !== '' && (inp.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value));
      inp.closest('.field')!.classList.toggle('has-error', !valid);
      inp.setAttribute('aria-invalid', String(!valid));
      if (!valid && ok) { inp.focus(); ok = false; }
    });
    return ok;
  };
  next.addEventListener('click', () => { if (validate()) { show(step + 1); demoUsed('quote_builder'); } });
  back.addEventListener('click', () => show(step - 1));
  form.addEventListener('input', render);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const q = compute();
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const lines = [
      { text: 'Ironbark Builders', size: 22, y: 770, bold: true },
      { text: 'Quote - demo built by Hitch Studio', size: 10, y: 750, gray: true },
      { text: `Prepared for ${q.name}${q.suburb ? ', ' + q.suburb : ''}`, size: 12, y: 700 },
      { text: date, size: 10, y: 684, gray: true },
      { text: 'Job', size: 10, y: 640, gray: true },
      { text: `${q.job}. Timing: ${q.when}.`, size: 12, y: 622 },
      ...q.items.map(([a, b], i) => ({ text: `${a}`, size: 11, y: 576 - i * 22 })),
      ...q.items.map(([, b], i) => ({ text: fmt(b), size: 11, y: 576 - i * 22, x: 440 })),
      { text: 'Estimated total', size: 12, y: 560 - q.items.length * 22, bold: true },
      { text: fmt(q.sub), size: 12, y: 560 - q.items.length * 22, x: 440, bold: true },
      { text: 'This is an estimate. A final quote follows a site visit. Valid for 30 days.', size: 9, y: 120, gray: true },
      { text: 'Demo document from hitch.build. Not a real offer.', size: 9, y: 104, gray: true },
    ];
    const blob = makePdf(lines, [{ x: 56, y: 600, w: 483, h: 0.6, rgb: [200, 200, 200] }, { x: 56, y: 574 - q.items.length * 22, w: 483, h: 0.6, rgb: [10, 10, 10] }, { x: 56, y: 60, w: 8, h: 8, rgb: [212, 255, 58] }]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ironbark-builders-quote.pdf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    done.hidden = false;
    demoUsed('quote_builder_pdf');
  });
  show(0);
  render();
}

/* ---------- M: Intake form with conditional logic ---------- */
const intake = document.querySelector<HTMLElement>('[data-intake]');
if (intake) {
  const form = intake.querySelector<HTMLFormElement>('[data-if-form]')!;
  const out = intake.querySelector('[data-if-out]')!;
  const rowsEl = intake.querySelector('[data-if-rows]')!;
  const painOut = intake.querySelector('[data-pain-out]')!;
  const update = () => {
    const fd = new FormData(form);
    const reason = String(fd.get('reason') || '');
    const fund = String(fd.get('fund') || 'self');
    form.querySelectorAll<HTMLElement>('[data-show]').forEach((el) => { el.hidden = !reason || !el.dataset.show!.split(',').includes(reason); });
    form.querySelectorAll<HTMLElement>('[data-show-fund]').forEach((el) => { el.hidden = !reason || el.dataset.showFund !== fund; });
    const pain = Number(fd.get('pain') ?? 4);
    painOut.textContent = `${pain} / 10`;
    rowsEl.innerHTML = '';
    if (!reason) { out.textContent = 'Choose a reason.'; return; }
    let appt = 'Initial assessment, 45 min';
    const notes: [string, string][] = [];
    if (reason === 'sport') { appt = 'Sports injury assessment, 45 min'; notes.push(['Sport', String(fd.get('sport') || '—')], ['Onset', String(fd.get('onset') || '—')]); }
    if (reason === 'surgery') { appt = 'Post-surgery rehab, 60 min'; notes.push(['Referral', fd.get('referral') === 'yes' ? 'Bring it on the day' : 'We’ll request it for you']); }
    if (reason === 'back') appt = 'Spinal assessment, 45 min';
    if (pain >= 8) notes.push(['Priority', 'Earliest available slot']);
    notes.push(['Funding', { self: 'Self-funded', insurance: `Insurance${fd.get('insurer') ? ': ' + fd.get('insurer') : ''}`, scheme: 'Scheme: bring your claim number' }[fund] ?? '—']);
    out.textContent = appt + '.';
    notes.forEach(([a, b]) => { const li = document.createElement('li'); li.append(Object.assign(document.createElement('span'), { textContent: a }), Object.assign(document.createElement('span'), { textContent: b })); rowsEl.appendChild(li); });
  };
  form.addEventListener('input', () => { update(); demoUsed('intake_form'); });
  form.addEventListener('change', update);
  update();
}
