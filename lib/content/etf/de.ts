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
  },
  "SOXX": {
    "lead": "SOXX (iShares Semiconductor ETF) bündelt rund 30 in den USA notierte Halbleiterunternehmen. Der Anbieter iShares (BlackRock) hat ihn 2001 aufgelegt; er folgt dem ICE Semiconductor Index. Von Firmen, die Rechenzentrums- und KI-Chips bauen – Nvidia, Broadcom, Qualcomm, AMD – bis hin zu Herstellern von Fertigungsanlagen und Materialien deckt er die gesamte Halbleiter-Wertschöpfungskette ab und ist damit eine konzentrierte Wette auf die Branche.",
    "sections": [
      {
        "h": "Eine konzentrierte Wette auf die gesamte Halbleiterbranche",
        "paras": [
          "SOXX beschränkt sich auf rund 30 US-notierte Halbleiterunternehmen. Im Vergleich zu QQQ (Nasdaq 100, 100 große Nicht-Finanzwerte) oder einem ETF, der die gesamte IT-Branche abdeckt, ist der Korb deutlich enger und stärker auf eine einzelne Industrie fokussiert. Läuft das Halbleitergeschäft gut, steigt SOXX entsprechend viel steiler als der Marktdurchschnitt – dreht der Wind, fällt er genauso kräftig.",
          "Die enthaltenen Firmen reichen von Unternehmen, die Chips selbst entwerfen und produzieren (Nvidia, AMD, Qualcomm und andere), bis zu Zulieferern von Fertigungsanlagen und Materialien (etwa Applied Materials oder Lam Research), die für die Chipherstellung nötig sind. Man investiert also über mehrere Glieder der Kette, landet aber letztlich immer bei derselben großen Variable: der Verfassung der Halbleiterbranche."
        ]
      },
      {
        "h": "KI-Boom und extreme Konzentration",
        "paras": [
          "In den letzten Jahren hat der Boom bei KI-Servern und Rechenzentren die Kurse der beteiligten Halbleiterfirmen kräftig steigen lassen, wodurch das Gewicht der Top-Werte innerhalb von SOXX spürbar zugenommen hat. Weil der Index nach Marktkapitalisierung gewichtet, hängt die Gesamtperformance von SOXX inzwischen stark vom Kursverlauf einzelner Schwergewichte ab.",
          "Diese Konzentration ist ein zweischneidiges Schwert. Läuft es bei diesen Unternehmen weiter gut, zieht das ganze SOXX mit nach oben; enttäuschen sie dagegen, kann der gesamte ETF kräftig ins Wanken geraten. Wer 'breit über die Halbleiterbranche streuen' will, sollte wissen, dass er faktisch stark auf wenige Namen konzentriert sein kann."
        ]
      },
      {
        "h": "Halbleiter sind eine zyklische Branche",
        "paras": [
          "Die Halbleiterindustrie gilt traditionell als 'zyklische Branche', in der sich Angebot und Nachfrage im Rhythmus mehrerer Jahre auf und ab bewegen. Ersatzbedarf bei Smartphones und PCs, Investitionen in Rechenzentren und die Nachfrage nach Automobil-Chips überlagern sich mal verstärkend, mal gegenläufig – Boom und Flaute wechseln sich ab, und mit ihnen schwankt auch der SOXX-Kurs kräftig.",
          "Ob die aktuelle KI-Nachfrage diesen Zyklus besonders lange verlängert, kann niemand garantieren. Da frühere Halbleiterbooms ebenfalls nicht ewig anhielten, ist es realistischer, SOXX nicht als 'stetig steigendes Asset', sondern als 'Wette auf einen schwankungsstarken Branchenzyklus' zu betrachten."
        ]
      },
      {
        "h": "Sparplan, Steuern und der Wechselkurs",
        "paras": [
          "SOXX ist ein US-notierter ETF, du kaufst ihn also mit Euro, und der Euro/Dollar-Wechselkurs wirkt auf deine Rendite in Euro. Wie Kursgewinne konkret besteuert werden, hängt von deinem Wohnsitzland und deiner persönlichen Situation ab – frag dazu am besten eine Steuerberatung, dieser Text kann und will das nicht ersetzen.",
          "Weil die Schwankung hoch ist, hängt das Ergebnis stark vom Startzeitpunkt ab. Ob du kurz vor dem Ende eines Booms oder nahe am Tiefpunkt einer Flaute eingestiegen bist, kann beim gleichen Sparzeitraum zu sehr unterschiedlichen Ergebnissen führen. Die Vergangenheit garantiert die Zukunft nicht – probiere im Rechner oben ruhig mehrere Startzeitpunkte durch. Dieser Text dient der Information und ist keine Anlageberatung."
        ]
      }
    ]
  },
  "VGT": {
    "lead": "VGT (Vanguard Information Technology ETF) bündelt mehrere Hundert Unternehmen aus dem US-Technologiesektor. Vanguard hat ihn 2004 aufgelegt; er folgt dem MSCI US IMI Information Technology Index. Von Techriesen wie Apple, Microsoft und Nvidia bis zu Software-, Halbleiter- und IT-Dienstleistungsfirmen deckt er breit ab – enger gefasst als QQQ, aber breiter als SOXX, ein reiner 'Tech-Sektor'-ETF.",
    "sections": [
      {
        "h": "Der ganze IT-Sektor – de facto aber von wenigen Konzernen getrieben",
        "paras": [
          "VGT bündelt mehrere Hundert Unternehmen aus Halbleitern, Software, Hardware und IT-Dienstleistungen und wirkt allein vom Namen her breit gestreut. Weil die Gewichtung aber nach Marktkapitalisierung erfolgt, machen wenige Schwergewichte wie Apple, Microsoft und Nvidia einen erheblichen Teil des Gesamtvermögens aus. Trotz vieler Positionen hängt die tatsächliche Bewegung stark von den größten Werten ab.",
          "Das bedeutet auch eine große Überschneidung mit QQQ (Nasdaq 100). Allerdings mischt QQQ neben Techwerten auch Telekom- und Konsumfirmen bei, während VGT ausschließlich auf den IT-Sektor beschränkt ist – dadurch ist er noch stärker auf Technologie konzentriert als QQQ."
        ]
      },
      {
        "h": "Was unterscheidet ihn von SOXX und QQQ?",
        "paras": [
          "Während SOXX sich auf die eine Branche Halbleiter konzentriert, deckt VGT inklusive Halbleiter auch Software, Cloud und IT-Dienstleistungen ab – also den gesamten IT-Sektor. Er streut damit innerhalb der Branche breiter als SOXX, bleibt aber dennoch im großen Themenfeld 'Technologie' gefangen.",
          "Im Vergleich zu QQQ ist VGT ausschließlich auf Informationstechnologie begrenzt und enthält keine im Nasdaq 100 vertretenen Telekom- oder Konsum-Schwergewichte. Er kommt damit einem reinen 'Tech-Index' näher als QQQ – und ist entsprechend stärker exponiert, wenn die gesamte Technologiebranche ins Wanken gerät."
        ]
      },
      {
        "h": "Der Preis der Tech-Konzentration – kräftig rauf, kräftig runter",
        "paras": [
          "Der IT-Sektor hat die letzten gut zehn Jahre das Wachstum der US-Börsen angeführt, und VGT hat in dieser Zeit oft den Marktdurchschnitt übertroffen. Das ist aber der Lohn für die Konzentration auf einen einzelnen Sektor – keine Garantie, dass sich dieser Trend fortsetzt.",
          "In Phasen steigender Zinsen oder wachsender Sorgen um Tech-Bewertungen ist VGT tendenziell tiefer gefallen als der Marktdurchschnitt. So breit gestreut er wirkt, bleibt er letztlich auf ein einziges Thema – 'Technologie' – konzentriert, ein klarer Unterschied zu breit gestreuten Produkten wie SPY oder VT."
        ]
      },
      {
        "h": "Wenn du per Sparplan einsteigst",
        "paras": [
          "VGT ist ein US-notierter ETF. Du kaufst ihn mit Euro, und der Euro/Dollar-Wechselkurs wirkt zusätzlich auf deine Rendite. Wie Kursgewinne besteuert werden, hängt von deinem Land und deiner Situation ab – das kann sich zudem ändern; frag im Zweifel eine Steuerberatung.",
          "Je schwankungsstärker ein Asset ist, desto mehr kann der Sparplan-Effekt ('bei niedrigen Kursen automatisch mehr kaufen') zu deinen Gunsten wirken – bei einem ungünstigen Startzeitpunkt kannst du aber auch lange unter deinem Einsatz bleiben. Weil die Vergangenheit die Zukunft nicht garantiert, probier im Rechner ruhig verschiedene Startzeitpunkte aus."
        ]
      }
    ]
  },
  "VNQ": {
    "lead": "VNQ (Vanguard Real Estate ETF) bündelt rund 150 in den USA notierte Immobiliengesellschaften (REITs). Vanguard hat ihn 2004 aufgelegt; er folgt dem MSCI US REIT Index. Er verteilt dein Geld auf Firmen, die Lagerhallen, Rechenzentren, Gewerbeimmobilien und Wohnimmobilien besitzen und betreiben – eine der bekanntesten Arten, in Immobilien zu streuen, ohne selbst eine zu kaufen.",
    "sections": [
      {
        "h": "Was ist ein REIT?",
        "paras": [
          "Ein REIT (Real Estate Investment Trust) sammelt Kapital von vielen Anlegern ein, kauft davon Gewerbeimmobilien und schüttet die daraus erzielten Mieteinnahmen als Dividende aus. Nach US-Steuerrecht muss ein REIT mindestens 90 % seines steuerpflichtigen Einkommens als Dividende ausschütten, um von Steuervorteilen zu profitieren – strukturell bedingt ist der Dividendenanteil deshalb hoch. VNQ bündelt dutzende bis Hunderte solcher REITs in einem Produkt.",
          "Die enthaltenen Immobilienarten sind vielfältig: Logistikzentren, Mobilfunk-Infrastruktur, Rechenzentren, Einkaufszentren, Wohnungen sowie Kliniken und Pflegeeinrichtungen sind nach Segment aufgeteilt. Du bist also nicht in ein einzelnes Gebäude investiert, sondern breit über mehrere Immobilientypen gestreut."
        ]
      },
      {
        "h": "Ungewöhnlich zinsempfindlich",
        "paras": [
          "REITs finanzieren Immobilienkäufe oft stark über Kredite. Steigen die Zinsen, wachsen die Zinskosten und neue Investitionen werden unattraktiver, was den Kurs drückt. Sinken die Zinsen, wirkt sich das meist umgekehrt günstig aus. Deshalb reagiert VNQ sensibler auf Zinsnachrichten als andere US-Aktien-ETFs.",
          "Dadurch trägt VNQ Züge einer 'Aktie, die sich wie eine Anleihe verhält'. Man hält es wegen des stetigen Cashflows aus Mieteinnahmen, muss aber wissen, dass der Kurs je nach Zinsumfeld selbst ziemlich stark schwanken kann."
        ]
      },
      {
        "h": "Ähnlich wie SCHD und doch anders – ein Dividendenwert",
        "paras": [
          "Während SCHD solide Unternehmen aus vielen Branchen bündelt, die ihre Dividende stetig erhöht haben, konzentriert sich VNQ ausschließlich auf die Immobilien-(REIT)-Branche. Auch die Art der Dividende unterscheidet sich: SCHDs Dividende stammt aus Unternehmensgewinnen, während REITs gesetzlich verpflichtet sind, den Großteil ihres Gewinns auszuschütten – deshalb liegt die Dividendenrendite oft höher.",
          "Eine hohe Dividendenrendite heißt aber nicht automatisch eine bessere Gesamtrendite (Kursentwicklung plus Dividende). Es gab Phasen, in denen die Gesamtrendite von VNQ unter der von SPY oder SCHD lag. Am besten steigt ein, wer Verständnis für und Vertrauen in die spezielle Anlageklasse Immobilien hat."
        ]
      },
      {
        "h": "Steuern und der Sparplan-Ansatz",
        "paras": [
          "Wie Dividenden und Kursgewinne besteuert werden, hängt von deinem Land und deiner Situation ab und kann sich ändern – frag dazu am besten eine Steuerberatung. Die Zahlen auf dieser Seite sind ein Vorsteuerwert auf Basis des um Dividenden bereinigten Kurses, also unter der Annahme, dass Dividenden wieder angelegt werden.",
          "Als US-Dollar-Anlagewert wirkt zusätzlich der Euro/Dollar-Wechselkurs auf deine Rendite in Euro. Weil VNQ stark am Immobilien- und Zinszyklus hängt, kann das Ergebnis je nach Startzeitpunkt stark schwanken. Die Vergangenheit garantiert die Zukunft nicht – vergleiche im Rechner am besten mehrere Startzeitpunkte, bevor du urteilst."
        ]
      }
    ]
  },
  "GLD": {
    "lead": "GLD (SPDR Gold Shares) bildet die Wertentwicklung von physischem Gold ab. State Street hat ihn 2004 aufgelegt; über einen Trust, der tatsächlich Goldbarren lagert, folgt er unmittelbar dem Goldpreis. Es handelt sich nicht um eine Aktie, sondern um ein Investment in einen Rohstoff (Gold) – vom Charakter her grundlegend anders als die übrigen Werte auf dieser Seite.",
    "sections": [
      {
        "h": "GLD ist kein Unternehmen, sondern ein Anteil an einem 'Goldlager'",
        "paras": [
          "Kaufst du eine GLD-Aktie, erwirbst du einen anteiligen Eigentumsanspruch an Goldbarren, die tatsächlich in einem Tresor liegen. Anders als ein indexnachbildender Aktien-ETF steigt und fällt der Wert von GLD unabhängig von Unternehmensgewinnen oder Wachstum – ausschließlich nach dem internationalen Goldpreis. Deshalb gibt es weder Dividende noch Zinsen: Gold selbst erwirtschaftet keine laufenden Erträge.",
          "Die Kosten für Lagerung und Verwaltung werden Jahr für Jahr in kleinen Anteilen vom Vermögen abgezogen (laufende Kosten). Der Hauptvorteil von GLD ist, dass du wie eine Aktie handeln kannst, ohne dich um den Kauf und die sichere Aufbewahrung von physischem Gold kümmern zu müssen."
        ]
      },
      {
        "h": "Warum überhaupt Gold ins Portfolio?",
        "paras": [
          "Gold gilt traditionell als Asset mit geringer Korrelation zu Aktien und Anleihen. Wenn die Börsen stark schwanken oder Sorgen um die Werthaltigkeit von Währungen zunehmen, fließt oft Kapital in Gold – daher der Ruf als 'krisenfest' und 'Inflationsschutz'.",
          "Diese Korrelation ist aber nicht immer konstant. In Phasen starken Dollars, steigender Zinsen oder bestimmter Marktstimmung ist der Goldpreis mitunter zusammen mit Aktien gefallen, und es gab auch lange Phasen seitwärts gerichteter Bewegung. Statt der einfachen Formel 'fallen Aktien, steigt Gold' ist es realistischer, Gold als Beimischung zu betrachten, von der man sich einen gewissen Diversifikationseffekt erhofft."
        ]
      },
      {
        "h": "Kein wachsendes, sondern ein 'wertbewahrendes' Asset",
        "paras": [
          "Aktien-ETFs wie SPY oder QQQ setzen darauf, dass Unternehmen Gewinne erzielen, wachsen und dadurch langfristig an Wert gewinnen. Gold dagegen schafft keinen neuen Wert – sein Preis richtet sich nach Knappheit sowie Angebot und Nachfrage der Marktteilnehmer. Über sehr lange Zeiträume lag die Rendite deshalb oft unter der von Aktien.",
          "Auch die Zahlen im Ergebnisfeld oben können diesen Charakter zeigen. Gold eignet sich eher dazu, die Schwankung des Gesamtportfolios zu dämpfen, als dazu, dein Vermögen kräftig zu vermehren – mit diesem Verständnis solltest du an GLD herangehen."
        ]
      },
      {
        "h": "Sparplan, Steuern und was du beachten solltest",
        "paras": [
          "GLD ist ein US-notierter ETF. Wie Kursgewinne besteuert werden, hängt von deinem Land und deiner Situation ab – frag dazu am besten eine Steuerberatung. Da es keine Dividende gibt, entfällt zumindest diese Frage; dafür fließt der gesamte Kursanstieg in den steuerpflichtigen Gewinn.",
          "Der Goldpreis wird in Dollar notiert, sodass zusätzlich der Euro/Dollar-Wechselkurs auf deinen Ertrag in Euro wirkt. Willst du dein Vermögen wie mit dem Rechner oben angepeilt aktiv vermehren, ist es üblicher, Gold nur als kleinen Baustein neben Aktien-ETFs beizumischen, statt allein darauf zu sparen. Die Vergangenheit garantiert die Zukunft nicht; dieser Text dient der Information und ist keine Anlageberatung."
        ]
      }
    ]
  },
  "TLT": {
    "lead": "TLT (iShares 20+ Year Treasury Bond ETF) bündelt ausschließlich US-Staatsanleihen mit einer Restlaufzeit von über 20 Jahren. iShares (BlackRock) hat ihn 2002 aufgelegt; er investiert in extralange Anleihen, die die US-Regierung begibt. Es handelt sich um Anleihen statt Aktien, weshalb sich der Risikocharakter von den übrigen Werten auf dieser Seite unterscheidet.",
    "sections": [
      {
        "h": "Ein Anleihen-ETF ist ein 'Verleihen-gegen-Zinsen'-Asset",
        "paras": [
          "Eine Staatsanleihe ist eine Urkunde, die ein Staat bei der Kreditaufnahme ausgibt: Er zahlt über eine festgelegte Laufzeit Zinsen und tilgt am Ende das Kapital. TLT bündelt ausschließlich US-Staatsanleihen mit einer Restlaufzeit von 20 Jahren oder mehr und schüttet die erhaltenen Zinsen monatlich als Ausschüttung aus.",
          "US-Staatsanleihen gelten als eine der bonitätsstärksten Anleihen der Welt, das Ausfallrisiko ist also gering. Das heißt aber – wie unten erklärt – keineswegs, dass der Kurs nicht schwankt."
        ]
      },
      {
        "h": "Je länger die Laufzeit, desto zinsempfindlicher",
        "paras": [
          "Anleihekurse bewegen sich entgegengesetzt zum Marktzins. Steigen die Zinsen, verlieren bestehende, niedriger verzinste Anleihen an Attraktivität und ihr Kurs fällt; sinken die Zinsen, steigt der Kurs. Diese Reaktion fällt umso stärker aus, je länger die Restlaufzeit ist – und weil TLT ausschließlich Anleihen mit über 20 Jahren Laufzeit hält, ist diese Reaktion besonders ausgeprägt.",
          "Deshalb schwankt der Kurs von TLT trotz seines Rufs als 'sicherer Hafen' erheblich. In Phasen, in denen Zentralbanken die Zinsen schnell angehoben haben, ist der TLT-Kurs zeitweise fast so stark gefallen wie Aktien. Wer nur mit der Gleichung 'Staatsanleihe = sicher' herangeht, kann von diesen Kursausschlägen überrascht werden."
        ]
      },
      {
        "h": "Die Formel 'Anleihen laufen entgegengesetzt zu Aktien' stimmt nicht immer",
        "paras": [
          "Traditionell gelten Anleihen als Asset, das sich gegenläufig zu Aktien bewegt und so ein Portfolio stabilisiert: Fällt die Konjunktur und mit ihr die Aktienkurse, senkt die Zentralbank die Zinsen, wodurch Anleihekurse steigen.",
          "In Phasen, in denen die Zinsen wegen hoher Inflation angehoben werden müssen, kann diese Formel jedoch außer Kraft gesetzt sein. Tatsächlich sind Aktien und TLT in Zeiten stark steigender Inflation und schnell steigender Zinsen gemeinsam gefallen, sodass der erhoffte Diversifikationseffekt ausblieb. Solche Ausnahmesituationen solltest du im Hinterkopf behalten, wenn du TLT ins Portfolio nimmst."
        ]
      },
      {
        "h": "Sparplan, Steuern und die Asset-Allokations-Perspektive",
        "paras": [
          "TLT ist ein US-notierter ETF. Wie Kursgewinne und Ausschüttungen (Zinsen) besteuert werden, hängt von deinem Land und deiner Situation ab – frag dazu am besten eine Steuerberatung. Als Dollar-Anlagewert wirkt außerdem der Euro/Dollar-Wechselkurs auf deine Rendite in Euro. Die Zahlen auf dieser Seite sind ein Vorsteuerwert auf Basis des um Zinsen bereinigten Kurses (Wiederanlage der Zinsen).",
          "TLT wird seltener wegen langfristigen Kurswachstums wie ein Aktien-ETF gehalten, sondern häufiger, um die Schwankung des Gesamtportfolios zu steuern oder um auf sinkende Zinsen zu setzen. Das Ergebnis, wenn du im Rechner oben nur TLT ansparst, ist immer nur eine Simulation für einen bestimmten historischen Zeitraum – auch bei Anleihen kann das Ergebnis je nach Startzeitpunkt stark variieren. Dieser Text dient der Information und ist keine Anlageberatung."
        ]
      }
    ]
  },
  "AGG": {
    "lead": "AGG (iShares Core U.S. Aggregate Bond ETF) streut breit über den gesamten US-Anleihemarkt. iShares (BlackRock) hat ihn 2003 aufgelegt; er bündelt Tausende Investment-Grade-Anleihen – US-Staatsanleihen, staatsnahe Anleihen, Unternehmensanleihen und hypothekenbesicherte Wertpapiere (MBS). Während sich TLT auf extralange Staatsanleihen konzentriert, mischt AGG Laufzeiten und Anleihearten breit und ist damit eher ein 'Indexfonds für Anleihen'.",
    "sections": [
      {
        "h": "Ein 'Core'-Baustein für den gesamten Anleihemarkt",
        "paras": [
          "Der von AGG abgebildete Bloomberg U.S. Aggregate Bond Index umfasst breit gestreut Investment-Grade-Anleihen (mit einer Bonität über einem bestimmten Mindestniveau), die in den USA begeben wurden – von Staatsanleihen über Unternehmensanleihen und staatsnahe Anleihen bis zu hypothekenbesicherten Wertpapieren. Auch die Laufzeiten reichen breit gemischt von kurz bis lang, sodass keine einzelne Laufzeit oder Emittentengruppe übermäßig dominiert.",
          "Wegen dieser breiten Zusammensetzung gilt AGG oft als 'Core'-Baustein für Anleihen im Portfolio. Statt einzelne Anleihen mühsam selbst auszuwählen, erreichst du mit AGG allein eine breite Streuung über den gesamten US-Anleihemarkt."
        ]
      },
      {
        "h": "Warum AGG weniger schwankt als TLT – kürzere durchschnittliche Laufzeit",
        "paras": [
          "Die durchschnittliche Laufzeit (genauer: Duration) der in AGG enthaltenen Anleihen liegt deutlich unter den über 20 Jahren von TLT. Wie zuvor erklärt, reagieren längere Laufzeiten sensibler auf Zinsänderungen – weil AGG auch kürzer laufende Anleihen mischt, fällt die Kursbewegung bei Zinsschwankungen tendenziell geringer aus als bei TLT.",
          "Das heißt aber nicht, dass der Kurs überhaupt nicht schwankt. In Phasen schneller Zinsänderungen bewegt sich auch AGG mit; in Zeiten steil steigender Zinsen kam es sogar zu für Anleihen ungewöhnlich starken Rückgängen. Diese fielen aber milder aus als bei TLT."
        ]
      },
      {
        "h": "Die Rolle im Zusammenspiel mit Aktien",
        "paras": [
          "AGG wird häufig neben Aktien-Assets wie SPY oder QQQ gehalten, um die Schwankung des Gesamtportfolios zu senken. Die Hoffnung: Wenn Aktien stark schwanken, bewegt sich die Anleihenkomponente vergleichsweise ruhiger oder sogar gegenläufig und wirkt so als Puffer.",
          "Wie bei TLT kann dieser Puffereffekt jedoch schwächer ausfallen, wenn Zinsen zur Inflationsbekämpfung schnell angehoben werden müssen – dann fallen Aktien und Anleihen mitunter gemeinsam. 'Anleihen bedeuten automatisch Sicherheit' greift also zu kurz; wie stark der Diversifikationseffekt ausfällt, hängt von der jeweiligen Marktlage ab."
        ]
      },
      {
        "h": "Steuern und was das für diesen Rechner bedeutet",
        "paras": [
          "AGG ist ein US-notierter ETF. Wie Kursgewinne und Ausschüttungen (Zinsen) besteuert werden, hängt von deinem Land und deiner Situation ab – frag dazu am besten eine Steuerberatung. Die Zahlen auf dieser Seite sind ein Vorsteuerwert auf Basis des um Zinsen bereinigten Kurses (Wiederanlage der Zinsen); der Euro/Dollar-Wechselkurs wirkt zusätzlich auf deine Rendite in Euro.",
          "Anleihen-Assets haben tendenziell eine niedrigere langfristige erwartete Rendite als Aktien-Assets. Sparst du also allein mit AGG auf ein Ziel wie das dieses Rechners, kann das Ergebnis deutlich länger dauern als mit Aktien-Assets wie SPY oder QQQ. Vergleiche diesen Unterschied im Rechner oben direkt, indem du nur das Wertpapier wechselst."
        ]
      }
    ]
  },
  "JEPI": {
    "lead": "JEPI (JPMorgan Equity Premium Income ETF) ist ein aktiv gemanagter ETF, der in US-Standardwerte investiert und gleichzeitig Optionen verkauft, um monatlich zusätzliche Erträge zu erzielen ('Covered Call'-Strategie). JPMorgan Asset Management hat ihn im Mai 2020 aufgelegt; er kombiniert einen Korb schwankungsarmer Qualitätsaktien mit dem Verkauf von Optionen auf den S&P 500, um eine hohe monatliche Ausschüttung anzustreben. Wichtig: Der Zeitraum vor dem Börsenstart (vor Mai 2020) basiert auf dieser Seite nicht auf echten JEPI-Daten, sondern auf synthetischen Daten, die den CBOE S&P 500 BuyWrite Index (BXM) als Ersatzindikator anfügen – lies dazu unbedingt den Abschnitt weiter unten.",
    "sections": [
      {
        "h": "Covered Call – Aufstiegschance verkaufen, dafür Cash kassieren",
        "paras": [
          "Bei einem Covered Call hältst du Aktien und verkaufst gleichzeitig einer anderen Partei eine 'Kaufoption', mit der du dich verpflichtest, die Aktien ab einem bestimmten Kurs zu verkaufen. Als Gegenleistung erhältst du sofort eine Optionsprämie – diese Prämie ist die zentrale Finanzierungsquelle für JEPIs hohe monatliche Ausschüttung.",
          "Umsonst ist das aber nicht. Steigt der Kurs deutlich über den vereinbarten Preis, geht dieser Mehrwert an den Käufer der Option, und JEPI verpasst diesen Teil des Anstiegs. JEPI verzichtet also bewusst auf einen Teil des Kurspotenzials nach oben und erhält dafür einen stetigen Cashflow (die Prämie)."
        ]
      },
      {
        "h": "Was JEPI besonders macht – aktive Aktienauswahl plus ELN-Struktur",
        "paras": [
          "JEPI ist kein einfaches Produkt, das schlicht Optionen auf den S&P 500 verkauft. JPMorgan wählt zunächst nach eigenen Kriterien schwankungsarme, stabile US-Standardwerte aus (aktives Management) und ergänzt das Portfolio über ein Finanzinstrument namens ELN (Equity-Linked Note) um eine Verkaufsposition auf S&P-500-Optionen.",
          "Diese Kombination aus aktiver Titelauswahl und Derivaten macht JEPI komplexer als 'einfach den S&P 500 mit Optionen überziehen'. Je nach Marktlage und Einschätzung des Managements kann sich die Portfoliozusammensetzung leicht verändern – ein Unterschied zu Index-ETFs wie SPY, die einem Index starr folgen."
        ]
      },
      {
        "h": "Der Zeitraum vor dem Börsenstart ist eine Annäherung – bitte unbedingt lesen",
        "paras": [
          "JEPI ist erst im Mai 2020 an die Börse gegangen; echte Handelsdaten gibt es also erst seit gut fünf Jahren. Um einen längeren Backtest-Zeitraum zeigen zu können, hat diese Seite den Zeitraum vor dem Börsenstart mit der Entwicklung des CBOE S&P 500 BuyWrite Index (BXM, der seit 1988 existiert) angefügt, skaliert auf den Kurs von JEPI zum Börsenstart.",
          "BXM ist allerdings ein einfacher, mechanischer Index, der Kaufoptionen auf den gesamten S&P 500 verkauft, während JEPI – wie oben beschrieben – einen aktiv ausgewählten, schwankungsarmen Aktienkorb mit einer ELN-Struktur kombiniert. Beide Strategien folgen zwar demselben Grundprinzip 'Covered Call', unterscheiden sich aber im Detail. Das Ergebnis für den Zeitraum vor dem Börsenstart ist deshalb nur eine Annäherung an 'wie es gewesen wäre, hätte es JEPI schon gegeben' und kann von der tatsächlichen JEPI-Performance abweichen. Dieser Hinweis wird auch im Ergebnisfeld des Rechners angezeigt."
        ]
      },
      {
        "h": "Monatliche Ausschüttung – ein Vorteil in Märkten ohne klares Wachstum",
        "paras": [
          "Das wichtigste Merkmal von JEPI ist die monatliche Ausschüttung. Die Ausschüttungsrendite schwankt je nach Marktvolatilität, liegt aber meist deutlich über der eines gewöhnlichen S&P-500-ETFs. Das macht JEPI bei Menschen im Ruhestand oder bei allen, die einen regelmäßigen Cashflow wünschen, beliebt.",
          "In Phasen, in denen der Kurs seitwärts läuft oder sich nur moderat auf und ab bewegt, kann die Optionsprämie als Puffer wirken und die Gesamtrendite besser ausfallen lassen als bei einem einfachen Indexprodukt wie SPY. Steigt der Markt dagegen kräftig, bleibt JEPI wegen der abgegebenen Kurschancen tendenziell hinter SPY zurück. Vergleiche die Zahlen im Ergebnisfeld oben am besten direkt mit SPY, um diesen Unterschied zu sehen."
        ]
      },
      {
        "h": "Steuern und der Sparplan-Ansatz",
        "paras": [
          "Wie Kursgewinne und die monatlichen Ausschüttungen besteuert werden, hängt von deinem Land und deiner Situation ab und kann sich ändern – frag dazu am besten eine Steuerberatung. Da der Ausschüttungsanteil hoch ist, solltest du dein Ergebnis nach Steuern im Blick behalten.",
          "Berücksichtige zusätzlich die oben beschriebenen Grenzen der synthetischen Daten: Das langfristige Backtest-Ergebnis von JEPI solltest du vorsichtiger interpretieren als bei Werten mit durchgehend echten Kursdaten. Als Dollar-Anlagewert wirkt außerdem der Euro/Dollar-Wechselkurs auf deine Rendite in Euro. Dieser Text dient der Information und ist keine Anlageberatung; auch geschätzte historische Renditen garantieren keine Zukunft."
        ]
      }
    ]
  },
  "JEPQ": {
    "lead": "JEPQ (JPMorgan Nasdaq Equity Premium Income ETF) wendet dieselbe Covered-Call-Strategie wie JEPI an, allerdings bezogen auf den Nasdaq 100. JPMorgan Asset Management hat ihn im Mai 2022 aufgelegt; er kombiniert einen schwankungsarmen, technologielastigen Aktienkorb mit dem Verkauf von Optionen auf den Nasdaq 100 und zahlt monatlich eine Ausschüttung. Weil der Nasdaq 100 selbst stärker schwankt, gilt auch die Optionsprämie – und damit die Ausschüttung – als tendenziell höher als bei JEPI.",
    "sections": [
      {
        "h": "Die Nasdaq-Version von JEPI",
        "paras": [
          "Die Grundstruktur von JEPQ entspricht der von JEPI: Ein aktiv ausgewählter Korb schwankungsarmer Titel wird um eine Optionsverkaufsposition ergänzt, aus der zusätzliche Prämieneinnahmen entstehen. Der Unterschied liegt im Referenzindex – JEPI orientiert sich am S&P 500, JEPQ am technologielastigen Nasdaq 100.",
          "Der Nasdaq 100 ist, wie schon bei QQQ beschrieben, volatiler als der S&P 500. Je schwankungsstärker ein Basiswert ist, desto höher fällt tendenziell die Optionsprämie aus (die Gegenleistung für den Verkauf der Option) – deshalb liegt die Ausschüttungsrendite von JEPQ häufig über der von JEPI."
        ]
      },
      {
        "h": "Der Preis der hohen Ausschüttung – stärker gedeckeltes Aufwärtspotenzial",
        "paras": [
          "Eine hohe Prämie bedeutet auch, dass dem Optionskäufer günstigere Konditionen eingeräumt wurden (etwa ein niedrigerer Ausübungspreis). In Phasen, in denen der Nasdaq 100 kräftig steigt, verzichtet JEPQ deshalb auf einen deutlich größeren Teil des Anstiegs als QQQ. Wegen der Covered-Call-Struktur lassen sich 'hohe Ausschüttung' und 'großes Kurspotenzial nach oben' kaum gleichzeitig haben.",
          "Läuft der Techsektor dagegen seitwärts oder korrigiert, kann die monatlich anfallende Prämie den Rückgang teilweise abfedern. JEPQ ist also weniger eine gerichtete Wette auf den Nasdaq 100 als eine Strategie, die dessen Schwankung in Cashflow verwandeln will."
        ]
      },
      {
        "h": "Kurze Börsenhistorie – warum es keine synthetischen Daten gibt",
        "paras": [
          "JEPQ ist erst im Mai 2022 gestartet, weshalb auf dieser Seite nur gut drei Jahre Daten vorliegen. Bei JEPI ließ sich der Zeitraum vor dem Börsenstart über den seit 1988 existierenden CBOE S&P 500 BuyWrite Index (BXM) annähern; für den Nasdaq 100 gibt es jedoch keinen vergleichbar verlässlichen, langfristigen Covered-Call-Index. Deshalb hat diese Seite für JEPQ – anders als bei JEPI – keine synthetischen Daten erzeugt.",
          "Dadurch ist der Backtest-Zeitraum von JEPQ deutlich kürzer als bei den übrigen Werten auf dieser Seite. Aus einem Zeitraum von nur wenigen Jahren lässt sich noch kein verlässlicher Schluss über einen langfristigen Sparplan ziehen. Bedenke, dass sich der Einfluss einer einzelnen Aufwärts- oder Abwärtsphase in einem so kurzen Zeitraum besonders stark bemerkbar machen kann."
        ]
      },
      {
        "h": "Steuern und Punkte, die du bei der Beurteilung beachten solltest",
        "paras": [
          "Wie Kursgewinne und die monatlichen Ausschüttungen besteuert werden, hängt von deinem Land und deiner Situation ab – frag dazu am besten eine Steuerberatung. Da der Ausschüttungsanteil hoch ist, lohnt sich auch hier ein Blick auf das Ergebnis nach Steuern.",
          "Weil sich die Schwankung des Nasdaq 100 mit der kurzen Börsenhistorie überlagert, solltest du das Backtest-Ergebnis von JEPQ noch vorsichtiger interpretieren als bei den übrigen Werten dieser Seite. Als Dollar-Anlagewert wirkt zudem der Euro/Dollar-Wechselkurs auf deine Rendite in Euro. Dieser Text dient der Information und ist keine Anlageberatung; auch eine – noch dazu kurze – historische Rendite garantiert keine Zukunft."
        ]
      }
    ]
  }
};
