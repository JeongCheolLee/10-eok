import type { Locale } from "@/lib/i18n/locales";
const copy = {
  ko: {
    title: "저장한 계산과 공유 링크",
    body: "‘계산 저장하기’를 누르면 종목·금액·매수 주기·목돈·목표·배당 등 계산 조건을 이 브라우저의 로컬 저장소에 저장해요. 계정이나 다른 기기와 동기화하지 않아요. 저장한 계산의 편집 메뉴 또는 브라우저 사이트 데이터 설정에서 지울 수 있어요. 공유 링크에는 계산 조건이 포함되며, 링크를 받은 사람도 해당 조건을 볼 수 있어요. 링크를 열면 주소의 조건이 웹 호스팅 서버로 전송되고 접속 로그에 포함될 수 있어요.",
  },
  en: {
    title: "Saved calculations and shared links",
    body: "“Save calculation” stores ETFs, amounts, purchase schedules, initial investment, target and dividend settings in this browser’s local storage. These entries do not sync to an account or another device. Delete them from the saved calculations edit menu or your browser’s site data settings. Shared links contain calculation conditions, visible to anyone receiving the link. Opening a link sends its URL conditions to the web host, where they may appear in access logs.",
  },
  ja: {
    title: "保存した計算と共有リンク",
    body: "「計算を保存」を押すと、ETF・金額・購入頻度・開始時の一括金額・目標・分配金などの条件を、このブラウザのローカルストレージに保存します。アカウントや他の端末とは同期しません。保存した計算の編集メニュー、またはブラウザのサイトデータ設定から削除できます。共有リンクには計算条件が含まれ、受け取った人も確認できます。リンクを開くとURLの条件がウェブホストに送信され、アクセスログに含まれる場合があります。",
  },
  de: {
    title: "Gespeicherte Berechnungen und geteilte Links",
    body: "„Berechnung speichern“ speichert ETFs, Beträge, Kaufrhythmus, Startkapital, Ziel und Ausschüttungseinstellungen im lokalen Speicher dieses Browsers. Es gibt keine Synchronisierung mit einem Konto oder anderen Geräten. Einträge lassen sich über „Bearbeiten“ bei gespeicherten Berechnungen oder über die Website-Dateneinstellungen des Browsers löschen. Geteilte Links enthalten die Berechnungsbedingungen und machen sie für Empfänger sichtbar. Beim Öffnen werden die URL-Bedingungen an den Webhost übermittelt und können in Zugriffsprotokollen erscheinen.",
  },
};
export function StorageNotice({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section>
      <h2>{t.title}</h2>
      <p>{t.body}</p>
    </section>
  );
}
