import Link from "next/link";
import type { ContentBlock } from "@/lib/cms/types";

function BlockLink({ label, href }: { label: string; href: string }) {
  const external = /^(https:|mailto:)/.test(href);
  return (
    <p className="cms-link-block">
      {external ? (
        <a href={href} rel="noopener noreferrer" {...(href.startsWith("https:") ? { target: "_blank" } : {})}>
          {label}
        </a>
      ) : (
        <Link href={href}>{label}</Link>
      )}
    </p>
  );
}

/** Renders structured CMS blocks. All text is rendered as React text (escaped); no raw HTML. */
export function CmsBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return b.level === 1 ? <h1 key={i}>{b.text}</h1> : b.level === 2 ? <h2 key={i}>{b.text}</h2> : <h3 key={i}>{b.text}</h3>;
          case "paragraph":
            return <p key={i}>{b.text}</p>;
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </Tag>
            );
          }
          case "table":
            return (
              <div key={i} className="cms-table-wrap" role="region" aria-label="Table" tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      {b.columns.map((c, j) => (
                        <th key={j} scope="col">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <aside key={i} className="cms-callout">
                {b.title && <p><strong>{b.title}</strong></p>}
                <p>{b.content}</p>
              </aside>
            );
          case "link":
            return <BlockLink key={i} label={b.label} href={b.href} />;
        }
      })}
    </>
  );
}
