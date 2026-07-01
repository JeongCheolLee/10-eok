import { SOURCES, type SourceId } from "@/lib/sources";

/**
 * 글 하단의 데이터·출처 인용 블록 — YMYL(금융) 신뢰(E-E-A-T) 신호.
 * 페이지가 관련 출처 id만 골라 넘긴다. 실제 사용하는 출처만 인용한다.
 */
export function Sources({ ids }: { ids: SourceId[] }) {
  const items = ids.map((id) => SOURCES[id]);
  if (items.length === 0) return null;
  return (
    <aside className="sources" aria-label="데이터 및 출처">
      <p className="sources-label">데이터 · 출처</p>
      <ul>
        {items.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener">{s.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
