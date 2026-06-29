import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import { Byline } from "@/components/Byline";

export function ContentShell({
  title,
  desc,
  crumb,
  byline,
  children,
}: {
  title: string;
  desc?: string;
  crumb?: string;
  /** 작성자/수정일 바이라인 표시 — 글(가이드·종목·계산방법)에만 true 또는 수정일 문자열을 넘긴다. */
  byline?: boolean | string;
  children: React.ReactNode;
}) {
  return (
    <main className="content">
      <div className="content-top">
        <Link href="/" className="home">
          <AppLogo />
          10-eok
        </Link>
        {crumb && <span className="crumb">{crumb}</span>}
      </div>
      <article className="prose">
        <h1>{title}</h1>
        {desc && <p className="desc">{desc}</p>}
        {byline && <Byline updated={typeof byline === "string" ? byline : undefined} />}
        {children}
      </article>
    </main>
  );
}
