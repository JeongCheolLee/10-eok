export const ETF_EN: Record<string, { lead: string; sections: { h: string; paras: string[] }[] }> = {
  "QLD": {
    "lead": "QLD (ProShares Ultra QQQ) seeks twice the daily performance of the Nasdaq-100, before fees and expenses. Its target applies to one trading day, not to the return over an entire holding period.",
    "sections": [
      {
        "h": "How the daily target works",
        "paras": [
          "QLD uses financial instruments, including derivatives, to obtain leveraged exposure. The fund adjusts that exposure as its value changes; buying one share does not simply mean owning two shares of QQQ."
        ]
      },
      {
        "h": "Compounding changes the result",
        "paras": [
          "In a hypothetical two-day example, an index gains 10% then loses 9.09%, returning roughly to its starting value. A daily 2x product gains 20% then loses 18.18%, leaving about 98.2 from an initial 100, before costs.",
          "A sustained trend can produce a different effect. Both the size and the sequence of daily returns matter, so a long-term result cannot be calculated by doubling the index's cumulative return."
        ]
      },
      {
        "h": "Reading an accumulation result",
        "paras": [
          "Regular purchases change the number of shares bought on each date; they do not change QLD's daily leverage or remove losses on shares already held. Financing, fund expenses, and tracking differences also affect its historical price."
        ]
      }
    ]
  },
  "TQQQ": {
    "lead": "TQQQ (ProShares UltraPro QQQ) seeks three times the daily performance of the Nasdaq-100, before fees and expenses. It tracks the same benchmark as QLD, with a larger daily multiplier.",
    "sections": [
      {
        "h": "A daily objective",
        "paras": [
          "The 3x objective is reset daily. A 10% gain in the index over a month does not imply a 30% gain in TQQQ: the intervening daily moves and costs affect the result."
        ]
      },
      {
        "h": "A hypothetical comparison",
        "paras": [
          "If an index rises 10% and then falls 10%, an initial 100 becomes 99. Ignoring costs, daily 2x exposure leaves 96 and daily 3x exposure leaves 91. The index itself also loses value in this example.",
          "Recovery percentages use the smaller remaining balance. A 50% loss requires a 100% gain to recover; a 75% loss requires a 300% gain. These are arithmetic examples, not forecasts of a particular market decline."
        ]
      },
      {
        "h": "What recurring purchases change",
        "paras": [
          "New contributions buy shares at later prices, but cannot reverse the leverage mechanics affecting existing shares. A historical target crossing may be followed by a large decline, which is why first crossing and the later balance need to be read separately."
        ]
      }
    ]
  },
  "QQQ": {
    "lead": "QQQ (Invesco QQQ Trust) tracks the Nasdaq-100 without a daily leverage multiplier. The index selects large non-financial companies listed on Nasdaq; it is neither the whole U.S. market nor a pure technology-sector index.",
    "sections": [
      {
        "h": "What the index includes",
        "paras": [
          "The Nasdaq-100 includes information technology alongside other non-financial sectors. Its weighting rules give larger companies substantial influence, so holding many companies does not imply equal exposure to each."
        ]
      },
      {
        "h": "Compared with SPY and QLD",
        "paras": [
          "SPY tracks the S&P 500, whose eligibility rules and sector coverage differ. QLD targets 2x the Nasdaq-100's daily return, whereas QQQ has no such leverage objective. Costs and tracking differences can still make QQQ's return differ from its benchmark."
        ]
      },
      {
        "h": "Compounding and regular purchases",
        "paras": [
          "An unleveraged fund can also lose through compounded up-and-down returns. QQQ avoids the additional daily leverage reset, not the arithmetic of compounding.",
          "At a fixed contribution amount, falling prices buy more shares. Those shares still lose value if prices continue falling; a lower average purchase price is not a guarantee of a positive return."
        ]
      }
    ]
  },
  "SPY": {
    "lead": "SPY (SPDR S&P 500 ETF Trust) tracks the S&P 500. Launched in 1993, it provides exposure to large U.S. companies across multiple sectors through an exchange-traded trust.",
    "sections": [
      {
        "h": "Broad exposure has limits",
        "paras": [
          "The S&P 500 weights companies principally by float-adjusted market capitalization. Sector weights are not equal, and the index does not cover every U.S. company or the global stock market. Membership changes under the index provider's rules."
        ]
      },
      {
        "h": "Same benchmark, different funds",
        "paras": [
          "SPY and VOO follow the same index, but their fund structures, expenses, trading spreads, and tracking can differ. A shared benchmark does not make their realized returns exactly identical. Current fees belong in the issuer's documents rather than a timeless comparison."
        ]
      },
      {
        "h": "Price and distributions",
        "paras": [
          "Distributions contribute to total return. Reinvesting them and taking them as cash create different share counts and cash flows; the calculator's selected dividend assumption determines the simulation.",
          "SPY has no daily leverage target. It remains exposed to broad equity declines, and diversification across sectors does not protect the invested amount from loss."
        ]
      }
    ]
  },
  "VOO": {
    "lead": "VOO (Vanguard S&P 500 ETF) tracks the S&P 500 without leverage. It shares a benchmark with SPY, but is a separate fund with its own trading history and operating costs.",
    "sections": [
      {
        "h": "What it tracks",
        "paras": [
          "The S&P 500 covers large U.S. companies across sectors. Market-cap weighting means larger companies exert greater influence; it is not an equal-weight portfolio and does not include the entire U.S. stock market."
        ]
      },
      {
        "h": "Why similar funds can differ",
        "paras": [
          "Fund expenses, how cash and distributions are handled, and tracking differences affect returns. Investors also encounter a market price and bid-ask spread when trading, which a closing-price simulation does not reproduce in full."
        ]
      },
      {
        "h": "History and reinvestment",
        "paras": [
          "VOO's own trading history begins in 2010. Earlier S&P 500 history is not an actual VOO holding record. A comparison should distinguish the benchmark's history from the ETF's available data.",
          "Reinvested distributions increase the simulated share count. They do not add a separate guaranteed return: the fund price can decline, and actual taxes or execution costs can change the outcome."
        ]
      }
    ]
  },
  "SCHD": {
    "lead": "SCHD (Schwab U.S. Dividend Equity ETF) tracks the Dow Jones U.S. Dividend 100 Index. Its selection process considers dividend history and financial measures, rather than simply choosing the highest current yields.",
    "sections": [
      {
        "h": "What the dividend screen means",
        "paras": [
          "The index combines dividend-related criteria with measures such as profitability and cash flow relative to debt. The resulting sector mix can differ substantially from a broad-market index. The screen is a selection rule, not a promise that future dividends will grow."
        ]
      },
      {
        "h": "Distributions and total return",
        "paras": [
          "SCHD distributes dividends quarterly rather than monthly. The amount can change. A distribution is part of an investment's total return alongside price changes; a high yield alone cannot establish that the investment made more money."
        ]
      },
      {
        "h": "How to read the comparison",
        "paras": [
          "Dividend reinvestment matters when comparing SCHD with a fund whose return comes more from price changes. Keep that assumption and the calculation period consistent.",
          "A dividend focus does not eliminate equity risk. Companies can reduce payouts, and both the fund's price and its distributions can fall. The simulation does not reproduce every investor's tax treatment."
        ]
      }
    ]
  },
  "VT": {
    "lead": "VT (Vanguard Total World Stock ETF) tracks the FTSE Global All Cap Index, covering developed and emerging stock markets and a range of company sizes.",
    "sections": [
      {
        "h": "Global does not mean equal weights",
        "paras": [
          "Country and company weights reflect market capitalization under the index rules. VT does not allocate an equal amount to every country; its geographic mix changes as markets change."
        ]
      },
      {
        "h": "Diversification and shared risks",
        "paras": [
          "Holding companies across regions reduces dependence on one local market, but global equities can fall together. Currency movements, local market conditions, and political risks also affect the underlying holdings."
        ]
      },
      {
        "h": "Trading currency and exposure",
        "paras": [
          "VT trades in U.S. dollars, while its portfolio contains businesses listed in different currencies. A dollar listing does not remove those underlying currency exposures. Results expressed in another currency add a further conversion effect.",
          "Reinvested distributions and price changes both contribute to the simulated return. Comparing VT with SPY or QQQ is a comparison of different geographic and sector exposures, not simply different versions of the same index."
        ]
      }
    ]
  },
  "SOXX": {
    "lead": "SOXX (iShares Semiconductor ETF) concentrates on U.S.-listed semiconductor and semiconductor-equipment companies. It is an industry fund, with a narrower scope than a broad technology or market index.",
    "sections": [
      {
        "h": "Several businesses, one industry",
        "paras": [
          "Chip design, manufacturing, and production equipment occupy different parts of the supply chain. Holding several of them spreads company-specific exposure, while leaving common sensitivity to semiconductor demand, inventories, and capital spending."
        ]
      },
      {
        "h": "Why the cycle matters",
        "paras": [
          "End-market demand and production capacity do not always change at the same pace. Supply shortages, excess inventory, and changes in customers' investment plans can affect earnings and valuations across the industry.",
          "A growing use for chips does not automatically produce a positive investment return: purchase prices already reflect expectations about that growth."
        ]
      },
      {
        "h": "Compared with VGT and QQQ",
        "paras": [
          "VGT covers the broader information-technology sector, while QQQ uses Nasdaq-100 eligibility rules across non-financial sectors. These baskets can overlap. Adding several of them does not necessarily reduce exposure to the same large companies or business cycle."
        ]
      }
    ]
  },
  "VGT": {
    "lead": "VGT (Vanguard Information Technology ETF) invests in the U.S. information-technology sector, including software, hardware, semiconductors, and IT services. Sector classification defines its scope.",
    "sections": [
      {
        "h": "Technology is a classification",
        "paras": [
          "A business may be associated with technology in everyday language yet belong to another market sector. VGT therefore does not include every company described as a technology business."
        ]
      },
      {
        "h": "Overlap is not extra diversification",
        "paras": [
          "VGT can share holdings with QQQ and SOXX, but the selection rules differ. QQQ includes non-financial sectors beyond information technology; SOXX narrows exposure to semiconductors and related equipment.",
          "Market-cap-based weighting can concentrate influence in larger companies even when a fund holds many names. The number of holdings alone does not measure how evenly risk is spread."
        ]
      },
      {
        "h": "What drives the result",
        "paras": [
          "Changes in earnings expectations, discount rates, and valuations affect sector prices. A strong technological trend can coexist with falling share prices if expectations or the price paid were too high. Recurring purchases change entry prices, while leaving the sector concentration in place."
        ]
      }
    ]
  },
  "VNQ": {
    "lead": "VNQ (Vanguard Real Estate ETF) holds U.S. real-estate equities, including real estate investment trusts, or REITs. It provides exposure to listed property businesses rather than direct ownership of a specific building.",
    "sections": [
      {
        "h": "Different properties, different businesses",
        "paras": [
          "Residential, industrial, retail, and other property businesses depend on different tenants, lease terms, occupancy levels, and financing arrangements. A fund can diversify across those businesses while remaining concentrated in real estate."
        ]
      },
      {
        "h": "Rates are one influence",
        "paras": [
          "Borrowing costs and the yields available on competing investments affect real-estate valuations. Rent growth, property operating costs, and vacancy also matter, so a change in interest rates does not determine VNQ's return by itself."
        ]
      },
      {
        "h": "Distributions are not a fixed payment",
        "paras": [
          "Real-estate companies can pass income to shareholders, but distribution amounts and share prices can change. A quoted distribution yield should be distinguished from total return, which also includes changes in price.",
          "VNQ is an equity investment. It does not promise a property's appraised value, a fixed rent payment, or repayment of the amount invested. A reinvestment simulation also differs from an investor withdrawing distributions as cash."
        ]
      }
    ]
  },
  "GLD": {
    "lead": "GLD (SPDR Gold Shares) is a trust backed by physical gold. Its shares provide exposure to the gold price after trust expenses, rather than to the earnings of gold-mining companies.",
    "sections": [
      {
        "h": "What a share represents",
        "paras": [
          "The trust holds gold bullion. Ordinary exchange purchases are purchases of trust shares, not an arrangement to collect a small bar at a bank. Creation and redemption of large baskets follow the trust's own procedures."
        ]
      },
      {
        "h": "Gold has no operating income",
        "paras": [
          "Gold itself pays neither interest nor company dividends. Expenses reduce the gold represented by a share over time, so the share return can differ from a simple chart of the gold price."
        ]
      },
      {
        "h": "Diversification has no fixed formula",
        "paras": [
          "Gold's relationship with stocks, bonds, inflation, and currencies varies by period. It can fall alongside other assets and can lose purchasing power over a chosen interval.",
          "A dollar gold price and a result converted to yen or euros are different measurements. The converted result reflects the exchange rate as well as the underlying gold exposure; neither is a guaranteed store of value."
        ]
      }
    ]
  },
  "TLT": {
    "lead": "TLT (iShares 20+ Year Treasury Bond ETF) tracks U.S. Treasury bonds with more than 20 years remaining to maturity. Its defining feature is exposure to long-term interest rates.",
    "sections": [
      {
        "h": "Credit quality and price risk",
        "paras": [
          "Government credit exposure and a stable market price are different properties. Long-dated bond prices can change substantially when market yields change. A low perceived default risk does not protect TLT's share price from falling."
        ]
      },
      {
        "h": "Duration is not maturity",
        "paras": [
          "Maturity is the time until a bond's principal is due. Duration measures price sensitivity to changes in yields; they are related but are not interchangeable. Long-duration exposure amplifies the effect of yield changes."
        ]
      },
      {
        "h": "A fund has no single repayment date",
        "paras": [
          "TLT replaces holdings as they cease to meet its index rules. Holding the ETF is therefore different from holding one Treasury until a known maturity date.",
          "Interest distributions form part of total return. Stocks and long-term bonds can also fall together, so an assumption that TLT always offsets equity losses is not built into the calculator."
        ]
      }
    ]
  },
  "AGG": {
    "lead": "AGG (iShares Core U.S. Aggregate Bond ETF) tracks a broad index of U.S.-dollar investment-grade bonds, including Treasuries, corporate debt, and mortgage-backed securities. It does not represent every bond market segment.",
    "sections": [
      {
        "h": "A mix of issuers and maturities",
        "paras": [
          "Its investment-grade scope differs from high-yield bonds, and its broad maturity range differs from TLT's long-term Treasury focus. The basket is not equally weighted across issuers or maturity groups."
        ]
      },
      {
        "h": "More than interest-rate risk",
        "paras": [
          "Treasuries and corporate bonds have different credit exposure. Mortgage-backed securities also face changes in repayment timing: borrowers may refinance or repay at different speeds as rates change.",
          "Duration describes sensitivity to yields, not the date on which an ETF repays its investors. AGG has no single maturity at which its share price is guaranteed to return to a purchase price."
        ]
      },
      {
        "h": "Reading the historical balance",
        "paras": [
          "Interest distributions and market-price changes both affect total return. Reinvesting distributions changes the simulated holdings; it does not remove the possibility of a loss.",
          "A comparison with an equity ETF shows the outcome of different assets in the selected past period. It cannot establish a fixed number of extra years that bonds would require to reach a future goal."
        ]
      }
    ]
  },
  "JEPI": {
    "lead": "JEPI (JPMorgan Equity Premium Income ETF) is actively managed. It combines a U.S. large-cap stock portfolio with option-related exposure through equity-linked notes, or ELNs, to pursue income.",
    "sections": [
      {
        "h": "The income trade-off",
        "paras": [
          "Option premiums can contribute to distributions, while the option strategy can limit participation in a strong equity rally. Premium income is not protection against all stock-market losses, and the size of distributions can vary."
        ]
      },
      {
        "h": "Why ELNs matter",
        "paras": [
          "An ELN is a financial instrument issued by a counterparty. In addition to equity and option exposure, this introduces counterparty, valuation, and liquidity risks. JEPI is not simply an S&P 500 index fund with a fixed dividend attached."
        ]
      },
      {
        "h": "Actual history and estimated comparisons",
        "paras": [
          "JEPI began trading in May 2020. The main calculator uses its actual trading history. In ETF comparisons only, an earlier interval may use the BXM buy-write index as a labeled estimate.",
          "BXM uses different portfolio and option rules. Its pre-listing interval is not JEPI's realized performance and cannot reproduce the decisions of JEPI's managers. The source and estimated dates belong alongside any such comparison."
        ]
      }
    ]
  },
  "JEPQ": {
    "lead": "JEPQ (JPMorgan Nasdaq Equity Premium Income ETF) combines an actively managed equity portfolio with Nasdaq-100-related option exposure through equity-linked notes. It pursues income through a different equity exposure from JEPI.",
    "sections": [
      {
        "h": "Benchmark and holdings differ",
        "paras": [
          "The Nasdaq-100 provides a reference for JEPQ's equity exposure, but JEPQ does not simply replicate QQQ. Active stock selection and the option component can both cause its return to differ from that benchmark."
        ]
      },
      {
        "h": "Premiums and upside",
        "paras": [
          "Option premium depends on volatility, strike prices, time to expiry, and other contract terms. A higher premium does not, by itself, prove a lower strike price or guarantee a higher distribution than JEPI.",
          "The option strategy can give up some gains in a rally while leaving substantial equity downside. ELNs also introduce counterparty and liquidity risks."
        ]
      },
      {
        "h": "The available history",
        "paras": [
          "JEPQ began trading in May 2022. This site does not extend its history with a pre-listing proxy. That is a choice about this dataset, not a claim that no Nasdaq-100 option index exists.",
          "Its available period contains fewer market cycles than an older fund's record. A short historical result cannot establish how the strategy would have performed through earlier crises."
        ]
      }
    ]
  }
};
