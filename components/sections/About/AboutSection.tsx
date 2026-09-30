 "use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Lock, X, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";
import styles from "./AboutSection.module.css";

const ABOUT_PHOTOS = [
  "/image/about/1.jpg",
  "/image/about/2.jpg",
  "/image/about/3.jpg",
  "/image/about/4.jpg",
  "/image/about/5.jpg",
] as const;

const HERO_AVATARS = [
  { src: ABOUT_PHOTOS[0], className: "left-[8%] top-[6%] h-14 w-14 sm:h-16 sm:w-16" },
  { src: ABOUT_PHOTOS[3], className: "right-[9%] top-[8%] h-14 w-14 sm:h-16 sm:w-16" },
  { src: ABOUT_PHOTOS[1], className: "right-[4%] top-[46%] h-11 w-11 sm:h-12 sm:w-12" },
  { src: ABOUT_PHOTOS[4], className: "left-[14%] bottom-[10%] h-12 w-12 sm:h-14 sm:w-14" },
  { src: ABOUT_PHOTOS[2], className: "right-[16%] bottom-[6%] h-11 w-11 sm:h-12 sm:w-12" },
] as const;

const COMPARISON_ROWS: [string, boolean | "soon", boolean | "soon", boolean | "soon"][] = [
  ["Startup and investor profiles", false, false, true],
  ["Introductions with context", false, false, true],
  ["Messages next to documents", false, false, true],
  ["Notes and pipeline tracking", false, true, true],
  ["Access controls per document", false, false, true],
  ["One searchable history", false, false, "soon"],
];

const PRINCIPLES = [
  { title: "Context first", body: "Every profile, note and message stays linked to the relationship it belongs to." },
  { title: "Owner-controlled sharing", body: "Workspace owners choose which documents are visible and to whom." },
  { title: "Quiet by default", body: "Fewer notifications, clearer activity, and no noise for the sake of engagement." },
] as const;

function Mark({ value }: { value: boolean | "soon" }) {
  if (value === "soon") {
    return (
      <span className="inline-block rounded-pill bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold text-blue-600 border border-blue-200/80">
        COMING SOON
      </span>
    );
  }
  if (value)
    return (
      <Check
        size={18}
        strokeWidth={2.5}
        className="mx-auto align-middle text-emerald-600"
        aria-label="Yes"
      />
    );
  return (
    <X
      size={18}
      strokeWidth={2.5}
      className="mx-auto align-middle text-slate-400"
      aria-label="No"
    />
  );
}

export default function AboutSection() {
  return (
    <div className="bg-slate-50/80 border-slate-100 font-sans text-slate-900 antialiased">
      {/* HERO */}
      <section className={`relative flex min-h-[85vh] flex-col justify-center overflow-hidden to-blue-400 ${styles.dotGrid || ""}`}>
        {HERO_AVATARS.map((a, i) => (
          <span
            key={a.src + i}
            className={`absolute z-10 hidden overflow-hidden rounded-pill border-2 border-white shadow-md sm:block ${a.className}`}
            aria-hidden="true"
          >
            <Image src={a.src} alt="" width={64} height={64} className="h-full w-full object-cover" />
          </span>
        ))}
        <Reveal className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-32">
          <h1 className="font-about-display text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight">
            A calmer way for founders <br />
            <span className="text-blue-600">and investors to work together.</span>
          </h1>

          <p className="font-about-display mt-7 text-lg font-semibold">
            A startup–investor workspace for discovery, introductions and collaboration.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-base text-slate-600">
            Keep profiles, messages, notes and documents together, so every conversation has the context it needs.
          </p>

          <div className="mt-9 flex items-center justify-center">
            <AuthButton
              flow="signup"
              className="btn-pill-primary px-7 py-3.5"
              icon={false}
            >
              <span>Get started</span>
              <ArrowRight size={15} />
            </AuthButton>
          </div>
        </Reveal>
      </section>
      {/*platform page ka jo login page hai wo bhi us mai bhi forget password and email  reset option is there ui will be same but there will
      be only the to change password directly and i will provide you api that will fit for that you neeed to go through and  
      work accordingly and rest you neede not to change */}

      {/* HARD TO KNOW */}
      <section id="hard-to-know" className="bg-blue-50/70 py-24 border-y border-slate-200/80">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-about-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold leading-tight tracking-tight">
            Why Relationships Get Scattered <br className="hidden sm:block" /> Across Too Many Tools
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-600">
            Conversations live in inboxes, files sit in shared drives, and notes end up in personal documents. Nobody has the full picture.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          <Reveal delay={0} className={`relative flex flex-col p-6 pt-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs ${styles.receipt || ""}`}>
            <div className="mb-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="mb-2 h-2.5 w-3/4 rounded bg-slate-200" />
              <div className="mb-2 h-2.5 w-1/2 rounded bg-slate-200" />
              <div className="mb-4 h-2.5 w-2/3 rounded bg-slate-200" />
              <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 font-mono text-xs font-semibold text-slate-600 border border-slate-200">
                <Lock size={11} strokeWidth={2.5} /> Files in five places
              </span>
            </div>
            <h3 className="font-about-display mb-2 min-h-[48px] text-lg font-bold">
              Files drift out of sight.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Documents get attached to threads and forgotten. Finding the latest version takes longer than it should.
            </p>
          </Reveal>

          <Reveal delay={0.08} className={`relative flex flex-col p-6 pt-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs ${styles.receipt || ""}`}>
            <div className="relative mb-6 flex h-[104px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="text-center">
                <span className="font-mono text-3xl font-bold text-blue-600">3 tools</span>
                <p className="mt-1 text-micro text-slate-500">for one conversation</p>
              </div>
              <span className="absolute right-6 top-2 bottom-2 border-r border-dashed border-slate-300" aria-hidden="true" />
            </div>
            <h3 className="font-about-display mb-2 min-h-[48px] text-lg font-bold">
              Context gets lost between tools.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              A note in one place and a message in another make it hard to remember why a decision was made.
            </p>
          </Reveal>

          <Reveal delay={0.16} className={`relative flex flex-col p-6 pt-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs ${styles.receipt || ""}`}>
            <div className="mb-6 flex h-[104px] items-center justify-center gap-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="text-center">
                <div className="font-mono text-lg font-bold">Inbox</div>
                <div className="text-micro text-slate-600">messages</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <div className="font-mono text-lg font-bold">Drive</div>
                <div className="text-micro text-slate-600">documents</div>
              </div>
            </div>
            <h3 className="font-about-display mb-2 min-h-[48px] text-lg font-bold">
              One relationship, many places.
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              A shared workspace gives founders and investors the same view of introductions, documents and next steps.
            </p>
          </Reveal>
        </div>
      </section>

      {/* APPROACH NOTE */}
      {/* APPROACH */}
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <span className="mb-4 block h-[3px] w-8 bg-blue-600 rounded-full" />
            <span className="font-mono text-xs font-semibold tracking-[0.02em] text-blue-600">
              Our approach
            </span>
            <h2 className="font-about-display mt-4 text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-snug">
              Good relationships need good context.
              <span className="mt-3 block text-[0.85em] font-semibold text-slate-600">
                Profiles, conversations and documents belong in one place.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-7 max-w-[62ch] space-y-5 text-sm leading-relaxed text-slate-700">
            <p>
              Founders and investors usually work across email, chat, shared drives and spreadsheets. Context gets lost between them, and every new conversation starts from scratch.
            </p>
            <p>
              VentureFlow keeps the essentials together: a startup profile, an investor profile, introductions, messages, notes and the documents that go with them.
            </p>
            <p>
              Each workspace owner decides what is shared and with whom. The goal is a calm, searchable history of every relationship.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT YOU ACTUALLY GET */}
      <section className="py-24 bg-blue-50/70 border-y border-slate-200/80">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-about-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold tracking-tight">
            What you actually get.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Most tools give you somewhere to talk or somewhere to store files. VentureFlow connects the two.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl px-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="w-[42%] py-4 pl-6 pr-4 font-medium text-slate-600">
                      <span className="sr-only">Comparison aspect</span>
                    </th>
                    <th className="px-4 py-4 text-center font-semibold text-slate-600">
                      Email threads
                    </th>
                    <th className="px-4 py-4 text-center font-semibold text-slate-600">
                      Spreadsheets
                    </th>
                    <th className="bg-blue-50 py-4 pl-4 pr-6 text-center font-bold text-blue-600">
                      VentureFlow
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COMPARISON_ROWS.map(([label, a, b, c]) => (
                    <tr key={label} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 pl-6 pr-3 font-medium text-slate-800">{label}</td>
                      <td className="px-3 py-4 text-center align-middle"><Mark value={a} /></td>
                      <td className="px-3 py-4 text-center align-middle"><Mark value={b} /></td>
                      <td className="bg-blue-50/40 py-4 pl-3 pr-6 text-center align-middle"><Mark value={c} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PRINCIPLES */}
      <section className="py-24 bg-white border-t border-slate-100">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-about-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold tracking-tight">
            What VentureFlow is built around.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            A few principles that shape how the workspace behaves.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
          {PRINCIPLES.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 0.08}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <p className="font-semibold text-slate-900 text-base">{f.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="relative z-20 mt-24 sm:mt-28">
        <div className="absolute inset-x-0 top-0 z-20 -translate-y-1/2 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="card-fintech mx-auto flex w-full max-w-[1120px] flex-col items-center gap-8 p-6 md:p-10 shadow-xl md:flex-row md:justify-between"
          >
            <div className="text-center md:text-left">
              <h2 className="font-about-display text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold tracking-tight text-slate-900">
                Take a look around.
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                The best way to understand VentureFlow is to open a workspace and explore the sample profiles.
              </p>
              <div className="mt-5">
                <AuthButton
                  flow="signup"
                  className="btn-pill-primary px-6 py-3.5"
                  icon={false}
                >
                  Explore VentureFlow <ArrowRight size={15} />
                </AuthButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}