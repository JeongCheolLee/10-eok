// Deutsche Version der ETF-Analyseinhalte (E-E-A-T / YMYL).
// Markt-adaptiert für Anleger im Euro-Raum. Keine wörtliche Übersetzung.
export const ETF_DE: Record<string, { lead: string; sections: { h: string; paras: string[] }[] }> = {
  "QLD": {
    "lead": "QLD (ProShares Ultra QQQ) ist ein Hebel-ETF, der die 'Tagesrendite' des US-Index Nasdaq 100 verdoppelt. Er ist 2006 an die Börse gegangen, hat also eine lange Datenhistorie und taucht deshalb oft in Sparplan-Backtests auf. Stell dir den Nasdaq 100 vor – voll mit großen Techwerten wie Apple, Microsoft und Nvidia – und QLD tritt diesen Index mit geliehenem Geld täglich doppelt so stark durch.",
    "sections": [
      {
        "h": "Zuerst: Was ist der Nasdaq 100?",
        "paras": [
          "Der Nasdaq 100 bündelt rund 100 große Unternehmen der US-Börse Nasdaq – ohne Finanzwerte. Techkonzerne, die wir täglich nutzen, wie Apple, Microsoft, Amazon, Nvidia oder Google, machen einen großen Teil aus. Deshalb steigt der Index schnell, wenn das Wachstum stark ist, fällt aber genauso kräftig, wenn die Techwerte gemeinsam ins Wanken geraten.",
          "QLD kauft nicht den Index selbst, sondern verstärkt dessen 'Tagesbewegung' auf das Doppelte. Steigt der Index an einem Tag um 1 %, legt QLD um rund 2 % zu; fällt er um 1 %, verliert QLD rund 2 %. Das wird jeden Tag neu eingestellt."
        ]
      },
      {
        "h": "'Täglich 2x' und das tägliche Rebalancing",
        "paras": [
          "Der entscheidende Punkt: Das '2-fache' gilt pro Tag. Nach jedem Handelsschluss passt QLD den geliehenen Anteil so an, dass am nächsten Tag wieder exakt das Doppelte herauskommt. Das nennt man tägliches Rebalancing.",
          "Deshalb ergibt sich 'nach einem Monat' oder 'nach einem Jahr' nicht einfach die doppelte Indexrendite. Weil sich das tägliche Verdoppeln aufsummiert, weicht das Langzeitergebnis von der einfachen Multiplikation ab. Wer das nicht weiß, erwartet leicht Falsches – etwa 'der Nasdaq 100 hat sich verdoppelt, also steht QLD viermal höher'."
        ]
      },
      {
        "h": "Warum ist das Langzeitergebnis nicht 'das Doppelte des Index'?",
        "paras": [
          "Der Grund heißt Pfadabhängigkeit. Weil täglich neu verdoppelt wird, bleibt bei einem Auf und Ab ein Verlust hängen, selbst wenn der Index wieder am Ausgangspunkt landet. Beispiel: Steigt ein Wert an einem Tag um +10 % und fällt am nächsten um −9,09 %, steht er wieder bei null. Das 2-fach-Produkt macht aber +20 % und dann −18,18 %, sodass aus 100 nur noch etwa 98,2 werden – weniger als der Einsatz. Sammeln sich solche kleinen Verluste in einem Seitwärtsmarkt an, spricht man von Volatilitäts-Drift (oder Hebel-Zerfall).",
          "Umgekehrt kann in einem starken, stetig steigenden Markt der Zinseszins wirken: Auf das täglich gewachsene Vermögen wird erneut das Doppelte gesetzt, und das bringt manchmal mehr als das einfache Doppelte. QLD ist also dein Freund, wenn der Trend klar ist, und dein Gegner, wenn es hin und her schwankt oder lange fällt. Selbst über denselben Zeitraum hängt das Ergebnis stark davon ab, wann du eingestiegen bist und in welcher Reihenfolge es rauf und runter ging."
        ]
      },
      {
        "h": "Passt das zum Sparplan – und wo sind die Grenzen?",
        "paras": [
          "Ein Sparplan, bei dem du jeden Monat denselben Betrag anlegst, kauft bei niedrigen Kursen automatisch mehr Anteile. In der Erholungsphase nach einem großen Rückgang kann das überraschend gut zu einem schwankungsstarken Produkt wie QLD passen: Die im Abschwung günstig eingesammelten Anteile entfalten beim Rebound ihre Wirkung.",
          "Die Grenzen sind aber deutlich. Selbst beim gleichen Sparplan klaffen die Ergebnisse je nach Startzeitpunkt viel weiter auseinander als bei einem 1-fach-Produkt. Wer kurz vor einem großen Crash einsteigt, muss lange bis zur Erholung durchhalten – und in der Zwischenzeit nagt die Volatilitäts-Drift an der Rendite. Denk unbedingt daran, dass das 'Glück des Startzeitpunkts' hier stark wirkt. Dass die Vergangenheit gut war, garantiert keine gleiche Zukunft."
        ]
      },
      {
        "h": "Für wen passt es – und für wen nicht?",
        "paras": [
          "QLD passt zu Menschen, die große Rückgänge emotional aushalten, die Funktionsweise eines Hebelprodukts verstehen und nur einen Teil ihres Vermögens abzweigen, um die Schwankungen über lange Zeit zu ertragen. Verbreitet ist die Sicht, es nicht als Gesamtwette, sondern nur als 'Satelliten', also einen kleinen Teil, beizumischen.",
          "Umgekehrt ist es nichts für dich, wenn dich ein Kapitalverlust um den Schlaf bringt, wenn du das Geld bald brauchst oder wenn du bei einem Absturz zum Verkauf neigst. Dann sind ein QQQ ohne Hebel oder ein breiter gestreuter SPY vielleicht die ruhigere Wahl. So oder so: Es ist nie zu spät, deine eigenen Zahlen einmal mit dem Rechner oben durchzurechnen, bevor du entscheidest."
        ]
      }
    ]
  },
  "TQQQ": {
    "lead": "TQQQ (ProShares UltraPro QQQ) ist ein extrem schwankungsstarker Hebel-ETF, der die 'Tagesrendite' des US-Index Nasdaq 100 verdreifacht. Im Vergleich zum QQQ, der denselben Nasdaq 100 einfach abbildet, oder zum zweifachen QLD sind die Ausschläge nach oben wie nach unten überwältigend groß. Das 'UltraPro' im Namen und die Zahl 3 liest man sicherheitshalber als Signal: Hier braucht es entsprechend viel Nervenstärke.",
    "sections": [
      {
        "h": "Was heißt 'täglich 3x' genau?",
        "paras": [
          "TQQQ ist so gebaut, dass er sich um rund +3 % bewegt, wenn der Nasdaq 100 an einem Tag um +1 % steigt, und um rund −3 %, wenn er um −1 % fällt. Entscheidend ist das Wort 'Tag'. Der Anbieter stellt die 3-fache Hebelwirkung jeden Tag zum Börsenschluss neu ein (Rebalancing). Deshalb ist die aufsummierte Rendite über mehrere Tage oder Monate nicht einfach das Dreifache des Index.",
          "Steigt der Nasdaq 100 in einem Monat um 10 %, legt TQQQ also nicht exakt 30 % zu. Weil täglich neu verdreifacht wird, hängt das Ergebnis vom Pfad ab (in welcher Reihenfolge es rauf und runter ging) – und meist weicht es zu unseren Ungunsten von der Intuition ab."
        ]
      },
      {
        "h": "Volatilitäts-Drift — hier gräbt sie viel tiefer als bei 2x",
        "paras": [
          "In einem Seitwärtsmarkt mit ständigem Auf und Ab knabbert der Hebel Stück für Stück am Kapital – das ist die Volatilitäts-Drift (Decay). Nehmen wir an, der Index macht abwechselnd +10 % und am nächsten Tag −10 %. Bei 1-fach ergibt 1,10 × 0,90 = 0,99, es bleibt also nur rund 1 % Verlust. Bei 2-fach sind es 1,20 × 0,80 = 0,96, also rund 4 %, und bei 3-fach 1,30 × 0,70 = 0,91, also rund 9 %, die verschwinden.",
          "Bei derselben Schaukelbewegung wird die Drift von 1 % auf 4 % auf 9 % steiler. Der Faktor steigt nur um eine Stufe von 2 auf 3, doch der Verlust mehr als verdoppelt sich. Schon reines Hin- und Herschwanken ohne Richtung lässt TQQQ still dahinschmelzen. Dieser Effekt summiert sich, je höher die Schwankung und je länger die Haltedauer ist."
        ]
      },
      {
        "h": "Warum die Erholung nach großen Rückgängen so schwer ist",
        "paras": [
          "Ein Rückgang von −50 % braucht allein schon +100 %, um wieder bei null zu sein. Ist die Hälfte weg, muss sich der Rest verdoppeln. Das Problem: Bei einem 3-fach-Produkt fällt man beim gleichen Indexrückgang viel tiefer.",
          "Fällt der Nasdaq 100 an einem Tag um −20 %, verliert TQQQ etwa −60 % und braucht +150 %, um sich zu erholen. Je tiefer der Sturz, desto weiter wird der Rückweg – geradezu exponentiell. Konstruktionsbedingt ist es in einer Tech-Baisse durchaus möglich, dass der Wert bis rund 80 % unter das Hoch fällt; dann kann die Rückkehr zum Einstand Jahre dauern oder ganz ausbleiben. Und die Vergangenheit garantiert die Zukunft nicht.",
          "Wichtig zu wissen ist außerdem: TQQQ hat höhere laufende Kosten als ein 1-fach-ETF, die sich über lange Zeiträume aufsummieren."
        ]
      },
      {
        "h": "Ist es fürs langfristige Sparen und Halten geeignet?",
        "paras": [
          "Manche gehen an TQQQ mit dem Gedanken heran: 'Ich glaube langfristig an die Nasdaq, also parke ich es dreifach.' Wegen der oben beschriebenen Struktur ist Buy-and-Hold über lange Zeit aber umstritten. Betrachtet man nur die langen Aufwärtsphasen, sieht es glanzvoll aus; die wahre Hürde ist, ob du die tiefen Abstürze und die Seitwärts-Drift dazwischen aushältst. Auch die laufenden Kosten sind höher als bei einem 1-fach-ETF und summieren sich mit der Zeit.",
          "Realistisch ist es ein Produkt, das man nur mit einem Anteil in Betracht zieht, dessen Verlust den Alltag nicht ins Wanken bringt – und nur, wenn man bereit ist, große Rückgänge immer wieder auszusitzen. Je nach Glück beim Startzeitpunkt gehen selbst beim gleichen Sparplan die Ergebnisse extrem auseinander. Verschiebst du im Rechner oben den Startzeitpunkt hin und her, zeigt sich in Zahlen, wie weit bestes und schlechtestes Ergebnis beim selben Sparplan auseinanderliegen."
        ]
      }
    ]
  },
  "QQQ": {
    "lead": "QQQ (Invesco QQQ Trust) ist der bekannte ETF, der den US-Index Nasdaq 100 ohne Hebel einfach (1-fach) abbildet. Er enthält die 100 größten Nicht-Finanzunternehmen der Nasdaq-Börse, wobei Techwerte wie Apple, Microsoft und Nvidia einen großen Anteil ausmachen. Mit nur einem Anteil investierst du auf einen Schlag in rund 100 US-Techwerte.",
    "sections": [
      {
        "h": "Was heißt es, den Nasdaq 100 1-fach abzubilden?",
        "paras": [
          "Der von QQQ nachgebildete Nasdaq 100 bündelt 100 Nicht-Finanzunternehmen der Nasdaq-Börse nach Marktkapitalisierung. Finanzwerte wie Banken oder Versicherer sind ausgeschlossen; ihren Platz füllen Wachstumswerte aus Technik, Kommunikation und Konsum. Deshalb trägt er den Spitznamen 'Tech-Index'.",
          "Der Kern ist das '1-fach (ohne Hebel)'. QLD verstärkt denselben Index täglich zweifach, TQQQ dreifach – QQQ dagegen steigt um rund 1 %, wenn der Index 1 % zulegt, und fällt um rund 1 %, wenn er 1 % nachgibt. Ohne Verstärker gibt es hier keine 'Volatilitäts-Drift' (das Phänomen, dass der Wert wegen des täglichen Neujustierens selbst im Seitwärtsmarkt abgeschliffen wird), das bei Hebel-ETFs zum Problem wird. Deshalb passt QQQ deutlich besser zum langfristigen Halten."
        ]
      },
      {
        "h": "Schwankung, die aus dem Wachstumscharakter folgt",
        "paras": [
          "Ein hoher Anteil an Tech- und Wachstumswerten ist ein zweischneidiges Schwert. Erwartungen an neue Produkte und Gewinne spiegeln sich schnell im Kurs, sodass QQQ in Aufwärtsphasen oft steiler steigt als der Marktdurchschnitt – aus demselben Grund fällt er aber auch tiefer, sobald Sorgen über Zinserhöhungen oder eine Konjunkturabkühlung aufkommen.",
          "Ohne Hebel heißt nicht, dass der Kurs 'niemals schwankt'. Auch in der Vergangenheit gab es mehrfach Phasen mit Rückgängen von mehreren zehn Prozent vom Hoch. Wer per Sparplan ansammelt, für den können solche Abschwünge sogar eine Gelegenheit sein, mit demselben Geld mehr Anteile einzusammeln – aber du brauchst die innere Bereitschaft, Zeiten auszuhalten, in denen dein Depotwert eine Weile unter dem Einsatz liegt."
        ]
      },
      {
        "h": "Was unterscheidet ihn vom SPY (S&P 500)?",
        "paras": [
          "Beide sind 1-fach-ETFs auf erstklassige US-Werte, haben aber einen anderen Charakter. Der SPY enthält 500 Unternehmen aus 11 Branchen – Finanzen, Energie, Gesundheit und mehr – und ist damit breiter gestreut, während QQQ die Finanzwerte weglässt und mit 100 Unternehmen auf Techwerte setzt.",
          "Vereinfacht ist QQQ eher 'die offensivere Wahl mit Fokus auf Techwerte' und SPY 'die unaufgeregte Wahl mit breiter Wette auf die gesamte US-Wirtschaft'. Welche der beiden besser lief, war je nach Zeitraum verschieden. Welche zu deinem Sparzeitraum gepasst hätte, kannst du direkt vergleichen, indem du im Rechner nur das Wertpapier wechselst und unter gleichen Bedingungen rechnest."
        ]
      },
      {
        "h": "QQQ als langfristiges Sparziel",
        "paras": [
          "Weil es keine Volatilitäts-Drift gibt, eignet sich QQQ – anders als Hebelprodukte – recht gut für einen Sparplan, den man 'lange hält'. Ein Sparplan mit monatlich gleichem Betrag kauft teuer weniger und günstig mehr und glättet so den Durchschnittspreis; das harmoniert besonders gut mit einem schwankungsstarken Wachstumsindex.",
          "Der Techfokus ist aber zugleich eine Schwäche bei der Streuung. Schwächelt die Techbranche insgesamt, gerät auch QQQ ins Wanken. Die Zahlen im Ergebnisfeld oben sind mit echten historischen Kursen berechnet, aber immer nur eine Simulation für einen bestimmten Startzeitpunkt – vergangene Renditen garantieren die Zukunft nicht. Beziehe auch das mit ein, dass das Ergebnis vom Startzeitpunkt abhängt, und urteile nach deinen eigenen Maßstäben."
        ]
      }
    ]
  },
  "SPY": {
    "lead": "SPY ist ein ETF, der den S&P 500 mit den 500 größten US-Werten abbildet – 1993 erstmals notiert und einer der ältesten und größten ETFs der Welt. Sein voller Name lautet SPDR S&P 500 ETF Trust. Am einfachsten denkst du: 'Kaufe ich einen SPY-Anteil, verteile ich mein Geld in kleinen Häppchen auf 500 der größten US-Unternehmen.' Wer per Sparplan langsam den gesamten US-Markt ansammeln will, stößt zuerst auf dieses Kern-Investment.",
    "sections": [
      {
        "h": "Was ist der S&P 500?",
        "paras": [
          "Der S&P 500 bündelt rund 500 große, an der US-Börse notierte Unternehmen. Es ist nicht so, dass '500 Firmen gleich gewichtet' werden – je größer ein Unternehmen (Marktkapitalisierung), desto größer sein Anteil. Deshalb haben Riesen wie Apple oder Microsoft ein starkes Gewicht.",
          "Wichtig ist: Diese Liste von 500 ist nicht in Stein gemeißelt. Unternehmen, die die Kriterien nicht mehr erfüllen, fliegen raus, und neu gewachsene rücken nach – die Zusammensetzung wird regelmäßig getauscht. Dadurch teilt der gesamte Index nicht das Schicksal einer einzelnen Firma, selbst wenn diese pleitegeht. Mit dem SPY folgst du diesem sich selbst erneuernden Bündel als Ganzes."
        ]
      },
      {
        "h": "Warum er 'weniger schwankt' als QQQ",
        "paras": [
          "Auch wenn es beide um große US-Werte geht, haben SPY und QQQ einen anderen Charakter. Während QQQ auf Techwerte konzentriert ist, verteilt sich der SPY breit auf viele Branchen – Technik, Finanzen, Gesundheit, Konsum, Energie und mehr. Wackelt eine Branche, stützen andere; deshalb gilt er allgemein als weniger schwankungsanfällig als ein tech-lastiger Index.",
          "Natürlich heißt 'weniger schwanken' keineswegs 'nicht fallen'. Auch der SPY fällt in einer Baisse, in der der ganze Markt absackt, kräftig mit. Der Kernpunkt ist aber: breite Streuung über die gesamte US-Wirtschaft statt einer Wette auf eine einzelne Branche."
        ]
      },
      {
        "h": "SPY als langfristiges Sparziel",
        "paras": [
          "Der SPY ist kein Hebelprodukt, sondern ein ETF, der den Index 1-fach abbildet. Deshalb ist er von der 'Drift' (dem Volatilitätsverlust im Seitwärtsmarkt), die bei Hebelprodukten wie TQQQ oder QLD zum Problem wird, weitgehend frei. Das ist der Grund, warum er gut zu einem Sparplan mit monatlich gleichem Betrag passt.",
          "Allerdings ist der SPY ein US-Dollar-Anlagewert. Kaufst du ihn mit Euro, wirkt der Euro/Dollar-Wechselkurs auf deine Rendite. Beim gleichen Kurs kann dein Ergebnis in Euro anders ausfallen, je nachdem, wie sich der Euro/Dollar-Wechselkurs bewegt hat. Auch die Zahlen im Ergebnisfeld oben berücksichtigen die echten historischen Kurse und den jeweiligen Tageskurs der Währung gemeinsam."
        ]
      },
      {
        "h": "Startzeitpunkt und Erwartungen richtig einordnen",
        "paras": [
          "Nur weil es der US-Leitindex ist, kommt nicht bei jedem Startzeitpunkt dasselbe heraus. Ob du deinen Sparplan kurz vor einem Hoch oder direkt nach einem Absturz begonnen hast, macht beim gleichen Wertpapier einen spürbaren Unterschied. Ein Sparplan dämpft dieses Timing-Glück ein Stück weit, weil er bei niedrigen Kursen automatisch mehr einsammelt – ganz beseitigen kann er es aber nicht.",
          "Vor allem garantiert die Tatsache, dass es in der Vergangenheit aufwärtsging, keine künftige Rendite (Vergangenheit ≠ Zukunft). Dieser Text dient der Information und ist keine Anlageberatung. Weil selbst derselbe SPY je nach Startzeitpunkt anders abschneidet, ist es sicherer, mit dem Rechner verschiedene Szenarien für Betrag, Zeitraum und Ziel durchzuspielen und dann selbst zu urteilen."
        ]
      }
    ]
  },
  "VOO": {
    "lead": "VOO (Vanguard S&P 500 ETF) bildet den S&P 500 mit den 500 größten US-Werten ohne Hebel einfach (1-fach) ab. Vanguard hat ihn 2010 aufgelegt; er enthält denselben Index wie der ältere SPY, unterscheidet sich aber in Anbieter und Kosten. Wer per Sparplan den gesamten US-Markt ansammeln will, stößt bei den Anlegern im Euro-Raum immer wieder auf genau dieses Kürzel.",
    "sections": [
      {
        "h": "Der S&P 500, den VOO enthält",
        "paras": [
          "Der S&P 500 bündelt rund 500 große, an der US-Börse notierte Unternehmen. Es werden nicht 500 gleich gewichtet – je größer ein Unternehmen (Marktkapitalisierung), desto größer sein Anteil; wer die Kriterien nicht erfüllt, fliegt raus, neu gewachsene rücken nach, und das wird regelmäßig getauscht. Kaufst du einen VOO-Anteil, verteilst du dein Geld in kleinen Häppchen auf dieses sich selbst erneuernde Bündel führender US-Unternehmen.",
          "VOO folgt diesem Index '1-fach'. Steigt der Index an einem Tag um 1 %, legt er rund 1 % zu; fällt er um 1 %, verliert er rund 1 %. Die 'Volatilitäts-Drift' (der Wert wird wegen des täglichen Neujustierens selbst im Seitwärtsmarkt abgeschliffen), die bei Hebelprodukten wie QLD oder TQQQ zum Problem wird, gibt es hier nicht – eine Struktur, die gut zum monatlichen Ansparen passt."
        ]
      },
      {
        "h": "Was unterscheidet ihn vom SPY? — Gleicher Index, anderes Produkt",
        "paras": [
          "Weil VOO und SPY denselben S&P 500 enthalten, ist die Rendite praktisch fast gleich. Der reale Unterschied liegt beim Anbieter (VOO von Vanguard, SPY von State Street) und bei den laufenden Kosten. Die Kosten des VOO liegen bei etwa 0,03 % pro Jahr und damit niedriger als beim SPY (rund 0,09 % pro Jahr). Kosten werden jedes Jahr in kleinen Beträgen vom Vermögen abgezogen – je länger und je größer du anlegst, desto leicht vorteilhafter ist die günstigere Seite.",
          "Dafür ist der SPY seit 1993 notiert, hat eine lange Geschichte, ein sehr großes Handelsvolumen und viel Liquidität, und auch der Optionsmarkt ist gut entwickelt. Deshalb ist die verbreitete Sicht: für kurzes Traden eher der SPY, fürs langfristige Ansparen der kostengünstigere VOO. Merke dir aber vor allem: Egal, welchen du wählst, der Kern (der S&P 500) ist derselbe."
        ]
      },
      {
        "h": "Als Dollar-Anlagewert bewegt sich der Wechselkurs mit",
        "paras": [
          "VOO ist ein in US-Dollar notierter Anlagewert. Kaufst du ihn mit Euro, schwankt dein in Euro umgerechneter Depotwert mit, wenn der Euro/Dollar-Wechselkurs steigt oder fällt. Steigt der US-Kurs, der Euro/Dollar-Wechselkurs entwickelt sich aber ungünstig, kann deine Rendite in Euro schrumpfen; umgekehrt kann sie größer aussehen, wenn der Wechselkurs zu deinen Gunsten läuft.",
          "Auch die Zahlen im Ergebnisfeld oben sind mit den echten historischen Tageskursen und dem jeweiligen Tageskurs der Währung gemeinsam berechnet. Dass eine einzige Variable wie der Wechselkurs auf das Langzeitergebnis stärker wirkt als gedacht, solltest du immer im Blick haben, wenn du einen US-ETF mit Euro ansparst."
        ]
      },
      {
        "h": "Als langfristiges Sparziel – und der Startzeitpunkt",
        "paras": [
          "Weil VOO ohne Hebel breit auf 500 große US-Werte gestreut ist, gilt er oft als beruhigenderes langfristiges Sparziel als Einzelwerte oder Hebelprodukte. Ein Sparplan mit monatlich gleichem Betrag kauft teuer weniger und günstig mehr und glättet den Durchschnittspreis – das harmoniert gut.",
          "Aber 'weniger schwanken' heißt nicht 'nicht fallen'. In einer Baisse, in der der ganze Markt absackt, fällt auch VOO kräftig mit, und ob du kurz vor einem Hoch oder direkt nach einem Absturz begonnen hast, macht beim gleichen Wertpapier einen Unterschied. Dass es in der Vergangenheit aufwärtsging, garantiert die Zukunft nicht – deshalb ist es sicherer, mit dem Rechner selbst verschiedene Kombinationen aus Betrag, Zeitraum und Ziel durchzuspielen und dann zu urteilen."
        ]
      }
    ]
  },
  "SCHD": {
    "lead": "SCHD (Schwab U.S. Dividend Equity ETF) bündelt rund 100 erstklassige US-Unternehmen, die 'zuverlässig und stetig Dividende zahlen'. Charles Schwab hat ihn 2011 aufgelegt; er folgt dem Dow Jones U.S. Dividend 100 Index. Anders als der tech-lastige Nasdaq 100 setzt er auf solide Firmen, die seit Langem Dividende zahlen – und ist auch im Euro-Raum als Aushängeschild für 'Dividendenwachstum' beliebt.",
    "sections": [
      {
        "h": "Welche Unternehmen wählt SCHD aus?",
        "paras": [
          "Der von SCHD nachgebildete Dow Jones U.S. Dividend 100 Index nimmt nicht jedes Unternehmen auf, nur weil dessen 'Dividendenrendite hoch ist'. Zuerst kommen nur Firmen in die Auswahl, die seit mindestens 10 Jahren durchgehend Dividende gezahlt haben; anschließend werden über Finanzkennzahlen wie Verschuldung im Verhältnis zum Cashflow und Eigenkapitalrendite (ROE) sowie über Dividendenrendite und Dividendenwachstum der letzten 5 Jahre rund 100 ausgewählt. Es geht also nicht um Firmen, die 'viel zahlen', sondern um solche, die 'gesund und lange zahlen können'.",
          "Deshalb sind die enthaltenen Branchen recht anders als beim Nasdaq 100. Der Techanteil ist niedrig; stattdessen nehmen Unternehmen mit 'Value-/Dividenden'-Charakter aus Industrie, Finanzen, Gesundheit, Basiskonsum und Energie viel Raum ein. Auch wenn es US-Aktien sind, ist es ein anders gearteter Korb."
        ]
      },
      {
        "h": "Was 'Dividendenwachstum' bedeutet, und der Zahlungsrhythmus — es ist keine Monatsdividende",
        "paras": [
          "Dividendenwachstum bezeichnet Unternehmen, die ihre Dividende Jahr für Jahr etwas erhöht haben. Dass eine Dividende stetig steigen kann, wird als Zeichen dafür gelesen, dass die Gewinne stabil wachsen – deshalb gilt es als der zentrale Reiz von SCHD.",
          "Ein häufiges Missverständnis sei genannt: SCHD ist kein 'Monatsdividenden'-ETF, sondern zahlt alle 3 Monate (vierteljährlich) aus. Das Missverständnis entsteht, weil manche für ein Monatsdividenden-Portfolio mehrere ETFs mit unterschiedlichen Ausschüttungsmonaten mischen. Die Dividendenrendite variiert je nach Zeitpunkt, liegt aber meist über dem Durchschnitt des S&P 500; und der Backtest auf dieser Seite rechnet auf Basis des um Dividenden bereinigten Kurses, also unter der Annahme, dass die erhaltene Dividende wieder angelegt wird."
        ]
      },
      {
        "h": "Was unterscheidet ihn von Wachstumsindizes (QQQ / S&P 500)?",
        "paras": [
          "In Phasen wie den letzten gut zehn Jahren, in denen Techwerte den Markt anführten, lag die Gesamtrendite von SCHD oft hinter QQQ oder S&P 500 zurück. Auch an den Zahlen im Ergebnisfeld oben siehst du, dass der Endwert niedriger ausfällt als bei Wachstums- oder Hebelwerten. Der Grund: Wer sich für Dividende und geringe Schwankung entscheidet, verzichtet ein Stück weit auf explosive Kurssteigerungen.",
          "Dafür sind die Rückgänge in einer Baisse relativ flach und die Schwankung ist gering, und mit der Dividende fließt stetig ein Cashflow herein. SCHD ist also eher die Wahl für 'weniger schwanken und Dividende erhalten' als für 'mehr verdienen'. Welche Seite besser ist, war je nach Person und Zeitpunkt verschieden – vergleiche im Rechner am besten unter gleichen Bedingungen, nur mit gewechseltem Wertpapier."
        ]
      },
      {
        "h": "Wie sieht es mit Steuern aus?",
        "paras": [
          "Wie Dividenden und Kursgewinne besteuert werden, hängt von deinem Land und deiner persönlichen Situation ab und kann sich zudem ändern. Für eine verbindliche Einschätzung frag am besten eine Steuerberatung – dieser Text kann und will das nicht ersetzen.",
          "Wichtig für die Einordnung der Zahlen: Das Ergebnis auf dieser Seite ist ein Vorsteuerwert auf Basis des um Dividenden bereinigten Kurses (also unter der Annahme, dass Dividenden wieder angelegt werden). Es kann daher von deinem tatsächlichen Ergebnis nach Steuern abweichen, besonders wenn du Dividenden real als Bargeld erhältst. Wer SCHD wegen der Dividende in Betracht zieht, sollte die Rendite nach Steuern mitbedenken. Dieser Text dient der Information und ist keine Anlageberatung; und vergangene Renditen garantieren die Zukunft nicht."
        ]
      }
    ]
  },
  "VT": {
    "lead": "VT (Vanguard Total World Stock ETF) packt, wie der Name sagt, die Aktien der ganzen Welt in einen einzigen Korb. Vanguard hat ihn 2008 aufgelegt; er enthält tausende Titel aus Industrie- und Schwellenländern – die USA ebenso wie Europa, Japan und die Emerging Markets. Nach dem Motto 'Man weiß nie, welches Land steigt, also kaufe ich gleich die ganze Welt' ist er der König der Streuung.",
    "sections": [
      {
        "h": "Was in einem einzigen VT-Anteil steckt",
        "paras": [
          "VT folgt dem FTSE Global All Cap Index. Er umfasst Industrie- und Schwellenländer und reicht von Groß- bis Kleinwerten, sodass er tausende Titel enthält. Mit nur einem Anteil investierst du praktisch in kleinen Häppchen in 'den gesamten Weltaktienmarkt'.",
          "So breit gestreut sinkt das Risiko stark, sein Schicksal an ein einzelnes Land, eine Branche oder ein Unternehmen zu knüpfen. Schwächelt die Wirtschaft einer Region, können andere Regionen stützen. Als 1-fach-Produkt ohne Hebel gibt es auch keine Sorge um Volatilitäts-Drift."
        ]
      },
      {
        "h": "'Ganze Welt' – und doch macht die USA über die Hälfte aus",
        "paras": [
          "Hier lässt sich leicht etwas missverstehen. Weil VT die Aktien jedes Landes nach Marktkapitalisierung gewichtet, nimmt der größte Markt der Welt – die USA – mit rund 60 % den größten Platz ein. Den Rest teilen sich Europa, Japan, China und weitere Schwellenländer.",
          "VT ist also nicht 'die ganze Welt ohne die USA', sondern eher 'die ganze Welt mit großem US-Anteil'. In Phasen, in denen die US-Börse stark war, hat auch VT stark davon profitiert; schwächeln umgekehrt die USA, kann er sich defensiver bewegen als ein rein auf die USA konzentriertes Produkt."
        ]
      },
      {
        "h": "Der Trade-off gegenüber USA-Fokus (SPY / QQQ)",
        "paras": [
          "Die letzten gut zehn Jahre haben die USA und die Techwerte die Weltbörsen angeführt. Über denselben Zeitraum lag die Gesamtrendite von VT deshalb in vielen Phasen unter S&P 500 oder Nasdaq 100, und auch im Ergebnisfeld oben zeigt sich dieser Unterschied. VT zu wählen heißt, auf die Überrendite eines einzelnen Landes (USA) ein Stück weit zu verzichten und dafür das Risiko, welche Region vorn liegen wird, breit zu verteilen.",
          "Diese Streuung ist eine Art Versicherungsprämie. Welches Land voranschreitet, hat sich von Epoche zu Epoche geändert, und es gibt keine Garantie, dass die Überlegenheit der USA ewig währt. Ob du auf einen bestimmten Markt konzentrierst, um größer zu zielen, oder breit auf die ganze Welt setzt, um ruhiger zu schlafen, hängt von deiner Veranlagung und deinem Urteil ab."
        ]
      },
      {
        "h": "Wechselkurs, langfristiges Sparen, Startzeitpunkt",
        "paras": [
          "Auch VT ist ein in US-Dollar notierter Anlagewert. Kaufst du ihn mit Euro, wirkt der Euro/Dollar-Wechselkurs auf deine Rendite. Auch die Zahlen im Ergebnisfeld oben sind mit den echten historischen Kursen und dem jeweiligen Tageskurs der Währung gemeinsam berechnet. Die enthaltenen Unternehmen kommen aus aller Welt, doch die Handels- und Bewertungswährung ist der Dollar – das solltest du im Kopf behalten.",
          "Als breit gestreutes 1-fach-Produkt ohne Hebel passt VT gut zum Sparplan, aber eine Wette auf die ganze Welt umgeht keine Baisse. In Phasen, in denen die globalen Börsen gemeinsam fallen, gibt auch VT mit nach, und je nach Startzeitpunkt fällt das Ergebnis anders aus. Die Vergangenheit garantiert die Zukunft nicht – spiele deshalb im Rechner selbst mehrere Kombinationen durch und urteile dann. Dieser Inhalt dient der Information und ist keine Anlageberatung."
        ]
      }
    ]
  }
};
