/** @type {import('next').NextConfig} */
const nextConfig = {
  // 토스 미니앱이 https://jeongcheol.cloud/data/* 를 교차 출처로 fetch한다.
  // 공개 읽기 전용 JSON이라 Origin은 * 허용 (headers는 public/ 파일보다 먼저 적용됨).
  async headers() {
    return [
      {
        source: "/data/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};
export default nextConfig;
