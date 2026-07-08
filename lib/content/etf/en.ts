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
  },
  "SOXX": {
    "lead": "SOXX (iShares Semiconductor ETF) bundles around 30 U.S.-listed semiconductor companies. Manager iShares (BlackRock) launched it in 2001, and it tracks the ICE Semiconductor Index. It holds everything from chipmakers building data-center and AI chips — Nvidia, Broadcom, Qualcomm, AMD — to the equipment and materials companies that support them, making it a concentrated bet on the health of the semiconductor industry.",
    "sections": [
      {
        "h": "A concentrated bet on the entire semiconductor industry",
        "paras": [
          "SOXX narrows the field down to roughly 30 U.S.-listed semiconductor companies. Compared with QQQ (the Nasdaq-100's 100 non-financial large caps) or a broader information-technology ETF, it's a much narrower basket concentrated in a single industry. That means it tends to climb far more steeply than the market average when the semiconductor cycle is strong — and fall just as hard when it turns.",
          "Its holdings span the whole chip supply chain: companies that design and manufacture semiconductors directly (Nvidia, AMD, Qualcomm, and others), plus the companies that supply the equipment and materials needed to make those chips (Applied Materials, Lam Research, and others). You're spread across several links of the same chain, but the outcome still hinges on one big variable — the health of the semiconductor industry as a whole."
        ]
      },
      {
        "h": "The AI boom and extreme concentration",
        "paras": [
          "Over the past few years, the boom in AI server and data-center spending has driven up the share prices of related chip companies so much that a handful of names now make up a noticeably larger slice of SOXX. Because the index weights holdings by market cap, the price action of just a few companies now drives a bigger share of SOXX's overall performance.",
          "That concentration cuts both ways. If those companies keep performing well, SOXX rises sharply right along with them — but if disappointing news hits even a few of them, the whole fund can swing hard. It's worth remembering that what feels like 'diversified exposure to semiconductors' can, in practice, be heavily concentrated in just a handful of names."
        ]
      },
      {
        "h": "Semiconductors are a cyclical industry",
        "paras": [
          "The semiconductor industry has traditionally been described as a 'cyclical industry,' where supply and demand swing on a multi-year rhythm. Smartphone and PC replacement cycles, data-center buildouts, and automotive chip demand overlap and diverge over time, producing repeated booms and busts — and SOXX's share price has swung sharply along with each one.",
          "Nobody can guarantee how long the current AI-driven demand will stretch this cycle. Given that past semiconductor booms didn't last forever either, it's more realistic to approach SOXX as 'a bet on a highly volatile industry cycle' than as 'an asset that steadily grinds upward.'"
        ]
      },
      {
        "h": "Taxes and your start date",
        "paras": [
          "SOXX is a U.S.-listed ETF, so as a USD investor there's no currency conversion to think about the way there would be investing from abroad — your results are already in dollars. What does matter is cost and taxes: how capital gains and any distributions are taxed depends entirely on your country of residence and personal situation, so it's worth checking with a local tax professional rather than assuming one flat rate applies. This isn't tax advice.",
          "Because SOXX is so volatile, the outcome can differ sharply depending on when you start. Beginning near the tail end of a boom versus near the bottom of a downturn can produce wildly different results even over the same accumulation period. Past performance doesn't guarantee the future, so it's worth comparing several different start dates yourself in the calculator above. This article is for information, not investment advice."
        ]
      }
    ]
  },
  "VGT": {
    "lead": "VGT (Vanguard Information Technology ETF) holds hundreds of companies in the U.S. information-technology sector. Vanguard launched it in 2004, and it tracks the MSCI US IMI Information Technology Index. It ranges from mega-cap tech names like Apple, Microsoft, and Nvidia to software, semiconductor, and IT-services companies — broader than SOXX but narrower in sector scope than QQQ, making it a 'tech-sector specialist' ETF.",
    "sections": [
      {
        "h": "Hundreds of holdings, but a handful of names lead the way",
        "paras": [
          "VGT holds hundreds of information-technology companies spanning semiconductors, software, hardware, and IT services, so by name alone it sounds broadly diversified. But because it's weighted by market cap, a handful of mega-caps — Apple, Microsoft, Nvidia — make up a large share of total assets. Plenty of tickers, but the actual moves are driven largely by a few companies at the top.",
          "That also means significant overlap with QQQ (the Nasdaq-100). The difference is that QQQ mixes in communications and consumer names alongside tech, while VGT is narrowed strictly to the information-technology sector — making it even more concentrated in tech than QQQ."
        ]
      },
      {
        "h": "How it differs from SOXX and QQQ",
        "paras": [
          "Where SOXX concentrates on a single industry — semiconductors — VGT spans the broader information-technology sector, including software, cloud, and IT services alongside chips. So it's more diversified within the sector than SOXX, but it shares the same limitation of sitting inside one big theme: 'tech stocks.'",
          "Compared with QQQ, VGT is narrowed strictly to information technology, so it skips the communications and consumer mega-caps that sit inside the Nasdaq-100. The result is something closer to a 'pure' tech-sector index than QQQ — and correspondingly more exposed when the tech sector as a whole wobbles."
        ]
      },
      {
        "h": "The price of concentration — bigger gains, bigger drops",
        "paras": [
          "The information-technology sector has been a leading driver of U.S. market gains over roughly the past decade, and VGT has often outperformed the broader market riding that wave. But that's the payoff for concentrating in one sector — there's no guarantee the same trend continues going forward.",
          "During rate-hike periods or whenever concerns about tech valuations flare up, VGT has tended to fall more deeply than the market average. Even though it looks diversified on paper, it's still concentrated in a single theme — tech — which sets it clearly apart from broadly diversified products like SPY or VT."
        ]
      },
      {
        "h": "If you're accumulating steadily",
        "paras": [
          "VGT is a U.S.-listed ETF, so as a USD investor you don't need to think about currency conversion — your gains and losses are already denominated in dollars. What you should weigh instead is cost, and how capital gains taxes apply to you: the rules depend entirely on your country of residence, so it's worth checking with a local tax professional rather than assuming a single rate applies to everyone.",
          "The more volatile an asset, the more dollar-cost averaging's 'buy more when it's cheap' effect can work in your favor — but if your start date happens to be a bad one, you may have to sit through a long stretch below your cost basis. Past returns don't guarantee the future, so it's worth checking this yourself by varying the start date in the calculator."
        ]
      }
    ]
  },
  "VNQ": {
    "lead": "VNQ (Vanguard Real Estate ETF) bundles around 150 U.S.-listed real estate investment trusts (REITs). Vanguard launched it in 2004, and it tracks the MSCI US REIT Index. It spreads your money across companies that own and operate warehouses, data centers, commercial properties, and residential real estate, making it one of the most common ways to get diversified real estate exposure without buying property directly.",
    "sections": [
      {
        "h": "What is a REIT?",
        "paras": [
          "A REIT pools money from many investors to buy commercial real estate, then distributes the rental income it collects as dividends. Under U.S. tax law, a REIT must distribute at least 90% of its taxable income as dividends to qualify for favorable tax treatment, so REITs structurally tend to pay out a large share of income. VNQ bundles dozens to hundreds of these REITs into one fund.",
          "The types of real estate involved vary widely too — logistics centers, telecom infrastructure (cell towers), data centers, shopping malls, apartments, and even hospitals and care facilities are all represented, so you're spread across several categories of real estate business rather than betting on any single type of property."
        ]
      },
      {
        "h": "Unusually sensitive to interest rates",
        "paras": [
          "REITs rely heavily on borrowed money to buy property, so when interest rates rise, higher interest costs and less attractive new investments tend to weigh on share prices. When rates fall, the opposite tends to happen and it's often a tailwind for share prices. That's why VNQ tends to react more sharply to interest-rate news than most other U.S. equity ETFs.",
          "Because of this, VNQ carries a bit of a dual personality — it's a stock, but it behaves somewhat like a bond. It's an asset you might hold for a steady cash flow from dividends (rental income), while also knowing that the share price itself can swing quite a bit depending on the rate environment."
        ]
      },
      {
        "h": "Similar to SCHD, but different — a dividend asset",
        "paras": [
          "SCHD holds quality companies across many sectors that have steadily raised dividends; VNQ concentrates purely on the real estate (REIT) sector. The nature of the dividend differs too. SCHD's dividends come out of corporate profits, while REITs are legally required to distribute most of their income, which is why REIT dividend yields often run higher.",
          "A higher dividend yield doesn't always mean better total return (price change plus dividends), though. There have been stretches when VNQ's total return trailed SPY's or SCHD's. It's best suited to investors who understand and have conviction in real estate as a specific asset class."
        ]
      },
      {
        "h": "Taxes and accumulating steadily",
        "paras": [
          "How dividends and capital gains are taxed depends entirely on your country of residence and personal situation — the rules, rates, and any withholding differ from place to place. This isn't tax advice, so it's worth checking with a local tax professional rather than assuming one rate applies to everyone. One thing to note about the numbers here: this site's results are pre-tax, computed on a dividend-reinvested adjusted-close basis, so your actual after-tax outcome can differ if you take dividends as cash instead of reinvesting them.",
          "Because VNQ swings with both the real-estate cycle and the interest-rate cycle, results can differ sharply depending on when you start accumulating. Past returns don't guarantee the future, so it's worth comparing different start dates yourself in the calculator. This article is for information, not investment advice."
        ]
      }
    ]
  },
  "GLD": {
    "lead": "GLD (SPDR Gold Shares) gives you the effect of investing in physical gold. State Street launched it in 2004, and it tracks the spot price of gold through a trust that actually holds gold bars in storage. It's not a stock — it's a commodity (gold) product — which makes it fundamentally different in character from the other tickers on this site.",
    "sections": [
      {
        "h": "GLD is a claim on a gold vault, not a company",
        "paras": [
          "Buy one share of GLD and you effectively own a claim on a slice of the gold bars sitting in a vault. Unlike a stock ETF that tracks an index, GLD's value has nothing to do with any company's earnings or growth — it moves purely with the international price of gold. That also means no dividends and no interest, because gold itself is an asset that doesn't generate any yield.",
          "Storage and management costs are reflected the way any expense ratio is — a small amount skimmed from assets each year. The core appeal of GLD is that you can buy and sell it just like a stock, without the hassle of buying and storing physical gold yourself."
        ]
      },
      {
        "h": "Why hold gold in a portfolio at all",
        "paras": [
          "Gold has traditionally been seen as an asset with low correlation to stocks and bonds. Money tends to flow into gold when equity markets get shaky or confidence in currencies wavers, which is why it's often described as 'resilient in a crisis' or 'a hedge against inflation.'",
          "That correlation isn't constant, though. Depending on interest rates, dollar strength, and market sentiment, gold has fallen alongside stocks at times, and it's also had long stretches of going essentially nowhere. Rather than relying on a simple formula like 'gold always rises when stocks fall,' it's more realistic to treat it as a supporting asset you hold for diversification."
        ]
      },
      {
        "h": "Not a growth asset — a value-preservation asset",
        "paras": [
          "Stock ETFs like SPY and QQQ are built around the expectation that a company's assets grow in value over the long run as it earns profits and expands. Gold doesn't create new value the same way — its price is set by its scarcity and by shifting demand and sentiment. Over very long horizons, that's meant gold has often trailed stocks in return.",
          "That character can show up in the numbers in the result box above too. It helps to understand gold less as 'an asset for growing your money significantly' and more as 'an asset for smoothing out the swings in your overall portfolio.'"
        ]
      },
      {
        "h": "Taxes, accumulating, and a few things to keep in mind",
        "paras": [
          "GLD is a U.S.-listed ETF, and how capital gains on it are taxed depends entirely on your country of residence and personal situation — this isn't tax advice, so it's worth checking with a local tax professional. Because GLD pays no dividends, there's no dividend tax to worry about, but keep in mind the entire price gain is treated as a capital gain when you sell.",
          "Since GLD is priced in dollars, as a USD investor there's no currency conversion involved — the price of gold itself is what matters. And if your goal is to grow your wealth over time, it's far more common to hold a small slice of gold alongside stock-based assets for diversification than to accumulate in gold alone. Past returns don't guarantee the future; this article is for information, not investment advice."
        ]
      }
    ]
  },
  "TLT": {
    "lead": "TLT (iShares 20+ Year Treasury Bond ETF) holds only U.S. Treasury bonds with more than 20 years left to maturity. iShares (BlackRock) launched it in 2002, investing in ultra-long-term bonds issued by the U.S. government. It's a bond product, not a stock, so its risk profile is fundamentally different from the other tickers on this site.",
    "sections": [
      {
        "h": "Bond ETFs are a 'lend money, collect interest' asset",
        "paras": [
          "A Treasury bond is a certificate the government issues when it borrows money — it pays interest over a set period and repays the principal at maturity. TLT holds only U.S. Treasuries with 20-plus years left until maturity, and it passes the interest it collects along to shareholders as a monthly distribution.",
          "U.S. Treasuries are considered among the highest-credit-quality bonds in the world, so default risk is low. But as explained below, that absolutely does not mean the price doesn't move."
        ]
      },
      {
        "h": "The longer the maturity, the more sensitive to rates",
        "paras": [
          "Bond prices move opposite to prevailing interest rates. When rates rise, older bonds paying lower interest become less attractive and their prices fall; when rates fall, prices rise. This sensitivity grows with maturity, and since TLT holds only ultra-long-term bonds (20+ years), its price reacts especially strongly.",
          "That's why, despite the 'safe asset' label, TLT's share price can actually be quite volatile. There have been periods when central banks raised rates quickly and TLT fell nearly as sharply as stocks. Approaching it with a simple 'Treasuries equal safe' mindset can leave you surprised by these swings."
        ]
      },
      {
        "h": "The 'moves opposite stocks' rule doesn't always hold",
        "paras": [
          "Bonds have traditionally been seen as moving opposite stocks, which helps stabilize a portfolio: when the economy weakens and stocks fall, central banks cut rates, and bond prices rise in response.",
          "But that relationship can break down during periods when rates need to rise to fight inflation. There have been stretches when surging inflation pushed rates up sharply, and stocks and TLT fell together — the 'diversification effect' didn't work as expected. It's worth knowing that TLT can behave this way in certain environments."
        ]
      },
      {
        "h": "Taxes, allocation, and this calculator",
        "paras": [
          "How capital gains and interest distributions are taxed depends entirely on your country of residence and personal situation — this isn't tax advice, so check with a local tax professional rather than assuming a single rate applies. One note on the numbers here: this site's results are pre-tax, computed on an interest-reinvested adjusted-close basis, so your actual after-tax outcome can differ.",
          "TLT is usually held less for long-term price appreciation the way stock ETFs are, and more to manage a portfolio's overall volatility or as a bet on falling rates. The result of accumulating in TLT alone in this calculator is just a simulation of one specific past period, and bonds too can produce very different outcomes depending on your start date. This article is for information, not investment advice."
        ]
      }
    ]
  },
  "AGG": {
    "lead": "AGG (iShares Core U.S. Aggregate Bond ETF) spreads your money broadly across the entire U.S. bond market. iShares (BlackRock) launched it in 2003, and it holds thousands of investment-grade bonds — U.S. Treasuries, government-agency bonds, corporate bonds, and mortgage-backed securities (MBS). Where TLT concentrates only in ultra-long-term Treasuries, AGG is closer to a 'bond-market index fund,' mixing maturities and bond types evenly.",
    "sections": [
      {
        "h": "A 'core' asset that covers the whole bond market",
        "paras": [
          "The Bloomberg U.S. Aggregate Bond Index that AGG tracks spans a wide range of investment-grade bonds issued in the U.S. — Treasuries, corporate bonds, government-agency debt, and mortgage-backed securities. Maturities range from short to long, so it's not concentrated in any single maturity or type of issuer.",
          "Because of that broad composition, AGG is often called a portfolio's 'core' bond holding. Instead of picking individual bonds one by one, a single position in AGG gives you diversified exposure across the entire U.S. bond market."
        ]
      },
      {
        "h": "Why it swings less than TLT — shorter average maturity",
        "paras": [
          "The average maturity (more precisely, duration) of the bonds in AGG is much shorter than TLT's 20-plus years. As explained earlier, longer maturities react more sharply to rate changes, so AGG — which mixes in shorter-maturity bonds too — tends to move less than TLT does when rates rise or fall.",
          "That doesn't mean its price never moves, though. During periods of rapid rate change, AGG moves too, and it's had unusually large drawdowns for a bond fund during periods when rates rose sharply. Still, the magnitude has generally been milder than TLT's."
        ]
      },
      {
        "h": "Its role alongside stocks",
        "paras": [
          "AGG is commonly held alongside stock assets like SPY or QQQ to lower a portfolio's overall volatility — the idea being that when stocks swing hard, bonds move less, or in the opposite direction, and act as a cushion.",
          "But just like TLT, that cushioning effect can weaken during periods when rates need to rise quickly to fight inflation, since stocks and bonds can fall together. Rather than assuming 'holding bonds means you're automatically safe,' it's worth remembering that the size of the diversification benefit can vary with conditions."
        ]
      },
      {
        "h": "Taxes and what this means for the calculator",
        "paras": [
          "AGG is also a U.S.-listed ETF, and how capital gains and interest distributions are taxed depends entirely on your country of residence — this isn't tax advice, so check with a local tax professional. This site's results are pre-tax, computed on an interest-reinvested adjusted-close basis.",
          "Bond assets generally carry lower long-term expected returns than stocks, so accumulating in AGG alone toward a big long-term goal will typically take much longer than it would with stock assets like SPY or QQQ. You can see this difference directly by comparing tickers side by side in the calculator above. This article is for information, not investment advice."
        ]
      }
    ]
  },
  "JEPI": {
    "lead": "JEPI (JPMorgan Equity Premium Income ETF) is an actively managed 'covered call' ETF that invests in large U.S. stocks while also selling options for extra monthly income. J.P. Morgan Asset Management launched it in May 2020, combining a basket of lower-volatility, high-quality stocks with S&P 500-linked options selling to pursue a high monthly distribution. On this site, the pre-listing period for JEPI (before May 2020) isn't real JEPI data — it's synthetic data spliced together using the CBOE S&P 500 BuyWrite Index (BXM) as a proxy, so please read the notes below carefully.",
    "sections": [
      {
        "h": "Covered calls — selling upside for cash",
        "paras": [
          "A covered call means selling a 'call option' on stock you already own — a promise to sell it at a set price or higher to another investor if it's exercised. In exchange, you collect an option premium (a fee) immediately, and that premium is the core source of JEPI's high monthly distribution.",
          "It's not free, though. If the stock price rises well above the agreed price, that extra gain goes to whoever bought the option, and JEPI misses out on it. In other words, JEPI gives up some of the 'room to run big' in exchange for a steady stream of cash (the premium)."
        ]
      },
      {
        "h": "What sets JEPI apart — active stock-picking plus an ELN structure",
        "paras": [
          "JEPI isn't as simple as writing options against the S&P 500 itself. First, J.P. Morgan actively selects a basket of low-volatility, stable large-cap U.S. stocks using its own criteria, then layers on S&P 500-linked options-selling exposure through a financial instrument called an ELN (equity-linked note).",
          "Combining active stock selection with derivatives makes it more complex than a simple 'options wrapper on the S&P 500.' The portfolio's composition can also shift somewhat based on market conditions and the managers' judgment, which sets it apart from an index-tracking ETF like SPY."
        ]
      },
      {
        "h": "The pre-listing period is an approximation — please read this",
        "paras": [
          "JEPI listed in May 2020, so it has just over five years of real trading data. To show a longer backtest, this site scales the CBOE S&P 500 BuyWrite Index (BXM, which dates back to 1988) to JEPI's listing-day price and splices it in for the period before that.",
          "But BXM is a simple index that mechanically sells call options against the entire S&P 500, while JEPI, as explained above, uses an actively chosen low-volatility basket and an ELN structure. Both strategies fall under the broad umbrella of 'covered calls,' but the details differ, so results for the pre-listing period are only a rough approximation of 'what JEPI might have looked like had it existed' — actual JEPI performance can differ. This caveat is also shown alongside the calculator's results."
        ]
      },
      {
        "h": "Monthly income, and its edge in a flat market",
        "paras": [
          "JEPI's biggest feature is its monthly distribution. The yield varies with market volatility, but it's generally been known to run well above a typical S&P 500 ETF's — which is why it's popular with retirees and investors who want regular cash flow.",
          "In periods when prices move sideways or drift gently, the option premium acts as a cushion, and total return can beat a plain index product like SPY. In periods when the market rallies hard, though, giving up part of the upside tends to make JEPI lag SPY. You can see this difference by comparing the numbers in the result box above side by side with SPY."
        ]
      },
      {
        "h": "Taxes and accumulating steadily",
        "paras": [
          "How capital gains and monthly distributions are taxed depends entirely on your country of residence and personal situation — this isn't tax advice, so it's worth checking with a local tax professional. Since distributions make up a large share of JEPI's return, it's worth factoring in your after-tax take, not just the headline yield.",
          "Given the limits of the synthetic data described above, JEPI's long-run backtest results should be read more cautiously than tickers with a full history of real data. This article is for information, not investment advice, and past returns — including the estimated portion — don't guarantee the future."
        ]
      }
    ]
  },
  "JEPQ": {
    "lead": "JEPQ (JPMorgan Nasdaq Equity Premium Income ETF) applies the same covered-call strategy as JEPI, but benchmarked to the Nasdaq-100 instead of the S&P 500. J.P. Morgan Asset Management launched it in May 2022, combining a basket of lower-volatility tech-heavy stocks with Nasdaq-100-linked options selling to pay a monthly distribution. Because the Nasdaq-100 itself is more volatile, JEPQ's option premiums — and its distribution yield — tend to run higher than JEPI's.",
    "sections": [
      {
        "h": "JEPI's Nasdaq counterpart",
        "paras": [
          "JEPQ's basic structure mirrors JEPI's: it actively selects lower-volatility stocks, then layers on an options-selling position to add premium income. The difference is the benchmark — JEPI uses the S&P 500, while JEPQ uses the tech-heavy Nasdaq-100.",
          "As covered earlier with QQQ, the Nasdaq-100 is more volatile than the S&P 500. The more volatile the underlying, the bigger the option premium tends to be, which is why JEPQ's distribution yield often runs higher than JEPI's."
        ]
      },
      {
        "h": "The price of a higher yield — a tighter cap on gains",
        "paras": [
          "A bigger premium also means offering more favorable terms to the option buyer (like a lower strike price). So in stretches when the Nasdaq-100 rallies hard, JEPQ gives up considerably more upside than QQQ does. With a covered-call strategy, 'high income' and 'big upside potential' are hard to have at the same time.",
          "On the flip side, when tech stocks move sideways or pull back, the premium collected each month can help offset some of the decline. In that sense, JEPQ is less a directional bet on the Nasdaq-100 and more a strategy for converting its volatility into cash flow."
        ]
      },
      {
        "h": "A short listing history — and why it wasn't synthesized",
        "paras": [
          "JEPQ listed in May 2022, so the data available on this site spans just a bit over three years. For JEPI, the CBOE S&P 500 BuyWrite Index (BXM) goes back to 1988, which made it possible to splice in an approximated pre-listing period. But a reliable long-term Nasdaq-100 covered-call index doesn't exist, so this site didn't create synthetic data for JEPQ.",
          "As a result, JEPQ's backtest window is much shorter than the other tickers on this site. It's too early to draw conclusions about 'what a long-term accumulation would look like' from just a few years of results. Keep in mind that a short window can be disproportionately shaped by a single bull or bear stretch."
        ]
      },
      {
        "h": "Taxes and what to weigh when judging this one",
        "paras": [
          "JEPQ is also a U.S.-listed ETF, and how capital gains and monthly distributions are taxed depends entirely on your country of residence and personal situation — this isn't tax advice, so check with a local tax professional. Since distributions make up a large share of the return here too, it's worth looking at your after-tax take alongside the headline yield.",
          "Between the Nasdaq-100's volatility and JEPQ's short listing history, its backtest results deserve even more caution than the other tickers on this site. This article is for information, not investment advice, and past returns — over a short window at that — don't guarantee the future."
        ]
      }
    ]
  }
};
