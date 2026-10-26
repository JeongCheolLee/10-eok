import { LEGAL_APP_NAME, LEGAL_EMAIL, LEGAL_UPDATED, MINIAPP_LEGAL, PRIVACY_REFERENCES, type LegalKind } from "./miniapp";

const escape = (text: string) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** 콘솔에서 로그인 없이 열 수 있는 독립 문서. 웹 레이아웃의 GA·AdSense를 로드하지 않는다. */
export function legalHtml(kind: LegalKind): string {
  const doc = MINIAPP_LEGAL[kind];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(doc.title)} · ${escape(LEGAL_APP_NAME)}</title><meta name="description" content="${escape(doc.intro)}"><link rel="canonical" href="https://jeongcheol.cloud/miniapp/${kind}"><style>
  :root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#fff;color:#191f28;font:16px/1.8 system-ui,sans-serif;word-break:keep-all;overflow-wrap:anywhere}main{max-width:760px;margin:auto;padding:40px 24px 64px}h1{font-size:30px;line-height:1.4}h2{font-size:20px;line-height:1.5;margin-top:32px}p{margin:12px 0}.meta{color:#5c6675;font-size:14px}a{color:#00875b;text-underline-offset:3px}nav{display:flex;flex-wrap:wrap;gap:8px 24px;border-top:1px solid #e5e8eb;margin-top:32px;padding-top:16px}nav a{min-height:44px;display:inline-flex;align-items:center}li{margin:8px 0}
  </style></head><body><main><p class="meta">${escape(LEGAL_APP_NAME)} · 토스 미니앱</p><h1>${escape(doc.title)}</h1><p class="meta">작성·수정일: ${LEGAL_UPDATED}</p><p>${escape(doc.intro)}</p>${doc.sections.map((section) => `<section><h2>${escape(section.title)}</h2>${section.paragraphs.map((p) => `<p>${escape(p)}</p>`).join("")}</section>`).join("")}${kind === "privacy" ? `<section><h2>외부 서비스 정책</h2><ul>${PRIVACY_REFERENCES.map((ref) => `<li><a href="${escape(ref.href)}" rel="noreferrer">${escape(ref.label)}</a></li>`).join("")}</ul></section>` : ""}<p>문의: <a href="mailto:${LEGAL_EMAIL}">${LEGAL_EMAIL}</a></p><nav aria-label="법적 안내"><a href="/miniapp/terms">이용약관</a><a href="/miniapp/privacy">개인정보처리방침</a></nav></main></body></html>`;
}

export function legalResponse(kind: LegalKind): Response {
  return new Response(legalHtml(kind), { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  } });
}
