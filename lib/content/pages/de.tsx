import type { ReactNode } from "react";
import Link from "next/link";
import { localeHref } from "@/lib/i18n/seo";
import { Sources } from "@/components/Sources";

import { authorName, CONTACT_EMAIL } from "@/lib/site";

export const DCA_DE = {
  metaTitle: "Was regelmäßige Käufe verändern",
  metaDescription: "Fester Betrag, wechselnde Stückzahl",
  head: {
    title: "Was regelmäßige Käufe verändern",
    desc: "Fester Betrag, wechselnde Stückzahl",
    crumb: "Ratgeber · Sparplan",
  },
  Body: () => (
    <>
      <h2>Eine Kaufregel, keine Renditeprognose</h2>
      <p>Bei einem Sparplan wird in regelmäßigen Abständen derselbe Betrag investiert. Monatliche Käufe aus dem Gehalt sind ein Beispiel; wöchentliche Käufe oder Käufe an jedem Handelstag folgen derselben Rechnung. Ein fester Betrag kauft bei niedrigen Kursen mehr Anteile und bei hohen Kursen weniger.</p>
      <h2>Ein Rechenbeispiel</h2>
      <p>Drei Käufe von jeweils 600 € zu Kursen von 100 €, 50 € und 100 € ergeben 6, 12 und 6 Anteile. Für 1.800 € entstehen 24 Anteile mit einem durchschnittlichen Kaufpreis von 75 €. Dieser liegt unter dem einfachen Mittel der drei Kurse von 83,33 €, weil zum niedrigen Kurs mehr gekauft wurde.</p>
      <p>Das Beispiel erlaubt Bruchstücke und lässt Kosten weg. Es zeigt einen Durchschnittspreis, keinen Gewinn. Der Endwert hängt weiterhin vom Schlusskurs ab.</p>
      <h2>Das Risiko nach dem Kauf</h2>
      <p>Verteilte Käufe verhindern keine Verluste bereits gehaltener Anteile. Bei weiter fallenden Kursen können auch neue Käufe verlieren. Ein niedrigerer durchschnittlicher Kaufpreis garantiert kein positives Ergebnis.</p>
      <p>Das gilt besonders für Hebel-ETFs: Neue Beiträge verändern weder Tageshebel noch Renditeverkettung, Finanzierungskosten oder die Möglichkeit großer Verluste.</p>
      <h2>Die Umsetzung im Rechner</h2>
      <p>Monatliche, wöchentliche oder handelstägliche Käufe lassen sich mit einer Einmalanlage am historischen Start kombinieren. Der Betrag gilt je Kauf. Derselbe Betrag bei anderer Häufigkeit bedeutet daher andere Gesamteinzahlungen. Zeitraum und Annahmen stehen in den Berechnungsdetails des Ergebnisses.</p>
      <p><a href="https://www.finra.org/investors/insights/dollar-cost-averaging">FINRA: Vorteile und Grenzen regelmäßiger Käufe</a></p>
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const DCA_VS_LUMPSUM_DE = {
  metaTitle: "Sparplan und Einmalanlage",
  metaDescription: "Zuerst klären, wann das Geld verfügbar ist",
  head: {
    title: "Sparplan und Einmalanlage",
    desc: "Zuerst klären, wann das Geld verfügbar ist",
    crumb: "Ratgeber · Sparplan vs. Einmalanlage",
  },
  Body: () => (
    <>
      <h2>Zwei verschiedene Fragen</h2>
      <p>Neu verdientes Einkommen sofort zu investieren ist etwas anderes, als bereits vorhandenes Bargeld schrittweise anzulegen. Nur die zweite Frage vergleicht verschiedene Kaufpläne für dasselbe Startkapital. Ein fairer Vergleich braucht zudem dieselbe Anlage, denselben Zeitraum und eine einheitliche Behandlung des noch nicht investierten Geldes.</p>
      <h2>Steigende und fallende Kurse</h2>
      <p>In einem Beispiel mit stetig steigenden Kursen kauft die frühe Einmalanlage mehr Anteile als spätere Käufe mit demselben Gesamtbudget. Bei während der Kaufphase fallenden Kursen kann schrittweises Anlegen mehr Anteile ergeben. Diese bedingten Beispiele erklären die Rechnung, ohne eine unbekannte Marktentwicklung festzulegen.</p>
      <p>Bei unregelmäßigen Kursen zählen der gesamte Verlauf, die Kaufdaten, der Endkurs und das außerhalb der Anlage verbleibende Geld.</p>
      <h2>Späteres Einkommen ist kein früheres Startkapital</h2>
      <p>Das Gehalt eines späteren Monats stand am ersten Tag noch nicht zur Verfügung. Ein Vergleich mit vollständiger Investition am Start unterstellt sonst zusätzliches Anfangskapital. Zinsen auf wartendes Bargeld, Handelskosten und Steuern können ein tatsächliches Ergebnis ebenfalls verändern.</p>
      <h2>Beide Komponenten im historischen Modell</h2>
      <p>10-eok kann eine Einmalanlage am historischen Start und danach regelmäßige Käufe berechnen. Die Einmalanlage ist kein importierter heutiger Kontostand. Wer bei gleichem Sparbetrag eine Anfangssumme ergänzt, erhöht die Gesamteinzahlung. Damit entsteht noch kein Vergleich beider Methoden mit gleichem Budget.</p>
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const ETF_BASICS_DE = {
  metaTitle: "Was ein ETF hält und wie seine Anteile handeln",
  metaDescription: "Handelsform und Anlageinhalt getrennt betrachten",
  head: {
    title: "Was ein ETF hält und wie seine Anteile handeln",
    desc: "Handelsform und Anlageinhalt getrennt betrachten",
    crumb: "Ratgeber · ETF-Grundlagen",
  },
  Body: () => (
    <>
      <h2>Ein handelbarer Portfolioanteil</h2>
      <p>Ein ETF hält Vermögenswerte oder bildet ein Engagement über Finanzinstrumente ab. Seine Anteile handeln während der Börsenzeiten. Manche Fonds folgen einem Index, andere werden aktiv verwaltet. Die Bezeichnung ETF verrät allein weder Anlageuniversum noch Strategie oder Risiko.</p>
      <h2>Index, Bestände und Konzentration</h2>
      <p>Ein Index ist ein Regelwerk, kein direkt kaufbares Konto. Ein Fonds kann die enthaltenen Wertpapiere halten oder andere erlaubte Methoden einsetzen. Eine Gewichtung nach Börsenwert gibt größeren Unternehmen mehr Einfluss als kleineren; Gleichgewichtung folgt einer anderen Regel.</p>
      <p>Breite Aktienmärkte, Halbleiter, Anleihen und tägliche Hebelstrategien können alle als ETF angeboten werden. Das gemeinsame Handelsformat macht ihre Verlustrisiken nicht gleich. Mehrere Fonds können zudem dieselben Unternehmen halten.</p>
      <h2>Börsenpreis und innerer Wert</h2>
      <p>Der Börsenpreis kann vom Nettoinventarwert je Anteil abweichen. Die Geld-Brief-Spanne ist ein weiterer Handelskostenfaktor. Ausgabe und Rücknahme großer Anteilskörbe verbinden Markt und Fondsvermögen, garantieren aber nicht für jeden Handel einen identischen Preis.</p>
      <h2>Kosten und Ausschüttungen</h2>
      <p>Betriebskosten wirken auf Fondsvermögen und Rendite. Brokergebühren und Ausführungspreise wirken zusätzlich auf den Anleger. Ausschüttungen sind Teil der Gesamtrendite, kein vom Fondswert unabhängiger Bonus.</p>
      <p>Der Rechner vereinfacht die Ausführung mit Tageskursen und Bruchstücken. Er modelliert historische Annahmen und bildet keinen tatsächlichen Depotauszug nach.</p>
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const COMPOUND_72_DE = {
  metaTitle: "Zinseszins und die 72er-Regel",
  metaDescription: "Ein fester Zinssatz ist keine ETF-Prognose",
  head: {
    title: "Zinseszins und die 72er-Regel",
    desc: "Ein fester Zinssatz ist keine ETF-Prognose",
    crumb: "Ratgeber · Zinseszins",
  },
  Body: () => (
    <>
      <h2>Wie Zinseszins entsteht</h2>
      <p>Bleiben Gewinne angelegt, wirken spätere Prozentänderungen auf den veränderten Betrag. Bei hypothetisch konstanten 6% jährlich werden aus 100 zuerst 106 und dann 112,36. Im zweiten Jahr beträgt der Zuwachs 6,36, weil die Basis größer ist. Kosten und weitere Einzahlungen bleiben in diesem Beispiel außen vor.</p>
      <h2>Eine Verdopplungszeit schätzen</h2>
      <p>Die 72er-Regel teilt 72 durch einen positiven jährlichen Prozentsatz. Bei hypothetischen 6% ergibt das zwölf Jahre. Exakt lautet die Rechnung log(2) geteilt durch log(1,06), also etwa 11,9 Jahre.</p>
      <p>Das ist eine Näherung für konstantes Wachstum. Sie beschreibt weder tatsächliche ETF-Kurse noch die Zielerreichung eines Sparplans. Bei null oder negativen Zinssätzen liefert die Regel keine sinnvolle positive Verdopplungszeit.</p>
      <h2>Schwankende Renditen verketten sich anders</h2>
      <p>Ein Plus von 10% und ein anschließendes Minus von 10% machen aus 100 noch 99. Der einfache Durchschnitt der Renditen ist zwar null, das geometrische Ergebnis berücksichtigt aber ihre Multiplikation. Ohne Hebel entfällt dieser Effekt nicht.</p>
      <h2>Einzahlungen sind keine Anlagegewinne</h2>
      <p>Ein Depot kann sich auch durch zusätzliche Einzahlungen verdoppeln. Das unterscheidet sich von einer Verdopplung der ursprünglichen Anlage allein durch Erträge. Bei regelmäßigen Käufen ist jeder Beitrag unterschiedlich lange investiert.</p>
      <p>Eine Verdopplungsfaustregel ersetzt deshalb keine Berechnung mit datierten Zahlungsströmen. Der Rechner nutzt historische Kurse und Kaufdaten; die 72er-Regel bleibt ein eigenständiges mathematisches Beispiel.</p>
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const LEVERAGE_ETF_RISK_DE = {
  metaTitle: "Tägliche Hebelziele und ihre Risiken",
  metaDescription: "Der Multiplikator gilt für einen Tag",
  head: {
    title: "Tägliche Hebelziele und ihre Risiken",
    desc: "Der Multiplikator gilt für einen Tag",
    crumb: "Ratgeber · Risiko",
  },
  Body: () => (
    <>
      <h2>Das Tagesziel</h2>
      <p>QLD strebt vor Gebühren und Kosten die doppelte, TQQQ die dreifache tägliche Nasdaq-100-Wertentwicklung an. Das Engagement wird mit Finanzinstrumenten täglich angepasst. Keines dieser Ziele verspricht denselben Faktor über Monate, Jahre oder eine gesamte Haltedauer.</p>
      <h2>Ein hypothetischer Verlauf</h2>
      <p>Steigt ein Index um 10% und fällt dann um 10%, werden aus 100 noch 99. Ohne Kosten und Nachbildungsabweichungen bleiben bei täglichem Zweifachhebel 96 und bei Dreifachhebel 91. Andere Tagesverläufe ergeben andere Beziehungen zur kumulierten Indexrendite.</p>
      <p>Bei anhaltenden Trends kann die Verkettung auch mehr als das einfache Vielfache ergeben. Das Ergebnis hängt vom Kursverlauf ab; es wird nicht unabhängig vom Markt jeden Tag ein fester Verlustprozentsatz abgezogen.</p>
      <h2>Verluste, Erholung und Kosten</h2>
      <p>Nach 50% Verlust braucht der verbliebene Wert 100% Gewinn zur Erholung, nach 75% Verlust 300%. Die Rechnung beschreibt den erforderlichen Anstieg, nicht die Dauer. Manche Verluste werden möglicherweise nie aufgeholt.</p>
      <p>Zusätzlich zum Hebel wirken Fondskosten, Finanzierungsbedingungen, Derivatepreise und Nachbildungsabweichungen. Eine allein aus dem Index berechnete Reihe ist nicht der tatsächliche Handelsverlauf des ETF.</p>
      <h2>Warum regelmäßige Käufe das Risiko nicht aufheben</h2>
      <p>Beiträge verteilen Kaufpreise, lassen die Hebelstruktur aber bestehen. Ein günstiges historisches Sparplanergebnis belegt nicht, dass fortgesetzte Käufe das Produkt sicher machen. Eine erste Zielüberschreitung sichert den Betrag ebenfalls nicht: Weiter gehaltene Anteile bleiben Kursschwankungen ausgesetzt.</p>
      <Sources locale="de" ids={["prosharesQld", "prosharesTqqq"]} />
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const NASDAQ100_VS_SP500_DE = {
  metaTitle: "Nasdaq-100 und S&P 500: unterschiedliche Auswahlregeln",
  metaDescription: "Erst das Engagement, dann den historischen Wert vergleichen",
  head: {
    title: "Nasdaq-100 und S&P 500: unterschiedliche Auswahlregeln",
    desc: "Erst das Engagement, dann den historischen Wert vergleichen",
    crumb: "Ratgeber · Indexvergleich",
  },
  Body: () => (
    <>
      <h2>Welche Unternehmen ausgewählt werden</h2>
      <p>Der Nasdaq-100 konzentriert sich auf große, an der Nasdaq notierte Unternehmen außerhalb des Finanzsektors. Der S&amp;P 500 umfasst große US-Unternehmen nach eigenen Zulassungs- und Auswahlregeln und schließt Finanzunternehmen ein. Keiner ist ein vollständiges Weltaktienportfolio.</p>
      <h2>Branchen und Gewichtung</h2>
      <p>Der Nasdaq-100 ist formal kein reiner Technologieindex, obwohl technologiebezogene Unternehmen großen Einfluss haben können. Der S&amp;P 500 deckt mehr Sektoren ab, verteilt sie aber nicht gleichmäßig. Große Unternehmen können beide Indizes prägen.</p>
      <p>Die Bestände überschneiden sich. QQQ mit SPY oder VOO zu kombinieren erzeugt nicht zwangsläufig so viel zusätzliche Streuung, wie die Zahl der Fonds vermuten lässt.</p>
      <h2>Warum sich Renditen unterscheiden</h2>
      <p>Gewinne, Bewertungen, Zinsen und wechselnde Sektorführerschaft wirken unterschiedlich auf beide Körbe. Eine technologielastige Rally und eine breite Branchenerholung können andere Vergleiche ergeben. Aus Indexregeln folgt nicht, welcher Markt im nächsten Zeitraum besser abschneidet.</p>
      <h2>Historische Bedingungen konstant halten</h2>
      <p>QQQ folgt dem Nasdaq-100, SPY und VOO folgen dem S&amp;P 500. Verglichen werden sollten dieselben Daten, Kaufpläne und Ausschüttungsannahmen. Unterschiedliche verfügbare Handelshistorien müssen dennoch offengelegt werden.</p>
      <p>QLD und TQQQ bringen zusätzlich tägliche Hebelwirkung ein. Ihr Ergebnis ist nicht einfach eine stärkere Ausprägung der Wahl zwischen zwei ungehebelten Aktienkörben.</p>
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const QLD_GUIDE_DE = {
  metaTitle: "QLD und sein tägliches Zweifachziel",
  metaDescription: "Indexauswahl und Hebel sind getrennte Entscheidungen",
  head: {
    title: "QLD und sein tägliches Zweifachziel",
    desc: "Indexauswahl und Hebel sind getrennte Entscheidungen",
    crumb: "Ratgeber · QLD",
  },
  Body: () => (
    <>
      <h2>Das Anlageziel</h2>
      <p>ProShares Ultra QQQ mit dem Kürzel QLD strebt vor Gebühren und Kosten die doppelte tägliche Nasdaq-100-Wertentwicklung an. Der Nasdaq-100 umfasst große nichtfinanzielle Nasdaq-Unternehmen. QLD ergänzt dieses Aktienengagement um einen täglichen Hebel.</p>
      <h2>Wie das Engagement entsteht</h2>
      <p>Finanzinstrumente einschließlich Derivaten ermöglichen ein Engagement über dem Nettovermögen des Fonds. Es wird täglich angepasst. Das unterscheidet sich sowohl vom ungehebelten Besitz der Indexaktien als auch von einem persönlichen Kredit mit unverändertem Schuldbetrag.</p>
      <h2>Warum die doppelte Langfristrendite nicht folgt</h2>
      <p>Ein hypothetischer Index steigt um 10% und fällt dann um 9,09%, ungefähr zurück zum Ausgangswert. Ein tägliches Zweifachmodell steigt um 20% und fällt um 18,18%: Aus 100 werden vor Kosten etwa 98,2. Das Beispiel isoliert die Verkettung täglicher Renditen.</p>
      <p>Andere Verläufe, etwa anhaltende Trends, verändern die Beziehung zum Index. Finanzierungskosten, Fondskosten und Nachbildungsabweichungen trennen QLDs tatsächliche Rendite zusätzlich von einem einfachen Vielfachen.</p>
      <h2>Das Sparplanergebnis lesen</h2>
      <p>Regelmäßige Beiträge verändern Einstiegspreise und Stückzahl, doch gehaltene Anteile bleiben gehebelt. Erstes Erreichen des Ziels und der Wert nach weiteren Käufen sind getrennt zu lesen. Ein günstiger Endwert belegt weder einen erträglichen Verlauf noch Wiederholbarkeit.</p>
      <p>QQQ, QLD und TQQQ teilen eine Indexfamilie, haben aber unterschiedliche Tagesziele. Um diese Unterschiede zu vergleichen, müssen Zeitraum und Zahlungsannahmen übereinstimmen.</p>
      <Sources locale="de" ids={["prosharesQld", "prosharesTqqq"]} />
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const CONTACT_DE = {
  metaTitle: "Kontakt",
  metaDescription: "Fragen, Fehlermeldungen oder Wünsche für neue ETFs bei 10-eok? Schreib uns einfach per E-Mail.",
  head: {
    title: "Kontakt",
    desc: "Fragen, Fehlermeldungen und Wünsche für neue ETFs sind willkommen",
    crumb: "Kontakt",
  },
  Body: () => {
    const name = authorName("de");
    return (
      <>
        <p>
          Hallo, ich bin <strong>{name}</strong>, ich habe 10-eok gebaut und betreibe es. Keine
          Finanzfirma, keine Beratung — ich bin <strong>Entwickler und Privatanleger</strong> und habe
          dieses Tool gebaut, weil mich selbst interessiert hat, was gewesen wäre, wenn ich damals so
          angespart hätte, und ich das mit echten Daten überprüfen wollte.
        </p>
        <p>
          Fragen, Fehlermeldungen oder Wünsche für neue ETFs schickst du am besten per E-Mail an die
          Adresse unten. Ich antworte in der Regel innerhalb weniger Werktage.
        </p>
        <p>
          <strong>E-Mail:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>

        <h2>Das hilft uns besonders</h2>
        <ul>
          <li>Wenn ein Rechenergebnis komisch aussieht (am besten mit den verwendeten Eingabewerten)</li>
          <li>ETFs, die du dir zusätzlich wünschst</li>
          <li>Falsche Angaben oder Tippfehler in den Ratgeber-Artikeln</li>
          <li>Vorschläge für neue Funktionen</li>
        </ul>

        <p className="note">
          Individuelle Anlageberatung beantworte ich nicht. 10-eok ist ein Informationstool und keine
          Anlageberatung oder -empfehlung.
        </p>
      </>
    );
  },
};

export const PRIVACY_DE = {
  metaTitle: "Datenschutzerklärung",
  metaDescription: "Wie 10-eok personenbezogene Daten erhebt und nutzt, sowie Hinweise zu Cookies und Werbung (Google AdSense).",
  head: {
    title: "Datenschutzerklärung",
    desc: "Letzte Aktualisierung: 19. Juni 2026",
    crumb: "Datenschutzerklärung",
  },
  Body: () => (
    <>
      <p>
        10-eok (im Folgenden &ldquo;der Dienst&rdquo;) nimmt den Schutz deiner personenbezogenen Daten
        ernst. Diese Erklärung beschreibt, welche Informationen der Dienst wie verarbeitet.
      </p>

      <h2>1. Welche Daten wir erheben</h2>
      <p>
        Der Dienst erfordert keine Registrierung und erhebt keine direkt identifizierenden Daten wie
        Namen oder Kontaktdaten. Beträge, Kaufdaten und andere Eingaben für den Backtest werden nur im
        Browser für die Berechnung verwendet und nicht auf einem Server gespeichert.
      </p>

      <h2>2. Cookies und automatisch erfasste Daten</h2>
      <p>
        Der Dienst kann Cookies und ähnliche Technologien für Zugriffsstatistiken und Werbung
        verwenden. Dabei können allgemeine, nicht identifizierende Informationen wie Browsertyp,
        besuchte Seiten und Zugriffszeitpunkt erfasst werden.
      </p>

      <h2>3. Werbung (Google AdSense)</h2>
      <ul>
        <li>Dieser Dienst kann Werbung über den Drittanbieter Google einblenden.</li>
        <li>Google und andere Drittanbieter können Cookies verwenden, um Anzeigen auf Basis früherer Besuche zu schalten.</li>
        <li>
          Du kannst personalisierte Werbung in den{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>{" "}
          deaktivieren und Cookies von Drittanbietern über{" "}
          <a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>{" "}
          ablehnen.
        </li>
      </ul>

      <h2>4. Externe Daten</h2>
      <p>
        Kursdaten stammen von Yahoo Finance, Wechselkursdaten von der Federal Reserve Bank of St. Louis
        (FRED). Es handelt sich um öffentlich zugängliche Marktdaten, die nichts mit personenbezogenen
        Daten der Nutzer zu tun haben.
      </p>

      <h2>5. Speicherung und Schutz von Daten</h2>
      <p>
        Der Dienst speichert keine personenidentifizierenden Daten auf einem Server. Daten zu
        Statistik- und Werbezwecken werden gemäß den Richtlinien der jeweiligen Anbieter verarbeitet
        und gespeichert.
      </p>

      <h2>6. Änderungen dieser Erklärung</h2>
      <p>
        Diese Erklärung kann aufgrund gesetzlicher Vorgaben oder Änderungen am Dienst angepasst werden;
        Änderungen werden auf dieser Seite veröffentlicht.
      </p>

      <h2>7. Kontakt</h2>
      <p>
        Bei Fragen zum Datenschutz wende dich an{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  ),
};

export const TERMS_DE = {
  metaTitle: "Nutzungsbedingungen",
  metaDescription: "Nutzungsbedingungen und Haftungsausschluss für den 10-eok-Dienst.",
  head: {
    title: "Nutzungsbedingungen",
    desc: "Letzte Aktualisierung: 19. Juni 2026",
    crumb: "Nutzungsbedingungen",
  },
  Body: () => (
    <>
      <h2>1. Art des Dienstes</h2>
      <p>
        10-eok (im Folgenden &ldquo;der Dienst&rdquo;) ist ein <strong>Informationsdienst</strong>, der
        Backtest-Ergebnisse auf Basis echter historischer Marktdaten zeigt. Nichts an diesem Dienst
        stellt eine Empfehlung zum Kauf oder Verkauf eines bestimmten Finanzprodukts, eine
        Anlageberatung oder eine Finanzberatung dar.
      </p>

      <h2>2. Verantwortung für Anlageentscheidungen (Haftungsausschluss)</h2>
      <ul>
        <li><strong>Vergangene Renditen garantieren keine zukünftigen Ergebnisse.</strong> Alle Ergebnisse basieren auf der Annahme &ldquo;wenn man es damals so gemacht hätte&rdquo;.</li>
        <li>Hebel-ETFs und ähnliche Produkte bergen ein hohes Risiko des Kapitalverlusts; bei einer echten Anlage kommen zusätzlich Steuern, Gebühren, Wechselkurskosten und psychologische Faktoren hinzu.</li>
        <li>Die Verantwortung für Anlageentscheidungen, die auf Basis dieses Dienstes getroffen werden, sowie für deren Ergebnisse liegt vollständig bei dir.</li>
      </ul>

      <h2>3. Genauigkeit der Daten</h2>
      <p>
        Der Dienst nutzt Daten aus vertrauenswürdigen externen Quellen (Yahoo Finance, FRED),
        übernimmt jedoch keine Garantie für Genauigkeit, Vollständigkeit oder Aktualität dieser Daten.
        Die Berechnungen basieren auf den in{" "}
        <a href={localeHref("de", "/how-it-works")}>So funktioniert&rsquo;s</a> genannten Annahmen und
        Vereinfachungen.
      </p>

      <h2>4. Haftungsbeschränkung</h2>
      <p>
        Der Anbieter des Dienstes haftet, soweit gesetzlich zulässig, nicht für direkte oder indirekte
        Schäden, die durch die Nutzung oder Nichtnutzung des Dienstes, Datenfehler oder die
        Interpretation von Berechnungsergebnissen entstehen.
      </p>

      <h2>5. Änderungen der Nutzungsbedingungen</h2>
      <p>
        Diese Nutzungsbedingungen können sich ändern; Änderungen werden auf dieser Seite
        veröffentlicht. Nutzt du den Dienst nach einer Änderung weiter, gilt dies als Zustimmung zu den
        Änderungen.
      </p>

      <p className="note">
        Kontakt: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </>
  ),
};


// ─────────────────────────────────────────────────────────────────────────
// Deutsche Inhalte für HomeContent, /how-it-works und /compare.
// Zahlen sind auf den de-Markt zugeschnitten: Sparrate 600 €/Monat, Ziel
// 1 Mio. €, Kauftag jeweils der 1. eines Monats. Alle unterstützten ETFs
// (QLD, TQQQ, QQQ, SPY, VOO, SCHD, VT, SOXX, VGT, VNQ, GLD, TLT, AGG, JEPI,
// JEPQ) sind USD-Werte — der Euro/Dollar-Wechselkurs wirkt daher bei jedem
// einzelnen Ticker, es gibt kein währungsfreies Pendant wie KODEX 200.
//
// Die tatsächlichen <table>-Renderings mit Live-Daten (Zeilen aus
// computeTickerResults) werden separat integriert. An den entsprechenden
// Stellen steht ein Kommentar {/* TABLE: ... */} als Marker. tableHeaders /
// tableNote / missLabel sind als eigene Felder exportiert, damit sie dort
// wiederverwendet werden können.
// ─────────────────────────────────────────────────────────────────────────

export const HOME_DE = {
  tableHeaders: {
    ticker: "ETF",
    timeToGoal: "600 €/Monat → 1 Mio. €",
    cagr: "Jährliche Rendite",
  },
  missLabel: (rough: string) => `Auch über den gesamten Zeitraum nicht erreicht · am Datenende etwa ${rough}`,
  // Präfix "Datenstand" vor dem Tabellen-Absatz (locale-spezifisch). ym ist bereits per fmt.ym formatiert.
  asOf: (ym: string) => `Stand der Daten: ${ym}. `,
  Body: ({ table, asOf }: { table: ReactNode; asOf: string }) => (
    <>
      <h2>Was der Rechner zeigt</h2>
      <p>ETF, Kaufhäufigkeit und Betrag je Kauf bestimmen die Annahmen. Eine optionale Einmalanlage wird am historischen Start investiert. Mit vergangenen Kursen wird berechnet, was diese Käufe ergeben hätten. Ein künftiger Zieltermin wird nicht vorhergesagt.</p>
      <h2>Erstes Überschreiten und späterer Wert</h2>
      <p>Das Hauptergebnis wählt den spätesten Startmonat, dessen Verlauf das Ziel mindestens einmal überschritt. Angezeigt wird die erste Überschreitung dieses Verlaufs. Das ist nicht die kürzeste Dauer über alle Startmonate. Der Wert bei fortgesetzten Käufen erscheint separat.</p>
      <h2>Die Referenztabelle</h2>
      <p>Die folgende Tabelle ist ein separat vorberechnetes Monatsbeispiel. Ihre Dauer bezieht sich darauf, das Ziel am Datenende zu erreichen, mit der jeweiligen gebündelten Historie. Manche Reihen enthalten geschätzte Abschnitte vor Fondsauflage. Die Tabelle entspricht weder dem Hauptrechner mit tatsächlicher Historie und erster Überschreitung noch einem Vergleich über identische Zeiträume.</p>
      <p>{asOf}</p>
      {table}
      <h2>ETF-Vergleich innerhalb eines Ergebnisses</h2>
      <p>Dieser Vergleich hält den ursprünglichen Zeitraum und Kaufplan fest. Geschätzte Abschnitte werden gekennzeichnet und von tatsächlicher Historie getrennt. Historische Beträge beschreiben diesen Test und bilden keine Rangliste geeigneter Anlagen.</p>
      <Sources locale="de" ids={["yahoo", "fredFxEur"]} />
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const HOW_IT_WORKS_DE = {
  metaTitle: "So funktioniert die historische Berechnung",
  metaDescription: "Kaufdaten, Annahmen und Ergebnisgrenzen",
  head: {
    title: "So funktioniert die historische Berechnung",
    desc: "Kaufdaten, Annahmen und Ergebnisgrenzen",
  },
  Body: () => (
    <>
      <h2>Käufe und Bewertung</h2>
      <p>Das Modell kauft monatlich, wöchentlich oder an jedem Handelstag für den gewählten Betrag je Kauf. Geschlossene Märkte verschieben monatliche und wöchentliche Kauftermine auf den nächsten verfügbaren Handelstag. Eine Anfangssumme wird am historischen Berechnungsstart investiert. Bruchstücke sind im Modell erlaubt.</p>
      <h2>Was die angezeigte Dauer bedeutet</h2>
      <p>Der Rechner durchsucht Startmonate innerhalb der tatsächlichen Handelshistorie. Er wählt den spätesten, dessen Wert das Ziel mindestens einmal überschritten hat, und zeigt die erste Überschreitung dieses Verlaufs. Er sucht nicht die kürzeste Dauer. Erreicht kein Start das Ziel, erscheint das Ergebnis der verfügbaren Historie.</p>
      <h2>Kurse, Ausschüttungen und Währungen</h2>
      <p>Yahoo Finance liefert Tageskurse. Wiederanlage wird mit bereinigten Kursen als Näherung der Gesamtrendite modelliert. Ohne Wiederanlage zählt nur die Kursrendite; Barausschüttungen werden nicht angesammelt. Euro-Ergebnisse beziehen historische Wechselkurse ein. Fehlt ein Tageswert, wird der vorherige verfügbare verwendet.</p>
      <h2>Vergleiche und Vereinfachungen</h2>
      <p>Der ETF-Vergleich behält Daten, tatsächliche Beiträge und Kaufannahmen des Ausgangsergebnisses bei. Nur dort können gekennzeichnete Ersatzreihen verwendet werden. Deckt die Historie den Zeitraum nicht ab, wird kein Vergleichswert angezeigt.</p>
      <p>Standardmäßig bleiben Anlegersteuern und Handelskosten außen vor. Fondskosten sind bereits in historischen Fondspreisen enthalten. Schlusskurskäufe, Bruchstücke und Wiederanlage können von einem tatsächlichen Depot abweichen. Eine annualisierte Kurskennzahl unterscheidet sich zudem von einer mit den Einzahlungsdaten gewichteten Anlegerrendite.</p>
      <Sources locale="de" ids={["yahoo", "fredFxEur"]} />
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};

export const COMPARE_DE = {
  metaTitle: "Historische ETF-Ergebnisse vergleichen",
  metaDescription: "Unterschiedliche Historien sind kein gemeinsamer Zeitraum",
  head: {
    title: "Historische ETF-Ergebnisse vergleichen",
    desc: "Unterschiedliche Historien sind kein gemeinsamer Zeitraum",
    crumb: "Vergleich",
  },
  tableHeaders: {
    ticker: "ETF",
    timeToGoal: "Bis 1 Mio. €",
    cagr: "Jährlich",
    dataStart: "Datenbeginn",
  },
  missLabel: (rough: string) => `Auch über den gesamten Zeitraum nicht erreicht · am Datenende etwa ${rough}`,
  asOf: (ym: string) => `Stand der Daten: ${ym}. `,
  tableNote:
    "Die Datenhistorie beginnt für jeden ETF zu einem anderen Zeitpunkt, daher lässt sich die Dauer nicht 1:1 vergleichen. Basisannahme: Dividenden reinvestiert, Steuern und Gebühren nicht berücksichtigt.",
  Body: ({ table }: { table: ReactNode }) => (
    <>
      <h2>Was diese Tabelle misst</h2>
      <p>Die Tabelle ist ein vorberechnetes Beispiel mit dem angegebenen Monatsbeitrag. Ihre Dauer bezieht sich auf das Ziel am Datenende, nicht auf die erste Überschreitung nach der Regel des Hauptrechners. Die ETF-Historien unterscheiden sich; manche gebündelten Reihen enthalten geschätzte Abschnitte vor Auflage.</p>
      {table}
      <h2>Eine kürzere Dauer ist keine Empfehlung</h2>
      <p>Anlageklasse, Hebel, Ausschüttungen und Marktphase beeinflussen den Wert. Ein Ziel aus einem günstigen historischen Abschnitt ergibt keine wiederholbare Wartezeit. Unterschiedliche Startdaten bedeuten außerdem unterschiedliche Marktbedingungen.</p>
      <h2>Ein Vergleich im selben Zeitraum</h2>
      <p>Der Vergleich aus einem Berechnungsergebnis fixiert dessen Start, Ende und Kaufplan. Tatsächliche Historien und gekennzeichnete Schätzungen werden getrennt; ohne vollständige Datenabdeckung entfällt der Wert. Das beantwortet eine andere Frage als eine Tabelle individuell berechneter Dauern.</p>
      <h2>Renditen und Struktur zusammen lesen</h2>
      <p>QQQ, SPY und VOO folgen Aktienindizes, QLD und TQQQ ergänzen tägliche Hebelwirkung. Anleihen-, Gold-, Dividenden- und Optionsfonds haben andere Ertragsquellen. Die Fondsbeschreibungen erklären diese Unterschiede, ohne den größten historischen Betrag zur besten Wahl zu erklären.</p>
      <Sources locale="de" ids={["yahoo", "fredFxEur"]} />
      <p><Link href={localeHref("de", "/guides")}>Weitere Grundlagen</Link></p>
    </>
  ),
};
