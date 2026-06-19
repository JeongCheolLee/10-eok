import { tickerInfo } from "@/lib/tickers";

// 토스식 원형 아바타. 브랜드 로고 이미지가 아니라 티커 텍스트 모노그램 + 종목별 색.
export function TickerLogo({ symbol, size = 36 }: { symbol: string; size?: number }) {
  const { color } = tickerInfo(symbol);
  const fontSize = (symbol.length >= 4 ? 0.3 : 0.36) * size;
  return (
    <span
      className="tlogo"
      style={{ width: size, height: size, background: color, fontSize }}
      aria-hidden
    >
      {symbol}
    </span>
  );
}
