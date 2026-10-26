import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { CONTACT_EMAIL, authorName } from "@/lib/site";
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
    description: "10-eok은 과거 ETF 가격과 환율로 목표까지 걸렸던 시간을 계산해요. 만든 사람과 계산·비교·저장 기능을 소개해요.",
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

type AboutContent = {
  intro: string;
  useTitle: string;
  steps: string[];
  readingTitle: string;
  reading: string;
  comparison: string;
  authorTitle: string;
  author: string;
  approach: string;
  method: string;
  feedbackTitle: string;
  feedback: string;
  contact: string;
  disclaimer: string;
};

const CONTENT: Record<Locale, AboutContent> = {
  ko: {
    intro: "10-eok은 ETF를 같은 금액으로 꾸준히 모았다면 목표 금액까지 얼마나 걸렸을지 돌아보는 계산기예요. 고정 수익률을 가정하는 대신 과거 가격과 환율로 계산해요.",
    useTitle: "이렇게 계산해요",
    steps: [
      "궁금한 ETF를 최대 5개 골라요. 종목마다 매회 넣을 돈과 매달·매주·거래일마다 중에서 모으는 주기를 정해요.",
      "시작할 때 한 번 넣을 목돈이 있다면 함께 입력해요. 여러 ETF를 고르면 적립액 비중대로 목돈을 나눠 넣어요.",
      "‘10억까지 계산하기’를 누르면 결과를 볼 수 있어요. 조건을 바꾸려면 결과에서 ‘조건 바꿔보기’를 눌러 다시 계산해요.",
    ],
    readingTitle: "결과에서 볼 수 있는 것",
    reading: "처음 목표를 넘기까지 걸린 기간과 이후에도 계속 모았을 때의 마지막 평가액을 나눠 보여줘요. 기본 기간 계산은 목표를 한 번이라도 넘은 경우 중 가장 최근에 시작한 달을 찾아요. 모든 시작일 중 가장 짧은 기간을 찾는 계산은 아니에요.",
    comparison: "결과에서는 같은 기간과 납입 조건으로 다른 ETF도 비교할 수 있어요. 기본 결과는 실제 거래 자료를 쓰고, 비교에서 상장 전 추정 자료를 쓴 결과는 따로 표시해요. 조건을 저장하면 이 브라우저에서 다시 열어 새로 불러온 자료로 계산할 수 있어요.",
    authorTitle: "만든 사람",
    author: "의 개인 프로젝트예요. 개발자이자 개인 투자자로서 ‘과거에 이렇게 모았다면 어땠을까?’를 직접 확인하고 싶어 만들었어요. 금융 자격을 가진 전문가는 아니며, 특정 상품을 권유하지 않아요.",
    approach: "계산 로직은 공개된 함수로 작성하고 단위 테스트로 확인해요. 가격은 Yahoo Finance, 환율과 물가는 FRED 등의 공개 자료를 사용해요. 매일 자료 갱신을 시도하지만 휴장일이나 원자료의 갱신 지연으로 기준일이 다를 수 있어요. 결과에서 가격과 환율의 기준일을 확인할 수 있어요.",
    method: "계산 방법과 한계 알아보기",
    feedbackTitle: "오류를 발견했다면",
    feedback: "계산 조건과 결과의 기준일을 함께 알려주면 확인하는 데 도움이 돼요. 계좌번호나 실제 거래 내역 같은 개인정보는 보낼 필요가 없어요.",
    contact: "문의 페이지",
    disclaimer: "과거 데이터로 계산한 참고용 결과예요. 특정 종목을 추천하지 않고, 미래 수익을 보장하지 않아요.",
  },
  en: {
    intro: "10-eok looks back at how long regular ETF purchases would have taken to reach a target such as $1M. It uses historical prices and exchange rates rather than an assumed constant return.",
    useTitle: "How to use it",
    steps: [
      "Choose up to five ETFs, set the amount for each purchase of each ETF, and select monthly, weekly or every trading day.",
      "Add an optional lump sum at the historical start. With several ETFs, it is split in proportion to their regular contribution amounts.",
      "Press Calculate to see the result. To try different inputs, choose Change conditions on the result and calculate again.",
    ],
    readingTitle: "What the result tells you",
    reading: "The result separates the time to the first target crossing from the final value after continued purchases. The default time calculation finds the latest historical start month that reached the target at least once. It does not find the shortest duration across every possible start date.",
    comparison: "You can compare other ETFs using the same period and contribution conditions. The main result uses actual trading history. Comparisons using estimated history before an ETF’s listing are shown separately. Save conditions to reopen them in this browser and recalculate with newly loaded data.",
    authorTitle: "Who built this",
    author: "built 10-eok as a personal project. As a developer and individual investor, I wanted to check what would have happened if I had invested back then. I am not a licensed financial professional, and the site does not recommend specific products.",
    approach: "The calculation functions are public and checked with unit tests. Prices come from Yahoo Finance; exchange rates and inflation use public sources including FRED. The data pipeline runs daily, but market holidays and source delays can leave different reference dates. Check the price and exchange-rate dates in the result.",
    method: "Read the calculation method and limitations",
    feedbackTitle: "Report a problem",
    feedback: "Include the calculation conditions and the result’s reference date so the issue can be checked. You do not need to send account numbers or personal transaction records.",
    contact: "Contact page",
    disclaimer: "Results are historical scenarios for information. They are not investment advice or a guarantee of future returns.",
  },
  ja: {
    intro: "10-eokは、ETFを一定額ずつ積み立てていたら、1億円などの目標までどれくらいかかったかを振り返る計算機です。固定の利回りを仮定せず、過去の価格と為替を使います。",
    useTitle: "使い方",
    steps: [
      "ETFを最大5銘柄選び、銘柄ごとの1回の購入額と、毎月・毎週・取引日ごとの購入頻度を決めます。",
      "開始時に一度だけ投資する資金があれば入力します。複数のETFでは定期購入額の割合で配分します。",
      "計算ボタンを押すと結果が表示されます。条件を変更する場合は、結果の「条件を変える」から戻って再計算します。",
    ],
    readingTitle: "結果から分かること",
    reading: "初めて目標を超えるまでの期間と、その後も積み立てた場合の最終評価額を分けて表示します。通常の期間計算は、一度でも目標を超えた条件のうち、最も遅い開始月を探します。すべての開始日の中から最短期間を探す計算ではありません。",
    comparison: "同じ期間と購入条件で、ほかのETFも比較できます。基本の結果は実際の取引履歴を使い、上場前の推定資料を使う比較は別に表示します。条件を保存すると、このブラウザーで開き直し、新しく読み込んだ資料で再計算できます。",
    authorTitle: "作った人",
    author: "の個人プロジェクトです。開発者・個人投資家として、過去に投資していたらどうなったかを確かめたくて作りました。金融資格を持つ専門家ではなく、特定の商品を勧めるものではありません。",
    approach: "計算関数は公開され、単体テストで確認しています。価格はYahoo Finance、為替と物価はFREDなどの公開資料を使います。毎日更新を試みますが、休場日や資料の更新遅延により基準日が異なることがあります。結果で価格と為替の基準日を確認できます。",
    method: "計算方法と限界を読む",
    feedbackTitle: "問題を見つけたら",
    feedback: "計算条件と結果の基準日を添えると、問題を確認しやすくなります。口座番号や個人の取引明細を送る必要はありません。",
    contact: "お問い合わせページ",
    disclaimer: "過去の条件による参考用の計算です。投資助言や将来の利益を保証するものではありません。",
  },
  de: {
    intro: "10-eok zeigt im Rückblick, wie lange regelmäßige ETF-Käufe bis zu einem Ziel wie 1 Mio. € gebraucht hätten. Die Berechnung verwendet historische Kurse und Wechselkurse statt einer angenommenen konstanten Rendite.",
    useTitle: "So verwendest du den Rechner",
    steps: [
      "Wähle bis zu fünf ETFs, den Betrag je Kauf und ETF sowie den Rhythmus: monatlich, wöchentlich oder an jedem Handelstag.",
      "Ergänze bei Bedarf einen einmaligen Anfangsbetrag zum historischen Start. Bei mehreren ETFs wird er nach ihren regelmäßigen Kaufbeträgen aufgeteilt.",
      "Drücke die Berechnungstaste, um das Ergebnis zu sehen. Über „Bedingungen ändern“ im Ergebnis kannst du Eingaben ändern und erneut rechnen.",
    ],
    readingTitle: "Was du im Ergebnis siehst",
    reading: "Das Ergebnis trennt die Zeit bis zum ersten Erreichen des Ziels vom Endwert bei fortgesetzten Käufen. Die normale Zeitberechnung sucht den spätesten historischen Startmonat, mit dem das Ziel mindestens einmal erreicht wurde. Sie sucht nicht die kürzeste Dauer über alle möglichen Startdaten.",
    comparison: "Andere ETFs lassen sich mit demselben Zeitraum und denselben Kaufbedingungen vergleichen. Das Hauptergebnis nutzt tatsächliche Handelsdaten. Vergleiche mit geschätzten Daten vor der Börsennotierung werden getrennt angezeigt. Gespeicherte Bedingungen kannst du in diesem Browser erneut öffnen und mit neu geladenen Daten berechnen.",
    authorTitle: "Wer das gebaut hat",
    author: "hat 10-eok als persönliches Projekt entwickelt. Als Entwickler und Privatanleger wollte ich prüfen, was passiert wäre, wenn ich damals investiert hätte. Ich bin kein zugelassener Finanzexperte; die Seite empfiehlt keine bestimmten Produkte.",
    approach: "Die Berechnungsfunktionen sind öffentlich und durch Unit-Tests geprüft. Kurse stammen von Yahoo Finance, Wechselkurse und Inflation aus öffentlichen Quellen wie FRED. Die Daten werden täglich abzurufen versucht. Börsenfeiertage und Verzögerungen der Quellen können zu unterschiedlichen Stichtagen führen. Kurs- und Wechselkursdaten stehen im Ergebnis.",
    method: "Berechnungsmethode und Grenzen lesen",
    feedbackTitle: "Ein Problem melden",
    feedback: "Nenne die Berechnungsbedingungen und den Stichtag des Ergebnisses, damit sich das Problem prüfen lässt. Kontonummern oder persönliche Transaktionsbelege sind dafür nicht nötig.",
    contact: "Kontaktseite",
    disclaimer: "Die Ergebnisse sind historische Szenarien zur Information. Sie sind keine Anlageberatung oder Garantie künftiger Erträge.",
  },
};

function AboutBody({ locale }: { locale: Locale }) {
  const c = CONTENT[locale];
  const name = <strong>{authorName(locale)}</strong>;
  return (
    <>
      <p>{c.intro}</p>
      <h2>{c.useTitle}</h2>
      <ol>{c.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <h2>{c.readingTitle}</h2>
      <p>{c.reading}</p>
      <p>{c.comparison}</p>
      <h2>{c.authorTitle}</h2>
      <p>{locale === "ko" || locale === "ja" ? <>{name}{c.author}</> : <>{name} {c.author}</>}</p>
      <p>{c.approach}</p>
      <p><a href={localeHref(locale, "/how-it-works")}>{c.method}</a></p>
      <h2>{c.feedbackTitle}</h2>
      <p>{c.feedback}</p>
      <p><a href={localeHref(locale, "/contact")}>{c.contact}</a> · <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      <p className="note">{c.disclaimer}</p>
    </>
  );
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang as Locale) in CONTENT ? (lang as Locale) : "ko";
  const h = HEAD[locale];
  return (
    <ContentShell title={h.title} desc={h.desc} crumb={h.crumb}>
      <AboutBody locale={locale} />
    </ContentShell>
  );
}
