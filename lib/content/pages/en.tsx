import type { ReactNode } from "react";
import Link from "next/link";
import { localeHref } from "@/lib/i18n/seo";
import { Sources } from "@/components/Sources";


export const DCA_EN = {
  metaTitle: "The Logic of Dollar-Cost Averaging (DCA)",
  metaDescription:
    "Why buying a fixed amount every month — dollar-cost averaging (DCA) — is such an easy way to invest, and its strengths and limits.",
  head: {
    title: "The Logic of Dollar-Cost Averaging (DCA)",
    desc: "The same amount, every month",
    crumb: "Guide · DCA",
  },
  Body: () => (
    <>
      <p>
        Investing a fixed amount every month is called <strong>Dollar-Cost Averaging</strong>, or{" "}
        <strong>DCA</strong> for short. The idea is simple: <strong>buy the same ticker on the same
        day every month, for the same amount, whether the price is up or down</strong>. Unlike a
        lump sum — where you put in a large amount all at once — DCA spreads your purchases across
        many months. Since most people set aside a portion of every paycheck to invest, a lot of
        investing ends up being DCA almost by default, without anyone planning it that way.
      </p>

      <h2>How it spreads out your average cost</h2>
      <p>
        The biggest thing about DCA is that <strong>you spend the same &ldquo;amount&rdquo; every
        month</strong> — not the same number of shares. That means you automatically buy more
        shares when the price is low, and fewer when it&rsquo;s high. As a result, your average
        purchase price doesn&rsquo;t get stuck at any one price point — it spreads across many.
      </p>
      <h3>A simple example with numbers</h3>
      <p>
        Say you invest $700 every month, and the share price swings from $100 → $50 → $100.
      </p>
      <ul>
        <li>Month 1: $700 buys shares at $100 → <strong>7 shares</strong></li>
        <li>Month 2: $700 buys shares at $50 → <strong>14 shares</strong></li>
        <li>Month 3: $700 buys shares at $100 again → <strong>7 shares</strong></li>
      </ul>
      <p>
        With a total of $2,100, you ended up with 28 shares, so your average cost is $2,100 ÷ 28 ={" "}
        <strong>$75 per share</strong> — lower than the simple average of the three prices
        ($83.33). That&rsquo;s because you bought more when it was cheap. This automatic
        &ldquo;buy more when it&rsquo;s cheap, less when it&rsquo;s expensive&rdquo; behavior is
        DCA&rsquo;s cost-averaging effect.
      </p>

      <h2>It removes the timing question</h2>
      <p>
        One of the hardest calls in investing is figuring out &ldquo;should I buy now?&rdquo;
        People trying to time the exact bottom or top often miss their window entirely, or dump
        everything in at a peak and regret it. DCA replaces that guesswork with a rule. As long as
        you stick to <strong>the same day, the same amount, every month</strong>, you never have to
        predict whether the market will go up or down.
      </p>

      <h2>Habit and automation</h2>
      <p>
        A simple rule is easy to automate. Set up recurring buys with your broker, and investing
        just keeps happening every month, like a paycheck landing in your account. Because it runs
        mechanically instead of relying on willpower, it&rsquo;s much easier to keep investing even
        when the market gets scary. In long-term investing, simply &ldquo;not stopping&rdquo; is a
        bigger edge than it sounds.
      </p>

      <h2>It matters even more for volatile tickers</h2>
      <p>
        The more a price swings, the more pronounced the cost-averaging effect becomes. Just like
        the example above, where the price bounced between $100 and $50, bigger swings mean a
        bigger payoff from loading up when it&rsquo;s cheap. That&rsquo;s why DCA&rsquo;s timing
        diversification is especially noticeable with something as volatile as a leveraged ETF.
        That said, more volatility also means more risk — DCA doesn&rsquo;t prevent losses on its
        own. We cover the specific risks of leverage separately in{" "}
        <Link href={localeHref("en", "/guides/leverage-etf-risk")}>Leveraged ETF Risk</Link>.
      </p>

      <h2>The limits are real, too</h2>
      <p>
        DCA isn&rsquo;t always the right answer. In a market that trends steadily upward, a lump
        sum invested early tends to spend more time exposed to the market and often comes out
        ahead. That&rsquo;s because DCA, by trickling money in gradually, keeps less of it in the
        market early on. In other words, DCA&rsquo;s real value isn&rsquo;t &ldquo;the best possible
        return&rdquo; — it&rsquo;s <strong>lowering the psychological burden so you keep
        participating</strong>. We go deeper into how the two approaches compare, and when to pick
        one over the other, in{" "}
        <Link href={localeHref("en", "/guides/dca-vs-lumpsum")}>DCA vs. Lump Sum</Link>. And a
        strategy that worked well in the past is never guaranteed to work the same way going
        forward.
      </p>

      <h2>How 10-eok calculates DCA</h2>
      <p>
        10-eok assumes you buy your chosen ticker on <strong>the day of the month you pick</strong>{" "}
        (or the next trading day, if the market&rsquo;s closed), for <strong>the amount you
        set</strong>, at that day&rsquo;s real closing price. It finds the day your accumulated
        balance first crosses $1M, and shows you &ldquo;how long it took.&rdquo; You can check the
        actual numbers for each ticker, or run your own conditions, in the{" "}
        <Link href={localeHref("en", "/")}>calculator</Link> and the ticker comparison table on the
        homepage.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
    </>
  ),
};

export const DCA_VS_LUMPSUM_EN = {
  metaTitle: "DCA vs. Lump Sum",
  metaDescription:
    "Invest a lump sum all at once, or spread it out? The difference between DCA and lump-sum investing, which one wins on average, and how to choose for your situation.",
  head: {
    title: "DCA vs. Lump Sum",
    desc: "All at once, or spread out?",
    crumb: "Guide · DCA vs. Lump Sum",
  },
  Body: () => (
    <>
      <p>
        Put the same money into the same ticker, and the outcome still depends on{" "}
        <strong>when</strong> you put it in. There are two broad approaches.{" "}
        <strong>Lump sum</strong> means investing all of your available cash at once.{" "}
        <strong>DCA</strong> means spreading that same money across several months instead. Which
        one is right? The short answer: &ldquo;on average, lump sum has come out ahead, but in
        practice, DCA is often the more sensible choice.&rdquo; Let&rsquo;s unpack why.
      </p>

      <h2>On average, lump sum wins</h2>
      <p>
        Zoom in on the stock market and it looks choppy, but zoom out and it has spent much more
        time trending upward. If you assume the market rises over the long run, then the longer
        your money stays invested, the more it tends to grow. A lump sum exposes the full amount to
        the market from day one, so for the same total dollars,{" "}
        <strong>it spends more time, on average, in the market.</strong> DCA, by contrast, means
        the last dollars you contribute are exposed for the shortest stretch — so on average, its
        total market exposure time is shorter than a lump sum&rsquo;s.
      </p>
      <p>
        That&rsquo;s why, if you already have the cash available and believe strongly enough in a
        long-run uptrend, lump sum&rsquo;s <strong>expected return is often higher.</strong> But
        that&rsquo;s only an average and a historical tendency — it doesn&rsquo;t guarantee the
        outcome at any specific point in time. Lump sum&rsquo;s biggest weakness is{" "}
        <strong>a sharp drop right after you invest</strong>, which hits much harder than it would
        under DCA.
      </p>

      <h2>Why DCA is often the sensible choice in practice</h2>
      <p>
        Just because the statistical average favors lump sum doesn&rsquo;t mean everyone should go
        that route. Most real investors choose DCA for the following reasons, and it&rsquo;s a
        perfectly rational choice.
      </p>
      <ul>
        <li>
          <strong>There&rsquo;s no lump sum to begin with.</strong> Most people invest a portion of
          their paycheck each month. That means there&rsquo;s no large pile of cash sitting around
          to invest all at once, so DCA happens naturally. The lump-sum-vs-DCA debate really only
          matters for people who already have a large sum on hand.
        </li>
        <li>
          <strong>It spreads risk during drops and high-volatility stretches.</strong> If prices
          are swinging wildly, putting everything in at once risks getting stuck right at a peak.
          Spreading purchases out means you buy less when it&rsquo;s expensive and more when
          it&rsquo;s cheap, reducing the risk of your average cost getting stuck at an unlucky
          price. This effect is especially noticeable with more volatile assets.
        </li>
        <li>
          <strong>It reduces regret and psychological strain.</strong> If the market crashes the
          day after you put in a lump sum, it&rsquo;s easy to lose sleep and give up on the
          strategy entirely, regardless of the eventual return. No strategy matters if you
          can&rsquo;t stick with it. DCA structurally lowers the odds of &ldquo;getting fully
          caught at the worst possible moment.&rdquo;
        </li>
      </ul>

      <h2>The real question isn&rsquo;t &ldquo;best return&rdquo; — it&rsquo;s &ldquo;least regret&rdquo;</h2>
      <p>
        The most useful way to compare the two approaches isn&rsquo;t &ldquo;which one earns
        more?&rdquo; — it&rsquo;s{" "}
        <strong>&ldquo;do I want to maximize expected return, or minimize regret?&rdquo;</strong>{" "}
        Lump sum is closer to an &ldquo;expected-return-maximizing&rdquo; strategy that wins big
        when markets rise. DCA is closer to a &ldquo;regret-minimizing&rdquo; strategy: whatever
        happens, you can tell yourself &ldquo;that&rsquo;s just how it had to play out.&rdquo;
      </p>
      <p>
        What actually drives real-world decisions isn&rsquo;t just numbers. The same dollar loss
        feels much bigger when it happens &ldquo;right after putting everything in at once&rdquo;
        than when it happens &ldquo;gradually, while spreading out purchases,&rdquo; and that regret
        is often what causes people to quit investing altogether. So being honest with yourself
        about your temperament and how much volatility you can stomach often matters more than
        comparing a single average-return figure.
      </p>

      <h2>A middle ground: spreading a lump sum over a few months</h2>
      <p>
        You don&rsquo;t have to pick strictly one or the other. If you have a large sum but putting
        it all in at once makes you nervous, <strong>splitting it into equal purchases over a set
        period</strong> is a practical middle ground. For example, spreading a lump sum across 3 to
        12 months lets you capture some of lump sum&rsquo;s &ldquo;early exposure&rdquo; advantage
        while also getting some of DCA&rsquo;s &ldquo;avoid buying it all at the top&rdquo; benefit.
      </p>
      <p>
        The shorter the spread-out period, the closer it behaves to a lump sum; the longer, the
        closer to DCA. What matters most is <strong>setting the rule before you start, and
        sticking to it.</strong> Improvising along the way — &ldquo;I&rsquo;ll add more if it drops,
        and stop if it rises&rdquo; — turns into an attempt to time the market, which is hard for
        anyone to pull off.
      </p>

      <h2>Questions to help you pick what fits you</h2>
      <ul>
        <li>Do you already <strong>have a lump sum</strong> ready to invest? If not, DCA is basically your only option.</li>
        <li>If a big drop hits right after you invest, <strong>can you hold on without selling?</strong> If you&rsquo;re not confident, DCA or a phased buy-in will feel more comfortable.</li>
        <li>Is it a volatile asset? The more a ticker swings — like a leveraged product — the more timing diversification matters. We cover leverage&rsquo;s structural risks separately in <Link href={localeHref("en", "/guides/leverage-etf-risk")}>Leveraged ETF Risk</Link>.</li>
      </ul>
      <p>
        10-eok calculates results based on <strong>DCA — investing a fixed amount every
        month</strong>. For more on why DCA is such an easy way to invest, see{" "}
        <Link href={localeHref("en", "/guides/dca")}>The Logic of Dollar-Cost Averaging (DCA)</Link>
        , and you can check the actual numbers for each ticker in the comparison table or the{" "}
        <Link href={localeHref("en", "/")}>calculator</Link>. Just because one approach won
        historically doesn&rsquo;t mean it will in the future — so it&rsquo;s better to choose based
        on &ldquo;can I actually stick with this?&rdquo; rather than the result alone.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
    </>
  ),
};

export const ETF_BASICS_EN = {
  metaTitle: "What Is an ETF? (Beginner's Guide)",
  metaDescription:
    "What an ETF (exchange-traded fund) is, how it differs from individual stocks and mutual funds, and the costs and risks every beginner should know.",
  head: {
    title: "What Is an ETF? (Beginner's Guide)",
    desc: "A 'basket of many tickers' you trade like a stock — understanding ETFs from scratch",
    crumb: "Guide · ETF Basics",
  },
  Body: () => (
    <>
      <h2>ETF, in one sentence</h2>
      <p>
        ETF stands for <em>Exchange Traded Fund</em>. The name sounds technical, but it breaks down
        simply. &ldquo;Exchange traded&rdquo; means it&rsquo;s listed on an exchange like a stock,
        so you can buy or sell it any time the market&rsquo;s open. &ldquo;Fund&rdquo; means it
        pools money from many investors and spreads it across many holdings. In short, an ETF is{" "}
        <strong>a product you trade as easily as a stock, but that holds dozens to hundreds of
        tickers inside a single basket</strong>.
      </p>
      <p>
        For example, buy one share of an ETF, and that single share already contains shares of many
        different companies in set proportions. Instead of the effort of picking out individual
        tickers one by one, a single purchase gets you a small stake spread across the whole market.
      </p>

      <h2>What &ldquo;tracking an index&rdquo; actually means</h2>
      <p>
        Most ETFs are built to track a specific <strong>index</strong>. An index is a single number
        that summarizes the state of a market. The S&amp;P 500, for instance, bundles 500 large
        U.S. companies, while the Nasdaq-100 bundles roughly 100 leading companies listed on the
        Nasdaq. An index-tracking ETF holds the same tickers as that index, in close to the same
        proportions the index specifies.
      </p>
      <p>
        So when the index rises 1%, the ETF that tracks it rises about 1% too, minus costs. The key
        is that the fund manager isn&rsquo;t hand-picking &ldquo;stocks that look good&rdquo;
        — they&rsquo;re replicating the index according to a fixed rule. That&rsquo;s why this style
        of investing is called <strong>passive</strong> investing. Which index an ETF tracks shapes
        its whole personality, so understanding the index itself is the starting point for choosing
        an ETF. We cover the differences between two major indexes in detail in{" "}
        <Link href={localeHref("en", "/guides/nasdaq100-vs-sp500")}>Nasdaq-100 vs. S&amp;P 500</Link>.
      </p>

      <h2>Diversification — not putting all your eggs in one basket</h2>
      <p>
        An ETF&rsquo;s biggest advantage is <strong>diversification</strong>. Invest in a single
        stock, and you absorb the full hit if that one company posts bad earnings or runs into
        trouble. But with an ETF holding hundreds of tickers, if one company stumbles, the others
        cushion the blow. Unless the entire market collapses, the risk of your investment going to
        zero all at once drops sharply.
      </p>
      <p>
        That said, diversification absolutely does not mean &ldquo;no losses.&rdquo; When the whole
        market drops together — like in 2008 or 2020 — a diversified ETF drops right along with it.
        Diversification only reduces the risk concentrated in a single ticker; it can&rsquo;t
        eliminate market-wide (systemic) risk. Knowing this honestly is the most important thing
        for a beginner to internalize.
      </p>

      <h2>Costs and tracking gaps — the numbers that hide in plain sight</h2>
      <p>
        An ETF is still a fund, so running it costs money. The most important figure is the{" "}
        <strong>expense ratio (TER)</strong> — the percentage of your assets charged annually for
        management. If the expense ratio is 0.1% per year, for example, holding $10,000 for a year
        costs about $10. That fee gets skimmed into the price a little at a time, so it never feels
        like a separate bill, but over the long run, small differences compound into a meaningful
        gap. Among ETFs tracking the same index, the one with the lower fee comes out ahead.
      </p>
      <ul>
        <li>
          <strong>Premium/discount:</strong> the gap between an ETF&rsquo;s market price and its
          actual net asset value (NAV). In theory these should match, but thin trading can pull them
          apart briefly. A large gap means you could end up paying more, or selling for less, than
          fair value.
        </li>
        <li>
          <strong>Trading volume (liquidity):</strong> the more that trades hands each day, the
          easier it is to buy and sell at the price you want, and the narrower the bid-ask spread.
          An ETF with almost no trading can put you at a disadvantage when you go to sell.
        </li>
        <li>
          <strong>Tracking error:</strong> how much an ETF&rsquo;s actual return diverges from the
          index it&rsquo;s supposed to follow. The smaller it is, the more faithfully the fund
          replicates the index.
        </li>
      </ul>

      <h2>How does it differ from an actively managed fund?</h2>
      <p>
        A traditional <strong>actively managed fund</strong> has a fund manager hand-picking and
        trading securities, trying to beat the market. That human judgment and frequent trading
        come with relatively higher fees, prices are typically set once a day, and redemptions
        (cashing out) can take time.
      </p>
      <p>
        An index-tracking ETF, by contrast, aims simply to follow the market according to a fixed
        rule, so its fees are lower, it trades in real time throughout the day just like a stock,
        and its holdings are disclosed daily. Instead of &ldquo;trying to beat the market,&rdquo;
        the appeal of an ETF is the simplicity and low cost of &ldquo;just keeping pace with
        it.&rdquo; That said, some ETFs are actively managed too, so it&rsquo;s worth checking a
        fund&rsquo;s documentation to see which style it follows.
      </p>

      <h2>Checkpoints for picking your first ETF</h2>
      <ul>
        <li>
          <strong>What does it hold?</strong> Start by checking which index, market, or asset class
          it tracks. Is it U.S. or international stocks? Is it broadly diversified, or concentrated
          in one sector?
        </li>
        <li>
          <strong>Is the cost reasonable?</strong> Among funds tracking the same index, the one with
          the lower expense ratio wins out over the long run.
        </li>
        <li>
          <strong>Is it liquid enough?</strong> It&rsquo;s generally safer to avoid ETFs with very
          low trading volume or a small asset base.
        </li>
        <li>
          <strong>Is it leveraged or derivative-based?</strong> ETFs with &ldquo;2x,&rdquo;
          &ldquo;3x,&rdquo; or &ldquo;inverse&rdquo; in the name carry an entirely different risk
          profile from a regular ETF. Because they reset their multiplier every day, holding them
          long term can lead to value erosion from volatility. Only get into one once you fully
          understand how it works — see{" "}
          <Link href={localeHref("en", "/guides/leverage-etf-risk")}>Leveraged ETF Risk</Link> for
          the details.
        </li>
        <li>
          <strong>If it holds international assets, mind currency risk — and taxes.</strong> A fund
          invested outside your home market is exposed to currency swings on top of the underlying
          asset&rsquo;s price moves. And capital gains from selling investments are generally
          taxable — the specifics depend on where you live, so it&rsquo;s worth checking with a tax
          professional for your situation. We cover a steady, monthly buying approach in{" "}
          <Link href={localeHref("en", "/guides/dca")}>Dollar-Cost Averaging (DCA)</Link>.
        </li>
      </ul>
      <p>
        Once you&rsquo;ve got the concept of an ETF down, the fastest way to really learn is to
        simulate what happens when you actually invest a fixed amount every month. You can check
        ticker-by-ticker results based on real historical prices in the{" "}
        <Link href={localeHref("en", "/")}>calculator</Link>. Just keep in mind that past returns
        don&rsquo;t guarantee the future — treat the numbers as a reference point, not a promise.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
    </>
  ),
};

export const COMPOUND_72_EN = {
  metaTitle: "Compound Interest and the Rule of 72",
  metaDescription:
    "How compound interest lets your money make more money, illustrated with the Rule of 72 — a mental-math shortcut for how long it takes your principal to double.",
  head: {
    title: "Compound Interest and the Rule of 72",
    desc: "How money makes money, and a mental-math shortcut",
    crumb: "Guide · Compound Interest",
  },
  Body: () => (
    <>
      <p>
        The most powerful force in long-term investing turns out to be surprisingly simple:{" "}
        <strong>compound interest</strong> — the idea that money you&rsquo;ve already earned goes on
        to earn more money. Even at the same rate of return, having this mechanism or not creates a
        gap that widens dramatically over time, and the difference becomes obvious the moment you
        put compound interest side by side with simple interest.
      </p>

      <h2>Simple interest vs. compound interest</h2>
      <p>
        <strong>Simple interest</strong> only accrues on your original principal. Leave $1,000 at
        10% simple interest, and you earn a flat $100 every year — after 10 years, that&rsquo;s
        1,000 + (10 × 100) = $2,000. Because interest is always proportional to the same original
        principal, the growth is a steady &lsquo;straight line.&rsquo;
      </p>
      <p>
        <strong>Compound interest</strong> earns interest on the interest. Leave that same $1,000 at
        10% compound interest, and after 1 year you have $1,100; in year 2, that $1,100 earns
        another 10% — $110 — bringing you to $1,210. Because the grown balance itself becomes the
        base for next year&rsquo;s interest, the curve gets steeper and steeper over time. After 10
        years, it&rsquo;s about $2,594 — nearly $590 more than simple interest ($2,000).
      </p>

      <h2>The snowball effect of compounding</h2>
      <p>
        Compound interest&rsquo;s real power shows up in the later stretches. It&rsquo;s like
        rolling a small snowball — the first few turns barely change anything, but as it grows,
        each additional turn packs on a dramatically bigger amount of snow. At 10% compound
        interest, it takes about 7 years for your principal to double. Doubling again — to 4x —
        doesn&rsquo;t take another 7 years on top of that; it takes another 7, for 14 years total.
        An 8x multiple takes 21 years. But the same 7-year stretch produces a wildly different
        amount in absolute dollars depending on whether it&rsquo;s turning $1,000 into $2,000, or
        $10,000 into $20,000.
      </p>
      <p>
        That&rsquo;s why compounding makes <strong>time just as important a variable as the rate of
        return</strong>. At the same rate, a dollar that started one year earlier ends up
        contributing the single largest chunk of growth in the final year.
      </p>

      <h2>The Rule of 72</h2>
      <p>
        So how many years does it take for your money to double? Calculating that exactly requires
        logarithms, but a simple shortcut called the <strong>Rule of 72</strong> gets you close
        enough.
      </p>
      <ul>
        <li><strong>Years to double ≈ 72 ÷ annual return (%)</strong></li>
        <li>8% a year &rarr; 72 ÷ 8 = about <strong>9 years</strong></li>
        <li>6% a year &rarr; 72 ÷ 6 = about 12 years</li>
        <li>12% a year &rarr; 72 ÷ 12 = about 6 years</li>
      </ul>
      <p>
        Why 72, specifically? The exact condition for compound doubling is (1 + r)<sup>n</sup> = 2.
        Taking the log of both sides gives n = ln 2 ÷ ln(1 + r). ln 2 is about 0.693, and when the
        return isn&rsquo;t too large, ln(1 + r) is roughly equal to r itself. So n ≈ 0.693 ÷ r,
        which becomes n ≈ 69.3 ÷ return (%) once you switch to percentage terms. But 69.3 is
        awkward to calculate in your head, so <strong>72</strong> — which has far more divisors and
        splits evenly by common rates like 6, 8, 9, and 12 — became the conventional shortcut
        instead. In the 6&ndash;10% range, the error stays within about a year, which is plenty
        accurate for practical use.
      </p>

      <h2>Combining DCA with compounding</h2>
      <p>
        The Rule of 72 shows how a single lump sum grows over time. But real-world investing is
        often <Link href={localeHref("en", "/guides/dca")}>DCA</Link> — putting in new money every
        month. Under DCA, the dollars you invested earliest have had the most time for compounding
        to work, so they grow the most; the dollars you just contributed this month are still worth
        almost exactly what you paid. In other words, every dollar in the same account has a
        different &ldquo;age,&rdquo; and it&rsquo;s the oldest dollars that drive most of the
        overall growth.
      </p>
      <p>
        Because of this, a DCA portfolio&rsquo;s final value doesn&rsquo;t cleanly reduce to
        &ldquo;total contributions × some multiplier&rdquo; — the price at the time of every single
        monthly purchase, and everything that happened afterward, are all tangled together. To get
        a real feel for how much compounding is actually doing under DCA, run your own ticker and
        monthly amount through the <Link href={localeHref("en", "/")}>calculator</Link>, which
        replays it against real historical data.
      </p>

      <h2>What this means for long-term investing</h2>
      <p>
        Compounding and the Rule of 72 teach two lessons. First,{" "}
        <strong>starting earlier is a real advantage</strong>, because the very last doubling (say,
        $500K to $1M) creates as much new money as every doubling before it combined. Second,{" "}
        <strong>a small bump in your rate of return matters more than it sounds</strong>. Push your
        rate from 6% to 9%, and the time to double drops from 12 years to 8 — meaning your money
        completes twice as many &ldquo;doubling cycles&rdquo; in the same stretch of time. Just
        remember that a higher expected return almost always comes bundled with higher volatility.
      </p>

      <h2>The limits — reality isn&rsquo;t a straight line</h2>
      <p>
        The Rule of 72 assumes <strong>the exact same rate of return, year after year</strong>. But
        real stock and ETF returns bounce around from year to year, and some years are negative.
        When a loss enters the picture, compounding works in reverse too — recovering from one big
        drop requires an even bigger gain. For example, an asset that falls 50% needs +100%, not
        +50%, to get back to even. Leveraged ETFs in particular are prone to this kind of
        compounding volatility loss (decay) — see{" "}
        <Link href={localeHref("en", "/guides/leverage-etf-risk")}>Leveraged ETF Risk</Link> for
        more.
      </p>
      <ul>
        <li><strong>Volatility</strong> — even with the same average return, bigger swings can leave you worse off in the end.</li>
        <li><strong>Taxes</strong> — taxes on realized gains or dividends shrink the principal available for reinvestment, chipping away at the compounding effect.</li>
        <li><strong>Inflation</strong> — an 8% nominal annual return is closer to a 5% real (purchasing-power) return if inflation is running at 3% a year.</li>
      </ul>
      <p>
        So the Rule of 72 is best used not as a precise forecast but as a{" "}
        <strong>rough intuition tool</strong>. Real returns swing year to year, and the fact that
        something compounded at a certain pace in the past is no guarantee it will keep doing so
        going forward.
      </p>

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
    </>
  ),
};

export const LEVERAGE_ETF_RISK_EN = {
  metaTitle: "The Risks of Leveraged ETFs",
  metaDescription:
    "Losses as large as the 2x or 3x gains, plus the hidden trap known as volatility decay — explained with real numbers.",
  head: {
    title: "The Risks of Leveraged ETFs",
    desc: "2x applies to losses just as much as gains",
    crumb: "Guide · Risk",
  },
  Body: () => (
    <>
      <p>
        Leveraged ETFs like QLD (2x) or TQQQ (3x) put up dazzling returns in a rising market — look
        at a backtest alone, and you might wonder why you didn&rsquo;t buy in sooner. But that
        return always comes with an equally large risk attached. And leveraged products carry one
        more <strong>hidden trap</strong> that a plain index fund doesn&rsquo;t have. You need to
        understand the following before getting in.
      </p>

      <h2>1. Leverage operates on a &ldquo;daily&rdquo; basis</h2>
      <p>
        The biggest misconception is believing a leveraged ETF tracks &ldquo;2x the index over the
        long run.&rdquo; In reality, it targets 2x (or 3x) the <strong>daily</strong> return. If the
        Nasdaq-100 rises 1% today, QLD rises about 2%, and TQQQ about 3%. The key is that the fund
        manager <strong>resets that multiplier at the close of every trading day</strong>.
        Regardless of yesterday&rsquo;s gain or loss, exposure is reset to 2x based on today&rsquo;s
        asset value.
      </p>
      <p>
        This &ldquo;daily reset&rdquo; is what makes all the difference. Once you stack up several
        days or months, a leveraged ETF&rsquo;s cumulative return is not simply 2x the index&rsquo;s
        cumulative return. The gap between the two widens the longer you hold, and it doesn&rsquo;t
        always widen in the investor&rsquo;s favor. We cover the mechanics of the underlying product
        in more detail in <Link href={localeHref("en", "/guides/qld")}>What Is QLD?</Link>.
      </p>

      <h2>2. Losses are amplified 2x or 3x too</h2>
      <p>
        This is the most intuitive risk. If the underlying index drops 3% in a day, a 2x product
        drops about 6%, and a 3x product about 9%. The problem is that once you&rsquo;re deep in a
        hole, climbing out gets arithmetically harder. Recovering from a −50% loss requires not
        +50%, but <strong>+100%</strong>. As leverage deepens a drawdown, the gain needed to get
        back to even grows exponentially.
      </p>
      <p>
        The Nasdaq-100 itself has taken several sharp hits in the past. In those stretches, 3x
        products have come close to wiping out nearly all their peak value, and it took a long time
        to recover. For the exact drawdowns and recovery times, it&rsquo;s more accurate to check
        real data directly in the{" "}
        <Link href={localeHref("en", "/")}>calculator and ticker comparison table</Link>.
      </p>

      <h2>3. Volatility decay — the trap you can see in the numbers</h2>
      <p>
        The sneakiest risk in a leveraged product is <strong>volatility decay</strong>: your balance
        slowly erodes even when the market goes nowhere, just bouncing up and down. It&rsquo;s a
        mathematical inevitability that comes from resetting the multiplier every single day.
      </p>
      <p>
        Here&rsquo;s a simple example. Say the index goes <strong>+10%</strong> one day, then{" "}
        <strong>−10%</strong> the next.
      </p>
      <ul>
        <li>The underlying index: 100 → 110 → 99. Down <strong>1%</strong> over two days.</li>
        <li>A 2x product: +20% one day, −20% the next. 100 → 120 → 96. That&rsquo;s <strong>−4%</strong>.</li>
        <li>A 3x product: +30% one day, −30% the next. 100 → 130 → 91. That&rsquo;s <strong>−9%</strong>.</li>
      </ul>
      <p>
        The index only dropped 1%, but the 2x product dropped 4%, and the 3x product a whopping 9%.
        It&rsquo;s not simply &ldquo;2x or 3x the loss&rdquo; — the gap widens far more than that.
        This is volatility decay. The bigger the swing (±10% here), and the longer this
        back-and-forth continues, the faster the losses stack up. Because a 3x product roughly
        squares the effect of a swing compared to 2x, its decay is far worse.
      </p>

      <h2>4. Why it&rsquo;s especially dangerous in a sideways market</h2>
      <p>
        Volatility decay can actually work in leverage&rsquo;s favor when the market trends steadily
        in one direction — if it climbs every day, compounding makes the gains even bigger. But
        it&rsquo;s the exact opposite in a <strong>sideways market that just chops around in
        place</strong>. The index eventually returns to where it started, but a leveraged product
        amplifies every daily swing along the way, and its value keeps eroding regardless.
      </p>
      <p>
        In other words, for a leveraged ETF to perform well, it&rsquo;s not enough for the market to
        simply go up — it needs to <strong>climb steadily in one direction, without much
        back-and-forth</strong>. The real stock market isn&rsquo;t that accommodating; even when it
        does climb, it comes with sizable corrections and sideways stretches along the way. And
        decay chips away at returns during every one of those stretches.
      </p>

      <h2>5. The long-term-holding debate, and DCA&rsquo;s limits</h2>
      <p>
        Because of all this, many argue that leveraged ETFs were fundamentally designed for{" "}
        <strong>short-term, tactical use</strong>. Others point to the long, strong run U.S. tech
        stocks have had historically and argue that long-term DCA can work too. Both sides have a
        point, but it&rsquo;s important to remember that any backtest that looks great is
        ultimately just the result from <strong>one specific stretch of the past</strong>. A
        slightly different starting point could have produced a very different outcome. This should
        be considered alongside the start-date timing issue covered in{" "}
        <Link href={localeHref("en", "/guides/dca")}>Dollar-Cost Averaging (DCA)</Link>.
      </p>
      <p>
        DCA (buying a fixed amount steadily every month) <strong>partially</strong> softens
        leverage&rsquo;s risk, because buying the same dollar amount during a downturn nets you more
        shares, lowering your average cost. But DCA doesn&rsquo;t eliminate volatility decay itself.
        The balance you&rsquo;ve already built up is still exposed to daily decay, and a large
        drawdown can wipe out a chunk of everything you&rsquo;ve contributed so far, all at once.
        The key takeaway: <strong>it softens the blow, but doesn&rsquo;t make it
        disappear</strong>.
      </p>

      <h2>6. Keep it to a position you can actually handle</h2>
      <p>
        If you&rsquo;re going to include a leveraged ETF in your portfolio, the first question is
        whether the position size is one you can <strong>survive the worst-case drawdown</strong>{" "}
        with. Picture your position losing more than half its value from the peak, and honestly ask
        yourself whether that amount would still let you sleep at night and go about your life
        normally. Some commonly cited ground rules:
      </p>
      <ul>
        <li>Cap leverage at a slice of your total portfolio, and balance the rest with lower-volatility assets.</li>
        <li>Only put in money you won&rsquo;t need any time soon — money you won&rsquo;t be forced to sell during a big drop.</li>
        <li>A result like &ldquo;$1M in N years&rdquo; is only a record of <strong>what happened in the past</strong> — it&rsquo;s not a promise about the future.</li>
        <li>Remember that the fastest-arriving outcomes also tended to require surviving the deepest drawdowns along the way.</li>
      </ul>
      <p>
        You can compare the actual best-, median-, and worst-case outcomes by ticker and start date
        directly in the <Link href={localeHref("en", "/")}>calculator</Link>. Looking at the bad
        numbers as closely as the good ones is the real key to understanding leverage.
      </p>

      <Sources ids={["prosharesQld", "prosharesTqqq"]} />

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
    </>
  ),
};

export const NASDAQ100_VS_SP500_EN = {
  metaTitle: "Nasdaq-100 vs. S&P 500",
  metaDescription:
    "Comparing the composition, personality, and volatility of the Nasdaq-100 and S&P 500 — the indexes behind QQQ and SPY.",
  head: {
    title: "Nasdaq-100 vs. S&P 500",
    desc: "Two flagship U.S. indexes — what sets them apart",
    crumb: "Guide · Index Comparison",
  },
  Body: () => (
    <>
      <p>
        When it comes to DCA-ing into U.S. stocks, the two indexes that come up most often are the{" "}
        <strong>Nasdaq-100</strong> and the <strong>S&amp;P 500</strong>. Both hold large U.S.
        companies, but they differ in what they hold and how much of it, which gives them different
        personalities and volatility. The names are familiar, but the differences are easy to mix
        up — here&rsquo;s the essentials from a DCA investor&rsquo;s perspective.
      </p>

      <h2>What&rsquo;s inside — the difference in composition</h2>
      <p>
        The biggest difference is the <strong>number and breadth</strong> of companies each one
        holds. Both indexes are fundamentally market-cap weighted, meaning bigger companies carry
        more weight.
      </p>
      <ul>
        <li>
          <strong>S&amp;P 500:</strong> made up of roughly 500 large U.S. companies. It spans nearly
          every industry — tech, financials, healthcare, consumer goods, industrials, energy, and
          more — which is why it&rsquo;s often called &ldquo;the index of the U.S. economy.&rdquo;
          It includes companies regardless of which exchange they&rsquo;re listed on (NYSE or
          Nasdaq).
        </li>
        <li>
          <strong>Nasdaq-100:</strong> made up of the 100 largest companies by market cap listed on
          the Nasdaq exchange, <strong>excluding financials</strong>. With fewer holdings, it&rsquo;s
          structurally much more concentrated in tech and growth companies.
        </li>
      </ul>

      <h2>Sector concentration</h2>
      <p>
        With only 100 holdings and financials excluded, the Nasdaq-100 naturally{" "}
        <strong>skews heavily toward the tech sector</strong>. A handful of large tech companies
        make up a sizable share of the index, so when their stocks wobble, the whole index tends to
        wobble with them. The S&amp;P 500, on the other hand, spreads across a much wider range of
        industries, so weakness in one sector can be partly offset by strength in others.
      </p>
      <p>
        That said, it&rsquo;s worth noting that in recent years the S&amp;P 500 itself has become
        more concentrated in large-cap tech names, so the two indexes actually overlap quite a bit
        at the top. They&rsquo;re less &ldquo;two completely different markets&rdquo; and more
        &ldquo;the same market, viewed at different angles and concentrations.&rdquo;
      </p>

      <h2>Volatility and growth character</h2>
      <p>
        With less diversification and a heavier tilt toward growth stocks, the Nasdaq-100 generally
        tends to <strong>climb more steeply when things are good, and fall more sharply when
        they&rsquo;re not</strong>. The S&amp;P 500, thanks to its industry spread, tends to be
        comparatively smoother. Neither is definitively &ldquo;better&rdquo; — more volatility means
        both more upside potential and more downside risk.
      </p>
      <p>
        The important thing to remember is that <strong>past returns don&rsquo;t guarantee future
        ones</strong>. Just because the Nasdaq-100 led during a strong stretch for tech stocks over
        roughly the last decade doesn&rsquo;t mean that will always be the case. You can check the
        actual DCA results for both indexes yourself in the{" "}
        <Link href={localeHref("en", "/")}>calculator</Link> and the ticker comparison table on the
        homepage.
      </p>

      <h2>The flagship ETFs — QQQ and SPY</h2>
      <p>
        You can&rsquo;t buy an index directly, so you invest through a fund built to track it — an
        ETF (we cover the basics in{" "}
        <Link href={localeHref("en", "/guides/etf-basics")}>What Is an ETF?</Link>).
      </p>
      <ul>
        <li>
          <strong>QQQ</strong> (Invesco QQQ Trust): the flagship ETF tracking the Nasdaq-100.{" "}
          <Link href={localeHref("en", "/etf/qqq")}>QQQ DCA backtest</Link>
        </li>
        <li>
          <strong>SPY</strong> (SPDR S&amp;P 500 ETF Trust): tracking the S&amp;P 500, one of the
          oldest and most heavily traded ETFs in the world.{" "}
          <Link href={localeHref("en", "/etf/spy")}>SPY DCA backtest</Link>
        </li>
      </ul>
      <p>
        Both carry relatively low expense ratios and pay dividends. 10-eok&rsquo;s backtests use{" "}
        <strong>adjusted closing prices</strong> that account for reinvested dividends and fees, so
        those costs and payouts are already baked into the results.
      </p>

      <h2>Which one fits your temperament</h2>
      <p>
        This isn&rsquo;t here to hand you an answer — just to lay out the questions worth asking
        yourself.
      </p>
      <ul>
        <li>
          <strong>If big swings are hard for you to stomach</strong>, the more broadly diversified
          S&amp;P 500 may feel more comfortable — especially if you&rsquo;re the type to check your
          account daily during a downturn.
        </li>
        <li>
          <strong>If you want more concentrated exposure to tech and growth</strong> and can handle
          bigger swings, the Nasdaq-100 fits that temperament — just accept that the drawdowns can
          run deeper too.
        </li>
        <li>
          When you&rsquo;re buying the same amount every month, volatility isn&rsquo;t necessarily a
          bad thing — a down month means you pick up more shares for the same money. Just remember
          that the more volatile the index, the more{" "}
          <strong>your results can swing depending on exactly when you start and stop</strong>.
        </li>
      </ul>

      <h2>Leveraged versions exist too</h2>
      <p>
        The Nasdaq-100 has leveraged ETFs like <strong>QLD</strong>, which targets 2x the daily
        return, and <strong>TQQQ</strong>, which targets 3x. The key detail is that
        &ldquo;daily&rdquo; multiplier — once several days stack up, the result isn&rsquo;t simply
        2x or 3x the index&rsquo;s cumulative return, and volatility can create losses of its own
        (so-called volatility decay). During a decline, that same multiplier amplifies the losses
        too. Be sure to read{" "}
        <Link href={localeHref("en", "/guides/leverage-etf-risk")}>The Risks of Leveraged ETFs</Link>{" "}
        for the full picture.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
    </>
  ),
};

export const QLD_GUIDE_EN = {
  metaTitle: "What Is QLD?",
  metaDescription:
    "QLD is a leveraged ETF that tracks 2x the daily return of the Nasdaq-100 — its mechanics, fit with DCA, and risks, explained from the ground up.",
  head: {
    title: "What Is QLD?",
    desc: "A leveraged ETF tracking 2x the Nasdaq-100's daily return",
    crumb: "Guide · QLD",
  },
  Body: () => (
    <>
      <p>
        QLD is an exchange-traded fund (ETF) from U.S. asset manager ProShares, officially named
        ProShares Ultra QQQ. It aims to deliver <strong>2x the daily return</strong> of the{" "}
        <strong>Nasdaq-100 index</strong>, which is heavily weighted toward U.S. tech stocks. It
        launched in 2006, giving it a relatively long price history, which is why it shows up
        frequently in long-term DCA backtests. If QQQ (a similarly named ETF) tracks the Nasdaq-100
        at 1x, think of QLD as that same exposure with 2x leverage (using borrowed exposure to
        amplify the multiplier) layered on top.
      </p>

      <h2>What is the Nasdaq-100 index?</h2>
      <p>
        The Nasdaq-100 is an index of roughly 100 of the largest non-financial companies listed on
        the Nasdaq exchange. Big tech names like Apple, Microsoft, and Nvidia carry heavy weight,
        which is why it&rsquo;s often called &ldquo;the flagship U.S. tech index.&rdquo; Rather than
        investing directly in one company, you get diversified exposure across these 100 companies
        at once — but because it&rsquo;s so tech-concentrated, it tends to swing more than a
        broader index like the S&amp;P 500. We cover the personality differences between the two
        indexes in more detail in{" "}
        <Link href={localeHref("en", "/guides/nasdaq100-vs-sp500")}>Nasdaq-100 vs. S&amp;P 500</Link>.
      </p>

      <h2>What &ldquo;2x the daily return&rdquo; precisely means</h2>
      <p>
        Many people assume QLD is a product that &ldquo;tracks the Nasdaq-100 at 2x over the long
        run.&rdquo; It&rsquo;s actually 2x on a <strong>daily</strong> basis. If the Nasdaq-100
        rises 1% in a day, QLD rises about 2%; if it falls 1%, QLD falls about 2%. The fund manager
        resets that day&rsquo;s 2x multiplier at the close of every trading day — this is called{" "}
        <strong>daily rebalancing</strong>. The key point is that this 2x is measured on a
        &ldquo;daily&rdquo; basis, which is why the cumulative return over many days or months
        isn&rsquo;t simply 2x the Nasdaq-100&rsquo;s cumulative return.
      </p>

      <h2>Path dependence and compounding distortion over the long haul</h2>
      <p>
        Because the multiplier resets every day, QLD&rsquo;s final result depends not just on
        &ldquo;how much the index rose,&rdquo; but on <strong>the order in which it
        moved</strong>. This is called <strong>path dependence</strong>. Working through the math
        makes it click quickly.
      </p>
      <ul>
        <li>
          If the index rises +10% one day and falls −10% the next: 100 → 110 → 99. Two days later,
          it&rsquo;s back to 99% of where it started — about a 1% loss.
        </li>
        <li>
          A 2x product experiences the same two days as +20% and −20%: 100 → 120 → 96. That&rsquo;s
          roughly a 4% loss — a bigger hit.
        </li>
      </ul>
      <p>
        The index came full circle and landed nearly back where it started, while the 2x product
        ended up with a loss. This gradual erosion that happens during directionless, choppy
        stretches is called <strong>volatility decay</strong>. The more frequent and prolonged the
        swings, the more this loss accumulates — which is why holding QLD for a long time can
        produce results that diverge sharply from intuition. We continue this topic in more detail
        in <Link href={localeHref("en", "/guides/leverage-etf-risk")}>The Risks of Leveraged ETFs</Link>.
      </p>

      <h2>The power of a rising market, the losses of a falling or sideways one</h2>
      <p>
        In a market that climbs steadily in one direction, this same mechanism works in reverse —
        compounding kicks in strongly. Because each day&rsquo;s 2x gain builds on top of the
        previous day&rsquo;s already-doubled gain, returns can end up exceeding a simple
        &ldquo;2x the index.&rdquo; That&rsquo;s exactly why QLD has stood out during the long,
        strong runs U.S. tech stocks have had historically.
      </p>
      <p>
        But that same structure magnifies losses in a downturn. If the index drops 3% in a day, QLD
        drops about 6%, and in a major bear market, the drawdown from the peak can get very deep.
        And once you&rsquo;re deep in a hole, the required recovery gets steeper — an asset
        that&rsquo;s fallen 50% needs a 100% gain just to get back to even. In a directionless,
        sideways market, volatility decay (described above) means QLD can keep quietly eroding even
        while the index itself goes nowhere.
      </p>

      <h2>How it pairs with DCA — and where that pairing breaks down</h2>
      <p>
        <Link href={localeHref("en", "/guides/dca")}>DCA</Link> — steadily investing a fixed amount
        every month — pairs reasonably well with QLD&rsquo;s volatility. It automatically buys more
        shares when prices are cheap and fewer when they&rsquo;re expensive, smoothing out your
        average cost, and it can turn a deep drawdown into a buying opportunity instead. It also
        reduces the risk of dumping everything in right at a peak.
      </p>
      <p>
        That said, DCA doesn&rsquo;t eliminate volatility decay itself. The balance you&rsquo;ve
        already built stays exposed to daily rebalancing, and a prolonged decline or sideways
        stretch can still produce losses even under a DCA plan. It&rsquo;s also worth remembering
        that a strong past result is a record of <strong>one specific stretch of history</strong>,
        not a promise about the future. Rather than making QLD your entire core holding, it&rsquo;s
        more realistic to decide your own position size and time horizon and operate within a loss
        range you can actually tolerate.
      </p>
      <p>
        Whether QLD fits your own plan is ultimately something you have to check with real numbers.
        Plug in different monthly amounts, goals, and start dates into the{" "}
        <Link href={localeHref("en", "/")}>calculator</Link>, and it becomes clear exactly where QLD
        has pulled ahead of other tickers — and where it has fallen apart.
      </p>

      <Sources ids={["prosharesQld", "yahoo", "fredFx"]} />

      <p className="note">This content is for general information only, not investment advice or a solicitation.</p>
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
  missLabel: (rough: string) => `Didn't reach it even over the full period · currently about ${rough}`,
  // 표 위 문단의 "데이터 기준 시점" 접두사(로케일별). ym은 fmt.ym으로 이미 로케일 포맷된 문자열.
  asOf: (ym: string) => `Data as of ${ym}. `,

  Body: ({ table, asOf }: { table: ReactNode; asOf: string }) => (
    <>
      <h2 id="intro">If you'd invested every month, how long to reach $1M?</h2>
      <p>
        10-eok flips the usual return-calculator question around. Most calculators ask "if I invest
        this much now, how much will I have later?" — 10-eok asks{" "}
        <strong>"how long would it have taken, in the past, to reach my goal ($1M)?"</strong> It's not
        based on some assumed, made-up return — it uses <strong>actual historical daily closing
        prices</strong>, so you can see "if only I'd started back then" as a concrete number.
      </p>
      <p>
        The math is simple. Assume you bought the chosen ETF with{" "}
        <strong>the same dollar amount, on the same day every month</strong> (moving to the next
        trading day if the market was closed), at that day's real closing price, and find the first
        point where your accumulated balance crosses $1M.
      </p>

      <h2 id="compare">Results by ticker, from real historical data</h2>
      <p>
        The table below assumes you invested <strong>$700 every month, on the 1st</strong>, and shows
        how long it took each ETF to reach $1M. "Time to goal" is calculated{" "}
        <strong>working backwards from today</strong> — in other words, "if you'd started saving about
        this many years ago, you'd be at $1M today." Dividends are reinvested; taxes and fees are
        excluded by default.
      </p>

      {table}

      <p className="cmp-note">
        {asOf}
        Each ETF's data starts at a different point, so comparing the raw duration isn't quite
        apples-to-apples. See the full{" "}
        <Link href={localeHref("en", "/compare")}>ETF comparison</Link> for composition and risk
        alongside the $1M results, or tap a ticker to see the details and run your own numbers.
      </p>

      <h2 id="read">How to read these numbers</h2>
      <p>
        The first thing to keep in mind: the times above are close to{" "}
        <strong>the best-case scenario for when you started</strong>. With the same ticker and the
        same monthly amount, results can swing enormously depending on <strong>when you began</strong>.
        Leveraged ETFs like QLD (2x) and TQQQ (3x) in particular can be explosive in a rising market,
        but in a falling or sideways market, losses and so-called{" "}
        <Link href={localeHref("en", "/guides/leverage-etf-risk")}>volatility drag</Link> add up fast —
        so the outcome varies wildly depending on your start date, even over the same stretch of time.
        When a leveraged ticker looks faster in the table, it also means it took on that much more
        risk.
      </p>
      <p>
        That's why 10-eok's calculator also has a <strong>"timing risk"</strong> feature: it runs the
        same plan starting from every past month and shows you the range from worst to median to best
        outcome. Looking at "how much the result can swing based on luck" is a lot more realistic than
        the single number in the table above.
      </p>

      <h2 id="how">Data and methodology</h2>
      <ul>
        <li>
          <strong>Price:</strong> Yahoo Finance daily adjusted close. Dividend reinvestment, stock
          splits, and expense ratios are already reflected.
        </li>
        <li>
          <strong>Currency:</strong> All prices are in USD — no currency conversion is needed.
        </li>
        <li>
          <strong>Assumptions:</strong> Dividends reinvested (ON), contributions on a fixed day each
          month, balance shown at market value (unrealized). Taxes and fees are not subtracted by
          default; the calculator lets you turn on inflation-adjusted contributions.
        </li>
        <li>
          <strong>Updates:</strong> Market data refreshes automatically once a day.
        </li>
      </ul>
      <p>
        The exact assumptions, simplifications, and answers to common questions are laid out
        transparently on the{" "}
        <Link href={localeHref("en", "/how-it-works")}>How it works &amp; FAQ</Link> page.
      </p>

      <h2 id="more">Learn more</h2>
      <ul>
        <li>
          <Link href={localeHref("en", "/compare")}>Full ETF comparison</Link> — composition,
          character, risk, and $1M results side by side
        </li>
        <li>
          <Link href={localeHref("en", "/guides/dca")}>How dollar-cost averaging (DCA) works</Link> —
          why buying steadily every month feels a lot easier
        </li>
        <li>
          <Link href={localeHref("en", "/guides/leverage-etf-risk")}>The risks of leveraged ETFs</Link>{" "}
          — losses and volatility drag as big as the 2x/3x gains
        </li>
        <li>
          <Link href={localeHref("en", "/guides")}>All investing guides</Link> ·{" "}
          <Link href={localeHref("en", "/about")}>About 10-eok</Link>
        </li>
      </ul>

      <p className="note">
        10-eok is an <strong>educational, informational tool</strong> that uses real historical
        data — it does not recommend buying any specific security and does not provide investment or
        financial advice. Past returns do not guarantee future results, and leveraged products carry a
        high risk of losing principal. You alone are responsible for your investment decisions and
        their outcomes.
      </p>
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
  metaTitle: "How it works & FAQ · 10-eok",
  metaDescription:
    "How 10-eok calculates its backtests from real historical prices — plus answers to frequently asked questions.",
  head: {
    title: "How it works & FAQ",
    desc: "How 10-eok turns real historical data into a result",
  },

  steps: [
    "Fetch the selected ticker's daily adjusted closing prices.",
    "On the chosen buy day each month (moving to the next trading day if the market was closed), buy shares with the specified dollar amount at that day's actual closing price.",
    "For every trading day, calculate your portfolio's value as shares held times that day's price.",
    "Find the first day your portfolio value crosses $1,000,000, and show how long that took.",
  ],

  faq: [
    {
      q: "Does the result guarantee future returns?",
      a: "No. Every result is simply a record of \"what would have happened if you'd done this in the past.\" Past returns do not guarantee future results.",
    },
    {
      q: "Why start with QLD?",
      a: "It has a long price history (since 2006) and enough volatility to clearly show what dollar-cost averaging does. More tickers are being added over time.",
    },
    {
      q: "What does \"Annualized\" mean?",
      a: "It's the compound annual growth rate (CAGR) — roughly how many percent your balance grew per year, on average, over the holding period.",
    },
    {
      q: "What's the difference between dividend reinvestment ON and OFF?",
      a: "ON (the default) uses total return — dividends are bought back into more shares (adjusted close prices). OFF uses price return only, excluding dividends. The gap is bigger for tickers with higher dividend yields.",
    },
    {
      q: "What does \"increase contributions with inflation\" do?",
      a: "Instead of investing the same amount every month, this scenario raises your monthly contribution each year in line with the U.S. Consumer Price Index (CPI). It's a more realistic assumption if your income also rises roughly with inflation.",
    },
    {
      q: "Does this account for taxes?",
      a: "No — taxes aren't factored in by default. Tax treatment varies a lot by country, account type, and individual situation, so please consult a tax professional for your own case.",
    },
    {
      q: "Should I actually invest this way?",
      a: "This is an informational tool, not investment advice or a solicitation. Make sure you fully understand the risks of leveraged products, and make your own investment decisions.",
    },
  ],

  Body: () => (
    <>
      <h2>Calculation steps at a glance</h2>
      <ol>
        <li>
          Fetch the selected ticker's <strong>daily adjusted closing prices</strong>.
        </li>
        <li>
          On the chosen <strong>buy day</strong> each month (moving to the next trading day if the
          market was closed), buy shares with the specified <strong>dollar amount</strong> at that
          day's actual closing price.
        </li>
        <li>
          For every trading day, calculate your <strong>portfolio value</strong> as shares held ×
          that day's price.
        </li>
        <li>
          Find the first day the portfolio value crosses <strong>$1,000,000</strong>, and show how
          long that took.
        </li>
      </ol>

      <h2>Data sources</h2>
      <ul>
        <li>
          <strong>Price:</strong>{" "}
          <a href="https://finance.yahoo.com" target="_blank" rel="noopener">
            Yahoo Finance
          </a>{" "}
          daily adjusted close. Dividend reinvestment, stock splits, and expense ratios are already
          reflected.
        </li>
        <li>
          <strong>Inflation index:</strong>{" "}
          <a href="https://fred.stlouisfed.org/series/CPIAUCSL" target="_blank" rel="noopener">
            U.S. Consumer Price Index (FRED, CPIAUCSL)
          </a>
          . Used for the "increase contributions with inflation" option.
        </li>
        <li>Data refreshes automatically once a day.</li>
      </ul>

      <h2>Assumptions and simplifications</h2>
      <ul>
        <li>
          Dividends are assumed to be <strong>reinvested</strong> (using adjusted close prices).
        </li>
        <li>
          <strong>Taxes</strong> are not factored in by default (results are shown at market value, on
          an unrealized basis). Tax rules vary widely by country and situation, so consult a tax
          professional for your own case.
        </li>
        <li>Trading fees and bid/ask spreads are excluded for simplicity.</li>
        <li>Shares are assumed to be purchasable in fractional amounts (a model simplification).</li>
      </ul>

      <h2>Frequently asked questions</h2>
      <h3>Does the result guarantee future returns?</h3>
      <p>
        No. Every result is simply a record of "what would have happened if you'd done this in the
        past." Past returns do not guarantee future results.
      </p>
      <h3>Why start with QLD?</h3>
      <p>
        It has a long price history (since 2006) and enough volatility to clearly show what
        dollar-cost averaging does. More tickers are being added over time.
      </p>
      <h3>What does "Annualized" mean?</h3>
      <p>
        It's the compound annual growth rate (CAGR) — roughly how many percent your balance grew per
        year, on average, over the holding period.
      </p>
      <h3>What's the difference between dividend reinvestment ON and OFF?</h3>
      <p>
        ON (the default) uses <strong>total return</strong> — dividends are bought back into more
        shares (adjusted close prices). OFF uses <strong>price return only</strong>, excluding
        dividends, so it comes out lower than the real result. The gap is bigger for tickers with
        higher dividend yields.
      </p>
      <h3>What does "increase contributions with inflation" do?</h3>
      <p>
        Instead of investing the same amount every month, this scenario raises your monthly
        contribution each year in line with the U.S. Consumer Price Index (CPI). It's a more realistic
        assumption if your actual income also rises roughly with inflation.
      </p>
      <h3>Does this account for taxes?</h3>
      <p>
        No — taxes aren't factored in by default. Tax treatment varies a lot by country, account type,
        and individual situation, so please consult a tax professional for your own case.
      </p>
      <h3>Should I actually invest this way?</h3>
      <p>
        This is an informational tool, not investment advice or a solicitation. Make sure you fully
        understand the risks of leveraged products, and make your own investment decisions.
      </p>

      <p className="note">
        You can read more about how the calculation logic works in the{" "}
        <Link href={localeHref("en", "/guides")}>guides</Link>.
      </p>
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
  metaTitle: "ETF comparison — which reached $1M fastest with $700/month",
  metaDescription:
    "Compare QLD, TQQQ, QQQ, SPY, VOO, SCHD, VT, and more ETFs using real historical data: how long it took to reach $1M investing $700/month, annualized returns, and each fund's character and risk.",
  head: {
    title: "ETF comparison, side by side to $1M",
    desc: "If you'd invested $700 every month — results and character by ticker, from real historical data",
    crumb: "Compare",
  },

  tableHeaders: {
    ticker: "Ticker",
    timeToGoal: "Time to $1M",
    cagr: "Annualized",
    dataStart: "Data starts",
  },
  missLabel: (rough: string) => `Didn't reach it even over the full period · currently about ${rough}`,
  asOf: (ym: string) => `Data as of ${ym}. `,
  tableNote:
    "Each fund's data starts at a different point, so comparing the raw duration isn't quite apples-to-apples. Assumes dividends reinvested (ON), taxes and fees excluded, by default.",

  Body: ({ table }: { table: ReactNode }) => (
    <>
      <p>
        Save the same amount every month, and where you put it still changes the outcome a lot. Below
        is how long it took each of the ETFs 10-eok supports to reach $1M, assuming you invested{" "}
        <strong>$700 every month, on the 1st</strong>, calculated from real historical daily closing
        prices. The time shown is calculated <strong>working backwards from today</strong> — in other
        words, "if you'd started saving about this many years ago, you'd be at $1M today."
      </p>

      {table}

      <h2>Why leverage looks faster</h2>
      <p>
        In the table, leveraged ETFs like QLD (2x Nasdaq-100) and TQQQ (3x) often show a shorter time
        to goal. But that's not because they're "better" — it means they{" "}
        <strong>took on that much more risk</strong>. Leveraged ETFs are built to match a multiple of
        the index's <em>daily</em> return, so they can be explosive in a rising market, but losses and{" "}
        <Link href={localeHref("en", "/guides/leverage-etf-risk")}>volatility drag</Link> pile up fast
        in a falling or sideways market. Even for the same ticker, a slightly different start date can
        produce wildly different results, and recovering from a deep drawdown is mathematically much
        harder.
      </p>

      <h2>Unleveraged index funds — QQQ and SPY</h2>
      <p>
        QQQ (Nasdaq-100) and SPY (S&amp;P 500) track their index at a plain 1x, with no leverage. QQQ
        is tech-heavy, so it combines strong growth with higher volatility; SPY spreads across 500
        large-cap companies, so its swings tend to be milder. Their time to goal tends to be longer
        than the leveraged tickers, but the ride is a lot smoother — which can make them an easier
        choice to hold comfortably over a long accumulation period. See{" "}
        <Link href={localeHref("en", "/guides/nasdaq100-vs-sp500")}>Nasdaq-100 vs. S&amp;P 500</Link>{" "}
        for a closer look at the difference.
      </p>

      <h2>Look at "luck of your start date," not a single number</h2>
      <p>
        The time-to-goal figures above are close to a single scenario where you happened to pick a
        great start date. In reality, when you start matters enormously. That's why the{" "}
        <Link href={localeHref("en", "/")}>calculator</Link> also runs the same plan from every past
        start date and shows the spread from worst to median to best — a feature called{" "}
        <strong>timing risk</strong>. Plug in your own monthly amount, buy day, goal, and inflation
        assumptions, and you can see for yourself how much the outcome shifts, even for the same
        ticker.
      </p>

      <p className="note">
        This comparison is <strong>educational and informational</strong>, using real historical data —
        it is not a recommendation to buy any specific security and not investment advice. Past
        returns do not guarantee future results, and leveraged products carry a high risk of losing
        principal. You alone are responsible for your investment decisions and their outcomes.
      </p>
    </>
  ),
};
