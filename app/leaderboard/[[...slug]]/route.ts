// 예전 "debates" 서비스가 쓰던 경로(리더보드). 현재 10-eok 에는 존재하지 않는다.
// app/debates/[[...slug]]/route.ts 와 동일하게 410 Gone 으로 응답해 구글이
// 색인에서 더 빠르게 "영구 삭제"로 처리하도록 유도한다. (/leaderboard 및 모든 하위 경로)
export function GET() {
  return new Response("410 Gone — 이 페이지는 더 이상 제공되지 않습니다.", {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
