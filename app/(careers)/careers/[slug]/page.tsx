import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { ApplyClientCTA, MobileApplyBar } from "@/components/careers/ApplyScrollButtons";
import { ApplyForm } from "@/components/careers/ApplyForm";
import { getRole, hiringSteps, roles } from "@/data/careers";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) {
    notFound();
  }
  const title = `${role.title} — Careers at UnBound X`;
  const description = role.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  return (
    <main className="pt-36 pb-28">
      <div className={section}>
        <Reveal>
          <Link
            href="/#roles"
            className="text-xs tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
          >
            ← All open roles
          </Link>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="display mt-8 text-[clamp(2.5rem,7vw,5.5rem)]">{role.title}</h1>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-8 flex flex-wrap gap-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {[role.department, role.location, role.type, role.experience].map((m) => (
              <span key={m} className="rounded-full border border-border px-3 py-1">
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <div className={`${section} mt-16 grid gap-14 md:grid-cols-[1.5fr_0.8fr] md:items-start`}>
        <div className="space-y-14">
          <Block title="Overview">
            <p className="text-muted-foreground">{role.description}</p>
          </Block>
          <Block title="What you will do">
            <List items={role.responsibilities} />
          </Block>
          <Block title="What we look for">
            <List items={role.requirements} />
          </Block>
          <Block title="Nice to have">
            <List items={role.niceToHave} />
          </Block>
          <Block title="Benefits">
            <List
              items={[
                "Remote-first with a yearly team gathering.",
                "Learning budget and dedicated craft time.",
                "Equity from your first day.",
                "Hardware of your choice.",
              ]}
            />
          </Block>
          <Block title="Hiring process">
            <ol className="space-y-5">
              {hiringSteps.map((s) => (
                <li key={s.step} className="border-l-2 border-brand pl-5">
                  <p className="display text-lg">
                    <span className="text-brand">{s.step}</span> {s.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </Block>
        </div>

        <aside className="surface top-28 p-8 md:sticky">
          <p className="eyebrow">Apply</p>
          <p className="display mt-4 text-2xl">Ready when you are.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Send your resume and a short note. We reply within five working
            days.
          </p>
          <ApplyClientCTA />
        </aside>
      </div>

      <div id="apply" className={`${section} mt-20 max-w-3xl`}>
        <Reveal>
          <h2 className="eyebrow">Apply — {role.title}</h2>
          <div className="mt-6">
            <ApplyForm roleSlug={role.slug} roleTitle={role.title} />
          </div>
        </Reveal>
      </div>

      <MobileApplyBar roleTitle={role.title} />
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section>
        <h2 className="eyebrow">{title}</h2>
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-muted-foreground">
          <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
          {i}
        </li>
      ))}
    </ul>
  );
}
