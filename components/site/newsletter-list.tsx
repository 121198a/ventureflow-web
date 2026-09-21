"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid, List as ListIcon } from "lucide-react";
import { articles } from "@/lib/newsletter-data";
import type { Article } from "@/lib/newsletter-data";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

function BriefCard({ a }: { a: Article }) {
  return (
    <article className="flex min-h-[190px] flex-col border-t-2 border-brand bg-surface-alt px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <p className="eyebrow text-brand">{a.kicker}</p>
      <h3 className="mt-3 font-editorial text-[1.25rem] leading-tight">{a.title}</h3>
      <p className="mt-3 text-[0.85rem] leading-relaxed text-ink/70">{a.blurb}</p>
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-hairline pt-3 text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
          <span>{a.date}</span>
          <span>{a.read}</span>
        </div>
      </div>
    </article>
  );
}

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Subscription failed. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-7 space-y-3" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        placeholder="you@company.com"
        className="w-full rounded-md border border-hairline bg-background px-4 py-3 text-[0.9rem] outline-none focus:border-brand"
        style={{ fontWeight: 500 }}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand px-4 py-3 text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong disabled:opacity-60"
        style={{ fontWeight: 800 }}
      >
        {loading ? "Subscribing..." : sent ? "Subscribed" : "Subscribe"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-[0.75rem] text-muted-foreground">
        {sent
          ? "You're on the list — the next briefing lands weekly."
          : "Weekly. No promotions. Unsubscribe anytime."}
      </p>
    </form>
  );
}

function Sidebar() {
  return (
    <aside>
      <Image src="/logo/unboundx-mark.png" alt="" width={44} height={44} className="size-11 rounded-full object-cover shadow-xs" />
      <h2 className="mt-5 font-editorial text-[1.5rem] leading-tight">The Fundraising Playbook</h2>
      <p className="mt-4 text-[0.9rem] leading-[1.75] text-ink/70">
        A weekly playbook on the mechanics of private raises — closes, data rooms, investor
        conditions, and the operational discipline institutional counterparties expect.
      </p>
      <SubscribeForm />
    </aside>
  );
}

export function NewsletterList() {
  const [view, setView] = useState<"stacks" | "list">("stacks");

  return (
    <>
      <section className="relative mt-6 overflow-hidden rounded-lg bg-navy">
        <Image
          src="/images/newsletter-hero.jpg"
          alt="Notebook, pen and printed financial performance report on a dark desk"
          fill
          sizes="(min-width: 1180px) 1180px, 100vw"
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-transparent" />
        <div className="relative max-w-2xl px-5 py-12 sm:px-14 sm:py-20">
          <Reveal as="p" className="text-[0.7rem] font-semibold tracking-[0.12em] text-white/80">
            Weekly · On the mechanics of private raises
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="mt-4 font-editorial text-[1.95rem] min-[400px]:text-[2.35rem] leading-tight text-white sm:text-[3rem]"
          >
            The Fundraising Playbook
          </Reveal>
          <Reveal as="p" delay={140} className="mt-8 text-[0.7rem] font-semibold tracking-[0.12em] text-white/80">
            UBverse
          </Reveal>
          <Reveal as="p" delay={160} className="mt-4 text-[1rem] leading-relaxed text-white/90">
            Closes, data rooms, investor conditions, and the operational discipline institutional
            counterparties expect — one playbook at a time.
          </Reveal>
          <Reveal delay={220}>
            <a href="#briefings" className="group mt-10 flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-full border border-white/70 text-white transition-colors group-hover:bg-white group-hover:text-navy">
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
              <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-white">Read the latest</span>
            </a>
          </Reveal>
        </div>
      </section>

      <section id="briefings" className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[1.7rem] sm:text-[2rem]" style={{ fontWeight: 800 }}>
            Recent briefings
          </h2>
          <div className="flex overflow-hidden rounded-md border border-hairline">
            {(["stacks", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs sm:text-sm capitalize transition-colors",
                  view === v ? "bg-accent text-brand font-semibold" : "text-muted-foreground"
                )}
              >
                {v === "stacks" ? (
                  <LayoutGrid className="size-4" />
                ) : (
                  <ListIcon className="size-4" />
                )}
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            {view === "stacks" ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {articles.map((a, i) => (
                  <Reveal key={a.slug} delay={i * 70}>
                    <Link
                      href={`/newsletter/article/${a.slug}`}
                      className="flex flex-col rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <BriefCard a={a} />
                      <h3 className="mt-6 text-[1.1rem] font-semibold text-ink">{a.headline}</h3>
                      <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/75">{a.summary}</p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-hairline">
                {articles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/newsletter/article/${a.slug}`}
                    className="grid grid-cols-1 gap-6 py-8 outline-none focus-visible:ring-2 focus-visible:ring-brand md:grid-cols-[300px_1fr] md:items-start"
                  >
                    <BriefCard a={a} />
                    <div className="md:pt-6">
                      <h3 className="text-[1.25rem] font-semibold text-ink">{a.headline}</h3>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{a.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </section>
    </>
  );
}
