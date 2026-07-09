import type { ReactNode } from "react";
import Link from "next/link";
import { localeHref } from "@/lib/i18n/seo";
import { Sources } from "@/components/Sources";

import { authorName, CONTACT_EMAIL } from "@/lib/site";

export const DCA_DE = {
  metaTitle: "Das Prinzip des Sparplans (DCA)",
  metaDescription:
    "Warum das monatliche Investieren eines festen Betrags per Sparplan (DCA) der entspanntere Weg ist – Vorteile und Grenzen im Überblick.",
  head: {
    title: "Das Prinzip des Sparplans (DCA)",
    desc: "Jeden Monat denselben Betrag, ganz gleichmäßig",
    crumb: "Ratgeber · Sparplan",
  },
  Body: () => (
    <>
      <p>
        Ein Sparplan heißt auf Englisch Dollar-Cost Averaging, kurz <strong>DCA</strong>. Das Prinzip
        ist einfach: <strong>Egal ob der Kurs steigt oder fällt, du kaufst jeden Monat am selben Tag
        denselben Betrag desselben Wertpapiers.</strong> Anders als bei der Einmalanlage, bei der du
        dein ganzes Kapital auf einen Schlag investierst, verteilst du den Kaufzeitpunkt auf mehrere
        Monate. Viele Menschen legen ohnehin jeden Monat einen Teil ihres Gehalts zur Seite und
        investieren ihn – dadurch entsteht ganz automatisch ein Sparplan, oft ohne dass man bewusst
        darüber nachdenkt.
      </p>

      <h2>Wie sich der durchschnittliche Kaufpreis verteilt</h2>
      <p>
        Das wichtigste Merkmal von DCA ist, dass du jeden Monat denselben &ldquo;Betrag&rdquo;
        ausgibst. Nicht dieselbe Stückzahl, sondern denselben Betrag. Ist der Preis niedrig, kaufst du
        dadurch automatisch mehr Anteile, ist er hoch, automatisch weniger. Am Ende verteilt sich dein
        durchschnittlicher Kaufpreis über mehrere Preisniveaus, statt sich auf ein einzelnes zu
        konzentrieren.
      </p>
      <h3>Ein einfaches Zahlenbeispiel</h3>
      <p>
        Nehmen wir an, du legst jeden Monat 600 € an, und der Kurs pendelt zwischen 100 € → 50 € →
        100 € pro Anteil.
      </p>
      <ul>
        <li>Monat 1: Für 600 € Anteile zu 100 € → <strong>6 Anteile</strong></li>
        <li>Monat 2: Für 600 € Anteile zu 50 € → <strong>12 Anteile</strong></li>
        <li>Monat 3: Wieder für 600 € Anteile zu 100 € → <strong>6 Anteile</strong></li>
      </ul>
      <p>
        Mit insgesamt 1.800 € hast du 24 Anteile gesammelt, dein durchschnittlicher Kaufpreis liegt
        also bei 1.800 € ÷ 24 = <strong>75 € pro Anteil</strong>. Das ist niedriger als der einfache
        Durchschnitt der drei Preise (83,33 €). Der Grund: Du hast mehr gekauft, als der Kurs niedrig
        war. Dass sich &ldquo;viel kaufen, wenn&rsquo;s billig ist, wenig, wenn&rsquo;s teuer ist&rdquo;
        von selbst einstellt, ist der Effekt der Kaufpreisverteilung beim DCA.
      </p>

      <h2>Es nimmt dir die Sorge um den richtigen Einstiegszeitpunkt</h2>
      <p>
        Eine der schwierigsten Fragen beim Investieren ist: &ldquo;Sollte ich jetzt kaufen?&rdquo; Wer
        versucht, Tief- und Hochpunkte exakt zu treffen, verpasst oft die Gelegenheit ganz oder steigt
        auf einen Schlag am Hoch ein und ärgert sich danach. DCA ersetzt genau diese Grübelei durch
        eine Regel. Hältst du dich nur an <strong>jeden Monat derselbe Tag, derselbe Betrag</strong>,
        musst du nicht vorhersagen, ob der Markt steigt oder fällt.
      </p>

      <h2>Gewohnheit und Automatisierung</h2>
      <p>
        Eine einfache Regel lässt sich leicht automatisieren. Richtest du bei deiner Bank oder deinem
        Broker einen automatischen Sparplan ein, läuft das Investieren jeden Monat von selbst weiter,
        so wie dein Gehalt eingeht. Weil es mechanisch abläuft statt auf Willenskraft zu setzen, fällt
        es leichter, auch in unruhigen Marktphasen dranzubleiben statt auszusteigen. Bei langfristigem
        Investieren ist &ldquo;einfach weitermachen&rdquo; eine stärkere Waffe, als man denkt.
      </p>

      <h2>Bei stark schwankenden Werten zählt es besonders</h2>
      <p>
        Je stärker ein Kurs schwankt, desto deutlicher zeigt sich der Effekt der Kaufpreisverteilung.
        Wie im Beispiel oben, wo der Kurs zwischen 100 € und 50 € pendelte: Je größer die
        Schwankungsbreite, desto stärker der Effekt, in günstigen Phasen mehr einzusammeln. Deshalb
        spürt man die zeitliche Streuung des Sparplans besonders deutlich bei schwankungsstarken
        Produkten wie Hebel-ETFs. Große Schwankung bedeutet aber auch großes Risiko – DCA verhindert
        Verluste an sich nicht. Die spezifischen Risiken von Hebelprodukten haben wir separat in{" "}
        <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>{" "}
        zusammengefasst.
      </p>

      <h2>Ein klarer Nachteil</h2>
      <p>
        DCA ist nicht immer die richtige Antwort. In Marktphasen, die stetig gestiegen sind, hätte eine
        Einmalanlage, die das gesamte Kapital früh investiert, das Geld länger dem Markt ausgesetzt und
        oft eine höhere Rendite erzielt. Beim Sparplan fließt das Geld langsam ein, deshalb ist es zu
        Beginn weniger dem Markt ausgesetzt. Der eigentliche Wert von DCA liegt also weniger in der{" "}
        &ldquo;höchsten Rendite&rdquo; als vielmehr darin,{" "}
        <strong>die psychologische Belastung zu senken und dranzubleiben</strong>. Den Unterschied
        zwischen beiden Wegen und wann welcher passt, haben wir in{" "}
        <Link href={localeHref("de", "/guides/dca-vs-lumpsum")}>Sparplan vs. Einmalanlage</Link>{" "}
        ausführlicher behandelt. Und dass ein Weg in der Vergangenheit gut funktioniert hat, garantiert
        nicht, dass es in Zukunft genauso ist.
      </p>

      <h2>10-eok rechnet mit dem Sparplan-Modell</h2>
      <p>
        10-eok geht davon aus, dass du das gewählte Wertpapier an einem <strong>festgelegten Tag jeden
        Monats</strong> (fällt er auf einen Feiertag, am nächsten Handelstag) mit einem{" "}
        <strong>festgelegten Betrag</strong> kaufst – zum echten Tagesschlusskurs und Euro/Dollar-
        Wechselkurs von damals. Es sucht den Tag, an dem der so aufgebaute Depotwert zum ersten Mal
        1 Mio. € überschreitet, und zeigt dir, wie lange es gedauert hat. Die konkreten Ergebnisse je
        Wertpapier und für deine eigenen Bedingungen kannst du direkt im{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> und in der Vergleichstabelle auf der
        Startseite nachsehen.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
    </>
  ),
};

export const DCA_VS_LUMPSUM_DE = {
  metaTitle: "Sparplan vs. Einmalanlage",
  metaDescription:
    "Alles auf einmal investieren oder aufteilen? Der Unterschied zwischen Sparplan und Einmalanlage, was im Schnitt besser abschneidet und wie du je nach Situation wählst.",
  head: {
    title: "Sparplan vs. Einmalanlage",
    desc: "Alles auf einmal oder aufgeteilt investieren?",
    crumb: "Ratgeber · Sparplan vs. Einmalanlage",
  },
  Body: () => (
    <>
      <p>
        Selbst wenn du dasselbe Geld in dasselbe Wertpapier steckst, hängt das Ergebnis davon ab,{" "}
        <strong>wann</strong> du es investierst. Es gibt im Wesentlichen zwei Wege.{" "}
        <strong>Bei der Einmalanlage (Lump-Sum)</strong> investierst du dein gesamtes Kapital auf einen
        Schlag; <strong>beim Sparplan (DCA)</strong> verteilst du dasselbe Geld über mehrere Monate.
        Welcher der beiden ist nun richtig? Kurz gesagt: &ldquo;Im Durchschnitt schnitt die
        Einmalanlage besser ab, aber in der Praxis ist der Sparplan für viele die vernünftigere
        Wahl.&rdquo; Schauen wir uns an, warum.
      </p>

      <h2>Im Durchschnitt ist die Einmalanlage im Vorteil</h2>
      <p>
        Kurzfristig schwankt der Aktienmarkt stark, aber über lange Zeiträume betrachtet gab es viele
        Phasen, in denen es aufwärtsging. Geht man davon aus, dass der Markt langfristig steigt, gilt:
        Je länger dein Geld im Markt investiert ist, desto wahrscheinlicher wächst es stärker an. Bei
        der Einmalanlage ist der gesamte Betrag von Tag eins an dem Markt ausgesetzt, sodass{" "}
        <strong>die durchschnittliche Verweildauer im Markt länger ist.</strong> Beim Sparplan dagegen
        ist das Geld, das du zuletzt einzahlst, nur kurz investiert, sodass die durchschnittliche
        Marktexposition insgesamt kürzer ausfällt als bei der Einmalanlage.
      </p>
      <p>
        Deshalb gilt: Wenn du schon ein Startkapital hast und über einen ausreichend langen Zeitraum an
        steigende Kurse glaubst, hat die Einmalanlage oft{" "}
        <strong>die höhere erwartete Rendite.</strong> Das ist aber nur ein Durchschnitt und eine
        historische Tendenz – kein garantiertes Ergebnis für einen bestimmten Zeitpunkt. Die größte
        Schwäche der Einmalanlage zeigt sich, <strong>wenn der Markt direkt nach dem Einstieg stark
        fällt</strong> – dieser Schlag trifft deutlich härter als beim Sparplan.
      </p>

      <h2>Warum der Sparplan in der Praxis trotzdem sinnvoll ist</h2>
      <p>
        Dass die Statistik im Schnitt für die Einmalanlage spricht, heißt nicht, dass alle sie wählen
        sollten. Die meisten Anleger entscheiden sich aus folgenden – durchaus vernünftigen – Gründen
        für den Sparplan.
      </p>
      <ul>
        <li>
          <strong>Es gibt schlicht kein Startkapital.</strong> Die meisten Menschen investieren Monat
          für Monat einen Teil ihres Gehalts. Wer gar kein großes Kapital hat, das er auf einen Schlag
          investieren könnte, landet automatisch beim Sparplan. Die Debatte Einmalanlage vs. Sparplan
          ist eigentlich nur relevant für Menschen, die bereits über ein größeres Startkapital
          verfügen.
        </li>
        <li>
          <strong>In fallenden oder stark schwankenden Phasen streut sie das Risiko.</strong> In
          Phasen starker Kursschwankungen besteht bei einer Einmalanlage die Gefahr, sich sofort am
          Hoch einzukaufen. Verteilst du den Kauf, kaufst du bei hohen Kursen weniger und bei niedrigen
          mehr, wodurch das Risiko sinkt, den Kaufpreis auf ein ungünstiges Niveau festzulegen. Bei
          stark schwankenden Werten ist dieser Effekt besonders spürbar.
        </li>
        <li>
          <strong>Sie reduziert Reue und psychologische Belastung.</strong> Stürzt der Kurs direkt nach
          der Einmalanlage ab, ist es – unabhängig von der Rendite – leicht, nachts nicht mehr schlafen
          zu können und die Anlage vorzeitig aufzugeben. Wer nicht bis zum Ende durchhält, dem nützt
          auch die beste Strategie nichts. Der Sparplan senkt strukturell das Risiko, zum denkbar
          schlechtesten Zeitpunkt alles auf einmal zu investieren.
        </li>
      </ul>

      <h2>Es geht nicht um &ldquo;die höchste Rendite&rdquo;, sondern um &ldquo;möglichst wenig Reue&rdquo;</h2>
      <p>
        Der nützlichste Rahmen für den Vergleich beider Wege ist nicht &ldquo;Womit verdiene ich
        mehr?&rdquo;, sondern{" "}
        <strong>&ldquo;Will ich auf die höchste Rendite setzen, oder will ich Reue
        minimieren?&rdquo;</strong> Die Einmalanlage ist eher eine Strategie zur Maximierung der
        erwarteten Rendite, die am meisten einbringt, wenn der Markt steigt. Der Sparplan ist eher eine
        Strategie zur Minimierung von Reue, bei der du – egal wie es ausgeht – sagen kannst: &ldquo;So
        musste ich es damals machen.&rdquo;
      </p>
      <p>
        Was eine Entscheidung tatsächlich beeinflusst, sind nicht nur Zahlen. Derselbe Verlust fühlt
        sich als &ldquo;Verlust direkt nach der Einmalanlage&rdquo; viel schwerer an als als
        &ldquo;Verlust, der sich beim schrittweisen Investieren ergeben hat&rdquo;, und diese Reue
        führt häufig dazu, dass Menschen ganz aufhören zu investieren. Deshalb ist es oft wichtiger,
        ehrlich die eigene Risikobereitschaft und aushaltbare Schwankungsbreite einzuschätzen, als eine
        einzelne Durchschnittsrenditezahl zu vergleichen.
      </p>

      <h2>Kompromiss: Das Kapital über mehrere Monate strecken</h2>
      <p>
        Du musst dich nicht zwingend für eines von beiden entscheiden. Hast du ein größeres
        Startkapital, aber ein ungutes Gefühl dabei, es auf einen Schlag zu investieren, ist ein{" "}
        <strong>gestaffelter Einstieg über einen festgelegten Zeitraum</strong> ein praktischer
        Mittelweg. Verteilst du zum Beispiel dein Kapital über 3 bis 12 Monate gleichmäßig, behältst du
        einen Teil des Vorteils der frühen Marktexposition der Einmalanlage und profitierst
        gleichzeitig vom Vorteil des Sparplans, nicht alles auf einmal am Hoch zu kaufen.
      </p>
      <p>
        Je kürzer der Streckungszeitraum, desto näher bist du an der Einmalanlage; je länger, desto
        näher am Sparplan. Wichtig ist, <strong>die Regel im Voraus festzulegen und dann konsequent
        einzuhalten.</strong> Spontane Entscheidungen wie &ldquo;Fällt der Kurs, lege ich mehr nach,
        steigt er, höre ich auf&rdquo; laufen letztlich auf den Versuch hinaus, den Markt zu timen – und
        das fällt allen schwer.
      </p>

      <h2>Fragen, mit denen du deine passende Wahl findest</h2>
      <ul>
        <li>
          Hast du bereits ein <strong>Startkapital, das du jetzt investieren könntest?</strong> Falls
          nicht, bleibt dir ohnehin nur der Sparplan.
        </li>
        <li>
          Kannst du einen starken Rückgang direkt nach dem Einstieg <strong>aushalten, ohne zu
          verkaufen?</strong> Bist du dir nicht sicher, sind Sparplan oder gestaffelter Einstieg die
          entspanntere Wahl.
        </li>
        <li>
          Handelt es sich um ein stark schwankendes Produkt? Bei Hebelprodukten mit großen Ausschlägen
          wird die zeitliche Streuung noch wichtiger. Das strukturelle Risiko von Hebelprodukten haben
          wir separat in{" "}
          <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>{" "}
          behandelt.
        </li>
      </ul>
      <p>
        10-eok rechnet auf Basis eines <strong>Sparplans mit einem festen monatlichen Betrag</strong>.
        Warum das der entspanntere Weg ist, erfährst du in{" "}
        <Link href={localeHref("de", "/guides/dca")}>Das Prinzip des Sparplans (DCA)</Link>; die
        konkreten Zahlen je Wertpapier findest du in der Vergleichstabelle oder direkt im{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link>. Dass eine Methode in der Vergangenheit
        besser abgeschnitten hat, garantiert nicht, dass es auch künftig so ist – wähle deshalb weniger
        nach dem reinen Ergebnis, sondern danach, welchen Weg du bis zum Ende durchhalten kannst.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
    </>
  ),
};

export const ETF_BASICS_DE = {
  metaTitle: "Was ist ein ETF? (Für Einsteiger)",
  metaDescription:
    "Was ein börsengehandelter Indexfonds (ETF) ist, wie er sich von Einzelaktien und klassischen Fonds unterscheidet, und welche Kosten und Risiken Einsteiger kennen sollten.",
  head: {
    title: "Was ist ein ETF? (Für Einsteiger)",
    desc: "Ein 'Korb aus vielen Wertpapieren', der wie eine Aktie gehandelt wird – ETFs von Grund auf verstehen",
    crumb: "Ratgeber · ETF-Grundlagen",
  },
  Body: () => (
    <>
      <h2>ETF in einem Satz</h2>
      <p>
        ETF steht für <em>Exchange Traded Fund</em>, auf Deutsch etwa &ldquo;börsengehandelter
        Fonds&rdquo;. Der Name klingt kompliziert, ist aber einfach, wenn man ihn zerlegt:
        &ldquo;Exchange Traded&rdquo; heißt, dass er wie eine Aktie an der Börse notiert ist und
        während der Handelszeiten jederzeit gekauft und verkauft werden kann; &ldquo;Fund&rdquo; heißt,
        dass er das Geld vieler Anleger bündelt und auf mehrere Wertpapiere verteilt. Ein ETF ist also
        ein Produkt, das <strong>sich so einfach handeln lässt wie eine Aktie, in dem aber Dutzende bis
        Hunderte Einzelwerte in einem einzigen Korb stecken.</strong>
      </p>
      <p>
        Kaufst du zum Beispiel einen Anteil eines bestimmten ETFs, stecken darin bereits Aktien vieler
        Unternehmen in einem festgelegten Verhältnis. Ohne die Mühe, jeden Titel einzeln auszuwählen,
        investierst du mit einem einzigen Kauf ein bisschen in den gesamten Markt.
      </p>

      <h2>Was bedeutet &ldquo;einem Index folgen&rdquo;?</h2>
      <p>
        Die meisten ETFs sind so konstruiert, dass sie einen bestimmten <strong>Index</strong> exakt
        nachbilden. Ein Index fasst den Zustand eines Marktes in einer einzigen Zahl zusammen. Der
        S&P 500 zum Beispiel bündelt 500 große US-Unternehmen, der Nasdaq 100 die 100 wichtigsten
        Unternehmen der Nasdaq-Börse. Ein indexnachbildender ETF hält die im Index enthaltenen Werte
        fast genau in der vom Index vorgegebenen Gewichtung.
      </p>
      <p>
        Steigt der Index also um 1 %, steigt in der Regel auch der Kurs des ETFs, der ihm folgt,
        abzüglich der Kosten, um etwa 1 %. Entscheidend ist: Die Fondsgesellschaft wählt nicht nach
        eigenem Ermessen &ldquo;vielversprechende Aktien&rdquo; aus, sondern bildet nach festen Regeln
        den Index ab. Deshalb nennt man solche Produkte &ldquo;passive&rdquo; Investments. Da sich der
        Charakter stark danach richtet, welchem Index gefolgt wird, ist das Verständnis des Index
        selbst der Ausgangspunkt bei der ETF-Auswahl. Die Unterschiede der wichtigsten Indizes haben
        wir in{" "}
        <Link href={localeHref("de", "/guides/nasdaq100-vs-sp500")}>Nasdaq 100 vs. S&P 500</Link>{" "}
        ausführlich behandelt.
      </p>

      <h2>Der Diversifikationseffekt — nicht alle Eier in einen Korb</h2>
      <p>
        Der größte Vorteil eines ETFs ist die <strong>Diversifikation</strong>. Investierst du nur in
        eine einzelne Aktie, trägst du den vollen Verlust, wenn das Unternehmen schlecht abschneidet
        oder in eine Krise gerät. Bei einem ETF mit Hunderten Titeln federn die anderen Unternehmen ab,
        wenn eines strauchelt. Solange nicht der gesamte Markt zusammenbricht, sinkt das Risiko, dass
        dein Investment auf einen Schlag wertlos wird, deutlich.
      </p>
      <p>
        Diversifikation heißt aber keineswegs &ldquo;kein Verlust möglich&rdquo;. In Phasen wie 2008
        oder 2020, in denen der gesamte Markt gemeinsam fällt, verlieren auch diversifizierte ETFs.
        Diversifikation reduziert nur das Risiko einer einzelnen Aktie, nicht das Risiko des
        Gesamtmarktes (Systemrisiko). Sich das ehrlich klarzumachen, ist für Einsteiger das
        Wichtigste.
      </p>

      <h2>Kosten und Tracking-Differenz — Zahlen, die man leicht übersieht</h2>
      <p>
        Auch ein ETF ist ein Fonds und verursacht Betriebskosten. Die wichtigste Kennzahl ist die{" "}
        <strong>Gesamtkostenquote (TER, Total Expense Ratio)</strong>. Sie gibt an, wie viel Prozent
        des Vermögens pro Jahr für Verwaltung und Betrieb anfallen. Liegt die TER zum Beispiel bei
        0,1 % pro Jahr, kostet die Verwahrung von 10.000 € für ein Jahr etwa 10 €. Die Kosten fließen
        Tag für Tag unmerklich in den Kurs ein, wirken sich also nicht wie eine separate Rechnung an,
        summieren sich aber bei langfristigem Investieren über den Zinseszinseffekt zu einem spürbaren
        Unterschied. Bei ETFs auf denselben Index ist der mit den niedrigeren Kosten im Vorteil.
      </p>
      <ul>
        <li>
          <strong>Tracking-Differenz (Preisabweichung)</strong>: Der Unterschied zwischen dem Börsenkurs
          des ETFs und seinem tatsächlichen Nettoinventarwert (NAV). Theoretisch sollten beide gleich
          sein, bei dünnem Handel kann kurzfristig eine Lücke entstehen. Ist die Abweichung groß,
          kaufst oder verkaufst du womöglich zu einem Preis, der vom fairen Wert abweicht.
        </li>
        <li>
          <strong>Handelsvolumen (Liquidität)</strong>: Je mehr an einem Tag gehandelt wird, desto
          leichter kaufst und verkaufst du zum gewünschten Preis, und desto enger ist die Spanne
          zwischen Kauf- und Verkaufspreis (Spread). Bei kaum gehandelten ETFs kann der Wiederverkauf
          ungünstig sein – hier ist Vorsicht geboten.
        </li>
        <li>
          <strong>Tracking Error</strong>: Wie stark die tatsächliche Rendite des ETFs von der des
          nachgebildeten Index abweicht. Je kleiner, desto treuer bildet er den Index nach.
        </li>
      </ul>

      <h2>Was unterscheidet ihn von aktiv gemanagten Fonds?</h2>
      <p>
        Bei einem klassischen <strong>aktiv gemanagten Fonds</strong> wählt ein Fondsmanager selbst
        Titel aus, kauft und verkauft sie und versucht, den Markt zu schlagen. Weil dabei menschliches
        Urteilsvermögen und häufigeres Handeln im Spiel sind, sind die Kosten meist höher, der Preis
        wird üblicherweise einmal täglich festgestellt, und eine Rückgabe kann etwas dauern.
      </p>
      <p>
        Ein indexnachbildender ETF dagegen will nach festen Regeln einfach den Markt abbilden, hat
        dadurch niedrigere Kosten, wird wie eine Aktie fortlaufend während der Handelszeit gehandelt,
        und seine Zusammensetzung wird täglich veröffentlicht. Statt &ldquo;den Markt schlagen zu
        wollen&rdquo; punktet der ETF mit der Einfachheit, &ldquo;genau mit dem Markt
        mitzugehen&rdquo;, und mit niedrigen Kosten. Es gibt allerdings auch aktiv gemanagte ETFs, bei
        denen ein Manager aktiv eingreift – ein Blick ins Produktinformationsblatt zeigt, um welche Art
        es sich handelt.
      </p>

      <h2>Checkliste für den ersten ETF als Einsteiger</h2>
      <ul>
        <li>
          <strong>Was steckt drin</strong>: Schau zuerst, welchen Index, Markt oder welche Anlageklasse
          der ETF abbildet. Prüfe, ob es sich um heimische oder US-Werte handelt und ob breit gestreut
          oder auf eine Branche konzentriert wird.
        </li>
        <li>
          <strong>Sind die Kosten angemessen</strong>: Bei gleichem Index ist eine niedrigere TER
          langfristig von Vorteil.
        </li>
        <li>
          <strong>Wird ausreichend gehandelt</strong>: Produkte mit sehr geringem Handelsvolumen und
          Fondsvolumen meidet man besser.
        </li>
        <li>
          <strong>Handelt es sich um ein Hebel- oder derivatives Produkt</strong>: ETFs mit
          &ldquo;2x&rdquo;, &ldquo;3x&rdquo; oder &ldquo;Inverse&rdquo; im Namen tragen ein völlig
          anderes Risiko als klassische ETFs. Durch die tägliche Neuausrichtung des Hebels kann es bei
          langem Halten zu Verlusten durch Schwankung kommen – setze dich damit gründlich auseinander,
          bevor du einsteigst. Die Details findest du in{" "}
          <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>.
        </li>
        <li>
          <strong>Bei ausländischen ETFs: Wechselkurs und Steuern beachten</strong>: US-ETFs
          unterliegen dem Euro/Dollar-Wechselkurs, und auf realisierte Kursgewinne fallen je nach
          Wohnsitzland und persönlicher Situation Steuern an – im Zweifel lohnt sich der Rat einer
          Steuerberatung. Wie eine Sparplan-Strategie mit regelmäßigen Käufen funktioniert, haben wir
          in <Link href={localeHref("de", "/guides/dca")}>Sparplan (DCA)</Link> zusammengefasst.
        </li>
      </ul>
      <p>
        Hast du das Konzept des ETFs verstanden, ist der schnellste Weg zu lernen, selbst zu
        simulieren, wie dein Vermögen wächst, wenn du monatlich einen festen Betrag einzahlst. Die
        Ergebnisse auf Basis echter historischer Kurse kannst du im{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> für jedes Wertpapier einsehen. Vergangene
        Renditen garantieren aber nicht die Zukunft, betrachte sie also nur als Orientierung.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
    </>
  ),
};

export const COMPOUND_72_DE = {
  metaTitle: "Zinseszins und die 72er-Regel",
  metaDescription:
    "Wie Geld für dich Geld verdient – das Prinzip des Zinseszinses – und die 72er-Regel, mit der du im Kopf ausrechnest, wann sich dein Kapital verdoppelt.",
  head: {
    title: "Zinseszins und die 72er-Regel",
    desc: "Wie Geld für dich arbeitet, und ein Kopfrechentrick",
    crumb: "Ratgeber · Zinseszins",
  },
  Body: () => (
    <>
      <p>
        Die stärkste Kraft beim langfristigen Investieren ist überraschend einfach: der{" "}
        <strong>Zinseszins (compound interest)</strong> – die Struktur, bei der bereits erwirtschaftetes
        Geld selbst wieder Geld verdient. Bei derselben Rendite macht es über die Zeit einen riesigen
        Unterschied, ob diese Struktur greift oder nicht – wie groß dieser Unterschied wirklich ist,
        zeigt sich am deutlichsten im direkten Vergleich mit dem einfachen Zins.
      </p>

      <h2>Einfacher Zins vs. Zinseszins</h2>
      <p>
        Beim <strong>einfachen Zins (simple interest)</strong> wird nur auf das ursprüngliche Kapital
        Zins gezahlt. Legst du 1.000 € zu 10 % einfachem Zins pro Jahr an, kommen jedes Jahr genau
        100 € dazu, sodass du nach 10 Jahren bei 1.000 + (100 × 10) = 2.000 € landest. Weil sich der
        Zins immer nur auf das gleichbleibende Kapital bezieht, wächst das Geld in einer geraden Linie.
      </p>
      <p>
        Beim <strong>Zinseszins (compound interest)</strong> wird auf die bereits verdienten Zinsen
        erneut Zins gezahlt. Legst du dieselben 1.000 € zu 10 % Zinseszins pro Jahr an, hast du nach
        1 Jahr 1.100 €, nach 2 Jahren kommen 10 % von 1.100 €, also 110 €, dazu, macht 1.210 €. Weil der
        gewachsene Betrag selbst zur Grundlage für die Zinsberechnung des nächsten Jahres wird, wird
        die Kurve mit der Zeit immer steiler. Nach 10 Jahren stehen etwa 2.594 € zu Buche – fast 600 €
        mehr als beim einfachen Zins (2.000 €).
      </p>

      <h2>Der Schneeball-Effekt des Zinseszinses</h2>
      <p>
        Die wahre Stärke des Zinseszinses zeigt sich in der zweiten Hälfte. Es ist wie ein Schneeball,
        den man rollt: In den ersten Runden sieht man kaum einen Unterschied, aber je größer er wird,
        desto stärker wächst die Menge an Schnee pro Umdrehung. Bei 10 % Zinseszins pro Jahr dauert es
        etwa 7 Jahre, bis sich das Kapital verdoppelt hat; für die Vervierfachung braucht es nicht noch
        einmal 7, sondern wieder nur etwa 7 Jahre, also insgesamt 14. Die Verachtfachung dauert
        21 Jahre. Bei denselben 7 Jahren ist der absolute Unterschied zwischen &ldquo;aus 1.000 € werden
        2.000 €&rdquo; und &ldquo;aus 10.000 € werden 20.000 €&rdquo; gewaltig.
      </p>
      <p>
        Deshalb ist beim Zinseszins nicht nur die Rendite entscheidend, sondern genauso die{" "}
        <strong>&ldquo;Zeit&rdquo;</strong>. Bei gleicher Rendite wächst Geld, das ein Jahr früher
        investiert wurde, im letzten Jahr zum größten Batzen an.
      </p>

      <h2>Die 72er-Regel</h2>
      <p>
        Wie viele Jahre dauert es also, bis sich dein Geld verdoppelt? Um das exakt zu berechnen,
        braucht man Logarithmen, aber mit der einfachen Faustregel <strong>72er-Regel</strong> kommst
        du nah genug heran.
      </p>
      <ul>
        <li><strong>Jahre bis zur Verdopplung ≈ 72 ÷ jährliche Rendite (%)</strong></li>
        <li>8 % pro Jahr → 72 ÷ 8 = etwa <strong>9 Jahre</strong></li>
        <li>6 % pro Jahr → 72 ÷ 6 = etwa 12 Jahre</li>
        <li>12 % pro Jahr → 72 ÷ 12 = etwa 6 Jahre</li>
      </ul>
      <p>
        Warum ausgerechnet 72? Die exakte Bedingung für eine Verdopplung durch Zinseszins lautet
        (1 + r)<sup>n</sup> = 2. Logarithmiert man beide Seiten, ergibt sich n = ln 2 ÷ ln(1 + r).
        ln 2 ist etwa 0,693, und für nicht zu große Renditen ist ln(1 + r) ungefähr gleich r. Damit
        wird n ≈ 0,693 ÷ r, und in Prozent umgerechnet n ≈ 69,3 ÷ Rendite (%). 69,3 lässt sich aber
        schlecht im Kopf rechnen, während <strong>72</strong> mit seinen vielen Teilern bequem durch
        gängige Renditen wie 6, 8, 9 oder 12 teilbar ist – deshalb hat sich 72 durchgesetzt. Im Bereich
        von 6–10 % pro Jahr liegt der Fehler bei etwa einem Jahr und ist damit praktikabel.
      </p>

      <h2>Sparplan und Zinseszins zusammen gedacht</h2>
      <p>
        Die 72er-Regel zeigt, wie schnell &ldquo;ein einzelner Kapitalbetrag&rdquo; wächst. In der
        Praxis investieren die meisten aber per{" "}
        <Link href={localeHref("de", "/guides/dca")}>Sparplan (DCA)</Link> jeden Monat neues Geld. Beim
        Sparplan wächst das Geld, das du früher eingezahlt hast, am stärksten, weil der Zinseszins am
        längsten Zeit hatte zu wirken; das Geld, das du gerade erst diesen Monat eingezahlt hast, ist
        praktisch noch unverändert. Innerhalb desselben Depots hat jeder eingezahlte Euro also ein
        anderes &ldquo;Alter&rdquo;, und die älteren Beträge treiben das Gesamtwachstum an.
      </p>
      <p>
        Deshalb ergibt sich der Depotwert eines Sparplans nicht einfach als &ldquo;eingezahltes Kapital
        × ein bestimmter Faktor&rdquo;. Kurs und Wechselkurs am jeweiligen Kauftag sowie die spätere
        Kursentwicklung spielen alle zusammen. Wie viel der Zinseszins beim Sparplan tatsächlich
        leistet, bekommst du am besten ein Gefühl dafür, wenn du Wertpapier und monatliche Sparrate im{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> eingibst, der mit echten historischen Daten
        rechnet.
      </p>

      <h2>Was das für langfristiges Investieren bedeutet</h2>
      <p>
        Zinseszins und 72er-Regel lehren uns zweierlei. Erstens: <strong>Je früher du beginnst, desto
        besser.</strong> Denn die letzte Verdopplung (z. B. von 500.000 € auf 1 Mio. €) bringt allein so
        viel wie alle vorherigen Verdopplungen zusammen. Zweitens:{" "}
        <strong>Eine kleine Erhöhung der Rendite wirkt größer, als man denkt.</strong> Steigst du von
        6 % auf 9 % pro Jahr, sinkt die Verdopplungszeit von 12 auf 8 Jahre – im gleichen Zeitraum
        durchläuft dein Geld also deutlich mehr &ldquo;Verdopplungszyklen&rdquo;. Denk aber daran: Eine
        höhere erwartete Rendite geht fast immer mit größerer Schwankung einher.
      </p>

      <h2>Grenzen — die Realität ist keine Gerade</h2>
      <p>
        Die 72er-Regel geht davon aus, dass <strong>jedes Jahr dieselbe Rendite</strong> anfällt. In der
        Realität schwanken die Renditen von Aktien und ETFs von Jahr zu Jahr stark, und es gibt auch
        Verlustjahre. Kommen Verluste ins Spiel, wirkt der Zinseszins auch in die andere Richtung: Um
        einen großen Rückgang wieder aufzuholen, braucht es einen noch größeren Anstieg. Ein Vermögen,
        das um 50 % gefallen ist, braucht zur Erholung nicht +50 %, sondern +100 %. Besonders bei
        Hebel-ETFs summiert sich dieser Schwankungsverlust (Decay) leicht auf – lies dazu auch{" "}
        <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>.
      </p>
      <ul>
        <li><strong>Volatilität</strong> — Auch bei gleicher Durchschnittsrendite kann das tatsächliche kumulierte Ergebnis schlechter ausfallen, wenn die Schwankungen groß sind.</li>
        <li><strong>Steuern</strong> — Fallen auf Kursgewinne oder Ausschüttungen Steuern an, sinkt das für die Wiederanlage verfügbare Kapital, was den Zinseszinseffekt schmälert. Wie genau das in deinem Fall aussieht, hängt von deinem Land und deiner persönlichen Situation ab.</li>
        <li><strong>Inflation</strong> — Selbst bei einer nominalen Rendite von 8 % pro Jahr bleibt bei 3 % Inflation pro Jahr real nur eine Kaufkraftrendite von etwa 5 % übrig.</li>
      </ul>
      <p>
        Die 72er-Regel ist also kein präzises Prognosewerkzeug, sondern ein{" "}
        <strong>Werkzeug für ein grobes Gefühl</strong>. Reale Renditen schwanken von Jahr zu Jahr, und
        dass es in der Vergangenheit so gelaufen ist, garantiert nicht, dass es in Zukunft im gleichen
        Tempo weitergeht.
      </p>

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
    </>
  ),
};

export const LEVERAGE_ETF_RISK_DE = {
  metaTitle: "Das Risiko von Hebel-ETFs",
  metaDescription:
    "So groß wie die 2- oder 3-fache Rendite ist auch der Verlust – und die versteckte Falle namens Volatilitäts-Drift, mit Zahlen erklärt.",
  head: {
    title: "Das Risiko von Hebel-ETFs",
    desc: "Der Faktor 2 gilt für Gewinne genauso wie für Verluste",
    crumb: "Ratgeber · Risiko",
  },
  Body: () => (
    <>
      <p>
        Hebel-ETFs wie QLD (2x) oder TQQQ (3x) liefern in Aufwärtsphasen beeindruckende Renditen.
        Schaut man nur auf die Backtest-Ergebnisse, denkt man leicht: &ldquo;Warum habe ich das nicht
        schon früher gekauft?&rdquo; Doch dieser Rendite steht immer ein gleich großes Risiko
        gegenüber. Und Hebelprodukte haben eine zusätzliche <strong>versteckte Falle</strong>, die
        klassische Indizes nicht kennen. Bevor du einsteigst, solltest du Folgendes unbedingt
        verstehen.
      </p>

      <h2>1. Der Hebel wirkt &ldquo;pro Tag&rdquo;</h2>
      <p>
        Das größte Missverständnis ist der Glaube, ein Hebel-ETF folge &ldquo;langfristig dem Doppelten
        des Index&rdquo;. Tatsächlich wird die <strong>Tagesrendite</strong> verdoppelt (oder
        verdreifacht). Steigt der Nasdaq 100 heute um +1 %, steigt QLD um etwa +2 %, TQQQ um etwa +3 %.
        Entscheidend ist: Die Fondsgesellschaft <strong>stellt den Hebel jeden Tag zum
        Handelsschluss neu ein</strong>. Unabhängig vom gestrigen Gewinn oder Verlust wird der 2-fache
        Hebel jeden Tag neu auf Basis des heutigen Vermögens festgelegt.
      </p>
      <p>
        Diese &ldquo;tägliche Neueinstellung&rdquo; macht den ganzen Unterschied. Über Tage und Monate
        hinweg wird die kumulierte Rendite eines Hebel-ETFs nicht einfach das Doppelte der kumulierten
        Indexrendite. Je länger du hältst, desto größer wird die Lücke zwischen beiden, und diese
        Richtung ist nicht immer zu deinen Gunsten. Die Struktur des zugrunde liegenden Produkts
        erklären wir ausführlicher in{" "}
        <Link href={localeHref("de", "/guides/qld")}>Was ist QLD?</Link>
      </p>

      <h2>2. Verluste verdoppeln oder verdreifachen sich genauso</h2>
      <p>
        Das ist das offensichtlichste Risiko. Fällt der zugrunde liegende Index an einem Tag um −3 %,
        fällt ein 2-fach-Produkt um etwa −6 %, ein 3-fach-Produkt um etwa −9 %. Das Problem: Ist der
        Rückgang einmal tief, wird die Erholung rechnerisch deutlich schwerer. Um einen Verlust von
        −50 % aufzuholen, braucht es nicht +50 %, sondern <strong>+100 %</strong>. Je größer der
        hebelbedingte Rückgang, desto exponentiell größer wird die nötige Erholungsrendite.
      </p>
      <p>
        Auch in der Vergangenheit ist der Nasdaq 100 mehrfach kräftig gefallen. In solchen Phasen sind
        3-fach-Produkte teils bis nahe an ihren ursprünglichen Wert vom Hoch aus abgesackt, und die
        Erholung dauerte lange. Wie tief die Rückgänge tatsächlich waren und wie lange die Erholung
        dauerte, siehst du am genauesten direkt mit echten Daten im{" "}
        <Link href={localeHref("de", "/")}>Rechner und der Vergleichstabelle</Link>.
      </p>

      <h2>3. Volatilitäts-Drift — die Falle in Zahlen</h2>
      <p>
        Das trickreichste Risiko bei Hebelprodukten ist die{" "}
        <strong>Volatilitäts-Drift (volatility decay)</strong>. Dabei schmilzt das Vermögen langsam
        dahin, selbst wenn der Markt nur richtungslos hin und her schwankt – ein mathematisch
        zwangsläufiges Ergebnis der täglichen Neueinstellung des Hebels.
      </p>
      <p>
        Ein einfaches Beispiel: Der Index steigt an einem Tag um <strong>+10 %</strong> und fällt am
        nächsten um <strong>−10 %</strong>.
      </p>
      <ul>
        <li>Zugrunde liegender Index: 100 → 110 → 99. Nach zwei Tagen ein Minus von <strong>−1 %</strong>.</li>
        <li>2-fach-Produkt: An einem Tag +20 %, am nächsten −20 %. 100 → 120 → 96. Also <strong>−4 %</strong>.</li>
        <li>3-fach-Produkt: An einem Tag +30 %, am nächsten −30 %. 100 → 130 → 91. Also <strong>−9 %</strong>.</li>
      </ul>
      <p>
        Der Index hat nur 1 % verloren, das 2-fach-Produkt aber 4 % und das 3-fach-Produkt sogar 9 %.
        Das ist nicht einfach das Doppelte oder Dreifache des Verlusts, sondern eine deutlich größere
        Lücke. Genau das ist die Volatilitäts-Drift. Je größer die Schwankungsbreite (±10 %) und je
        länger sich solche Ausschläge wiederholen, desto schneller summiert sich der Verlust. Bei
        3-fach wächst die Schwankungsbreite fast quadratisch, weshalb die Drift dort noch viel stärker
        ist als beim 2-fach-Produkt.
      </p>

      <h2>4. Warum es im Seitwärtsmarkt besonders riskant ist</h2>
      <p>
        Die Volatilitäts-Drift kann in einem Trendmarkt, der stetig in eine Richtung steigt, sogar zum
        Vorteil des Hebelprodukts wirken – steigt der Kurs jeden Tag, wächst er durch den
        Zinseszinseffekt umso stärker. In einem <strong>Seitwärtsmarkt</strong>, in dem der Kurs nur um
        denselben Punkt herum schwankt, ist es aber genau umgekehrt. Der Index kehrt am Ende zu seinem
        Ausgangspunkt zurück, das Hebelprodukt aber verstärkt jede tägliche Bewegung und verliert dabei
        kontinuierlich an Wert.
      </p>
      <p>
        Damit ein Hebel-ETF gute Ergebnisse liefert, reicht es also nicht, dass der Markt steigt — er
        muss <strong>stetig und ohne große Ausschläge in eine Richtung</strong> steigen. Der reale
        Aktienmarkt ist selten so gnädig; selbst in Aufwärtsphasen gibt es kräftige Korrekturen und
        Seitwärtsbewegungen, und in jeder dieser Phasen nagt die Drift an der Rendite.
      </p>

      <h2>5. Die Debatte um langfristiges Halten und die Grenzen des Sparplans</h2>
      <p>
        Deshalb vertreten viele die Ansicht, dass Hebel-ETFs eigentlich für{" "}
        <strong>kurzfristige, taktische Zwecke</strong> konstruiert sind. Andere argumentieren, dass
        langfristiges Ansparen möglich sei, weil US-Technologiewerte in der Vergangenheit über lange
        Phasen stark gestiegen sind. Beide Seiten haben einen Punkt, aber man darf nicht vergessen: Ein
        gut aussehender Backtest ist immer nur das Ergebnis eines <strong>bestimmten historischen
        Zeitraums</strong>. Schon ein leicht anderer Startzeitpunkt kann zu einem völlig anderen
        Ergebnis führen. Das solltest du zusammen mit der Frage des Einstiegszeitpunkts beim{" "}
        <Link href={localeHref("de", "/guides/dca")}>Sparplan (DCA)</Link> mitdenken.
      </p>
      <p>
        Ein Sparplan (jeden Monat einen festgelegten Betrag investieren) mildert das Risiko von
        Hebelprodukten <strong>teilweise</strong>. Denn in fallenden Phasen kaufst du für dasselbe Geld
        mehr Anteile und senkst so deinen durchschnittlichen Kaufpreis. Der Sparplan beseitigt die
        Volatilitäts-Drift selbst aber nicht. Das bereits angesammelte Vermögen ist weiterhin täglich
        der Drift ausgesetzt, und ein großer Einbruch kann das über Monate angesparte Kapital auf einen
        Schlag deutlich schmälern. <strong>Gemildert, aber nicht beseitigt</strong> — das ist der
        entscheidende Punkt.
      </p>

      <h2>6. Nur mit einem Anteil, den du verkraften kannst</h2>
      <p>
        Wenn du Hebel-ETFs in dein Portfolio aufnimmst, solltest du vor allem prüfen, ob der
        eingesetzte Anteil einen worst-case-Rückgang aushält. Frag dich, ob du auch dann noch ruhig
        schlafen könntest, wenn sich dein Vermögen vom Hoch aus mehr als halbiert. Häufig genannte,
        praxisnahe Grundsätze sind:
      </p>
      <ul>
        <li>Hebel nur mit einem Teil des Gesamtvermögens einsetzen und den Rest mit schwankungsärmeren Werten ausbalancieren.</li>
        <li>Nur Geld investieren, das du nicht kurzfristig brauchst und bei einem großen Rückgang nicht gezwungenermaßen verkaufen musst.</li>
        <li>Ergebnisse wie &ldquo;in N Jahren zu 1 Mio. €&rdquo; sind nur eine Aufzeichnung dessen, <strong>was in der Vergangenheit geschehen wäre</strong> — keine Garantie für die Zukunft.</li>
        <li>Je schneller ein Ziel in der Vergangenheit erreicht wurde, desto tiefere Zwischenrückgänge musste man dabei oft aushalten — das solltest du mitbedenken.</li>
      </ul>
      <p>
        Die tatsächlichen Ergebnisse je Wertpapier und die Unterschiede zwischen bestem, mittlerem und
        schlechtestem Startzeitpunkt kannst du direkt im{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> vergleichen. Gute Zahlen genauso ernst zu
        nehmen wie schlechte, ist der Schlüssel, um Hebelprodukte wirklich zu verstehen.
      </p>

      <Sources ids={["prosharesQld", "prosharesTqqq"]} />

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
    </>
  ),
};

export const NASDAQ100_VS_SP500_DE = {
  metaTitle: "Nasdaq 100 vs. S&P 500",
  metaDescription:
    "Vergleich von Zusammensetzung, Charakter und Volatilität zwischen Nasdaq 100 und S&P 500, repräsentiert durch QQQ und SPY.",
  head: {
    title: "Nasdaq 100 vs. S&P 500",
    desc: "Zwei führende US-Indizes im Vergleich",
    crumb: "Ratgeber · Indexvergleich",
  },
  Body: () => (
    <>
      <p>
        Wenn du per Sparplan in US-Aktien investierst, sind die zwei am häufigsten genannten Indizes
        der <strong>Nasdaq 100</strong> und der <strong>S&P 500</strong>. Beide enthalten große
        US-Unternehmen, unterscheiden sich aber darin, was und wie viel sie jeweils enthalten — und
        damit auch in Charakter und Schwankungsbreite. Die Namen sind vertraut, die Unterschiede aber
        leicht zu verwechseln. Hier die wichtigsten Punkte aus Sicht eines Sparplan-Anlegers.
      </p>

      <h2>Was steckt drin — Unterschiede in der Zusammensetzung</h2>
      <p>
        Der größte Unterschied liegt in Zahl und Umfang der enthaltenen Werte. Beide Indizes gewichten
        grundsätzlich nach Marktkapitalisierung: Je größer das Unternehmen, desto größer sein Anteil.
      </p>
      <ul>
        <li>
          <strong>S&P 500:</strong> Besteht aus rund 500 großen US-Unternehmen. Nahezu alle Branchen
          sind vertreten — Technologie, Finanzen, Gesundheit, Konsumgüter, Industrie, Energie und mehr
          —, weshalb er oft als &ldquo;Leitindex der US-Wirtschaft&rdquo; gilt. Die Börsennotierung
          (NYSE oder Nasdaq) spielt für die Aufnahme keine Rolle.
        </li>
        <li>
          <strong>Nasdaq 100:</strong> Besteht aus den 100 größten Unternehmen der Nasdaq-Börse nach
          Marktkapitalisierung — <strong>ohne Finanzwerte</strong>. Weniger Titel bedeuten strukturell
          einen sehr hohen Anteil an Technologie- und Wachstumsunternehmen.
        </li>
      </ul>

      <h2>Sektor-Konzentration</h2>
      <p>
        Mit nur 100 Titeln und ohne Finanzwerte konzentriert sich der Nasdaq 100 naturgemäß stark auf
        den <strong>Technologiesektor</strong>. Einige große Technologiekonzerne machen einen
        beträchtlichen Teil des Index aus, sodass der gesamte Index tendenziell mitschwankt, wenn deren
        Kurse sich bewegen. Der S&P 500 dagegen ist breiter über Branchen gestreut, sodass die Schwäche
        eines Sektors durch andere teilweise ausgeglichen werden kann.
      </p>
      <p>
        Allerdings ist erwähnenswert, dass sich zuletzt auch im S&P 500 der Anteil großer
        Technologiewerte deutlich erhöht hat, sodass sich die Kernwerte beider Indizes stark
        überschneiden. Es handelt sich also weniger um &ldquo;zwei völlig getrennte Märkte&rdquo; als
        vielmehr um denselben Markt, nur aus unterschiedlichem Blickwinkel und in unterschiedlicher
        Konzentration abgebildet.
      </p>

      <h2>Volatilität und Wachstumscharakter</h2>
      <p>
        Mit geringerer Streuung und höherem Wachstumsanteil zeigt der Nasdaq 100 in der Regel die
        Tendenz, <strong>in Aufwärtsphasen steiler zu steigen und in Abwärtsphasen tiefer zu
        fallen.</strong> Der S&P 500 schwankt dank breiterer Branchenstreuung vergleichsweise
        gemäßigter. Welche Seite &ldquo;besser&rdquo; ist, lässt sich nicht pauschal sagen — höhere
        Volatilität bedeutet gleichzeitig größeres Aufwärtspotenzial und größeres Abwärtsrisiko.
      </p>
      <p>
        Wichtig ist: <strong>Vergangene Renditen garantieren nicht die Zukunft.</strong> Dass der
        Nasdaq 100 in den letzten gut zehn Jahren, als Technologiewerte stark waren, die Nase vorn
        hatte, heißt nicht, dass das immer so bleiben wird. Die tatsächlichen Sparplan-Ergebnisse
        beider Indizes kannst du direkt im{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> und in der Vergleichstabelle auf der
        Startseite nachsehen.
      </p>

      <h2>Die wichtigsten ETFs — QQQ und SPY</h2>
      <p>
        Einen Index selbst kann man nicht kaufen, deshalb investiert man über einen Fonds, der ihn
        nachbildet — einen ETF (die Grundlagen findest du in{" "}
        <Link href={localeHref("de", "/guides/etf-basics")}>Was ist ein ETF?</Link>).
      </p>
      <ul>
        <li>
          <strong>QQQ</strong> (Invesco QQQ Trust): Der bekannteste ETF auf den Nasdaq 100.{" "}
          <Link href={localeHref("de", "/etf/qqq")}>QQQ Sparplan-Backtest</Link>
        </li>
        <li>
          <strong>SPY</strong> (SPDR S&P 500 ETF Trust): Einer der ältesten und meistgehandelten ETFs
          der Welt, der den S&P 500 abbildet.{" "}
          <Link href={localeHref("de", "/etf/spy")}>SPY Sparplan-Backtest</Link>
        </li>
      </ul>
      <p>
        Beide haben vergleichsweise niedrige laufende Kosten und schütten Dividenden aus. Der Backtest
        von 10-eok rechnet mit dem um Dividenden bereinigten und kostenadjustierten{" "}
        <strong>Kurs</strong>, sodass diese Kosten und Ausschüttungen bereits im Ergebnis stecken.
      </p>

      <h2>Was passt zu welchem Anlegertyp</h2>
      <p>
        Dieser Text gibt keine feste Antwort vor, sondern Kriterien, an denen du dich selbst
        orientieren kannst.
      </p>
      <ul>
        <li>
          <strong>Fällt es dir schwer, Schwankungen auszuhalten,</strong> ist der breiter gestreute
          S&P 500 vielleicht die entspanntere Wahl — besonders wenn du dazu neigst, dein Depot in einer
          Baisse täglich zu checken und dich davon verunsichern zu lassen.
        </li>
        <li>
          <strong>Willst du dich stärker auf Technologie und Wachstum konzentrieren</strong> und kannst
          größere Ausschläge verkraften, passt der Nasdaq 100 zu dieser Veranlagung. Du musst aber
          akzeptieren, dass die Rückgänge ebenfalls größer ausfallen können.
        </li>
        <li>
          Beim Sparplan mit gleichbleibendem monatlichem Betrag ist Volatilität nicht zwingend schlecht
          — in Monaten mit niedrigeren Kursen sammelst du für dasselbe Geld mehr Anteile. Bei stärker
          schwankenden Indizes solltest du dir aber bewusst machen, dass{" "}
          <strong>das Ergebnis je nach Start- und Endzeitpunkt stark auseinanderfällt.</strong>
        </li>
      </ul>

      <h2>Es gibt auch Hebel-Versionen</h2>
      <p>
        Für den Nasdaq 100 gibt es Hebel-ETFs wie <strong>QLD</strong>, der die Tagesrendite
        verdoppelt, und <strong>TQQQ</strong>, der sie verdreifacht. Entscheidend ist, dass es sich um
        einen &ldquo;täglichen&rdquo; Hebel handelt: Über mehrere Tage kumuliert ergibt sich nicht
        einfach das Doppelte oder Dreifache des Index, sondern es kann durch Volatilität ein
        zusätzlicher Verlust entstehen (die sogenannte Volatilitäts-Drift). In Verlustphasen wächst
        auch der Verlust entsprechend. Mehr dazu unbedingt in{" "}
        <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>{" "}
        nachlesen.
      </p>

      <Sources ids={["yahoo", "fredFx"]} />

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
    </>
  ),
};

export const QLD_GUIDE_DE = {
  metaTitle: "Was ist QLD?",
  metaDescription:
    "QLD, ein Hebel-ETF, der den Nasdaq 100 täglich zweifach nachbildet — Aufbau, Sparplan-Eignung und Risiken von Grund auf erklärt.",
  head: {
    title: "Was ist QLD?",
    desc: "Ein Hebel-ETF, der den Nasdaq 100 täglich zweifach nachbildet",
    crumb: "Ratgeber · QLD",
  },
  Body: () => (
    <>
      <p>
        QLD ist ein börsengehandelter Indexfonds (ETF) der US-Fondsgesellschaft ProShares, offiziell{" "}
        <strong>ProShares Ultra QQQ</strong> genannt. Er zielt darauf ab, die{" "}
        <strong>Tagesrendite</strong> des <strong>Nasdaq-100-Index</strong> — vollgepackt mit
        US-Technologiewerten — zu <strong>verdoppeln</strong>. Er wurde 2006 an die Börse gebracht und
        hat dadurch eine vergleichsweise lange Kurshistorie, weshalb er in Backtests zum langfristigen
        Ansparen oft auftaucht. Während das ähnlich klingende QQQ den Nasdaq 100 einfach (1-fach)
        nachbildet, setzt QLD zusätzlich einen 2-fachen Hebel (eine Struktur, die mit geliehenem Geld
        den Faktor verstärkt) darauf.
      </p>

      <h2>Was ist der Nasdaq 100?</h2>
      <p>
        Der Nasdaq 100 ist ein Index aus rund 100 Unternehmen mit der größten Marktkapitalisierung, die
        an der US-Börse Nasdaq notiert sind — ohne Finanzwerte. Große Technologiewerte wie Apple,
        Microsoft und Nvidia machen einen großen Anteil aus, weshalb er oft als &ldquo;Leitindex der
        US-Technologiewerte&rdquo; bezeichnet wird. Statt in einen einzelnen Titel zu investieren,
        streust du effektiv auf diese 100 Unternehmen, allerdings schwankt der Index wegen der
        Konzentration auf Technologiewerte stärker als der breiter gestreute S&P 500. Die Unterschiede
        beider Indizes haben wir in{" "}
        <Link href={localeHref("de", "/guides/nasdaq100-vs-sp500")}>Nasdaq 100 vs. S&P 500</Link>{" "}
        ausführlicher behandelt.
      </p>

      <h2>Was &ldquo;täglich 2x&rdquo; genau bedeutet</h2>
      <p>
        Viele missverstehen QLD als Produkt, das den Nasdaq 100 &ldquo;über lange Zeit hinweg&rdquo;
        verdoppelt. Tatsächlich gilt der Faktor 2 <strong>pro Tag</strong>. Steigt der Nasdaq 100 an
        einem Tag um 1 %, steigt QLD um etwa 2 %; fällt er um 1 %, fällt QLD um etwa 2 %. Die
        Fondsgesellschaft stellt den Faktor 2 jeden Tag zum Handelsschluss neu ein — das nennt man{" "}
        <strong>tägliches Rebalancing</strong>. Entscheidend ist, dass sich dieser Faktor 2 auf den
        &ldquo;Tag&rdquo; bezieht. Deshalb wird die über mehrere Tage oder Monate kumulierte Rendite
        nicht einfach das Doppelte der Nasdaq-100-Rendite.
      </p>

      <h2>Pfadabhängigkeit und verzerrter Zinseszins beim langfristigen Halten</h2>
      <p>
        Weil der Faktor jeden Tag neu eingestellt wird, hängt das Endergebnis von QLD nicht nur davon
        ab, &ldquo;wie stark&rdquo; der Index gestiegen ist, sondern auch davon, &ldquo;in welcher
        Reihenfolge&rdquo; sich die Kurse bewegt haben. Das nennt man{" "}
        <strong>Pfadabhängigkeit</strong>. Am schnellsten versteht man das an einer Beispielrechnung.
      </p>
      <ul>
        <li>
          Steigt der Index an einem Tag um +10 % und fällt am nächsten um −10 %: 100 → 110 → 99. Nach
          zwei Tagen also rund 99 % des Ausgangswerts, ein Verlust von etwa 1 %.
        </li>
        <li>
          Das 2-fach-Produkt erlebt dieselben zwei Tage als +20 % und −20 %: 100 → 120 → 96. Ein
          Verlust von etwa 4 %, also deutlich mehr.
        </li>
      </ul>
      <p>
        Der Index ist im Kreis gelaufen und fast wieder am Ausgangspunkt gelandet, während beim
        2-fach-Produkt ein Verlust hängen geblieben ist. Dieses Phänomen, bei dem sich in einem
        richtungslos schwankenden Markt die Rendite Stück für Stück abnutzt, nennt man{" "}
        <strong>Volatilitäts-Drift (volatility decay)</strong>. Je häufiger und länger die Schwankungen
        anhalten, desto mehr summiert sich dieser Verlust, weshalb sich das Ergebnis bei langem Halten
        von QLD stark von der Intuition unterscheiden kann. Mehr zur Funktionsweise findest du in{" "}
        <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>.
      </p>

      <h2>Die Kraft in Aufwärtsphasen, Verluste in Abwärts- und Seitwärtsphasen</h2>
      <p>
        In einem Markt, der stetig in eine Richtung steigt, wirkt derselbe Mechanismus umgekehrt und
        der Zinseszinseffekt verstärkt sich: Weil täglich erneut auf den bereits um den Faktor 2
        gewachsenen Kurs gesetzt wird, kann die Rendite sogar über das einfache &ldquo;Doppelte des
        Index&rdquo; hinausgehen. Das erklärt, warum QLD in Phasen, in denen US-Technologiewerte über
        lange Zeit stark stiegen, so stark auffiel.
      </p>
      <p>
        Dieselbe Struktur verstärkt jedoch in fallenden Märkten die Verluste. Fällt der Index an einem
        Tag um 3 %, fällt QLD um etwa 6 %, und in einer großen Baisse können die Rückgänge vom Hoch aus
        sehr tief werden. Zudem wird die für die Erholung nötige Rendite umso größer, je tiefer der
        Rückgang war. Ein Vermögen, das um 50 % gefallen ist, braucht zum Beispiel +100 %, um wieder auf
        den Ausgangswert zu kommen. In einem richtungslos seitwärts laufenden Markt kann QLD wegen der
        oben beschriebenen Volatilitäts-Drift Stück für Stück an Wert verlieren, selbst wenn der Index
        am Ende unverändert ist.
      </p>

      <h2>Wie passt das zum Sparplan — und wo liegen die Grenzen?</h2>
      <p>
        Ein Sparplan, bei dem du jeden Monat denselben Betrag investierst, verträgt sich in mancher
        Hinsicht überraschend gut mit der Schwankung von QLD. Er kauft automatisch mehr Anteile bei
        niedrigen Kursen und weniger bei hohen, was den durchschnittlichen Kaufpreis glättet und einen
        tiefen Rückgang sogar in eine Gelegenheit zum günstigen Einstieg verwandeln kann. Auch das
        Risiko, alles auf einmal am Hoch zu kaufen, sinkt.
      </p>
      <p>
        Der Sparplan beseitigt die Volatilitäts-Drift aber nicht. Das bereits angesammelte Guthaben
        bleibt weiterhin dem täglichen Rebalancing ausgesetzt, und bei einer langen Abwärts- oder
        Seitwärtsphase lässt sich ein Verlust auch mit einem Sparplan kaum vermeiden. Zudem gilt: Ein
        gutes Ergebnis in der Vergangenheit ist nur die Aufzeichnung eines{" "}
        <strong>bestimmten historischen Zeitraums</strong> und keine Garantie für die Zukunft. Statt
        QLD zum Kern deines gesamten Vermögens zu machen, ist es realistischer, Anteil und Zeitraum
        selbst festzulegen und innerhalb eines Verlustrahmens zu bleiben, den du verkraften kannst.
      </p>
      <p>
        Ob QLD zu deinem Sparplan passt, solltest du letztlich anhand von Zahlen entscheiden. Gibst du
        monatliche Sparrate, Zielbetrag und Startzeitpunkt in den{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> ein, siehst du deutlich, in welchen Phasen
        QLD anderen Wertpapieren voraus war und wo es eingebrochen ist.
      </p>

      <Sources ids={["prosharesQld", "yahoo", "fredFx"]} />

      <p className="note">Dieser Inhalt dient der allgemeinen Information und ist keine Anlageberatung.</p>
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
  missLabel: (rough: string) => `Auch über den gesamten Zeitraum nicht erreicht · aktuell etwa ${rough}`,
  // Präfix "Datenstand" vor dem Tabellen-Absatz (locale-spezifisch). ym ist bereits per fmt.ym formatiert.
  asOf: (ym: string) => `Stand der Daten: ${ym}. `,
  Body: ({ table, asOf }: { table: ReactNode; asOf: string }) => (
    <>
      <h2 id="intro">Wie lange bis 1 Mio. €, wenn du jeden Monat gespart hättest</h2>
      <p>
        10-eok dreht die Frage der üblichen Rendite-Rechner um. Die meisten Rechner fragen "wie viel
        wird aus meinem Geld?", aber 10-eok fragt <strong>"wie lange hätte es gedauert, mein Ziel
        (1 Mio. €) zu erreichen?"</strong>. Statt einer vagen angenommenen Rendite rechnen wir mit den{" "}
        <strong>tatsächlichen historischen Tagesschlusskursen und dem tatsächlichen
        Euro/Dollar-Wechselkurs</strong> des jeweiligen Tages — so lässt sich "wenn ich damals
        angefangen hätte" konkret in Zahlen ausdrücken.
      </p>
      <p>
        Die Rechenweise ist einfach. Wir nehmen an, du hättest den gewählten ETF <strong>jeden Monat
        am selben Tag mit demselben Betrag</strong> (an einem Feiertag am nächsten Handelstag) zum
        tatsächlichen Kurs und Wechselkurs jenes Tages gekauft, und suchen den Zeitpunkt, an dem dein
        Depotwert zum ersten Mal 1 Mio. € übersteigt. Auch den <strong>Wechselkurseffekt</strong>, der
        beim Kauf von Dollar-Anlagen mit Euro leicht übersehen wird, bilden wir mit dem tatsächlichen
        Wechselkurs zum Kauf- und Bewertungszeitpunkt ab.
      </p>

      <h2 id="compare">Ergebnisse pro ETF, berechnet mit echten Daten</h2>
      <p>
        Die folgende Tabelle zeigt, wie lange es bei einer Sparrate von <strong>600 €/Monat, jeweils
        am 1.</strong>, gedauert hätte, bis jeder ETF <strong>1 Mio. €</strong> erreicht. Die
        "benötigte Zeit" wird <strong>vom heutigen Tag aus rückwärts berechnet</strong> — sie zeigt
        also, vor wie vielen Jahren du hättest anfangen müssen, damit du heute bei 1 Mio. € stehst.
        Dividenden werden reinvestiert, Steuern und Gebühren sind in der Basisannahme nicht
        berücksichtigt.
      </p>

      {table}

      <p className="cmp-note">
        {asOf}
        Die Datenhistorie beginnt für jeden ETF zu einem anderen Zeitpunkt, daher lässt sich die
        Dauer nicht ohne Weiteres 1:1 vergleichen. Im ausführlichen{" "}
        <Link href={localeHref("de", "/compare")}>ETF-Vergleich</Link> siehst du Zusammensetzung und
        Risiko jedes ETFs im Detail, oder klicke direkt auf einen ETF für die Einzelanalyse und den
        eigenen Rechner.
      </p>

      <h2 id="read">Wie du diese Zahlen lesen solltest</h2>
      <p>
        Der wichtigste Punkt zuerst: Die oben gezeigte Dauer kommt einem{" "}
        <strong>optimal gewählten Startzeitpunkt</strong> nahe. Bei gleichem ETF und gleicher
        Sparrate hängt das Ergebnis stark davon ab, <strong>wann du angefangen hättest</strong>.
        Besonders Hebel-ETFs wie QLD (2-fach) und TQQQ (3-fach) sind in Aufwärtsphasen explosiv,
        aber in fallenden oder seitwärts laufenden Märkten drohen Verluste und die sogenannte{" "}
        <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Volatilitäts-Drift (Decay)</Link>{" "}
        — je nach Startzeitpunkt fällt das Ergebnis daher sehr unterschiedlich aus. Dass
        Hebel-ETFs in der Tabelle schneller aussehen, heißt zugleich: Du hast dafür entsprechend
        mehr Risiko getragen.
      </p>
      <p>
        Deshalb bietet der Rechner von 10-eok eine Funktion für das <strong>Timing-Risiko</strong>:
        Er wendet denselben Plan auf alle vergangenen Startzeitpunkte an und zeigt dir die
        Bandbreite von schlechtestem, mittlerem und bestem Ergebnis. Diese Bandbreite — wie stark
        das Ergebnis je nach Glück beim Timing schwankt — ist aussagekräftiger als die einzelne
        Zahl in der Tabelle oben.
      </p>

      <h2 id="how">Daten und Berechnungsmethode</h2>
      <ul>
        <li>
          <strong>Kurse:</strong> Tägliche, um Dividenden bereinigte Schlusskurse (adjusted close)
          von Yahoo Finance. Dividendenreinvestition, Aktiensplits und laufende Kosten sind darin
          bereits enthalten.
        </li>
        <li>
          <strong>Wechselkurs:</strong> Täglicher Euro/Dollar-Wechselkurs (FRED, DEXUSEU,
          invertiert) der US-Notenbank-Datenbank. Da alle hier verfügbaren ETFs auf US-Dollar
          lauten und mit Euro gekauft werden, wirkt sich der Wechselkurs bei jedem einzelnen ETF
          auf das Ergebnis aus.
        </li>
        <li>
          <strong>Annahmen:</strong> Dividendenreinvestition ON, monatlicher Kauf am festgelegten
          Tag, Bewertung als unrealisierter Depotwert. Standardmäßig werden Steuern und Gebühren
          nicht abgezogen; im Rechner kannst du die Dividendenreinvestition ausschalten und eine
          jährliche Anpassung der Sparrate an die Inflation im Euroraum (Eurostat HICP) einschalten.
        </li>
        <li><strong>Aktualisierung:</strong> Die Marktdaten werden einmal täglich automatisch neu geladen.</li>
      </ul>
      <p>
        Die Annahmen, Vereinfachungen und häufig gestellten Fragen zur Berechnung findest du
        transparent auf der Seite{" "}
        <Link href={localeHref("de", "/how-it-works")}>So funktioniert&apos;s &amp; FAQ</Link>.
      </p>

      <h2 id="more">Mehr erfahren</h2>
      <ul>
        <li>
          <Link href={localeHref("de", "/compare")}>ETF-Vergleich</Link> — Zusammensetzung,
          Charakter und Risiko neben dem Ergebnis auf einen Blick
        </li>
        <li>
          <Link href={localeHref("de", "/guides/dca")}>Das Prinzip des Sparplans (DCA)</Link> —
          warum monatlich gleichbleibend investieren so beruhigend ist
        </li>
        <li>
          <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Das Risiko von Hebel-ETFs</Link>{" "}
          — so groß wie die 2- oder 3-fache Rendite sind auch Verluste und Volatilitäts-Drift
        </li>
        <li>
          <Link href={localeHref("de", "/guides/fx-impact")}>Wie der Wechselkurs deine Rendite beeinflusst</Link>{" "}
          — wenn du mit Euro Dollar-Anlagen kaufst
        </li>
        <li>
          <Link href={localeHref("de", "/guides")}>Alle Investment-Guides</Link> ·{" "}
          <Link href={localeHref("de", "/about")}>Über 10-eok</Link>
        </li>
      </ul>

      <p className="note">
        10-eok ist ein <strong>Bildungs- und Informationstool</strong>, das mit echten historischen
        Daten arbeitet, und ist keine Kaufempfehlung für einzelne Wertpapiere oder eine Anlage- bzw.
        Finanzberatung. Vergangene Renditen garantieren keine zukünftigen Ergebnisse, und
        Hebelprodukte tragen ein hohes Verlustrisiko. Die Verantwortung für Anlageentscheidungen und
        ihre Folgen liegt bei dir.
      </p>
    </>
  ),
};

export const HOW_IT_WORKS_DE = {
  metaTitle: "So funktioniert's & FAQ · 10-eok",
  metaDescription:
    "Wie 10-eok mit echten historischen Kursen und dem Euro/Dollar-Wechselkurs ein Backtest berechnet — und Antworten auf häufig gestellte Fragen.",
  head: {
    title: "So funktioniert's & FAQ",
    desc: "Wie 10-eok deine Ergebnisse berechnet",
  },
  Body: () => (
    <>
      <h2>Der Rechenweg auf einen Blick</h2>
      <ol>
        <li>
          Für den gewählten ETF werden die <strong>täglichen, um Dividenden bereinigten Kurse</strong>{" "}
          und der <strong>tägliche Euro/Dollar-Wechselkurs</strong> geladen.
        </li>
        <li>
          An jedem festgelegten <strong>Kauftag</strong> im Monat (an Feiertagen am nächsten
          Handelstag) wird der festgelegte <strong>Euro-Betrag</strong> zum Kurs jenes Tages in
          Dollar umgerechnet und der ETF gekauft.
        </li>
        <li>
          An jedem Handelstag wird der <strong>Depotwert in Euro</strong> berechnet: Anzahl
          gehaltener Anteile × Kurs des Tages × Wechselkurs des Tages.
        </li>
        <li>
          Der Tag, an dem der Depotwert zum ersten Mal <strong>1 Mio. €</strong> übersteigt, wird
          gesucht und als "benötigte Zeit" angezeigt.
        </li>
      </ol>

      <h2>Datenquellen</h2>
      <ul>
        <li>
          <strong>Kurse:</strong>{" "}
          <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>,
          tägliche, um Dividenden bereinigte Schlusskurse (adjusted close). Dividendenreinvestition,
          Aktiensplits und laufende Kosten sind bereits enthalten.
        </li>
        <li>
          <strong>Wechselkurs:</strong>{" "}
          <a href="https://fred.stlouisfed.org/series/DEXUSEU" target="_blank" rel="noopener">
            Federal Reserve Bank of St. Louis (FRED), täglicher Euro/Dollar-Wechselkurs (DEXUSEU, invertiert)
          </a>.
        </li>
        <li>
          <strong>Inflationsindex:</strong>{" "}
          <a href="https://ec.europa.eu/eurostat/web/hicp" target="_blank" rel="noopener">
            Eurostat, Harmonisierter Verbraucherpreisindex (HICP) für den Euroraum
          </a>. Wird für die Option "jährliche Anpassung an die Inflation" verwendet.
        </li>
        <li>Die Daten werden einmal täglich automatisch aktualisiert.</li>
      </ul>

      <h2>Annahmen und Vereinfachungen</h2>
      <ul>
        <li>Dividenden gelten als <strong>reinvestiert</strong> (adjusted-close-Kurse werden verwendet).</li>
        <li>
          <strong>Steuern</strong> werden standardmäßig nicht abgezogen (das Ergebnis zeigt den
          unrealisierten Depotwert vor Steuern). Wie Kapitalerträge aus ETFs bei dir konkret
          besteuert werden, hängt von deinem Wohnsitz und deiner persönlichen Situation ab und kann
          sich außerdem ändern — dieses Tool bildet das nicht ab. Für eine verbindliche
          Einschätzung wende dich an eine Steuerberatung.
        </li>
        <li>Transaktionskosten und Spread sind der Einfachheit halber nicht berücksichtigt.</li>
        <li>Es wird angenommen, dass Anteile in beliebigen Bruchteilen gekauft werden können (Modellvereinfachung).</li>
      </ul>

      <h2>Häufig gestellte Fragen</h2>
      <h3>Garantiert das Ergebnis zukünftige Renditen?</h3>
      <p>
        Nein. Jedes Ergebnis ist lediglich eine Aufzeichnung von "was gewesen wäre, wenn du das
        damals so gemacht hättest". Vergangene Renditen garantieren keine zukünftigen Ergebnisse.
      </p>
      <h3>Warum startet ihr mit QLD?</h3>
      <p>
        Weil die Datenhistorie lang ist (seit 2006) und die Schwankungen groß genug sind, um den
        Effekt eines Sparplans anschaulich zu zeigen. Weitere ETFs kommen nach und nach dazu.
      </p>
      <h3>Was bedeutet die "jährliche Rendite" (CAGR)?</h3>
      <p>
        Sie zeigt, um wie viel Prozent dein Vermögenswert über den Haltezeitraum im Schnitt pro
        Jahr gewachsen ist — eine annualisierte, zinseszinsbereinigte Rendite auf Basis vergangener
        Renditen.
      </p>
      <h3>Was ist der Unterschied zwischen Dividendenreinvestition ON und OFF?</h3>
      <p>
        ON (Standard) rechnet mit der <strong>Gesamtrendite</strong> inklusive wieder angelegter
        Dividenden (adjusted close), OFF nur mit der <strong>Kursrendite</strong> ohne Dividenden.
        Je höher die Dividendenrendite eines ETFs, desto größer der Unterschied zwischen beiden.
      </p>
      <h3>Was bedeutet die jährliche Anpassung an die Inflation?</h3>
      <p>
        Statt jeden Monat denselben Betrag zu sparen, wird die Sparrate hier jährlich um die
        Inflationsrate im Euroraum (Eurostat HICP) erhöht. Das ergibt ein realistischeres Bild,
        wenn du davon ausgehst, dass auch dein Einkommen in etwa mit der Inflation steigt.
      </p>
      <h3>Werden Steuern in der Berechnung berücksichtigt?</h3>
      <p>
        Nein, nicht standardmäßig. Wie Kapitalerträge und ETF-Gewinne besteuert werden, hängt von
        deinem Wohnsitzland und deiner persönlichen Situation ab und ändert sich mitunter auch über
        die Zeit. Dieses Tool rechnet grundsätzlich mit dem unrealisierten Depotwert vor Steuern und
        bildet einzelne Steuerregeln nicht ab. Für eine verbindliche Berechnung wende dich an eine
        Steuerberatung.
      </p>
      <h3>Sollte ich tatsächlich genau so investieren?</h3>
      <p>
        Dieser Dienst ist ein Informationstool und keine Anlageempfehlung oder -beratung. Verstehe
        die Risiken von Hebelprodukten gründlich, und triff deine Anlageentscheidungen
        eigenverantwortlich.
      </p>

      <p className="note">
        Genauere Details zur Berechnungslogik findest du in den{" "}
        <Link href={localeHref("de", "/guides")}>Guides</Link>.
      </p>
    </>
  ),
};

export const COMPARE_DE = {
  metaTitle: "ETF-Vergleich — wer erreicht 1 Mio. € am schnellsten bei 600 €/Monat?",
  metaDescription:
    "QLD, TQQQ, QQQ, SPY, VOO, SCHD, VT und weitere ETFs im Vergleich: mit echten historischen Kursen berechnet, wie lange es bei 600 €/Monat bis 1 Mio. € gedauert hätte, plus jährliche Rendite, Zusammensetzung und Risiko jedes ETFs.",
  head: {
    title: "ETF-Vergleich, Zeit bis 1 Mio. €",
    desc: "Bei 600 €/Monat — echte historische Ergebnisse und Charakter jedes ETFs",
    crumb: "Vergleich",
  },
  tableHeaders: {
    ticker: "ETF",
    timeToGoal: "Bis 1 Mio. €",
    cagr: "Jährlich",
    dataStart: "Datenbeginn",
  },
  missLabel: (rough: string) => `Auch über den gesamten Zeitraum nicht erreicht · aktuell etwa ${rough}`,
  asOf: (ym: string) => `Stand der Daten: ${ym}. `,
  tableNote:
    "Die Datenhistorie beginnt für jeden ETF zu einem anderen Zeitpunkt, daher lässt sich die Dauer nicht 1:1 vergleichen. Basisannahme: Dividenden reinvestiert, Steuern und Gebühren nicht berücksichtigt.",
  Body: ({ table }: { table: ReactNode }) => (
    <>
      <p>
        Auch wenn du jeden Monat denselben Betrag anlegst, unterscheidet sich das Ergebnis stark
        danach, in welchen ETF du investierst. Die folgende Übersicht zeigt für alle von 10-eok
        unterstützten ETFs, wie lange es bei einer Sparrate von <strong>600 € am jeweils 1. eines
        Monats</strong> mit echten historischen Tagesschlusskursen und Wechselkursen gedauert hätte,
        bis der Depotwert <strong>1 Mio. €</strong> erreicht. Die Dauer wird{" "}
        <strong>vom heutigen Tag aus rückwärts berechnet</strong> — sie zeigt also, vor wie vielen
        Jahren du hättest anfangen müssen, damit du heute bei 1 Mio. € stehst.
      </p>

      {table}

      <h2>Warum Hebel-ETFs schneller wirken</h2>
      <p>
        In der Tabelle erreichen Hebel-ETFs wie QLD (2-fach auf den Nasdaq 100) und TQQQ (3-fach)
        ihr Ziel oft in kürzerer Zeit. Das bedeutet aber nicht "das bessere Produkt", sondern{" "}
        <strong>ein entsprechend höheres Risiko</strong>. Hebel-ETFs bilden die <em>tägliche</em>{" "}
        Rendite mit einem Multiplikator ab: In Aufwärtsphasen wirkt das explosiv, in fallenden oder
        seitwärts laufenden Märkten summieren sich Verluste und{" "}
        <Link href={localeHref("de", "/guides/leverage-etf-risk")}>Volatilitäts-Drift (Decay)</Link>.
        Schon eine kleine Verschiebung des Startzeitpunkts lässt das Ergebnis beim gleichen ETF
        stark auseinanderlaufen, und die Erholung aus einem tiefen Einbruch fällt rechnerisch
        deutlich schwerer.
      </p>

      <h2>Ohne Hebel: QQQ und SPY</h2>
      <p>
        QQQ (Nasdaq 100) und SPY (S&amp;P 500) bilden ihren Index ohne Hebel 1-fach ab. QQQ ist
        stark technologielastig und dadurch wachstumsstark, aber auch schwankungsreicher; SPY
        streut breiter über 500 Großunternehmen und bewegt sich dadurch etwas ruhiger. Die Dauer
        bis zum Ziel fällt bei diesen ETFs tendenziell länger aus als bei Hebelprodukten, dafür sind
        die Ausschläge während der Haltedauer kleiner — für einen langfristigen Sparplan oft die
        entspanntere Wahl. Die Unterschiede zwischen beiden Indizes erklären wir ausführlich in{" "}
        <Link href={localeHref("de", "/guides/nasdaq100-vs-sp500")}>Nasdaq 100 vs. S&amp;P 500</Link>.
      </p>

      <h2>Nicht die einzelne Zahl entscheidet — sondern das Timing-Risiko</h2>
      <p>
        Die in der Tabelle gezeigte Dauer ist nur ein Szenario, das einem günstig gewählten
        Startzeitpunkt nahekommt. In der Realität hängt das Ergebnis stark davon ab, wann du
        tatsächlich angefangen hättest. Deshalb bietet der{" "}
        <Link href={localeHref("de", "/")}>Rechner</Link> zusätzlich das{" "}
        <strong>Timing-Risiko</strong>: Er wendet denselben Plan auf alle vergangenen
        Startzeitpunkte an und zeigt die Bandbreite von schlechtestem, mittlerem und bestem
        Ergebnis. Passt du Sparrate, Kauftag, Zielbetrag und die Inflationsanpassung an deine
        Situation an, siehst du unmittelbar, wie stark das Ergebnis selbst beim gleichen ETF
        schwanken kann.
      </p>

      <p className="note">
        Dieser Vergleich dient der <strong>Bildung und Information</strong> auf Basis echter
        historischer Daten und ist keine Kaufempfehlung für einzelne Wertpapiere oder eine
        Anlageberatung. Vergangene Renditen garantieren keine zukünftigen Ergebnisse, und
        Hebelprodukte tragen ein hohes Verlustrisiko. Die Verantwortung für Anlageentscheidungen
        und ihre Folgen liegt bei dir.
      </p>
    </>
  ),
};
