import type { ReactNode } from "react";
import Link from "next/link";
import { localeHref } from "@/lib/i18n/seo";
import { Sources } from "@/components/Sources";


export const DCA_EN = {
  metaTitle: "Dollar-cost averaging: what regular purchases change",
  metaDescription: "Fixed contributions, variable share counts",
  head: {
    title: "Dollar-cost averaging: what regular purchases change",
    desc: "Fixed contributions, variable share counts",
    crumb: "Guide · DCA",
  },
  Body: () => (
    <>
      <h2>A purchase rule, not a return forecast</h2>
      <p>Dollar-cost averaging means buying for a fixed amount at recurring intervals. Monthly purchases from a paycheck are one example; a weekly or trading-day schedule follows the same arithmetic. A fixed amount buys more shares at a lower price and fewer at a higher price.</p>
      <h2>An illustrative calculation</h2>
      <p>Suppose three purchases of $700 take place at prices of $100, $50, and $100. They buy 7, 14, and 7 shares: $2,100 buys 28 shares at an average cost of $75. This is below the $83.33 arithmetic average of the quoted prices because more shares were bought at the lower price.</p>
      <p>The example assumes fractional purchases are possible and ignores costs. It illustrates purchase-price averaging, not a gain: the final value still depends on the final share price.</p>
      <h2>Risk after the money is invested</h2>
      <p>Recurring purchases spread entry dates. They do not protect shares already owned from falling prices. If prices keep declining, both old and new shares can lose value. A lower average cost cannot turn every falling investment into a profitable one.</p>
      <p>This distinction is especially important for leveraged ETFs. Buying more does not change their daily leverage target, compounding, financing costs, or potential for large losses.</p>
      <h2>How to read this calculator</h2>
      <p>The calculator models monthly, weekly, or trading-day purchases and can add a lump sum at the historical start. The contribution amount is per purchase, so the same displayed amount at different frequencies represents different total contributions. The result&#x27;s calculation details identify the period and assumptions.</p>
      <p><a href="https://www.finra.org/investors/insights/dollar-cost-averaging">FINRA: benefits and limitations of dollar-cost averaging</a></p>
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const DCA_VS_LUMPSUM_EN = {
  metaTitle: "Regular purchases and a lump sum",
  metaDescription: "Compare cash availability before comparing returns",
  head: {
    title: "Regular purchases and a lump sum",
    desc: "Compare cash availability before comparing returns",
    crumb: "Guide · DCA vs. Lump Sum",
  },
  Body: () => (
    <>
      <h2>Two different questions</h2>
      <p>Investing newly earned income as it arrives is different from gradually investing cash already available. Only the second question compares alternative schedules for the same starting pot. A fair comparison also needs the same asset, observation period, total available cash, and treatment of uninvested cash.</p>
      <h2>When prices rise or fall</h2>
      <p>If a price rises steadily, an early lump sum buys more shares than splitting that same cash into later, more expensive purchases. If the price falls during the purchase phase, gradual buying can acquire more shares. These conditional examples explain the mechanics without deciding what an unknown market will do.</p>
      <p>With irregular price paths, the whole sequence matters. The final share price, purchase dates, and cash remaining outside the investment all contribute to the result.</p>
      <h2>Income is not delayed cash</h2>
      <p>Money earned in a later month was not available for an earlier lump-sum purchase. Comparing a paycheck-funded plan with a full investment at the start silently assumes extra starting cash. Interest on waiting cash, transaction costs, and taxes can also change a real comparison.</p>
      <h2>Combining the two in a historical calculation</h2>
      <p>10-eok can model an amount invested at the historical start together with later recurring purchases. That starting amount is not an existing account balance imported from today. Adding it while retaining the same recurring amount increases total contributions; it does not by itself create an equal-budget test of lump sum versus gradual investment.</p>
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const ETF_BASICS_EN = {
  metaTitle: "What an ETF holds, and how its shares trade",
  metaDescription: "The fund structure and the investment exposure are separate",
  head: {
    title: "What an ETF holds, and how its shares trade",
    desc: "The fund structure and the investment exposure are separate",
    crumb: "Guide · ETF Basics",
  },
  Body: () => (
    <>
      <h2>A tradable share of a portfolio</h2>
      <p>An exchange-traded fund holds assets or obtains exposure through financial instruments. Its shares trade on an exchange during market hours. Some ETFs follow an index; others make active investment decisions. The ETF label alone does not tell you which markets, risks, or strategies are inside.</p>
      <h2>Index, holdings, and concentration</h2>
      <p>An index is a set of rules, not an account you can buy directly. A fund following it may hold the constituents or use other permitted methods. Market-cap weighting gives larger companies more influence, while equal weighting follows a different rule.</p>
      <p>A broad equity fund, a semiconductor fund, a bond fund, and a daily leveraged fund can all trade as ETFs. Their shared trading format does not make their potential losses comparable. Multiple funds can also hold the same companies.</p>
      <h2>Market price and underlying value</h2>
      <p>The exchange price can differ from the fund&#x27;s net asset value. The bid-ask spread is another trading cost. Creation and redemption processes help connect prices with underlying assets, but they do not guarantee that every trade occurs exactly at net asset value.</p>
      <h2>Costs and distributions</h2>
      <p>Operating expenses are reflected in the fund&#x27;s assets and returns. Broker charges and execution prices affect the investor separately. Distributions are part of total return, not an independent bonus added without an effect on the fund&#x27;s value.</p>
      <p>The calculator simplifies execution using daily prices and fractional shares. It is a historical model of the selected assumptions, not a reproduction of an actual broker statement.</p>
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const COMPOUND_72_EN = {
  metaTitle: "Compounding and the rule of 72",
  metaDescription: "A constant-rate example is not an ETF forecast",
  head: {
    title: "Compounding and the rule of 72",
    desc: "A constant-rate example is not an ETF forecast",
    crumb: "Guide · Compound Interest",
  },
  Body: () => (
    <>
      <h2>How compounding works</h2>
      <p>When gains stay invested, later percentage changes apply to the changed balance. In a hypothetical account earning a constant 6% annually, 100 becomes 106 and then 112.36. The second year&#x27;s gain is 6.36 because the base is larger. This example assumes a fixed return, no costs, and no new contributions.</p>
      <h2>Estimating a doubling time</h2>
      <p>The rule of 72 estimates the number of years to double as 72 divided by a positive annual percentage rate. At a hypothetical 6%, it gives 12 years. The exact expression is log(2) divided by log(1.06), or about 11.9 years.</p>
      <p>It is an approximation for constant compound growth. It does not explain how an ETF actually moves or when a recurring-purchase account reaches a target. Zero or negative rates do not produce a meaningful positive doubling time under this rule.</p>
      <h2>Uneven returns compound differently</h2>
      <p>A 10% rise followed by a 10% fall changes 100 to 99, even though the arithmetic average of the returns is zero. The geometric result incorporates the multiplication of successive returns. Removing leverage does not remove this effect.</p>
      <h2>New contributions are not investment gains</h2>
      <p>An account can double partly because new cash was added. That is different from the original investment doubling through returns. With recurring purchases, each contribution is exposed for a different length of time.</p>
      <p>For this reason, a constant-rate doubling shortcut cannot replace a dated cash-flow simulation. The calculator uses historical prices and purchase dates, while the rule of 72 is a separate mathematical illustration.</p>
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const LEVERAGE_ETF_RISK_EN = {
  metaTitle: "Daily leveraged ETFs: the target and the risks",
  metaDescription: "The multiplier applies to a day",
  head: {
    title: "Daily leveraged ETFs: the target and the risks",
    desc: "The multiplier applies to a day",
    crumb: "Guide · Risk",
  },
  Body: () => (
    <>
      <h2>A daily objective</h2>
      <p>QLD targets twice and TQQQ three times the Nasdaq-100&#x27;s daily performance before fees and expenses. Exposure is adjusted daily using financial instruments. Neither objective promises the same multiple over a month, year, or entire investment period.</p>
      <h2>A hypothetical two-day path</h2>
      <p>If an index rises 10% and then falls 10%, an initial 100 ends at 99. Ignoring costs and tracking differences, daily 2x exposure ends at 96 and 3x exposure at 91. A different sequence can produce a different relationship with the index&#x27;s cumulative return.</p>
      <p>In a sustained trend, compounding can also produce more than the simple multiple. This is path dependence, not a fixed rate of decay applied every day regardless of market behavior.</p>
      <h2>Losses, recovery, and costs</h2>
      <p>A 50% loss requires a 100% gain on the remaining amount to recover; a 75% loss requires 300%. These percentages describe arithmetic, not the time recovery takes. Some losses may never be recovered.</p>
      <p>Fund expenses, financing conditions, derivative pricing, and tracking differences affect returns in addition to the daily multiplier. A return calculated from the index alone is not the ETF&#x27;s actual trading record.</p>
      <h2>Why a purchase schedule does not remove the risk</h2>
      <p>Recurring contributions buy at multiple prices but leave the leveraged structure in place. A favorable past accumulation result cannot establish that continuing purchases makes the product safe. First reaching a target also does not lock in that balance: subsequent holdings remain exposed to market moves.</p>
      <Sources locale="en" ids={["prosharesQld", "prosharesTqqq"]} />
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const NASDAQ100_VS_SP500_EN = {
  metaTitle: "Nasdaq-100 and S&P 500: different selection rules",
  metaDescription: "Compare exposure before comparing a historical balance",
  head: {
    title: "Nasdaq-100 and S&P 500: different selection rules",
    desc: "Compare exposure before comparing a historical balance",
    crumb: "Guide · Index Comparison",
  },
  Body: () => (
    <>
      <h2>What each index selects</h2>
      <p>The Nasdaq-100 focuses on large non-financial companies listed on Nasdaq. The S&amp;P 500 covers large U.S. companies under its own eligibility and selection rules, including financial businesses. Neither is a complete global stock-market portfolio.</p>
      <h2>Sectors and weighting</h2>
      <p>The Nasdaq-100 is not formally a pure technology index, although technology-related businesses can strongly influence it. The S&amp;P 500 spans more sectors but is not equally allocated among them. Large companies can dominate both under their weighting rules.</p>
      <p>Holdings can overlap. Combining QQQ with SPY or VOO does not necessarily add as much diversification as the number of fund names suggests.</p>
      <h2>Different reasons for different returns</h2>
      <p>Earnings, valuations, interest rates, and changes in sector leadership affect the two baskets differently. A technology-led rally or a broad-sector recovery can produce very different comparisons. Describing the index rules does not establish which will outperform in the next period.</p>
      <h2>Keep the historical test consistent</h2>
      <p>QQQ follows the Nasdaq-100; SPY and VOO follow the S&amp;P 500. Compare them over the same dates, with the same contribution schedule and dividend assumption. Differences in their own available trading histories still need to be disclosed.</p>
      <p>QLD and TQQQ introduce another variable: daily leverage. Their results are not simply a more intense version of choosing between two unleveraged index baskets.</p>
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const QLD_GUIDE_EN = {
  metaTitle: "QLD: a daily 2x Nasdaq-100 ETF",
  metaDescription: "Benchmark exposure and daily leverage are separate choices",
  head: {
    title: "QLD: a daily 2x Nasdaq-100 ETF",
    desc: "Benchmark exposure and daily leverage are separate choices",
    crumb: "Guide · QLD",
  },
  Body: () => (
    <>
      <h2>The objective</h2>
      <p>ProShares Ultra QQQ, ticker QLD, seeks twice the Nasdaq-100&#x27;s daily performance before fees and expenses. The Nasdaq-100 contains large non-financial companies listed on Nasdaq. QLD adds a daily leverage objective to that underlying equity exposure.</p>
      <h2>How the fund obtains exposure</h2>
      <p>Financial instruments including derivatives allow the fund to obtain exposure greater than its net assets. The fund adjusts that exposure daily. This differs from holding an unleveraged portfolio of the index companies, and from a personal loan whose balance stays fixed.</p>
      <h2>Why multiplying a long-term return fails</h2>
      <p>Imagine an index gaining 10% and then losing 9.09%, roughly returning to its starting level. A daily 2x model gains 20% and then loses 18.18%, taking 100 to about 98.2 before costs. This hypothetical example isolates the effect of multiplying daily returns.</p>
      <p>Other paths, including sustained trends, can produce different relationships. Financing costs, fund expenses, and tracking differences further separate QLD&#x27;s actual return from a simple index multiple.</p>
      <h2>Reading its accumulation result</h2>
      <p>Regular contributions alter the entry prices and number of shares, but the shares held remain leveraged. Keep first target crossing separate from the value after continued purchases. A favorable final number does not show that the path was tolerable or that the same outcome can be repeated.</p>
      <p>QQQ, QLD, and TQQQ share a benchmark family but have different daily objectives. Their comparison needs the same dates and cash-flow assumptions to isolate those differences.</p>
      <Sources locale="en" ids={["prosharesQld", "prosharesTqqq"]} />
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

export const CONTACT_EN = {
  metaTitle: "Contact",
  metaDescription: "Questions, bug reports, or ticker requests for 10-eok? Send us an email.",
  head: {
    title: "Contact",
    desc: "Questions, bug reports, and ticker requests are all welcome",
    crumb: "Contact",
  },
  Body: () => (
    <>
      <p>
        Hi, I&rsquo;m <strong>이정철 (Jeongcheol Lee)</strong>, the person who built and runs
        10-eok. I&rsquo;m not a financial company or an advisory firm — I&rsquo;m a{" "}
        <strong>developer and individual investor</strong> who built this tool because I was
        curious &ldquo;what if I&rsquo;d invested like this in the past?&rdquo; and wanted to check
        it with real data.
      </p>
      <p>
        If you have a question, found a bug, or want to request a new ticker, feel free to email me
        at the address below. I usually reply within a few business days.
      </p>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:jclee7503@gmail.com">jclee7503@gmail.com</a>
      </p>

      <h2>What&rsquo;s helpful to include</h2>
      <ul>
        <li>If a calculation looks off (it helps to include your exact inputs)</li>
        <li>A ticker you&rsquo;d like added</li>
        <li>Incorrect information or typos in a guide article</li>
        <li>Feature suggestions</li>
      </ul>

      <p className="note">
        I&rsquo;m not able to respond to requests for personal investment advice. 10-eok is an
        informational tool, not investment advice or a solicitation.
      </p>
    </>
  ),
};

export const PRIVACY_EN = {
  metaTitle: "Privacy Policy",
  metaDescription:
    "10-eok's policy on collecting and using personal information, cookies, and advertising (Google AdSense).",
  head: {
    title: "Privacy Policy",
    desc: "Last updated: 2026-06-19",
    crumb: "Privacy Policy",
  },
  Body: () => (
    <>
      <p>
        10-eok (the &ldquo;Service&rdquo;) takes your privacy seriously. This policy explains what
        information the Service handles and how.
      </p>

      <h2>1. Information we collect</h2>
      <p>
        The Service doesn&rsquo;t require an account, and it doesn&rsquo;t directly collect
        personally identifying information like your name or contact details. Amounts, dates, and
        other inputs you enter into the backtest tool are used only for calculations inside your
        browser and are never stored on our servers.
      </p>

      <h2>2. Cookies and automatically collected information</h2>
      <p>
        The Service may use cookies and similar technologies for traffic analytics and to serve
        ads. This can involve collecting general, non-identifying information such as browser type,
        pages visited, and access times.
      </p>

      <h2>3. Advertising (Google AdSense)</h2>
      <ul>
        <li>The Service may display ads served by Google, a third-party advertising provider.</li>
        <li>Google and other third-party vendors may use cookies to serve ads based on your prior visits to this and other websites.</li>
        <li>
          You can opt out of personalized advertising in{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google&rsquo;s Ad Settings</a>
          , and opt out of third-party cookie use generally at{" "}
          <a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>.
        </li>
      </ul>

      <h2>4. External data</h2>
      <p>
        Price data comes from Yahoo Finance, and economic data (such as inflation figures) comes
        from the Federal Reserve Bank of St. Louis (FRED). This is all publicly available market
        data and has nothing to do with your personal information.
      </p>

      <h2>5. Data retention and protection</h2>
      <p>
        The Service does not store personally identifying information on its servers. Any data
        collected for analytics or advertising purposes is handled and retained according to the
        relevant provider&rsquo;s own policies.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>This policy may be updated to reflect changes in law or in the Service. Any changes will be posted on this page.</p>

      <h2>7. Contact</h2>
      <p>
        For privacy-related questions, please email{" "}
        <a href="mailto:jclee7503@gmail.com">jclee7503@gmail.com</a>.
      </p>
    </>
  ),
};

export const TERMS_EN = {
  metaTitle: "Terms of Service",
  metaDescription: "The terms and disclaimers governing use of the 10-eok service.",
  head: {
    title: "Terms of Service",
    desc: "Last updated: 2026-06-19",
    crumb: "Terms of Service",
  },
  Body: () => (
    <>
      <h2>1. Nature of the Service</h2>
      <p>
        10-eok (the &ldquo;Service&rdquo;) is an <strong>informational service</strong> that shows
        backtest results based on real historical market data. Nothing in the Service constitutes a
        recommendation to buy or sell any specific financial product, nor does it provide investment
        or financial advice.
      </p>

      <h2>2. Investment responsibility (disclaimer)</h2>
      <ul>
        <li><strong>Past returns do not guarantee future results.</strong> Every result reflects a hypothetical — &ldquo;if you had invested this way in the past.&rdquo;</li>
        <li>Leveraged ETFs and similar products carry a high risk of principal loss, and real-world investing adds taxes, fees, and psychological factors on top of what&rsquo;s shown here.</li>
        <li>You are solely responsible for any investment decisions you make based on the Service, and for their outcomes.</li>
      </ul>

      <h2>3. Data accuracy</h2>
      <p>
        The Service uses data from reputable external sources (Yahoo Finance, FRED), but does not
        guarantee the accuracy, completeness, or real-time nature of that data. Calculations are
        based on the stated assumptions and simplifications (see{" "}
        <Link href={localeHref("en", "/how-it-works")}>How It Works</Link>).
      </p>

      <h2>4. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the Service&rsquo;s provider is not liable for any
        direct or indirect damages arising from your use of, or inability to use, the Service, from
        data errors, or from your interpretation of any calculated results.
      </p>

      <h2>5. Changes to these terms</h2>
      <p>These terms may be updated from time to time; any changes will be posted on this page. Continuing to use the Service after a change means you accept the updated terms.</p>

      <p className="note">
        Contact: <a href="mailto:jclee7503@gmail.com">jclee7503@gmail.com</a>
      </p>
    </>
  ),
};


// ─────────────────────────────────────────────────────────────
// Homepage editorial (English / USD market)
// Source: components/HomeContent.tsx (Korean). The live <table> with
// per-ticker rows is intentionally NOT included in Body below — that part
// depends on server-fetched data (rows, dataEnd) and is left to be wired
// up in code. tableHeaders / missLabel cover the strings that table needs.
// ─────────────────────────────────────────────────────────────
export const HOME_EN = {
  tableHeaders: {
    ticker: "Ticker",
    timeToGoal: "$700/mo → $1M",
    cagr: "Annualized return",
  },
  missLabel: (rough: string) => `Didn't reach it even over the full period · at data end about ${rough}`,
  // 표 위 문단의 "데이터 기준 시점" 접두사(로케일별). ym은 fmt.ym으로 이미 로케일 포맷된 문자열.
  asOf: (ym: string) => `Data as of ${ym}. `,

  Body: ({ table, asOf }: { table: ReactNode; asOf: string }) => (
    <>
      <h2>What the calculator shows</h2>
      <p>Choose an ETF, a purchase frequency, and an amount per purchase. An optional starting lump sum is invested at the historical start. The model uses past prices to ask what those purchases would have produced; it does not estimate a future target date.</p>
      <h2>First crossing and later value</h2>
      <p>The main duration result selects the latest starting month whose simulated balance crossed the target at least once. It reports that run&#x27;s first crossing. This does not mean the shortest duration across all possible starts. The value after continuing purchases appears separately.</p>
      <h2>The reference table</h2>
      <p>The table below is a separate precomputed monthly illustration. Its duration is based on reaching the target by the data endpoint, using each fund&#x27;s available bundled history. Some bundled series contain estimated pre-listing data. It is not the main calculator&#x27;s actual-history first-crossing result, nor a same-period comparison.</p>
      <p>{asOf}</p>
      {table}
      <h2>Comparing ETFs within a result</h2>
      <p>The result&#x27;s ETF comparison holds the original period and contribution schedule fixed. Estimated intervals are labeled and separated from actual-history results. Different histories, leverage, and distributions make the amounts descriptive of that past test rather than a ranking of suitable investments.</p>
      <Sources locale="en" ids={["yahoo"]} />
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

// ─────────────────────────────────────────────────────────────
// "How it works & FAQ" page (English / USD market)
// Source: app/[lang]/how-it-works/page.tsx (Korean).
// The KRW→USD conversion step is removed from the calculation steps
// (this market is USD-native). The capital-gains-tax FAQ is replaced
// with a generic "does this account for taxes?" question.
// ─────────────────────────────────────────────────────────────
export const HOW_IT_WORKS_EN = {
  metaTitle: "How the historical calculation works",
  metaDescription: "Dates, purchases, and result boundaries",
  head: {
    title: "How the historical calculation works",
    desc: "Dates, purchases, and result boundaries",
  },

  steps: [
  "Load actual daily trading prices for the selected funds.",
  "Model the selected monthly, weekly, or trading-day schedule and any starting lump sum.",
  "Value the holdings on each available trading day under the selected dividend and currency assumptions.",
  "Select the latest starting month that crossed the target, and show its first crossing separately from its later value."
],

  faq: [
  {
    "q": "Does this forecast when I will reach my goal?",
    "a": "No. It describes purchases at past prices and does not forecast future returns or dates."
  },
  {
    "q": "Is the reported duration the shortest possible?",
    "a": "No. It belongs to the latest starting month whose historical balance crossed the target at least once."
  },
  {
    "q": "Are estimated pre-listing data used in the main result?",
    "a": "No. Only the separate ETF comparison may use labeled proxy intervals."
  },
  {
    "q": "What does turning dividend reinvestment off mean?",
    "a": "The simulation uses price return and does not accumulate dividends as cash."
  }
],

  Body: () => (
    <>
      <h2>Purchases and valuation</h2>
      <p>The model places monthly, weekly, or trading-day purchases using the selected amount per purchase. Monthly and weekly scheduled purchases on a closed market move to the next available trading day. A starting lump sum is applied at the historical calculation start, if entered. Fractional shares are allowed in the model.</p>
      <h2>What the main duration means</h2>
      <p>Using actual trading history, the calculator searches starting months and selects the latest one whose balance crossed the target at least once. It then reports the first crossing within that run. It does not search for the shortest elapsed duration. If no start reaches the target, it shows the available-history result.</p>
      <h2>Prices, dividends, and currencies</h2>
      <p>Yahoo Finance supplies daily prices. The reinvestment option uses adjusted prices as a total-return approximation; turning it off models price return without accumulating cash dividends. Non-dollar result currencies also require historical exchange rates. A missing exchange-rate date uses the previous available value.</p>
      <h2>Comparisons and limitations</h2>
      <p>The result&#x27;s ETF comparison preserves its original dates, actual contributions, and purchase assumptions. Only that comparison may include clearly labeled proxy history. Where the available data cannot cover the period, no comparable value is shown.</p>
      <p>Default results exclude investor taxes and transaction costs. Historical prices already reflect fund-level expenses. Daily closing-price execution, fractional shares, and reinvestment assumptions can differ from a real account. An annualized price-series measure is also different from an investor return weighted by dated contributions.</p>
      <Sources locale="en" ids={["yahoo"]} />
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};

// ─────────────────────────────────────────────────────────────
// ETF comparison page (English / USD market)
// Source: app/[lang]/compare/page.tsx (Korean).
// The "US ETFs vs Korean ETF (KODEX 200)" section is Korea-specific and is
// dropped entirely — the en market has no non-USD ticker to compare against,
// so there's no FX or Korean-tax-vs-US-tax contrast to draw. The actual
// <table> with live rows is left out of Body (see tableHeaders / tableNote).
// ─────────────────────────────────────────────────────────────
export const COMPARE_EN = {
  metaTitle: "ETF historical results",
  metaDescription: "Different histories are not a common-period experiment",
  head: {
    title: "ETF historical results",
    desc: "Different histories are not a common-period experiment",
    crumb: "Compare",
  },

  tableHeaders: {
    ticker: "Ticker",
    timeToGoal: "Time to $1M",
    cagr: "Annualized",
    dataStart: "Data starts",
  },
  missLabel: (rough: string) => `Didn't reach it even over the full period · at data end about ${rough}`,
  asOf: (ym: string) => `Data as of ${ym}. `,
  tableNote:
    "Each fund's data starts at a different point, so comparing the raw duration isn't quite apples-to-apples. Assumes dividends reinvested (ON), taxes and fees excluded, by default.",

  Body: ({ table }: { table: ReactNode }) => (
    <>
      <h2>What this table measures</h2>
      <p>This table is a precomputed illustration using the stated monthly contribution. Its duration measures a starting period that reaches the target at the data endpoint, rather than the main calculator&#x27;s first-crossing rule. Each ETF has its own history, and some bundled series include estimated pre-listing intervals.</p>
      {table}
      <h2>Why a shorter duration is not a recommendation</h2>
      <p>The fund&#x27;s asset exposure, leverage, distributions, and the market window all affect the amount. A target achieved during a strong past interval does not establish a repeatable waiting time. Different start dates also mean different market conditions.</p>
      <h2>A common-period comparison</h2>
      <p>The comparison opened from a calculator result fixes that result&#x27;s start, end, and contribution schedule. It separates actual histories from labeled proxy estimates, and omits a value when data cannot cover the whole period. This answers a different question from comparing independently calculated durations.</p>
      <h2>Read returns together with structure</h2>
      <p>QQQ, SPY, and VOO track different or shared equity benchmarks; QLD and TQQQ add daily leverage. Bond, gold, dividend, and option-income funds have other return sources. The fund descriptions explain those distinctions without treating the largest historical balance as the best choice.</p>
      <Sources locale="en" ids={["yahoo"]} />
      <p><Link href={localeHref("en", "/guides")}>Related guides</Link></p>
    </>
  ),
};
