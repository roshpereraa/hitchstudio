# hitch.build — Hitch Studio website

Astro static site, deployed on Vercel. Content lives in `src/data/site.ts` (pricing from the business plan, sectors, case studies, FAQs).

- `npm run dev` / `npm run build`
- `api/lead.js` — lead intake. Set `LEAD_WEBHOOK_URL` (CRM), `SLACK_WEBHOOK_URL`, and `RESEND_API_KEY` + `LEAD_ALERT_EMAIL` for alerts.
- `src/data/site.ts` — set `phone`/`whatsapp` for click-to-call and `calLink` to embed Rope's Cal.com calendar.
- `src/scripts/main.ts` — set `GTM_ID` to load Google Tag Manager after consent.
- `scripts/encode-video.sh` — grades (B&W, deep blacks, grain) and encodes footage to MP4 + WebM + WebP poster.
- `scripts/make-images.cjs` — renders the OG image and icons from the brand fonts.

Footage: Mixkit (free licence), real footage only, to be replaced by Hitch's own client shoots.
