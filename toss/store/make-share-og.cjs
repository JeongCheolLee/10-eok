// 코드로 그리는 토스 공유 카드. 결과 수치는 메시지에만 담는다(웹과 계산 기준이 다름).
// 실행: node toss/store/make-share-og.cjs
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');
const root = path.resolve(__dirname, '../..');
const font = fs.readFileSync(path.join(root, 'public/fonts/Pretendard-Bold.otf')).toString('base64');
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
@font-face {font-family:Card;src:url(data:font/otf;base64,${font}) format('opentype');font-weight:700}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#028450;color:white;font-family:Card,sans-serif;padding:56px 72px}
p,h1,h2{margin:0;white-space:nowrap}p{font-size:42px;line-height:1.4;color:#d3f5e5}h1{font-size:180px;line-height:1.16;letter-spacing:-8px;margin-top:16px}h2{font-size:98px;line-height:1.25;letter-spacing:-4px}footer{margin-top:42px;font-size:30px;color:#d3f5e5}
</style></head><body><p>월급날마다 ETF를 모았다면</p><h1>10억까지,</h1><h2>몇 년 걸렸을까요?</h2><footer>주식으로 10억 모으기</footer></body></html>`;
(async()=>{const browser=await chromium.launch();try{const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});await page.setContent(html);await page.evaluate(()=>document.fonts.ready);const fits=await page.locator('p,h1,h2,footer').evaluateAll(es=>es.every(e=>{const r=document.createRange();r.selectNodeContents(e);const b=r.getBoundingClientRect();return b.right<=1128&&b.bottom<=630}));if(!fits)throw new Error('OG text exceeds safe area');await page.screenshot({path:path.join(root,'public/og/toss-share.png')});console.log('Created public/og/toss-share.png (1200×630)');}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
