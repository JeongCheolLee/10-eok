import { tickerInfo, tickerMonogram } from "@/lib/tickers";

// 토스식 원형 아바타. 브랜드 로고 이미지가 아니라 모노그램(티커/한글 약자) + 종목별 색.
export function TickerLogo({ symbol, size = 36 }: { symbol: string; size?: number }) {
  const { color } = tickerInfo(symbol);
  const label = tickerMonogram(symbol);
  const fontSize = (label.length >= 4 ? 0.26 : label.length >= 3 ? 0.32 : 0.4) * size;
  return (
    <span
      className="tlogo"
      style={{ width: size, height: size, background: color, fontSize }}
      aria-hidden
    >
      {label}
    </span>
  );
}
