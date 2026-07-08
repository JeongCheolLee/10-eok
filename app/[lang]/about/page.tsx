import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { AUTHOR, CONTACT_EMAIL, authorName } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { langAlternates, localeHref } from "@/lib/i18n/seo";

type Head = { title: string; desc: string; crumb: string };
const HEAD: Record<Locale, Head> = {
  ko: {
    title: "소개",
    desc: "10-eok이 무엇이고, 누가 무엇을 위해 만들었는지",
    crumb: "소개",
  },
  en: {
    title: "About",
    desc: "What 10-eok is, and who built it and why",
    crumb: "About",
  },
  ja: {
    title: "サービス紹介",
    desc: "10-eokとは何か、誰が何のために作ったか",
    crumb: "サービス紹介",
  },
  de: {
    title: "Über uns",
    desc: "Was 10-eok ist, und wer es warum gebaut hat",
    crumb: "Über uns",
  },
};

const META: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: "소개 · 10-eok",
    description: "10-eok은 '과거에 매달 모았다면 10억까지 얼마나 걸렸을까'를 실제 데이터로 보여주는 백테스트 서비스입니다. 만든 사람과 운영 방식을 소개합니다.",
  },
  en: {
    title: "About · 10-eok",
    description: "10-eok answers 'how long would it have taken to reach $1M with monthly investing?' using real historical data. Here's who built it and how it works.",
  },
  ja: {
    title: "サービス紹介 · 10-eok",
    description: "10-eokは「毎月積み立てていたら1億円までどれくらいかかったか」を実際のデータで示すバックテストサービスです。作った人と運営方針を紹介します。",
  },
  de: {
    title: "Über uns · 10-eok",
    description: "10-eok beantwortet mit echten historischen Daten: Wie lange hätte ein monatlicher Sparplan bis 1 Mio. € gebraucht? Hier erfährst du, wer das gebaut hat und wie.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) in META ? (lang as Locale) : "ko";
  const m = META[locale];
  return { title: m.title, description: m.description, alternates: langAlternates(locale, "/about") };
}

function KoBody() {
  return (
    <>
      <p>
        <strong>10-eok</strong>은 "과거에 매달 일정 금액을 모았다면, 10억 원까지 얼마나 걸렸을까?"라는
        궁금증을 <strong>실제 과거 데이터</strong>로 답해 주는 백테스트 서비스입니다.
      </p>

      <h2>무엇이 다른가</h2>
      <ul>
        <li><strong>역방향 질문.</strong> 대부분의 계산기는 "얼마가 될까"를 묻지만, 10-eok은 "내 목표(10억)까지 얼마나 걸리나"를 묻습니다.</li>
        <li><strong>한국인의 현실 반영.</strong> 달러 자산을 원화로 사는 상황에서 빠지기 쉬운 환율 효과를, 매수·평가 시점의 실제 일별 환율로 반영합니다.</li>
        <li><strong>진짜 데이터.</strong> 가정된 고정 수익률이 아니라 실제 일별 종가로 계산합니다.</li>
      </ul>

      <h2>어떻게 쓰나</h2>
      <p>
        종목과 매달 적립 금액, 매수일을 고르면 끝입니다. 그러면 10억에 도달하기까지 걸린 기간과 자산이
        불어난 과정을 그래프로 보여줍니다. 금액이나 날짜를 바꾸면 즉시 다시 계산됩니다.
      </p>

      <h2>누가 만들었나</h2>
      <p>
        10-eok은 개발자이자 개인 투자자인 <strong>{AUTHOR}</strong>의 개인 프로젝트입니다. 금융사나
        자문업체가 아니라, "과거에 이렇게 모았으면 어땠을까?"가 직접 궁금해서 실제 데이터로 검증해 보려고
        만들었습니다. 그래서 결과를 부풀리기보다, 가정과 한계, 환율·세금 같은 현실 요소를 최대한 솔직하게
        드러내는 데 초점을 뒀습니다. 저는 금융 자격을 가진 전문가가 아니며, 이 사이트는 특정 상품을 권유하지
        않습니다.
      </p>
      <p>
        계산 로직은 공개된 순수 함수로 작성하고 단위·골든 테스트로 검증합니다. 가격은{" "}
        <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>, 환율은{" "}
        <a href="https://fred.stlouisfed.org/series/DEXKOUS" target="_blank" rel="noopener">미국 연방준비제도(FRED)</a>의 공개 데이터를 매일 자동으로 받아 반영합니다. 계산 방식의 전제와 단순화는{" "}
        <a href="/how-it-works">계산 방법 &amp; FAQ</a>에서 투명하게 공개합니다.
      </p>

      <h2>앞으로</h2>
      <p>
        현재 QLD·TQQQ·QQQ·SPY·VOO·SCHD·VT·KODEX 200(코스피200) 여덟 종목을 지원하며, 종목 간 비교, 물가 상승률을 반영한
        적립, 목표 기간을 정하면 필요한 월 적립액을 역산하는 기능 등을 더해 가고 있습니다. 오류 제보나 추가
        종목 요청은 언제든 환영합니다.
      </p>

      <p className="note">
        10-eok은 교육·정보 제공 도구이며 투자 권유나 자문이 아닙니다. 문의는{" "}
        <a href="/contact">문의 페이지</a> 또는{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 주세요.
      </p>
    </>
  );
}

function EnBody() {
  const name = authorName("en");
  return (
    <>
      <p>
        <strong>10-eok</strong> answers a simple question with <strong>real historical data</strong>:
        "If you'd invested a fixed amount every month, how long would it have taken to reach $1M?"
      </p>

      <h2>What makes it different</h2>
      <ul>
        <li><strong>The question is reversed.</strong> Most calculators ask "how much will I have?" — 10-eok asks "how long until I hit my goal ($1M)?"</li>
        <li><strong>Real daily prices.</strong> No assumed fixed return — every result is computed from actual historical daily closing prices.</li>
        <li><strong>Transparent assumptions.</strong> Dividends, buy day, and taxes are all explained plainly, not buried in fine print.</li>
      </ul>

      <h2>How to use it</h2>
      <p>
        Pick a ticker, a monthly amount, and a buy day — that's it. You'll see how long it took to
        reach $1M and a chart of how your balance grew along the way. Change the amount or date and
        it recalculates instantly.
      </p>

      <h2>Who built this</h2>
      <p>
        10-eok is a personal project by <strong>{name}</strong>, a developer and individual investor.
        It's not run by a financial firm or advisory service — I built it because I was genuinely
        curious "what if I'd started investing back then?" and wanted to check with real data instead
        of guessing. The focus is on being upfront about assumptions and limitations rather than
        making the numbers look better than they are. I'm not a licensed financial professional, and
        this site doesn't recommend any specific product.
      </p>
      <p>
        The calculation logic is written as pure, tested functions with unit and golden tests. Prices
        come from <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>,
        and economic data from the{" "}
        <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener">Federal Reserve Bank of St. Louis (FRED)</a>,
        refreshed automatically every day. The exact assumptions and simplifications behind the
        calculation are documented transparently on the{" "}
        <a href={localeHref("en", "/how-it-works")}>How it works &amp; FAQ</a> page.
      </p>

      <h2>What's next</h2>
      <p>
        Currently supported tickers include QLD, TQQQ, QQQ, SPY, VOO, SCHD, and VT, with more on the
        way — ticker comparisons, inflation-adjusted contributions, and reverse-calculating the
        monthly amount needed for a target timeline. Bug reports and requests for new tickers are
        always welcome.
      </p>

      <p className="note">
        10-eok is an educational, informational tool — not investment advice or a solicitation.
        Reach out via the{" "}
        <a href={localeHref("en", "/contact")}>contact page</a> or{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  );
}

function JaBody() {
  const name = authorName("ja");
  return (
    <>
      <p>
        <strong>10-eok</strong>は「毎月一定額を積み立てていたら、1億円までどれくらいかかったか?」という
        疑問に<strong>実際の過去データ</strong>で答えるバックテストサービスです。
      </p>

      <h2>何が違うのか</h2>
      <ul>
        <li><strong>逆方向の質問。</strong> 多くの計算機は「いくらになるか」を問いますが、10-eokは「目標(1億円)まで何年かかるか」を問います。</li>
        <li><strong>実際のドル/円為替。</strong> ドル資産を円で買う場合に見落としがちな為替の影響を、買付・評価時点の実際の日次レートで反映します。</li>
        <li><strong>本物のデータ。</strong> 仮定の固定リターンではなく、実際の日次終値で計算します。</li>
      </ul>

      <h2>使い方</h2>
      <p>
        銘柄・毎月の積立額・買付日を選ぶだけです。1億円に到達するまでの期間と、資産が増えていく様子を
        グラフで見られます。金額や日付を変えるとすぐに再計算されます。
      </p>

      <h2>誰が作ったか</h2>
      <p>
        10-eokは開発者であり個人投資家でもある<strong>{name}</strong>の個人プロジェクトです。金融会社や
        アドバイザリー企業ではなく、「過去にこう積み立てていたらどうだったか」を自分で確かめたくて、
        実際のデータで検証してみようと作りました。結果を良く見せることより、前提や限界、為替・税金と
        いった現実的な要素をできるだけ正直に示すことを大切にしています。私は金融の資格を持つ専門家では
        なく、このサイトは特定の商品を勧めるものではありません。
      </p>
      <p>
        計算ロジックは公開された純粋関数として書かれ、単体テスト・golden テストで検証しています。
        価格は<a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>、
        為替・経済データは
        <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener">米セントルイス連邦準備銀行(FRED)</a>
        の公開データを毎日自動取得しています。計算方法の前提と単純化については
        <a href={localeHref("ja", "/how-it-works")}>計算方法 &amp; FAQ</a>で透明に公開しています。
      </p>

      <h2>今後</h2>
      <p>
        現在QLD・TQQQ・QQQ・SPY・VOO・SCHD・VTなどの銘柄に対応しており、銘柄間の比較、物価上昇を反映した
        積立、目標期間から必要な毎月の積立額を逆算する機能などを追加していく予定です。不具合報告や
        追加してほしい銘柄のご要望はいつでも歓迎します。
      </p>

      <p className="note">
        10-eokは教育・情報提供のためのツールであり、投資勧誘や助言ではありません。お問い合わせは
        <a href={localeHref("ja", "/contact")}>お問い合わせページ</a>または
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>まで。
      </p>
    </>
  );
}

function DeBody() {
  const name = authorName("de");
  return (
    <>
      <p>
        <strong>10-eok</strong> beantwortet eine einfache Frage mit <strong>echten historischen Daten</strong>:
        "Wenn du jeden Monat einen festen Betrag investiert hättest, wie lange hätte es bis 1 Mio. € gedauert?"
      </p>

      <h2>Was ist anders</h2>
      <ul>
        <li><strong>Die Frage ist umgedreht.</strong> Die meisten Rechner fragen "wie viel wird es?" — 10-eok fragt "wie lange bis zu meinem Ziel (1 Mio. €)?"</li>
        <li><strong>Echter Euro/Dollar-Wechselkurs.</strong> Der Effekt der Währungsumrechnung beim Kauf von Dollar-Anlagen mit Euro wird mit den tatsächlichen Tageskursen berücksichtigt.</li>
        <li><strong>Echte Daten.</strong> Keine angenommene feste Rendite — jedes Ergebnis basiert auf echten historischen Tagesschlusskursen.</li>
      </ul>

      <h2>So funktioniert's</h2>
      <p>
        Wähle einen ETF, einen monatlichen Betrag und einen Kauftag — das war's. Du siehst, wie lange
        es bis 1 Mio. € gedauert hätte, und einen Chart, wie dein Vermögen dabei gewachsen ist. Änderst
        du Betrag oder Datum, wird sofort neu berechnet.
      </p>

      <h2>Wer das gebaut hat</h2>
      <p>
        10-eok ist ein persönliches Projekt von <strong>{name}</strong>, einem Entwickler und
        Privatanleger. Es steht keine Finanzfirma oder Beratung dahinter — ich habe es gebaut, weil
        mich selbst interessiert hat "was, wenn ich damals angefangen hätte?", und ich das mit echten
        Daten überprüfen wollte, statt zu raten. Der Fokus liegt darauf, Annahmen und Grenzen ehrlich
        offenzulegen, statt die Zahlen besser aussehen zu lassen als sie sind. Ich bin kein
        zugelassener Finanzexperte, und diese Seite empfiehlt kein bestimmtes Produkt.
      </p>
      <p>
        Die Berechnungslogik ist als reine, getestete Funktionen geschrieben, mit Unit- und
        Golden-Tests abgesichert. Kursdaten stammen von{" "}
        <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>, Wechselkurs-
        und Wirtschaftsdaten von der{" "}
        <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener">Federal Reserve Bank of St. Louis (FRED)</a>,
        täglich automatisch aktualisiert. Die genauen Annahmen und Vereinfachungen der Berechnung
        stehen transparent auf der Seite{" "}
        <a href={localeHref("de", "/how-it-works")}>So funktioniert's &amp; FAQ</a>.
      </p>

      <h2>Was als Nächstes kommt</h2>
      <p>
        Aktuell unterstützte ETFs sind unter anderem QLD, TQQQ, QQQ, SPY, VOO, SCHD und VT — weitere
        Funktionen sind in Arbeit: ETF-Vergleiche, inflationsangepasste Sparraten, und die
        Rückrechnung der nötigen Monatsrate für ein Zieljahr. Fehlermeldungen und Wünsche für neue
        ETFs sind jederzeit willkommen.
      </p>

      <p className="note">
        10-eok ist ein Bildungs- und Informationstool — keine Anlageberatung oder Empfehlung. Melde
        dich über die{" "}
        <a href={localeHref("de", "/contact")}>Kontaktseite</a> oder{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  );
}

const BODIES: Record<Locale, () => React.ReactElement> = { ko: KoBody, en: EnBody, ja: JaBody, de: DeBody };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in BODIES ? (lang as Locale) : "ko";
  const h = HEAD[locale];
  const Body = BODIES[locale];
  return (
    <ContentShell title={h.title} desc={h.desc} crumb={h.crumb}>
      <Body />
    </ContentShell>
  );
}
