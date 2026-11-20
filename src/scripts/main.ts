// Hitch Studio site behaviour. Small, dependency-free, progressive.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
type NetInfo = { saveData?: boolean; effectiveType?: string };
const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
const lowData = !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? ''));

/* ---------- Tracking: consent-aware dataLayer ---------- */
type W = Window & { dataLayer?: unknown[] };
const w = window as W;
w.dataLayer = w.dataLayer || [];
export function track(event: string, params: Record<string, unknown> = {}) {
  w.dataLayer!.push({ event, ...params });
}
(window as unknown as { hitchTrack: typeof track }).hitchTrack = track;

/* ---------- UTM capture: stored for the session, attached to every lead ---------- */
(() => {
  const p = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  try {
    const stored = JSON.parse(sessionStorage.getItem('hitch_utm') || '{}');
    let changed = false;
    keys.forEach((k) => { const v = p.get(k); if (v) { stored[k] = v; changed = true; } });
    if (!stored.landing_page) { stored.landing_page = location.pathname; stored.referrer = document.referrer || ''; changed = true; }
    if (changed) sessionStorage.setItem('hitch_utm', JSON.stringify(stored));
  } catch { /* storage unavailable */ }
})();

/* ---------- Header hairline on scroll ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu]');
const mobileNav = document.querySelector<HTMLElement>('[data-mobile-nav]');
if (menuBtn && mobileNav) {
  const setOpen = (open: boolean) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* ---------- Reveal on scroll ---------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
      if ((e.target as HTMLElement).dataset.count !== undefined) countUp(e.target as HTMLElement);
    });
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
);
document.querySelectorAll('.reveal, [data-reveal], .schematic, .scale-in, [data-count]').forEach((el) => revealIO.observe(el));

/* ---------- Schematics: measure path lengths so lines draw themselves ---------- */
document.querySelectorAll<SVGGeometryElement>('.schematic .draw').forEach((p) => {
  try {
    const len = Math.ceil(p.getTotalLength?.() || 1200);
    p.style.setProperty('--len', String(len));
  } catch { /* not a geometry element */ }
});

/* ---------- Stats count up once, in mono ---------- */
function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  if (reduceMotion.matches || !Number.isFinite(target)) { el.textContent = prefix + target + suffix; return; }
  const dur = 900;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Video manager ---------- */
// Plays only on screen, never more than two at once, poster only with reduced motion or Save-Data.
const MAX_PLAYING = 2;
type VState = { el: HTMLElement; video: HTMLVideoElement; ratio: number; loaded: boolean; userPaused: boolean; hero: boolean };
const vids: VState[] = [];
const canPlayWebm = document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== '';
const videoAllowed = () => !reduceMotion.matches && !lowData;

function loadVideo(v: VState) {
  if (v.loaded || !videoAllowed()) return;
  const small = window.matchMedia('(max-width: 599px)').matches;
  const base = (small && v.el.dataset.mobile) || v.el.dataset.src!;
  v.video.src = `${base}.${canPlayWebm ? 'webm' : 'mp4'}`;
  v.video.muted = true;
  v.loaded = true;
  v.video.addEventListener('playing', () => v.video.classList.add('is-ready'), { once: true });
}

function schedule() {
  if (!videoAllowed()) { vids.forEach((v) => v.video.pause()); return; }
  const candidates = vids
    .filter((v) => v.ratio > 0.2 && !v.userPaused && !document.hidden)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, MAX_PLAYING);
  vids.forEach((v) => {
    if (candidates.includes(v)) {
      loadVideo(v);
      if (v.video.paused) v.video.play().catch(() => {});
    } else if (!v.video.paused) {
      v.video.pause();
    }
  });
}

const thresholds = Array.from({ length: 11 }, (_, i) => i / 10);
const playIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const v = vids.find((x) => x.el === e.target);
    if (v) v.ratio = e.isIntersecting ? e.intersectionRatio : 0;
  });
  schedule();
}, { threshold: thresholds });
// Lazy-load section clips shortly before they reach the viewport.
const nearIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const v = vids.find((x) => x.el === e.target);
    if (v && !v.hero) { loadVideo(v); v.video.preload = 'auto'; }
    nearIO.unobserve(e.target);
  });
}, { rootMargin: '300px 0px' });

function initVideos() {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach((el) => {
    const video = el.querySelector('video');
    if (!video) return;
    const v: VState = { el, video, ratio: 0, loaded: false, userPaused: false, hero: el.hasAttribute('data-hero') };
    vids.push(v);
    playIO.observe(el);
    if (!v.hero) nearIO.observe(el);
  });
  // Hero pause button
  document.querySelectorAll<HTMLButtonElement>('[data-pause]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls') || '');
    const v = vids.find((x) => x.el === target || (!!target && target.contains(x.el)));
    if (!v) return;
    if (!videoAllowed()) { btn.hidden = true; return; }
    btn.addEventListener('click', () => {
      v.userPaused = !v.userPaused;
      btn.setAttribute('aria-pressed', String(v.userPaused));
      btn.querySelector('[data-label]')!.textContent = v.userPaused ? 'Play' : 'Pause';
      if (v.userPaused) v.video.pause();
      schedule();
    });
  });
  document.addEventListener('visibilitychange', schedule);
  reduceMotion.addEventListener?.('change', schedule);
}
// The hero video starts after first paint so the poster stays the LCP image.
const startVideos = () => (window.requestIdleCallback ? requestIdleCallback(initVideos, { timeout: 1500 }) : setTimeout(initVideos, 300));
if (document.readyState === 'complete') startVideos();
else window.addEventListener('load', startVideos, { once: true });

/* ---------- Sticky process: step through, square marks progress ---------- */
const processSteps = document.querySelectorAll<HTMLElement>('[data-process-step]');
const marker = document.querySelector<SVGElement>('[data-process-marker]');
if (processSteps.length) {
  const nodes = Array.from(document.querySelectorAll<SVGElement>('[data-process-node]'));
  const setActive = (i: number) => {
    processSteps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    nodes.forEach((n, k) => n.classList.toggle('is-active', k <= i));
    const node = nodes[i];
    if (marker && node) {
      const x = node.getAttribute('data-x');
      const y = node.getAttribute('data-y');
      marker.style.transform = `translate(${x}px, ${y}px)`;
    }
  };
  setActive(0);
  const stepIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(Array.from(processSteps).indexOf(e.target as HTMLElement)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  processSteps.forEach((s) => stepIO.observe(s));
}

/* ---------- Work filters ---------- */
const filterBtns = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
if (filterBtns.length) {
  const cards = document.querySelectorAll<HTMLElement>('[data-sector]');
  const apply = (key: string) => {
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
    cards.forEach((c) => { c.hidden = key !== 'all' && c.dataset.sector !== key; if (!c.hidden) c.classList.add('is-in'); });
    const url = new URL(location.href);
    if (key === 'all') url.searchParams.delete('sector'); else url.searchParams.set('sector', key);
    history.replaceState(null, '', url);
    schedule();
  };
  filterBtns.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter!)));
  const initial = new URLSearchParams(location.search).get('sector');
  if (initial && Array.from(filterBtns).some((b) => b.dataset.filter === initial)) apply(initial);
}

/* ---------- Cookie consent ---------- */
// Ad pixels and analytics load only after consent. Set GTM_ID to switch on GTM.
const GTM_ID = '';
const cookie = document.querySelector<HTMLElement>('[data-cookie]');
const getConsent = () => { try { return localStorage.getItem('hitch_consent'); } catch { return null; } };
function applyConsent(choice: string | null) {
  const granted = choice === 'all' ? 'granted' : 'denied';
  w.dataLayer!.push(['consent', 'update', { analytics_storage: granted, ad_storage: granted, ad_user_data: granted, ad_personalization: granted }]);
  if (choice === 'all' && GTM_ID && !document.getElementById('gtm')) {
    const s = document.createElement('script');
    s.id = 'gtm'; s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(s);
  }
}
w.dataLayer!.push(['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 }]);
const existing = getConsent();
if (existing) applyConsent(existing);
else setTimeout(() => cookie?.classList.add('is-open'), 1200);
document.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((b) =>
  b.addEventListener('click', () => {
    const choice = b.dataset.consent!;
    try { localStorage.setItem('hitch_consent', choice); } catch { /* ignore */ }
    applyConsent(choice);
    cookie?.classList.remove('is-open');
  }),
);
document.querySelectorAll('[data-cookie-open]').forEach((b) => b.addEventListener('click', () => cookie?.classList.add('is-open')));

/* ---------- Conversion events ---------- */
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (a) track(a.dataset.track!, { location: location.pathname });
});
if (location.pathname === '/pricing') track('pricing_view');
