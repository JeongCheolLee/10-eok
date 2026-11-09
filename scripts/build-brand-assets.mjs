// 승인한 10억 아이콘 원본을 웹, 미니앱, 콘솔 등록 크기로 내보낸다.
// 사용: node scripts/build-brand-assets.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = await readFile(path.join(root, 'design/brand/icon-10eok-source.png'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const size of [256, 600]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0}img{display:block;width:100vw;height:100vh}</style><img src="data:image/png;base64,${source.toString('base64')}" alt="10억">`);
    await page.locator('img').evaluate(img => img.decode());
    const png = await page.screenshot();
    const image = `<image width="128" height="128" href="data:image/png;base64,${png.toString('base64')}"/>`;
    const svg = (rounded) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">${rounded ? '<defs><clipPath id="round"><rect width="128" height="128" rx="30"/></clipPath></defs><g clip-path="url(#round)">' : ''}${image}${rounded ? '</g>' : ''}</svg>\n`;
    if (size === 256) {
      await mkdir(path.join(root, 'public/brand'), { recursive: true });
      await writeFile(path.join(root, 'public/brand/logo-10eok.png'), png);
      await writeFile(path.join(root, 'toss/public/logo-10eok.png'), png);
      await writeFile(path.join(root, 'app/icon.svg'), svg(true));
      await writeFile(path.join(root, 'toss/public/favicon.svg'), svg(true));
    } else {
      await writeFile(path.join(root, 'toss/store/logo-600.png'), png);
      await writeFile(path.join(root, 'toss/store/logo.svg'), svg(false));
    }
  }
} finally {
  await browser.close();
}
