export const ETF_DE: Record<string, { lead: string; sections: { h: string; paras: string[] }[] }> = {
  "QLD": {
    "lead": "QLD (ProShares Ultra QQQ) strebt vor Gebühren und Kosten die doppelte tägliche Wertentwicklung des Nasdaq-100 an. Das Ziel gilt für einen Handelstag, nicht für die Rendite einer gesamten Haltedauer.",
    "sections": [
      {
        "h": "Wie das Tagesziel entsteht",
        "paras": [
          "Der Fonds nutzt Finanzinstrumente einschließlich Derivaten für sein gehebeltes Engagement und passt dieses an Veränderungen seines Werts an. Ein Anteil QLD ist deshalb nicht einfach mit zwei Anteilen QQQ gleichzusetzen."
        ]
      },
      {
        "h": "Der Einfluss der täglichen Verzinsung",
        "paras": [
          "Ein hypothetischer Index steigt an einem Tag um 10% und fällt am nächsten um 9,09%. Damit liegt er ungefähr wieder am Ausgangspunkt. Ein täglich zweifach gehebeltes Produkt steigt um 20% und fällt dann um 18,18%: Aus 100 werden vor Kosten etwa 98,2.",
          "Bei einer anhaltenden Bewegung in eine Richtung wirkt die Verkettung anders. Höhe und Reihenfolge der Tagesrenditen bestimmen das Ergebnis. Die kumulierte Indexrendite zu verdoppeln ergibt daher keine verlässliche Langfristrendite für QLD."
        ]
      },
      {
        "h": "Was ein Sparplan verändert",
        "paras": [
          "Regelmäßige Käufe ändern die zu jedem Termin gekaufte Stückzahl. Sie beseitigen weder den Tageshebel noch Verluste bereits gehaltener Anteile. Finanzierungskosten, Fondskosten und Abweichungen vom Tagesziel beeinflussen ebenfalls den historischen Kurs."
        ]
      }
    ]
  },
  "TQQQ": {
    "lead": "TQQQ (ProShares UltraPro QQQ) strebt vor Gebühren und Kosten die dreifache tägliche Wertentwicklung des Nasdaq-100 an. Der Referenzindex ist derselbe wie bei QLD, der tägliche Multiplikator ist größer.",
    "sections": [
      {
        "h": "Dreifach gilt für einen Tag",
        "paras": [
          "Das Engagement wird täglich angepasst. Ein Indexplus von 10% in einem Monat bedeutet deshalb kein TQQQ-Plus von 30%. Die einzelnen Tagesbewegungen und Kosten verändern das Ergebnis."
        ]
      },
      {
        "h": "Ein hypothetischer Vergleich",
        "paras": [
          "Steigt ein Index erst um 10% und fällt dann um 10%, werden aus 100 noch 99. Bei täglichem Zweifachhebel bleiben vor Kosten 96, bei Dreifachhebel 91. Auch der ungehebelte Index hat in diesem Beispiel einen Verlust.",
          "Die nötige Erholung bezieht sich auf den verbliebenen Wert: Nach 50% Verlust sind 100% Gewinn nötig, nach 75% Verlust 300%. Das sind Rechenbeispiele, keine Vorhersagen eines bestimmten Markteinbruchs."
        ]
      },
      {
        "h": "Zusätzliche Käufe und bestehende Verluste",
        "paras": [
          "Neue Beiträge kaufen zu späteren Kursen, ändern aber nicht die Hebelwirkung auf bestehende Anteile. Auf eine historische Zielüberschreitung kann ein großer Rückgang folgen. Erstes Überschreiten und späterer Depotwert sind daher getrennte Ergebnisse."
        ]
      }
    ]
  },
  "QQQ": {
    "lead": "QQQ (Invesco QQQ Trust) bildet den Nasdaq-100 ohne täglichen Hebel ab. Der Index umfasst große, an der Nasdaq notierte Unternehmen außerhalb des Finanzsektors. Er steht weder für den gesamten US-Markt noch ausschließlich für Informationstechnologie.",
    "sections": [
      {
        "h": "Was im Index steckt",
        "paras": [
          "Neben Informationstechnologie enthält der Index weitere Sektoren außerhalb der Finanzbranche. Die Gewichtungsregeln geben größeren Unternehmen erheblichen Einfluss. Viele Positionen bedeuten deshalb keine gleichmäßige Verteilung."
        ]
      },
      {
        "h": "Unterschiede zu SPY und QLD",
        "paras": [
          "SPY folgt dem S&P 500 mit anderen Aufnahmeregeln und Sektorgrenzen. QLD strebt das Zweifache der Nasdaq-100-Tagesrendite an; QQQ hat dieses Hebelziel nicht. Kosten und Nachbildungsabweichungen bestehen dennoch."
        ]
      },
      {
        "h": "Verkettung und regelmäßige Käufe",
        "paras": [
          "Auch ohne Hebel können aufeinanderfolgende Kursanstiege und Rückgänge einen Verlust ergeben. Bei QQQ entfällt die zusätzliche tägliche Hebelanpassung, nicht die Mathematik der Renditeverkettung.",
          "Ein fester Beitrag kauft bei niedrigeren Preisen mehr Anteile. Fallen die Preise weiter, verlieren auch diese Anteile an Wert. Ein niedrigerer Durchschnittspreis garantiert keinen Gewinn."
        ]
      }
    ]
  },
  "SPY": {
    "lead": "SPY (SPDR S&P 500 ETF Trust) folgt dem S&P 500. Der 1993 aufgelegte börsengehandelte Trust bietet Zugang zu großen US-Unternehmen aus mehreren Branchen.",
    "sections": [
      {
        "h": "Breite mit Grenzen",
        "paras": [
          "Der S&P 500 gewichtet hauptsächlich nach dem um frei handelbare Aktien bereinigten Börsenwert. Sektoren sind nicht gleich gewichtet. Der Index umfasst weder alle US-Unternehmen noch den gesamten Weltmarkt; seine Zusammensetzung folgt den Regeln des Indexanbieters."
        ]
      },
      {
        "h": "Gleicher Index, verschiedene Fonds",
        "paras": [
          "SPY und VOO folgen demselben Index, unterscheiden sich aber etwa in Fondsstruktur, Kosten, Handelsspannen und Nachbildung. Ihre tatsächlichen Renditen sind deshalb nicht exakt identisch. Aktuelle Gebühren stehen in den Unterlagen der Anbieter."
        ]
      },
      {
        "h": "Kurs und Ausschüttungen",
        "paras": [
          "Ausschüttungen sind Teil der Gesamtrendite. Wiederanlage und Auszahlung als Bargeld führen zu anderen Stückzahlen und Zahlungsströmen. Die Simulation folgt der gewählten Dividendeneinstellung.",
          "SPY hat kein tägliches Hebelziel. Verluste bei einem breiten Aktienabschwung bleiben möglich. Die Verteilung über Sektoren ist kein Schutz des eingezahlten Betrags."
        ]
      }
    ]
  },
  "VOO": {
    "lead": "VOO (Vanguard S&P 500 ETF) bildet den S&P 500 ohne Hebel ab. Der Referenzindex ist derselbe wie bei SPY, doch VOO ist ein eigener Fonds mit eigener Kurshistorie und eigenen Kosten.",
    "sections": [
      {
        "h": "Welchen Markt der Index abdeckt",
        "paras": [
          "Der S&P 500 umfasst große US-Unternehmen aus mehreren Sektoren. Größere Unternehmen erhalten mehr Gewicht. Der Index ist weder gleich gewichtet noch eine vollständige Abbildung des US-Aktienmarkts."
        ]
      },
      {
        "h": "Warum ähnliche Fonds abweichen",
        "paras": [
          "Fondskosten, der Umgang mit Bargeld und Ausschüttungen sowie Nachbildungsabweichungen beeinflussen die Rendite. Beim tatsächlichen Handel kommen Marktpreise und Geld-Brief-Spannen hinzu. Eine Schlusskurssimulation bildet diese nicht vollständig ab."
        ]
      },
      {
        "h": "Historie und Wiederanlage",
        "paras": [
          "VOOs eigene Handelshistorie beginnt 2010. Frühere S&P-500-Daten sind kein tatsächlicher VOO-Anlageverlauf. Indexgeschichte und verfügbare Fondsdaten müssen getrennt werden.",
          "Wiederangelegte Ausschüttungen erhöhen die simulierte Stückzahl. Sie erzeugen keine zusätzliche garantierte Rendite: Kurse können fallen, und tatsächliche Steuern oder Ausführungskosten verändern das Ergebnis."
        ]
      }
    ]
  },
  "SCHD": {
    "lead": "SCHD (Schwab U.S. Dividend Equity ETF) folgt dem Dow Jones U.S. Dividend 100 Index. Die Auswahl berücksichtigt Dividendenhistorie und Finanzkennzahlen, statt nur die höchsten aktuellen Ausschüttungsrenditen zu suchen.",
    "sections": [
      {
        "h": "Was die Auswahlregeln aussagen",
        "paras": [
          "Der Index verbindet Dividendenkriterien mit Kennzahlen wie Rentabilität und dem Verhältnis von Cashflow zu Schulden. Seine Sektorverteilung kann deutlich von einem breiten Aktienindex abweichen. Die Kriterien versprechen kein künftiges Dividendenwachstum."
        ]
      },
      {
        "h": "Ausschüttung und Gesamtrendite",
        "paras": [
          "SCHD schüttet vierteljährlich statt monatlich aus; die Beträge können schwanken. Zur Gesamtrendite gehören auch Kursänderungen. Eine hohe Ausschüttungsrendite belegt für sich genommen keinen höheren Anlagegewinn."
        ]
      },
      {
        "h": "Einheitliche Vergleichsbedingungen",
        "paras": [
          "Die Wiederanlage ist beim Vergleich mit stärker kursgetriebenen Fonds relevant. Zeitraum und Dividendeneinstellung müssen übereinstimmen.",
          "Ein Dividendenfokus beseitigt das Aktienrisiko nicht. Unternehmen können Zahlungen kürzen, Fondskurs und Ausschüttungen können gleichzeitig sinken. Die Simulation bildet nicht die individuelle Besteuerung jedes Anlegers ab."
        ]
      }
    ]
  },
  "VT": {
    "lead": "VT (Vanguard Total World Stock ETF) folgt dem FTSE Global All Cap Index. Er umfasst Aktien aus Industrie- und Schwellenländern sowie unterschiedliche Unternehmensgrößen.",
    "sections": [
      {
        "h": "Weltweit bedeutet nicht gleich verteilt",
        "paras": [
          "Länder- und Unternehmensgewichte richten sich nach dem Börsenwert und den Indexregeln. VT verteilt kein gleich großes Budget auf jedes Land. Seine regionale Zusammensetzung verändert sich mit den Märkten."
        ]
      },
      {
        "h": "Gemeinsame Risiken trotz Streuung",
        "paras": [
          "Eine breite Länderstreuung reduziert die Abhängigkeit von einem lokalen Markt. Weltweite Aktienmärkte können dennoch gleichzeitig fallen. Wechselkurse, örtliche Marktbedingungen und politische Risiken wirken ebenfalls auf die Anlagen."
        ]
      },
      {
        "h": "Handelswährung und Währungsrisiko",
        "paras": [
          "VT wird in US-Dollar gehandelt, hält aber Unternehmen aus unterschiedlichen Währungsräumen. Die Dollarnotierung hebt diese Währungseinflüsse nicht auf. Eine Bewertung in Euro enthält eine weitere Umrechnung.",
          "Ausschüttungen und Kurse tragen zur Gesamtrendite bei. Ein Vergleich mit SPY oder QQQ betrifft unterschiedliche Länder- und Sektorengagements, nicht bloß verschiedene Anbieter desselben Index."
        ]
      }
    ]
  },
  "SOXX": {
    "lead": "SOXX (iShares Semiconductor ETF) konzentriert sich auf in den USA notierte Halbleiter- und Halbleiterausrüstungsunternehmen. Als Branchenfonds ist sein Anlageuniversum enger als das eines breiten Technologie- oder Marktindex.",
    "sections": [
      {
        "h": "Mehrere Unternehmen, eine Branche",
        "paras": [
          "Chipentwicklung, Fertigung und Produktionsausrüstung besetzen unterschiedliche Stellen der Lieferkette. Mehrere Unternehmen streuen einzelne Geschäftsrisiken, bleiben aber gemeinsam von Chipnachfrage, Lagerbeständen und Investitionsausgaben abhängig."
        ]
      },
      {
        "h": "Warum der Branchenzyklus zählt",
        "paras": [
          "Nachfrage und Produktionskapazität verändern sich nicht immer gleichzeitig. Engpässe, Überbestände und geänderte Investitionspläne von Kunden können Gewinne und Bewertungen in der gesamten Branche beeinflussen.",
          "Mehr Anwendungen für Chips bedeuten nicht automatisch einen Anlagegewinn. Im Kaufpreis stecken bereits Erwartungen an dieses Wachstum."
        ]
      },
      {
        "h": "Abgrenzung zu VGT und QQQ",
        "paras": [
          "VGT deckt den breiteren Informationstechnologiesektor ab, QQQ folgt den Nasdaq-100-Auswahlregeln außerhalb der Finanzbranche. Die Bestände können sich überschneiden. Mehrere dieser Fonds reduzieren daher nicht automatisch die Abhängigkeit von denselben Unternehmen oder Konjunkturzyklen."
        ]
      }
    ]
  },
  "VGT": {
    "lead": "VGT (Vanguard Information Technology ETF) investiert in den US-Sektor Informationstechnologie, darunter Software, Hardware, Halbleiter und IT-Dienstleistungen. Die Sektorklassifikation bestimmt den Umfang.",
    "sections": [
      {
        "h": "Technologie als formale Kategorie",
        "paras": [
          "Ein Unternehmen kann im Alltag als Technologiefirma gelten und am Kapitalmarkt dennoch einem anderen Sektor zugeordnet sein. VGT enthält deshalb nicht jedes Unternehmen, das umgangssprachlich als Tech-Firma bezeichnet wird."
        ]
      },
      {
        "h": "Überschneidung ist keine zusätzliche Streuung",
        "paras": [
          "VGT kann Bestände mit QQQ und SOXX teilen, die Auswahlregeln unterscheiden sich aber. QQQ enthält weitere nichtfinanzielle Sektoren; SOXX beschränkt sich auf Halbleiter und zugehörige Ausrüstung.",
          "Bei einer Gewichtung nach Börsenwert können große Unternehmen den Fonds stark prägen. Die Anzahl der Positionen allein beschreibt nicht, wie gleichmäßig das Risiko verteilt ist."
        ]
      },
      {
        "h": "Was das Ergebnis beeinflusst",
        "paras": [
          "Gewinnerwartungen, Zinsen und Bewertungen bewegen Sektorkurse. Technischer Fortschritt kann mit fallenden Aktienkursen einhergehen, wenn Erwartungen oder Kaufpreise zu hoch waren. Regelmäßige Käufe ändern Einstiegspreise, lassen die Sektorkonzentration aber bestehen."
        ]
      }
    ]
  },
  "VNQ": {
    "lead": "VNQ (Vanguard Real Estate ETF) hält US-Immobilienaktien einschließlich Real Estate Investment Trusts, kurz REITs. Anleger erwerben damit börsengehandelte Immobilienunternehmen statt eines bestimmten Gebäudes.",
    "sections": [
      {
        "h": "Unterschiedliche Immobiliengeschäfte",
        "paras": [
          "Wohnungen, Logistikflächen, Einzelhandel und andere Immobilien unterscheiden sich bei Mietern, Vertragslaufzeiten, Auslastung und Finanzierung. Eine Verteilung über mehrere Geschäftsmodelle lässt den Schwerpunkt Immobilien bestehen."
        ]
      },
      {
        "h": "Zinsen sind nur ein Einfluss",
        "paras": [
          "Finanzierungskosten und die Renditen anderer Anlagen beeinflussen Immobilienbewertungen. Ebenso zählen Mietwachstum, Betriebskosten und Leerstand. Die Zinsrichtung allein bestimmt deshalb VNQs Rendite nicht."
        ]
      },
      {
        "h": "Ausschüttungen sind keine feste Miete",
        "paras": [
          "Immobilienunternehmen können Erträge ausschütten, doch Beträge und Aktienkurse verändern sich. Die Ausschüttungsrendite ist von der Gesamtrendite einschließlich Kursänderungen zu unterscheiden.",
          "VNQ verspricht weder einen Immobiliengutachtenwert noch feste Mietzahlungen oder die Rückzahlung des Anlagebetrags. Eine Simulation mit Wiederanlage unterscheidet sich außerdem von einer Anlage, deren Ausschüttungen entnommen werden."
        ]
      }
    ]
  },
  "GLD": {
    "lead": "GLD (SPDR Gold Shares) ist ein durch physisches Gold gedeckter Trust. Seine Anteile vermitteln die Entwicklung des Goldpreises nach Trustkosten statt der Gewinne von Goldminenunternehmen.",
    "sections": [
      {
        "h": "Was ein Anteil bedeutet",
        "paras": [
          "Der Trust hält Goldbarren. Der gewöhnliche Börsenkauf ist ein Kauf von Trustanteilen, keine Vereinbarung, einen kleinen Goldbarren bei einer Bank abzuholen. Für die Ausgabe und Rücknahme großer Anteilskörbe gelten eigene Verfahren."
        ]
      },
      {
        "h": "Gold erwirtschaftet kein Betriebseinkommen",
        "paras": [
          "Gold selbst zahlt weder Zinsen noch Unternehmensdividenden. Kosten verringern im Zeitverlauf die Goldmenge je Anteil. Die Anteilsrendite kann deshalb von einem einfachen Goldpreisdiagramm abweichen."
        ]
      },
      {
        "h": "Keine feste Absicherungsformel",
        "paras": [
          "Golds Verhältnis zu Aktien, Anleihen, Inflation und Währungen verändert sich. Es kann mit anderen Anlagen fallen und über einen gewählten Zeitraum Kaufkraft verlieren.",
          "Der Goldpreis in Dollar und ein in Euro umgerechnetes Ergebnis sind unterschiedliche Größen. Die Umrechnung berücksichtigt zusätzlich den Wechselkurs; keine der beiden Größen garantiert Werterhalt."
        ]
      }
    ]
  },
  "TLT": {
    "lead": "TLT (iShares 20+ Year Treasury Bond ETF) folgt US-Staatsanleihen mit mehr als 20 Jahren Restlaufzeit. Prägend ist sein Engagement in langfristigen Zinsen.",
    "sections": [
      {
        "h": "Bonität und Kursrisiko",
        "paras": [
          "Die Kreditqualität eines Staates und ein stabiler Börsenkurs sind unterschiedliche Eigenschaften. Langfristige Anleihekurse können stark auf geänderte Marktrenditen reagieren. Ein gering eingeschätztes Ausfallrisiko schützt TLTs Anteilskurs nicht vor Verlusten."
        ]
      },
      {
        "h": "Duration ist nicht Laufzeit",
        "paras": [
          "Die Laufzeit beschreibt die Zeit bis zur Rückzahlung einer Anleihe. Die Duration misst die Kursempfindlichkeit gegenüber Renditeänderungen. Beide hängen zusammen, sind aber nicht austauschbar."
        ]
      },
      {
        "h": "Der Fonds hat keinen einzigen Rückzahlungstag",
        "paras": [
          "TLT ersetzt Anleihen, die seine Indexregeln nicht mehr erfüllen. Ein ETF-Anteil entspricht daher nicht einer einzelnen Staatsanleihe, die bis zu einem bekannten Rückzahlungstermin gehalten wird.",
          "Zinsausschüttungen gehören zur Gesamtrendite. Aktien und langlaufende Anleihen können auch gemeinsam fallen. Die Berechnung setzt nicht voraus, dass TLT Aktienverluste stets ausgleicht."
        ]
      }
    ]
  },
  "AGG": {
    "lead": "AGG (iShares Core U.S. Aggregate Bond ETF) folgt einem breiten Index von Investment-Grade-Anleihen in US-Dollar, darunter Staatsanleihen, Unternehmensanleihen und hypothekenbesicherte Wertpapiere. Nicht jedes Anleihesegment ist enthalten.",
    "sections": [
      {
        "h": "Emittenten und Laufzeiten",
        "paras": [
          "Der Investment-Grade-Schwerpunkt unterscheidet sich von Hochzinsanleihen. Die breite Laufzeitmischung unterscheidet sich von TLTs langfristigen Staatsanleihen. Emittenten und Laufzeitgruppen sind nicht gleich gewichtet."
        ]
      },
      {
        "h": "Risiken neben dem Zins",
        "paras": [
          "Staats- und Unternehmensanleihen tragen unterschiedliche Kreditrisiken. Bei hypothekenbesicherten Wertpapieren verändert sich außerdem der Rückzahlungszeitpunkt, wenn Schuldner je nach Zinsniveau umschulden oder vorzeitig tilgen.",
          "Die Duration beschreibt die Zinsempfindlichkeit, nicht einen Rückzahlungstermin für ETF-Anleger. AGG hat keinen festen Endtermin, an dem der Kaufpreis garantiert wieder erreicht wird."
        ]
      },
      {
        "h": "Den historischen Wert einordnen",
        "paras": [
          "Zinsausschüttungen und Marktpreisänderungen beeinflussen gemeinsam die Gesamtrendite. Wiederanlage verändert die Stückzahl, beseitigt aber Verlustrisiken nicht.",
          "Ein Aktienvergleich zeigt unterschiedliche Anlagen in einem bestimmten vergangenen Zeitraum. Daraus lässt sich keine feste Zahl zusätzlicher Jahre ableiten, die Anleihen für ein künftiges Ziel benötigen würden."
        ]
      }
    ]
  },
  "JEPI": {
    "lead": "JEPI (JPMorgan Equity Premium Income ETF) wird aktiv verwaltet. Der Fonds verbindet große US-Aktien mit optionsbezogenem Engagement über Equity-Linked Notes, kurz ELNs, und verfolgt damit ein Ertragsziel.",
    "sections": [
      {
        "h": "Erträge und begrenzte Kurschancen",
        "paras": [
          "Optionsprämien können Ausschüttungen finanzieren. Die Strategie kann gleichzeitig die Teilnahme an einem starken Aktienanstieg begrenzen. Prämien schützen nicht vor allen Aktienverlusten, und Ausschüttungsbeträge können schwanken."
        ]
      },
      {
        "h": "Warum ELNs relevant sind",
        "paras": [
          "Eine ELN wird von einer Gegenpartei ausgegeben. Zusätzlich zu Aktien- und Optionsrisiken entstehen dadurch Gegenpartei-, Bewertungs- und Liquiditätsrisiken. JEPI ist kein einfacher S&P-500-Fonds mit festem Zinsaufschlag."
        ]
      },
      {
        "h": "Tatsächliche Historie und geschätzte Vergleiche",
        "paras": [
          "JEPI wird seit Mai 2020 gehandelt. Der Hauptrechner verwendet die tatsächliche Handelshistorie. Ausschließlich beim ETF-Vergleich kann ein früherer Abschnitt mit dem BXM-Buy-write-Index als gekennzeichnete Schätzung ergänzt werden.",
          "BXM verwendet andere Aktien- und Optionsregeln. Dieser Abschnitt ist keine erzielte JEPI-Rendite und bildet die Entscheidungen des Fondsmanagements nicht nach. Quelle und geschätzter Zeitraum werden beim Vergleich ausgewiesen."
        ]
      }
    ]
  },
  "JEPQ": {
    "lead": "JEPQ (JPMorgan Nasdaq Equity Premium Income ETF) kombiniert ein aktiv verwaltetes Aktienportfolio mit Nasdaq-100-bezogenem Optionsengagement über ELNs. Die Aktienausrichtung unterscheidet sich von JEPI.",
    "sections": [
      {
        "h": "Referenzindex und Portfolio",
        "paras": [
          "Der Nasdaq-100 dient als Bezugspunkt, doch JEPQ bildet nicht einfach QQQ nach. Sowohl die aktive Aktienauswahl als auch die Optionskomponente können die Rendite vom Index abweichen lassen."
        ]
      },
      {
        "h": "Prämien und Aufwärtspotenzial",
        "paras": [
          "Die Optionsprämie hängt unter anderem von Schwankungen, Basispreis und Restlaufzeit ab. Eine höhere Prämie beweist für sich genommen weder einen niedrigeren Basispreis noch garantiert sie höhere Ausschüttungen als bei JEPI.",
          "Die Optionsstrategie kann einen Teil der Kursgewinne abgeben, während erhebliche Aktienverluste möglich bleiben. ELNs bringen außerdem Gegenpartei- und Liquiditätsrisiken mit sich."
        ]
      },
      {
        "h": "Die verfügbare Historie",
        "paras": [
          "JEPQ wird seit Mai 2022 gehandelt. Diese Website verlängert seine Historie nicht mit einem Ersatzindex. Das ist eine Entscheidung über diesen Datensatz, keine Behauptung, es gebe keinen Nasdaq-100-Optionsindex.",
          "Seine Historie enthält weniger Marktzyklen als die eines älteren Fonds. Ein kurzes Ergebnis belegt nicht, wie sich die Strategie in früheren Krisen entwickelt hätte."
        ]
      }
    ]
  }
};
