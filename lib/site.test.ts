import { describe, expect, it } from "vitest";
import { AUTHOR, CONTACT_EMAIL, LEGACY_HOSTS, SITE_URL, authorName, legacyRedirectUrl } from "./site";
import { LEGAL_EMAIL } from "./legal/miniapp";

describe("legacyRedirectUrl", () => {
  it("이전 도메인의 페이지 요청을 새 도메인의 같은 경로·쿼리로 보낸다", () => {
    expect(legacyRedirectUrl("jeongcheol.cloud", "/etf/069500.ks", "?h=QLD&m=100")).toBe(`${SITE_URL}/etf/069500.ks?h=QLD&m=100`);
    expect(legacyRedirectUrl("www.jeongcheol.cloud", "/", "")).toBe(`${SITE_URL}/`);
    expect(legacyRedirectUrl("JeongCheol.Cloud:443", "/en/guides")).toBe(`${SITE_URL}/en/guides`);
  });

  it("새 도메인의 www도 루트로 보낸다", () => {
    expect(legacyRedirectUrl("www.fefelabs.dev", "/guides", "?a=1")).toBe(`${SITE_URL}/guides?a=1`);
  });

  it("새 도메인·미리보기·로컬 요청은 그대로 둔다", () => {
    for (const host of ["fefelabs.dev", "10-eok-git-main.vercel.app", "localhost:3000", "notjeongcheol.cloud", "", null, undefined]) {
      expect(legacyRedirectUrl(host, "/", "")).toBeNull();
    }
  });

  it("새 주소가 이전 도메인 목록에 들어 있지 않다(리다이렉트 반복 방지)", () => {
    expect(LEGACY_HOSTS).not.toContain(new URL(SITE_URL).host);
  });
});

describe("공개 운영자 정보", () => {
  it("운영자 이름과 문의 주소에 개인 이름·개인 이메일이 없다", () => {
    expect(AUTHOR).toBe("페페랩스");
    expect(authorName("ko")).toBe("페페랩스");
    expect(authorName("en")).toBe("Fefe Labs");
    expect(CONTACT_EMAIL).toBe("fefelabss@gmail.com");
    expect(LEGAL_EMAIL).toBe(CONTACT_EMAIL);
  });
});
