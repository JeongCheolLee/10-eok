import type { CSSProperties } from "react";

/** 장식용 숫자 릴. 실제 결과는 부모 제목의 aria-label로 한 번만 읽는다. */
export function RollingNumber({ value, animate }: { value: number; animate: boolean }) {
  if (!animate) return <span aria-hidden="true">{value}</span>;
  return <span className="rolling-number" aria-hidden="true">
    {String(value).split("").map((digit, index) => {
      const last = Number(digit);
      const style = { "--roll-offset": `${-last * 1.1}em`, "--roll-delay": `${200 + index * 35}ms` } as CSSProperties;
      return <span className="rolling-digit" key={index}>
        <span className="rolling-track" style={style}>
          {Array.from({ length: last + 1 }, (_, row) => <span key={row}>{row % 10}</span>)}
        </span>
      </span>;
    })}
  </span>;
}
