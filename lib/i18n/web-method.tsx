import type { Locale } from "./locales";
import { localeHref } from "./seo";

type Section = { title: string; paragraphs: string[] };
type Method = {
  metaTitle: string;
  metaDescription: string;
  head: { title: string; desc: string };
  sections: Section[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  sourcesTitle: string;
  prices: string;
  fx: string;
  guides: string;
};
const METHODS: Record<Locale, Method> = {
  ko: {
    metaTitle: "계산 방법 & 자주 묻는 질문 · 10-eok",
    metaDescription:
      "과거 ETF 가격과 환율로 처음 목표를 넘은 시점, 이후 평가액과 같은 기간의 ETF 비교를 계산하는 방법을 알아봐요.",
    head: {
      title: "계산 방법 & 자주 묻는 질문",
      desc: "과거에 이 조건으로 ETF를 샀다면 어땠을지 계산해요.",
    },
    sections: [
      {
        title: "종목과 모으는 조건을 골라요",
        paragraphs: [
          "ETF를 최대 5개 고르고, 종목마다 매회 넣을 돈을 정해요. 매달·매주·거래일마다 중에서 주기를 골라요. 정한 날이 휴장일이면 다음 거래일에 사요.",
          "목돈은 과거 계산 시작일에 한 번 넣는 금액이에요. 여러 ETF를 고르면 종목별 적립액의 비율대로 나눠 넣어요. 현재 계좌의 평가액을 입력하는 기능은 아니에요.",
        ],
      },
      {
        title: "처음 목표를 넘은 날을 찾아요",
        paragraphs: [
          "기본 기간 계산은 과거의 시작월들을 살펴보고, 자료의 마지막 날까지 한 번이라도 목표를 넘은 경우 중 가장 늦게 시작한 달을 골라요. 그 시작일부터 처음 목표를 넘은 날까지 걸린 기간을 보여줘요. 가능한 모든 시작일 중 가장 짧은 기간을 뜻하지는 않아요.",
          "목표를 넘은 적이 없으면 함께 계산할 수 있는 자료의 처음부터 보여줘요. 기존 저장·공유 조건에 시작일이 있으면 입력한 날부터 계산해요. 금액 계산 조건은 정한 과거 기간에 목표에 도달하려면 매회 얼마씩 샀어야 했는지 계산해요.",
        ],
      },
      {
        title: "첫 도달과 이후 평가액을 나눠 봐요",
        paragraphs: [
          "처음 목표를 넘은 날짜와 이후에도 계속 샀을 때의 마지막 평가액은 서로 다른 시점의 값이에요. 목표를 넘었다가 마지막 평가액이 다시 내려올 수도 있어요. 각 금액의 기준일을 함께 확인해요.",
          "여러 ETF는 모두 자료가 있는 공통 기간으로 계산해요. 가장 늦은 자료 시작일 이후부터, 종목별 마지막 거래 자료 중 가장 이른 날까지 합쳐요. ETF마다 적립액을 따로 적용하고 합계로 보여줘요.",
        ],
      },
      {
        title: "가격·환율·배당을 반영해요",
        paragraphs: [
          "매수 당시 가격과 환율로 소수점 단위의 ETF를 샀다고 계산해요. 평가할 때도 그날의 가격과 환율을 써요. 환율이 없는 날은 직전 값을 쓰고, 자산 통화와 표시 통화가 같으면 환전하지 않아요.",
          "배당으로 다시 사는 조건은 배당과 액면분할을 반영한 수정주가로 계산해요. 이 옵션을 끄면 배당을 제외한 가격을 사용하며, 받은 배당을 현금으로 따로 더하지 않아요. 매매 수수료와 스프레드는 제외해요. 세금 옵션은 한국어 시장에서 제공하는 단순 계산이에요. 각 평가일에 모두 팔았을 때의 이익에 세금 가정을 적용해 평가액에서 빼요. 매년 매도하거나 배당세·다른 계좌의 손익까지 계산하지는 않아요. 물가 옵션은 적립액을 물가 지수에 맞춰 바꾸며, 평가액을 오늘의 구매력으로 환산하지는 않아요.",
        ],
      },
      {
        title: "같은 기간에 다른 ETF를 샀다면 비교해요",
        paragraphs: [
          "계산 결과의 ETF 비교는 시작 일정과 종료일, 실제 계산에 사용한 적립액과 목돈·배당 조건을 유지해요. 다른 ETF마다 시작월을 다시 찾는 비교는 아니에요.",
          "기본 계산은 실제 거래 이력을 사용해요. 비교에만 상장 전 기간을 다른 ETF나 지수로 이어 붙인 추정 자료를 허용해요. 추정 포함 결과는 실제 자료 결과와 나눠 보여주고, 사용 자료와 구간·한계를 표시해요. 비교 기간을 채우지 못하면 금액을 표시하지 않아요.",
        ],
      },
      {
        title: "저장한 조건으로 다시 볼 수 있어요",
        paragraphs: [
          "저장한 계산은 이 기기의 이 브라우저에 보관해요. 열 때 불러온 가격 자료로 다시 계산하므로 이전에 본 숫자와 달라질 수 있어요. 브라우저 데이터를 지우거나 다른 브라우저를 쓰면 같은 목록을 볼 수 없어요.",
          "이 결과는 과거에 같은 조건으로 샀다면 어땠을지 보여줘요. 앞으로 목표에 도달하는 날짜나 미래 수익을 예측하지 않아요. 레버리지 ETF는 손실도 더 커질 수 있어요.",
        ],
      },
    ],
    faqTitle: "자주 묻는 질문",
    faq: [
      {
        q: "마지막 평가액이 목표보다 낮아도 도달한 결과가 나올 수 있나요?",
        a: "네. 과거에 처음 목표를 넘은 시점을 찾기 때문이에요. 이후에도 계속 샀을 때의 평가액은 별도로 보여줘요.",
      },
      {
        q: "연평균은 무슨 뜻인가요?",
        a: "계산 시작부터 마지막 평가일까지 ETF 가격이 얼마나 변했는지 1년 단위의 복리로 환산한 값이에요. 표시 통화의 환율과 배당 재투자 설정을 반영해요. 여러 ETF는 각 가격의 증가 배율을 적립액 비중으로 합친 뒤 연평균으로 바꿔요. 매수 시점별로 넣은 돈의 수익률은 아니며, 세금도 반영하지 않아요. 매년 같은 수익률이었다거나 미래에도 이어진다는 뜻은 아니에요.",
      },
    ],
    sourcesTitle: "데이터 출처",
    prices: "가격: Yahoo Finance",
    fx: "환율·물가: FRED 등 번들에 표시된 원자료",
    guides: "투자 가이드 읽기",
  },
  en: {
    metaTitle: "How it works & FAQ · 10-eok",
    metaDescription:
      "How historical ETF prices and exchange rates determine the first target crossing, later portfolio value and comparisons over the same period.",
    head: {
      title: "How it works & FAQ",
      desc: "What would have happened if you had bought ETFs under these conditions?",
    },
    sections: [
      {
        title: "Choose ETFs and contribution conditions",
        paragraphs: [
          "Choose up to five ETFs and an amount for each purchase of each ETF. Buy monthly, weekly or every trading day. Purchases scheduled on market holidays move to the next trading day.",
          "An initial lump sum is invested once at the historical start date. With multiple ETFs, it follows the proportions of their regular contributions. It is not a current account balance.",
        ],
      },
      {
        title: "Find the first target crossing",
        paragraphs: [
          "The default time calculation considers historical start months. It chooses the latest start month whose portfolio reached the target at least once before the available data ended. The displayed duration runs from that start to the first crossing. It is not the shortest possible duration across all start dates.",
          "If none reached the target, the calculation starts with the earliest shared history. An existing saved or shared condition with a start date uses that date. Amount calculations find the regular contribution needed to meet the target over a specified historical period.",
        ],
      },
      {
        title: "Separate first crossing from later value",
        paragraphs: [
          "The first crossing date and the final value after continued purchases refer to different dates. A portfolio can reach the target and later fall below it. Each value is shown with its reference date.",
          "Multiple ETFs use a shared data range: from the latest history start to the earliest history end. Each ETF receives its own contribution amount; the total combines them.",
        ],
      },
      {
        title: "Use historical prices, exchange rates and dividends",
        paragraphs: [
          "Purchases allow fractional shares and use the price and exchange rate on the purchase date. Valuations use the rates for their valuation date. A missing exchange rate uses the previous available rate. No conversion is needed when the asset and display currencies match.",
          "Dividend reinvestment uses adjusted prices that account for dividends and splits. With reinvestment off, the calculation uses prices excluding dividends and does not add dividend cash separately. Trading fees and spreads are excluded. The tax option in the Korean market view deducts a simplified estimate on gains as if all holdings were sold on each valuation date. It does not model annual sales, dividend taxes or other accounts. The inflation option adjusts contribution amounts with the price index; it does not convert the portfolio value to today’s purchasing power.",
        ],
      },
      {
        title: "Compare another ETF over the same period",
        paragraphs: [
          "The result comparison preserves the original purchase schedule, end date, actual calculated contribution amounts, lump sum and dividend setting. It does not find a new start month for each ETF.",
          "The main calculation uses actual trading history. Comparisons alone may use estimated pre-listing history joined from another ETF or index. Estimated results are separated from actual-history results and identify their source, period and limitations. No value is shown when the data cannot cover the comparison period.",
        ],
      },
      {
        title: "Save conditions in this browser",
        paragraphs: [
          "Saved calculations stay in this browser on this device. Reopening recalculates from the price data loaded then, so values may change. Clearing browser data or using another browser does not preserve the same list.",
          "Results describe a historical scenario. They do not predict a future target date or future returns. Leveraged ETFs can also magnify losses.",
        ],
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Can a result reach the target even when its final value is lower?",
        a: "Yes. The calculation finds the first historical crossing. The value after continued purchases is shown separately.",
      },
      {
        q: "What does annualized return mean?",
        a: "It annualizes ETF price growth from the calculation start to the final valuation, including exchange-rate changes in the display currency and the selected dividend setting. For multiple ETFs, the price growth factors are combined in proportion to their regular contribution amounts before annualizing. It is not a return calculated from the amounts and dates of your contributions, and it does not deduct taxes. Returns were not necessarily the same each year and may not continue.",
      },
    ],
    sourcesTitle: "Data sources",
    prices: "Prices: Yahoo Finance",
    fx: "Exchange rates and inflation: FRED and the original sources identified in the data bundles",
    guides: "Read the investment guides",
  },
  ja: {
    metaTitle: "計算方法 & よくある質問 · 10-eok",
    metaDescription:
      "過去のETF価格と為替から、初めて目標に達した時点、その後の評価額、同じ期間のETF比較を計算する方法です。",
    head: {
      title: "計算方法 & よくある質問",
      desc: "過去にこの条件でETFを買っていたら、どうなったかを計算します。",
    },
    sections: [
      {
        title: "ETFと積立条件を選びます",
        paragraphs: [
          "ETFを最大5銘柄選び、銘柄ごとに1回の購入額を決めます。毎月・毎週・取引日ごとから頻度を選べます。購入日が休場日の場合は、次の取引日に購入します。",
          "最初に入れるお金は、過去の計算開始日に一度だけ投資します。複数のETFでは、定期購入額の割合で配分します。現在の口座残高を入力する機能ではありません。",
        ],
      },
      {
        title: "初めて目標に達した日を探します",
        paragraphs: [
          "通常の期間計算では、過去の開始月を調べます。資料の最終日までに一度でも目標に達した条件のうち、最も遅い開始月を選びます。その開始日から初めて目標に達した日までの期間を表示します。すべての開始日の中で最短の期間を意味するものではありません。",
          "達した条件がなければ、共通する資料の最初から計算します。保存・共有された条件に開始日がある場合は、その日から計算します。金額計算では、指定した過去の期間で目標に達するために必要だった定期購入額を求めます。",
        ],
      },
      {
        title: "初めての到達と、その後の評価額を分けます",
        paragraphs: [
          "初めて目標に達した日と、その後も買い続けた場合の最終評価額は、異なる時点の値です。一度到達しても、後で目標を下回ることがあります。それぞれの基準日も確認できます。",
          "複数のETFは、全銘柄に資料がある共通期間で計算します。資料の開始が最も遅い銘柄に合わせ、最終日が最も早い銘柄の日までを使います。銘柄別の購入額を反映し、合計も表示します。",
        ],
      },
      {
        title: "過去の価格・為替・配当を使います",
        paragraphs: [
          "端株を購入できるものとして、購入日の価格と為替で計算します。評価額には評価日の価格と為替を使います。為替のない日は直前の値を使い、資産と表示の通貨が同じ場合は換算しません。",
          "配当再投資では、配当と株式分割を反映した修正価格を使います。再投資をオフにすると配当を除いた価格を使い、配当金を現金として別に加算しません。売買手数料とスプレッドは含めません。韓国市場向けの税金オプションは、各評価日に全銘柄を売却したとみなした利益から、単純化した税額を差し引きます。毎年の売却、配当課税、ほかの口座は計算しません。物価オプションは積立額を物価指数に合わせて変えます。評価額を現在の購買力に換算するものではありません。",
        ],
      },
      {
        title: "同じ期間のほかのETFと比較します",
        paragraphs: [
          "結果の比較では、元の購入日程・終了日・計算に使った購入額・初期資金・配当条件を維持します。ETFごとに開始月を探し直す比較ではありません。",
          "基本計算は実際の取引履歴を使います。比較に限り、上場前を別のETFや指数で補った推定資料を使う場合があります。推定を含む結果は実際の履歴と分け、資料名・期間・限界を示します。比較期間を満たせない場合は金額を表示しません。",
        ],
      },
      {
        title: "このブラウザーに条件を保存します",
        paragraphs: [
          "保存した計算は、この端末のこのブラウザーに保管します。開いたときに読み込んだ価格で再計算するため、数値が変わることがあります。ブラウザーのデータを消したり別のブラウザーを使ったりすると、同じ一覧は引き継がれません。",
          "結果は過去の条件による計算です。将来の目標到達日や利益を予測するものではありません。レバレッジETFは損失も大きくなることがあります。",
        ],
      },
    ],
    faqTitle: "よくある質問",
    faq: [
      {
        q: "最終評価額が目標より低くても、到達した結果になりますか？",
        a: "はい。過去に初めて目標に達した時点を探すためです。その後も購入を続けた場合の評価額は別に表示します。",
      },
      {
        q: "年平均とは何ですか？",
        a: "計算開始から最終評価日までのETF価格の変化を、1年あたりの複利の率に換算した値です。表示通貨の為替と配当再投資の設定を反映します。複数のETFでは、各価格の増加倍率を定期購入額の割合で合算してから年率に換算します。入金の金額と時期から求めた収益率ではなく、税金も差し引きません。毎年同じ率だったことや、今後も続くことを意味しません。",
      },
    ],
    sourcesTitle: "データの出典",
    prices: "価格：Yahoo Finance",
    fx: "為替・物価：FREDなど、データに示した原資料",
    guides: "投資ガイドを読む",
  },
  de: {
    metaTitle: "So funktioniert’s & FAQ · 10-eok",
    metaDescription:
      "So berechnen historische ETF-Kurse und Wechselkurse das erste Erreichen des Ziels, den späteren Depotwert und Vergleiche im gleichen Zeitraum.",
    head: {
      title: "So funktioniert’s & FAQ",
      desc: "Was wäre passiert, wenn du unter diesen Bedingungen ETFs gekauft hättest?",
    },
    sections: [
      {
        title: "ETFs und Einzahlungen wählen",
        paragraphs: [
          "Wähle bis zu fünf ETFs und einen Betrag je Kauf und ETF. Käufe sind monatlich, wöchentlich oder an jedem Handelstag möglich. An Börsenfeiertagen verschiebt sich der Kauf auf den nächsten Handelstag.",
          "Ein Anfangsbetrag wird einmal am historischen Startdatum investiert. Bei mehreren ETFs wird er im Verhältnis der regelmäßigen Einzahlungen aufgeteilt. Er ist kein aktueller Depotstand.",
        ],
      },
      {
        title: "Das erste Erreichen des Ziels finden",
        paragraphs: [
          "Die normale Zeitberechnung prüft historische Startmonate. Sie wählt den spätesten Startmonat, dessen Depot bis zum Datenende mindestens einmal das Ziel erreicht hat. Angezeigt wird die Zeit von diesem Start bis zum ersten Erreichen. Das ist nicht die kürzeste mögliche Dauer über alle Startdaten.",
          "Erreicht keine Variante das Ziel, beginnt die Berechnung mit den frühesten gemeinsamen Daten. Enthalten gespeicherte oder geteilte Bedingungen ein Startdatum, wird dieses verwendet. Die Betragsberechnung ermittelt die regelmäßige Einzahlung, die im gewählten historischen Zeitraum zum Ziel geführt hätte.",
        ],
      },
      {
        title: "Erstes Erreichen und späteren Wert trennen",
        paragraphs: [
          "Das erste Erreichen des Ziels und der Endwert bei weiteren Käufen beziehen sich auf unterschiedliche Tage. Das Depot kann das Ziel erreichen und später wieder darunter fallen. Jeder Wert hat einen eigenen Stichtag.",
          "Mehrere ETFs verwenden einen gemeinsamen Datenzeitraum: vom spätesten Datenbeginn bis zum frühesten Datenende. Jeder ETF erhält seinen eigenen Kaufbetrag; die Summe führt sie zusammen.",
        ],
      },
      {
        title: "Historische Kurse, Wechselkurse und Dividenden nutzen",
        paragraphs: [
          "Die Berechnung erlaubt Bruchteile von Anteilen und nutzt Kurs und Wechselkurs des Kauftags. Für Bewertungen gelten die Werte des Bewertungstags. Fehlt ein Wechselkurs, wird der letzte verfügbare verwendet. Stimmen Anlage- und Anzeigewährung überein, entfällt die Umrechnung.",
          "Die Wiederanlage von Dividenden verwendet bereinigte Kurse einschließlich Dividenden und Aktiensplits. Ohne Wiederanlage werden Kurse ohne Dividenden verwendet; ausgezahlte Dividenden werden nicht zusätzlich als Bargeld verbucht. Handelsgebühren und Spreads bleiben unberücksichtigt. Die Steueroption für den koreanischen Markt zieht eine vereinfachte Steuer auf Gewinne ab, als würden alle Anteile am jeweiligen Bewertungstag verkauft. Jährliche Verkäufe, Dividendensteuern und andere Depots werden nicht modelliert. Die Inflationsoption passt die Kaufbeträge an den Preisindex an; sie rechnet den Depotwert nicht in heutige Kaufkraft um.",
        ],
      },
      {
        title: "Andere ETFs im gleichen Zeitraum vergleichen",
        paragraphs: [
          "Der Ergebnisvergleich behält den ursprünglichen Kaufplan, das Enddatum, die tatsächlich berechneten Einzahlungen, den Anfangsbetrag und die Dividendeneinstellung bei. Er sucht nicht für jeden ETF einen neuen Startmonat.",
          "Die Hauptberechnung nutzt tatsächliche Handelsdaten. Nur Vergleiche dürfen geschätzte Daten vor der Börsennotierung aus anderen ETFs oder Indizes ergänzen. Solche Ergebnisse werden getrennt von tatsächlichen Daten gezeigt und nennen Quelle, Zeitraum und Grenzen. Decken die Daten den Vergleichszeitraum nicht ab, erscheint kein Betrag.",
        ],
      },
      {
        title: "Bedingungen in diesem Browser speichern",
        paragraphs: [
          "Gespeicherte Berechnungen bleiben in diesem Browser auf diesem Gerät. Beim Öffnen wird mit den dann geladenen Kursdaten neu gerechnet; Werte können sich ändern. Nach dem Löschen der Browserdaten oder in einem anderen Browser steht dieselbe Liste nicht zur Verfügung.",
          "Die Ergebnisse beschreiben ein historisches Szenario. Sie sagen weder einen künftigen Zieltermin noch künftige Erträge voraus. Gehebelte ETFs können auch Verluste verstärken.",
        ],
      },
    ],
    faqTitle: "Häufige Fragen",
    faq: [
      {
        q: "Kann das Ziel erreicht worden sein, obwohl der Endwert niedriger ist?",
        a: "Ja. Die Berechnung sucht das erste historische Erreichen. Der Wert bei anschließenden weiteren Käufen wird getrennt gezeigt.",
      },
      {
        q: "Was bedeutet die jährliche Rendite?",
        a: "Der Wert rechnet die ETF-Kursentwicklung vom Berechnungsstart bis zum letzten Bewertungstag in eine jährliche Wachstumsrate um. Wechselkurse der Anzeigewährung und die gewählte Dividendeneinstellung fließen ein. Bei mehreren ETFs werden ihre Wachstumsfaktoren nach den regelmäßigen Kaufbeträgen gewichtet und anschließend annualisiert. Es ist keine aus Höhe und Zeitpunkt deiner Einzahlungen berechnete Rendite; Steuern werden nicht abgezogen. Die Rate war nicht jedes Jahr gleich und muss sich nicht fortsetzen.",
      },
    ],
    sourcesTitle: "Datenquellen",
    prices: "Kurse: Yahoo Finance",
    fx: "Wechselkurse und Inflation: FRED und die in den Datenpaketen genannten Originalquellen",
    guides: "Anlageratgeber lesen",
  },
};

export function getWebMethod(locale: Locale): Method {
  return METHODS[locale];
}

export function WebMethodBody({ locale }: { locale: Locale }) {
  const content = getWebMethod(locale);
  return (
    <>
      {content.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      <h2>{content.faqTitle}</h2>
      {content.faq.map((item) => (
        <section key={item.q}>
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </section>
      ))}
      <h2>{content.sourcesTitle}</h2>
      <ul>
        <li>
          <a
            href="https://finance.yahoo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.prices}
          </a>
        </li>
        <li>
          <a
            href="https://fred.stlouisfed.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.fx}
          </a>
        </li>
      </ul>
      <p className="note">
        <a href={localeHref(locale, "/guides")}>{content.guides}</a>
      </p>
    </>
  );
}
