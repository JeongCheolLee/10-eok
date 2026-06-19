import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <nav>
          <Link href="/">홈</Link>
          <Link href="/guides">가이드</Link>
          <Link href="/how-it-works">계산 방법</Link>
          <Link href="/about">소개</Link>
          <Link href="/contact">문의</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용약관</Link>
        </nav>
        <p className="disc">
          10-eok은 실제 과거 데이터를 이용한 백테스트 결과를 보여주는 정보 제공 서비스입니다.
          과거 수익률은 미래 수익을 보장하지 않으며, 본 서비스의 어떤 내용도 투자 권유나 투자
          자문이 아닙니다. 투자 결정과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
          가격 데이터는 Yahoo Finance, 환율은 미국 세인트루이스 연방준비은행(FRED)에서 가져옵니다.
        </p>
      </div>
    </footer>
  );
}
