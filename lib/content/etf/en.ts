// English (USD-investor) adaptation of ETF_CONTENT.
// Same structure per ticker: { lead, sections: [{ h, paras }] }.
// Facts/numbers preserved; Korean-won FX framing and Korea-specific tax rules reframed for a US investor.
export const ETF_EN: Record<string, { lead: string; sections: { h: string; paras: string[] }[] }> = {
  "QLD": {
    "lead": "QLD (ProShares Ultra QQQ) is a leveraged ETF built to track twice (2x) the *daily* return of the Nasdaq-100. It launched in 2006, so it has a long track record and shows up often in dollar-cost-averaging backtests. Think of it as riding the Nasdaq-100 — an index packed with big tech names like Apple, Microsoft, and Nvidia — at 2x on a day-by-day basis, using borrowed money to amplify the move.",
    "sections": [
      {
        "h": "First, what is the Nasdaq-100?",
        "paras": [
          "The Nasdaq-100 is an index of roughly 100 of the largest non-financial companies listed on the Nasdaq. Household tech names you use every day — Apple, Microsoft, Amazon, Nvidia, Google — make up a big chunk of it. That means it can climb fast when growth is strong, but it also tends to fall hard when tech stocks wobble all at once.",
          "QLD doesn't buy the index itself — it magnifies the index's *daily* move by 2x. If the index rises 1% on a given day, QLD rises about 2%; if it falls 1%, QLD falls about 2%. It's reset to do exactly this every single day."
        ]
      },
      {
        "h": "'2x daily' and daily rebalancing",
        "paras": [
          "The key word here is *daily*. After the market closes each day, QLD adjusts its borrowed exposure so that it's set to deliver 2x again the next day. This is called daily rebalancing.",
          "Because of this, the return over a month or a year is NOT simply 2x the index's return over that same stretch. As the daily 2x resets stack up, the long-run result drifts away from simple multiplication. If you don't understand this, it's easy to expect something wrong — like 'the Nasdaq-100 doubled, so QLD must have quadrupled.'"
        ]
      },
      {
        "h": "Why long-term results aren't just '2x the index'",
        "paras": [
          "The reason is path dependence. Because it resets to 2x every day, a choppy up-then-down-then-up sequence can leave you with a loss even after the index returns to where it started. For example, if an asset rises +10% one day and falls −9.09% the next, it's back to breakeven — but a 2x product goes +20% then −18.18%, so 100 becomes about 98.2, short of where it began. These small losses piling up in a sideways market are called volatility drag (or leverage decay).",
          "On the flip side, in a strong, steadily rising market that trends in one direction, the compounding of applying 2x to a growing balance each day can earn *more* than a plain 2x. So QLD is your friend when the trend is clear, and your enemy when things chop up and down or grind lower for a long time. That's why, even over the same period, the outcome swings hard depending on your start date and the *order* in which the ups and downs happened."
        ]
      },
      {
        "h": "How it fits dollar-cost averaging — and the limits",
        "paras": [
          "Dollar-cost averaging — investing the same amount every month — buys more shares when the price is low, so it can pair surprisingly well with a high-volatility product like QLD across a big drop and the recovery that follows. The shares you accumulate cheaply during a downturn pack a punch when things bounce back.",
          "But the limits are real. Even with the same contribution plan, *when* you start matters far more than it does for a 1x product. Start right before a big crash and you'll have to wait a long time to recover, and volatility drag eats into your returns the whole way. Keep in mind that 'luck of the start date' plays an outsized role here. A good past is no guarantee the future will look the same."
        ]
      },
      {
        "h": "Who it's for — and who it isn't",
        "paras": [
          "QLD suits people who can stomach a big drawdown emotionally, understand how a leveraged product is built, and can set aside just a slice of their portfolio to ride out the swings over a long horizon. A common view is to treat it as a satellite holding — a small portion — rather than something you bet everything on.",
          "It's a poor fit if losing principal keeps you up at night, if it's money you'll need soon, or if you tend to panic-sell on sharp drops. In that case, the unleveraged QQQ or the more diversified SPY may be an easier choice to live with. Either way, it's never too late to run your own numbers through the calculator above before deciding."
        ]
      }
    ]
  },
  "TQQQ": {
    "lead": "TQQQ (ProShares UltraPro QQQ) is an ultra-high-volatility leveraged ETF that tracks three times (3x) the *daily* return of the Nasdaq-100. Compared with QQQ (which holds the same Nasdaq-100 at 1x) or QLD (2x), its swings are overwhelmingly larger — both up and down. The 'UltraPro' in the name and the number 3 are best read as a signal of just how much conviction (and nerve) it takes.",
    "sections": [
      {
        "h": "What '3x daily' actually means",
        "paras": [
          "TQQQ is designed so that when the Nasdaq-100 rises +1% in a day, it moves about +3%, and when the index falls −1%, it moves about −3%. The critical word is *daily*. The manager resets that 3x exposure at each market close (rebalancing), and because of that, the cumulative return over several days or months is NOT simply 3x the index.",
          "So if the Nasdaq-100 rises 10% over a month, TQQQ does not rise exactly 30%. Because it resets to 3x every day, the result depends on the path — the order in which prices rose and fell — and it usually drifts in a way that's less favorable than your intuition expects."
        ]
      },
      {
        "h": "Volatility drag — a much deeper hole than 2x",
        "paras": [
          "In a choppy, sideways market that keeps rising and falling, leverage nibbles away at your principal — this is called volatility drag (decay). Say the index rises +10% one day and falls −10% the next, repeatedly. At 1x, 1.10 × 0.90 = 0.99, only about a 1% loss. At 2x, 1.20 × 0.80 = 0.96, about 4%. At 3x, 1.30 × 0.70 = 0.91, about 9% gone.",
          "Same chop, but the drag steepens from 1% → 4% → 9%. Bumping the multiplier just one notch from 2x to 3x more than doubles the loss. Even without any net direction, TQQQ quietly melts just from bouncing around. This effect compounds the more volatile the market and the longer you hold."
        ]
      },
      {
        "h": "Why recovering from a big drop is so hard",
        "paras": [
          "A −50% loss already needs a +100% gain just to break even — lose half and you have to double what's left to get back to square one. The problem is that a 3x product falls much deeper for the same index decline.",
          "For example, if the Nasdaq-100 crashes −20% in a day, TQQQ drops about −60%, and it would need +150% to recover. The deeper the fall, the exponentially longer the road back. Structurally, in a tech sell-off it's entirely possible to fall around 80% from the peak, and at that point getting back to breakeven can take years — or may never happen. And the past doesn't guarantee the future."
        ]
      },
      {
        "h": "Is it right for long-term accumulation and holding?",
        "paras": [
          "Some people approach TQQQ as 'I believe in the Nasdaq for the long haul, so I'll park it at 3x,' but because of the mechanics above, long-term buy-and-hold is hotly debated. Clip out only the stretches with a long uptrend and it looks spectacular — but the real test is whether you can survive the deep crashes and sideways drag in between. Its expense ratio is also higher than a 1x ETF, so costs stack up the longer you hold.",
          "Realistically, it's a product to consider only with a slice small enough that losing it won't shake your life, and only once you're truly prepared to weather big drops again and again. With the same contributions, the outcome splits to extremes depending on the luck of your start date. Shift the start date around in the calculator above, and the gap between the best and worst outcome for the very same plan shows up right there in the numbers."
        ]
      }
    ]
  },
  "QQQ": {
    "lead": "QQQ (Invesco QQQ Trust) is the flagship ETF that tracks the Nasdaq-100 at 1x, with no leverage. It holds the 100 largest non-financial companies on the Nasdaq, so tech names like Apple, Microsoft, and Nvidia carry heavy weight. Buy a single share and you effectively invest in roughly 100 large U.S. tech-heavy companies all at once.",
    "sections": [
      {
        "h": "What it means to hold the Nasdaq-100 at 1x",
        "paras": [
          "The Nasdaq-100 that QQQ tracks bundles 100 non-financial companies listed on the Nasdaq, weighted by market cap. Financials like banks and insurers are excluded, and that space is filled by growth-oriented tech, communications, and consumer companies. That's why it's nicknamed 'the tech index.'",
          "The key here is '1x (no leverage).' QLD amplifies the same index at 2x daily and TQQQ at 3x daily, but QQQ is built so that a 1% rise in the index is about a 1% rise, and a 1% drop about a 1% drop. With no amplifier, it avoids the 'volatility drag' that plagues leveraged ETFs (the erosion of value even in sideways markets, caused by daily resetting) — which makes it a far better fit for long-term holding."
        ]
      },
      {
        "h": "The volatility that comes with growth stocks",
        "paras": [
          "A heavy tilt toward tech and growth stocks is a double-edged sword. Expectations for new products and earnings get priced in quickly, so it tends to climb more steeply than the broad market in a rally — but for the same reason, it can fall deeper when rate hikes or slowdown fears surface.",
          "No leverage doesn't mean 'the price never moves.' Historically there have been several stretches where it fell tens of percent from a peak. If you're accumulating steadily, these downturns can actually be a chance to buy more shares with the same money — but you'll need the mental readiness to sit through periods when your balance dips below what you put in."
        ]
      },
      {
        "h": "How it differs from SPY (S&P 500)",
        "paras": [
          "Both are 1x ETFs holding leading U.S. companies, but their character differs. SPY holds 500 companies spread across 11 sectors — financials, energy, healthcare, and more — so it's more diversified, while QQQ excludes financials and concentrates in 100 tech-heavy companies.",
          "Put simply, QQQ is closer to 'a more aggressive, tech-concentrated pick,' and SPY to 'a steadier bet on the U.S. economy as a whole.' Which one did better varied by period. To see which would have fit your own accumulation window, just swap the ticker in the calculator and run it under the same conditions for a direct comparison."
        ]
      },
      {
        "h": "QQQ as a long-term accumulation target",
        "paras": [
          "Because it has no volatility drag, QQQ — unlike leveraged products — is well suited to 'hold-for-the-long-haul' dollar-cost averaging. Investing the same amount every month buys less when prices are high and more when they're low, smoothing your average cost, and this approach pairs especially well with a volatile growth index.",
          "That said, tech concentration is also a weakness — it means weaker diversification. If the tech sector as a whole struggles, QQQ struggles with it. The numbers in the result box above are computed from actual past prices, but they're still a simulation that assumes one specific start date, and past returns don't guarantee the future. It's best to weigh that — including how much the outcome shifts with your start date — and judge by your own standards."
        ]
      }
    ]
  },
  "SPY": {
    "lead": "SPY tracks the S&P 500 — an index of 500 large U.S. companies — and, first listed in 1993, it's one of the oldest and largest ETFs in the world. Its full name is the SPDR S&P 500 ETF Trust. The easy way to picture it: buy a single share of SPY and you're spreading a little money across 500 of America's leading companies. It's the core asset most often mentioned first when you want to slowly accumulate the whole U.S. market.",
    "sections": [
      {
        "h": "What is the S&P 500?",
        "paras": [
          "The S&P 500 is an index built from roughly 500 large companies listed on U.S. exchanges. It doesn't hold all 500 in equal amounts — the bigger a company (by market cap), the larger its weight. So giants like Apple and Microsoft carry an outsized influence.",
          "An important point: this list of 500 isn't fixed. Companies that fall below the bar are dropped and newly grown ones are added on a regular schedule. Thanks to that, if one company fails, the whole index isn't tied to its fate. Buy SPY and you ride this self-refreshing basket as a whole."
        ]
      },
      {
        "h": "Why it's 'less choppy' than QQQ",
        "paras": [
          "Even among large U.S. stocks, SPY and QQQ have different personalities. QQQ is tilted toward tech, whereas SPY is spread evenly across many sectors — tech, financials, healthcare, consumer, energy, and more. Because other sectors can cushion the blow when one falters, it's generally known to be less volatile than a tech-concentrated index.",
          "Of course, 'less choppy' absolutely does not mean 'won't fall.' SPY also drops hard when the whole market sinks in a bear market. But its defining feature is spreading broadly across the U.S. economy rather than staking its fate on a single sector."
        ]
      },
      {
        "h": "SPY as a long-term accumulation target",
        "paras": [
          "SPY isn't a leveraged product — it tracks the index at 1x. So it's largely free of the 'drag in sideways markets' (volatility loss) that hurts leveraged products like TQQQ and QLD. That's why it pairs well with dollar-cost averaging, where you steadily invest the same amount each month.",
          "One thing to weigh is cost. SPY's expense ratio is around 0.09% per year — a small slice skimmed from assets annually. That's slightly higher than some rivals tracking the very same index (VOO is about 0.03%), and over a long horizon with a large balance, a lower fee compounds in your favor. The numbers in the result box above are computed from actual past prices on a dividend-reinvested basis, so they reflect total return, not price alone."
        ]
      },
      {
        "h": "Handling your start date and expectations",
        "paras": [
          "Being the flagship U.S. index doesn't mean you get the same result no matter when you start. Whether you began accumulating right before a peak or right after a crash can make a real difference for the same fund. Dollar-cost averaging softens this luck-of-timing somewhat by automatically buying more when prices are cheap, but it doesn't erase it.",
          "Above all, the fact that it trended upward in the past does not guarantee future returns (past ≠ future). This article is for information, not investment advice. Even for the same SPY, the outcome splits depending on your start date, so it's safer to run several scenarios through the calculator — varying amount, horizon, and goal — before deciding for yourself."
        ]
      }
    ]
  },
  "VOO": {
    "lead": "VOO (Vanguard S&P 500 ETF) tracks the S&P 500 — 500 large U.S. companies — at 1x, with no leverage. Vanguard launched it in 2010, and while it holds the very same index as the older SPY, it differs in manager and fee. It's one of the most-mentioned tickers among long-term investors who want to accumulate the entire U.S. market month after month.",
    "sections": [
      {
        "h": "The S&P 500 that VOO holds",
        "paras": [
          "The S&P 500 bundles roughly 500 large companies listed on U.S. exchanges. It doesn't hold all 500 equally — the bigger a company (by market cap), the larger its weight — and companies that fall below the bar are dropped while newly grown ones are added on a regular schedule. Buy a single share of VOO and you're spreading a little money across this self-refreshing basket of leading U.S. companies.",
          "VOO tracks this index at '1x,' straight through. A 1% daily rise in the index is about a 1% rise, a 1% drop about a 1% drop. It has none of the 'volatility drag' that plagues leveraged products (QLD, TQQQ) — the erosion of value even in sideways markets caused by daily resetting — so its structure fits steady monthly accumulation well."
        ]
      },
      {
        "h": "How it differs from SPY — same index, different product",
        "paras": [
          "Because VOO and SPY hold the identical S&P 500, their returns are practically the same. The real differences are the manager (VOO is Vanguard, SPY is State Street) and the expense ratio. VOO's fee is about 0.03% per year, lower than SPY's (around 0.09%). Since the fee is skimmed from assets a little each year, the lower one is marginally better the longer and larger you invest.",
          "In exchange, SPY has a long history since its 1993 listing, with very high trading volume and liquidity and a well-developed options market. So a common view is to favor SPY for short-term trading and the lower-fee VOO for long-term accumulation. Either way, just remember the contents inside (the S&P 500) are the same."
        ]
      },
      {
        "h": "Dividends, reinvestment, and total return",
        "paras": [
          "The companies in the S&P 500 pay dividends, and VOO passes those along to shareholders (paid quarterly). Over the long run, what matters isn't the price chart alone but total return — price appreciation plus dividends. Reinvesting those dividends to buy more shares lets them compound, which can make a meaningful difference across many years.",
          "The numbers in the result box above are computed on a dividend-reinvested, adjusted-close basis, so they reflect total return rather than price alone. When you're comparing long-horizon accumulation, keep in mind that a fund's headline price gain and its total return are two different things — and it's the total return that lands in your account."
        ]
      },
      {
        "h": "As a long-term target, and your start date",
        "paras": [
          "With no leverage and broad diversification across 500 large U.S. companies, VOO is often cited as an easier long-term accumulation target to live with than individual stocks or leveraged products. Investing the same amount every month buys less when prices are high and more when they're low, smoothing your average cost — an approach it pairs well with.",
          "That said, 'less choppy' doesn't mean 'won't fall.' In a bear market where the whole market sinks, VOO drops hard too, and whether you started right before a peak or right after a crash changes the outcome for the same fund. The fact that it trended upward in the past doesn't guarantee the future, so it's safer to run it through the calculator yourself under various conditions — amount, horizon, and goal — before deciding."
        ]
      }
    ]
  },
  "SCHD": {
    "lead": "SCHD (Schwab U.S. Dividend Equity ETF) bundles about 100 high-quality U.S. companies that 'pay dividends consistently and well.' Charles Schwab launched it in 2011, and it tracks the Dow Jones U.S. Dividend 100 Index. Unlike the tech-growth-heavy Nasdaq-100, it leans toward sturdy companies with long dividend track records, making it a popular flagship for 'dividend growth' investing.",
    "sections": [
      {
        "h": "What kind of companies does SCHD pick?",
        "paras": [
          "The Dow Jones U.S. Dividend 100 Index that SCHD tracks doesn't hold just any company simply because it has a high dividend yield. First it narrows the field to companies that have paid dividends consistently for at least 10 years, then selects about 100 by weighing financial health — like debt relative to cash flow and return on equity (ROE) — alongside dividend yield and five-year dividend growth. In other words, it picks companies that can 'pay healthily for a long time,' not just those that 'pay a lot.'",
          "As a result, its sector mix looks quite different from the Nasdaq-100. Tech weight is low; instead, so-called 'value and dividend' companies in industrials, financials, healthcare, consumer staples, and energy take up big positions. Think of it as a different-flavored basket of the same U.S. stock market."
        ]
      },
      {
        "h": "What 'dividend growth' means, and the payout schedule — it's not monthly",
        "paras": [
          "Dividend growth refers to companies that have raised their dividend a little each year. Being able to keep raising dividends is read as a sign that profits are growing steadily, which is why it's cited as SCHD's core appeal.",
          "To clear up a common misconception: SCHD is not a 'monthly dividend' ETF — it pays dividends every three months (quarterly). The mix-up tends to arise because people build monthly-income portfolios by combining several ETFs that pay in different months. The dividend yield varies by period but is generally higher than the S&P 500 average, and this site's backtest is computed on a dividend-reinvested adjusted-close basis (assuming dividends received are used to buy more shares)."
        ]
      },
      {
        "h": "How it differs from growth indexes (QQQ, S&P 500)",
        "paras": [
          "In stretches where tech leads the market — like much of the past decade or so — SCHD's total return lagged QQQ or the S&P 500 in many periods. You can see this in the result box above, where its final balance often comes out lower than growth or leveraged tickers. That's because, in choosing dividends and lower volatility, it gives up some of the explosive price appreciation.",
          "In exchange, its drawdowns in a decline tend to be relatively shallow, its volatility lower, and it delivers a steady cash flow from dividends. In short, SCHD leans toward 'getting paid dividends while shaking less' rather than 'earning more.' Which one is better varied by person and by period, so it's best to compare them in the calculator by swapping only the ticker under the same conditions."
        ]
      },
      {
        "h": "A note on taxes",
        "paras": [
          "How dividends and capital gains are taxed depends entirely on your country of residence and your personal situation — the rules, rates, and any withholding differ from place to place. This isn't tax advice, and there's no single rate that applies to everyone, so it's worth checking with a local tax professional before treating dividends as a reason to hold SCHD.",
          "One thing to keep in mind about the numbers here: this site's results are pre-tax, computed on a dividend-reinvested adjusted-close basis (assuming dividends are used to buy more shares). If you actually take dividends as cash, your after-tax outcome can differ from what's shown. This article is for information, not investment advice, and past returns don't guarantee the future."
        ]
      }
    ]
  },
  "VT": {
    "lead": "VT (Vanguard Total World Stock ETF) does exactly what its name says — it holds the whole world's stock market in a single basket. Vanguard launched it in 2008, and it holds thousands of stocks across developed and emerging markets: the U.S., of course, plus Europe, Japan, and emerging economies. It's the ultimate diversifier, and it fits the mindset of 'I don't know which country will rise, so I'll just own the entire world.'",
    "sections": [
      {
        "h": "What's inside a single share of VT",
        "paras": [
          "VT tracks the FTSE Global All Cap Index. It spans developed and emerging markets and includes everything from large caps down to small caps, so the number of holdings runs into the thousands. Buy a single share and you effectively invest a little in 'the entire global stock market.'",
          "Spreading this widely sharply reduces the risk of staking your fate on any one country, sector, or company. If one region's economy struggles, another can pick up the slack. And since it's a 1x product with no leverage, there's no volatility-drag worry either."
        ]
      },
      {
        "h": "It says 'whole world,' but the U.S. is over half",
        "paras": [
          "Here's an easy point to misread. Because VT holds each country's stocks by market-cap weight, the U.S. — the world's largest market — occupies the biggest slot, around 60%. The rest is divided among Europe, Japan, China, and other emerging markets.",
          "So VT isn't 'the whole world minus the U.S.' — it's closer to 'the whole world with a big helping of the U.S.' When U.S. markets were strong, VT rode that tailwind heavily; conversely, when the U.S. lags, it can behave more defensively than a U.S.-concentrated fund."
        ]
      },
      {
        "h": "The trade-off versus U.S. concentration (SPY, QQQ)",
        "paras": [
          "Over the past decade or so, the U.S. and tech stocks led global equities. So looking at that same window, VT's total return lagged the S&P 500 or the Nasdaq-100 in many stretches, and that gap shows up in the result box above too. Choosing VT means giving up some of the excess return from a single country (the U.S.) in exchange for spreading widely the risk of not knowing which region will lead.",
          "This diversification is a bit like an insurance premium. Which country pulls ahead has shifted from era to era, and there's no guarantee U.S. dominance lasts forever. Whether to concentrate in one market to aim for more, or spread across the whole world for peace of mind, comes down to your own temperament and judgment."
        ]
      },
      {
        "h": "Total return, long-term accumulation, and your start date",
        "paras": [
          "With VT, the return that matters over the long run isn't the price chart alone but total return — price appreciation plus the dividends its thousands of holdings pay. The numbers in the result box above are computed on a dividend-reinvested, adjusted-close basis, so they reflect that total return rather than price alone. Remember that the holdings span the entire globe even though it trades as one simple fund.",
          "As a broadly diversified 1x product with no leverage, VT fits dollar-cost averaging well — but betting on the whole world doesn't let you dodge bear markets. When global equities sink together, VT sinks with them, and the outcome changes depending on your start date. The past doesn't guarantee the future, so run it through the calculator yourself under various conditions before deciding. This content is for information, not investment advice."
        ]
      }
    ]
  }
};
