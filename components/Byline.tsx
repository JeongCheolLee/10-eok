import Link from "next/link";
import { AUTHOR, AUTHOR_ROLE, LAST_UPDATED } from "@/lib/site";

/** 글머리 작성자/수정일 표시 — YMYL(금융) 신뢰(E-E-A-T) 신호. */
export function Byline({ updated = LAST_UPDATED, note }: { updated?: string; note?: string }) {
  const [y, m, d] = updated.split("-").map(Number);
  return (
    <p className="byline">
      <Link href="/about" className="byline-author">{AUTHOR}</Link>
      <span className="byline-role">{AUTHOR_ROLE}</span>
      <span className="byline-sep">·</span>
      <span className="byline-date">최종 업데이트 {y}년 {m}월 {d}일</span>
      {note && <span className="byline-note">{note}</span>}
    </p>
  );
}
