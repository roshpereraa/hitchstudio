// Renders the Open Graph image and PNG icons from the design system fonts. Run: node scripts/make-images.cjs
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const fonts = path.resolve(__dirname, '../public/fonts');
const b64 = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(fonts, f)).toString('base64');
const css = `
@font-face{font-family:'Inter Tight';src:url('${b64('inter-tight.woff2')}') format('woff2');font-weight:100 900}
@font-face{font-family:'Geist Mono';src:url('${b64('geist-mono-500.woff2')}') format('woff2');font-weight:500}
*{margin:0;box-sizing:border-box}body{background:#0A0A0A;color:#fff;font-family:'Inter Tight'}
.sq{display:inline-block;background:#D4FF3A}
.mono{font-family:'Geist Mono';text-transform:uppercase;letter-spacing:.06em;font-weight:500}`;
const og = `<html><head><style>${css}
.og{width:1200px;height:630px;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.logo{font-size:40px;font-weight:600;letter-spacing:-.04em}.logo span{font-weight:400}
h1{font-size:104px;line-height:.92;letter-spacing:-.055em;font-weight:600;max-width:1100px}
.row{display:flex;justify-content:space-between;color:#a8a8a8;font-size:18px}
</style></head><body><div class="og"><div class="logo">hitch <span>studio</span><i class="sq" style="width:8px;height:8px;margin-left:3px"></i></div>
<h1>Websites for businesses<br>with a front door.</h1>
<div class="row mono"><span>Live in days · Fixed prices · You own it</span><span>hitch.build</span></div></div></body></html>`;
const icon = (size, radius) => `<html><head><style>${css}body{background:transparent}
.i{width:${size}px;height:${size}px;border-radius:${radius}px;background:#0A0A0A;display:flex;align-items:center;justify-content:center}
.i b{font-size:${size * 0.62}px;font-weight:600;letter-spacing:-.05em;line-height:1;transform:translateY(-${size * 0.04}px)}
.i .sq{width:${size * 0.12}px;height:${size * 0.12}px;margin-left:${size * 0.02}px}</style></head>
<body><div class="i"><b>h</b><i class="sq" style="align-self:center;transform:translateY(${size * 0.13}px)"></i></div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(og); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'public/og.png' });
  for (const [s, r, out] of [[32, 6, 'favicon-32.png'], [180, 0, 'apple-touch-icon.png'], [512, 0, 'icon-512.png']]) {
    await p.setViewportSize({ width: s, height: s });
    await p.setContent(icon(s, r)); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: 'public/' + out, omitBackground: true });
  }
  await b.close();
})();
