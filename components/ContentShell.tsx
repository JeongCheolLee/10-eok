import Link from "next/link";

export function ContentShell({
  title,
  desc,
  crumb,
  children,
}: {
  title: string;
  desc?: string;
  crumb?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="content">
      <div className="content-top">
        <Link href="/" className="home">
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          10-eok
        </Link>
        {crumb && <span className="crumb">{crumb}</span>}
      </div>
      <article className="prose">
        <h1>{title}</h1>
        {desc && <p className="desc">{desc}</p>}
        {children}
      </article>
    </main>
  );
}
