import { LEGAL_APP_NAME, LEGAL_EMAIL, LEGAL_UPDATED, MINIAPP_LEGAL, PRIVACY_REFERENCES, type LegalKind } from "@/lib/legal/miniapp";
import { NavBar } from "../components/ui";

export function LegalScreen({ kind, back, onMenu, onClose }: {
  kind: LegalKind; back: () => void; onMenu: () => void; onClose: () => void;
}) {
  const doc = MINIAPP_LEGAL[kind];
  return <div className="screen">
    <NavBar back={back} onMenu={onMenu} onClose={onClose} />
    <article className="legal-document">
      <p className="legal-meta">{LEGAL_APP_NAME}</p>
      <h1>{doc.title}</h1>
      <p className="legal-meta">작성·수정일: {LEGAL_UPDATED}</p>
      <p>{doc.intro}</p>
      {doc.sections.map((section) => <section key={section.title}>
        <h2>{section.title}</h2>
        {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </section>)}
      {kind === "privacy" && <section><h2>외부 서비스 정책</h2>
        {PRIVACY_REFERENCES.map((ref) => <p key={ref.href}><a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.label}</a></p>)}
      </section>}
      <p>문의: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a></p>
    </article>
  </div>;
}
