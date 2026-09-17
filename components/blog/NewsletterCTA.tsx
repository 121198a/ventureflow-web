"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { NewsletterSignalIcon } from "@/components/ui/CustomIcons";
import { Reveal } from "@/components/motion/Reveal";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Unable to subscribe. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-t border-slate-200/70 bg-white">
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <NewsletterSignalIcon size={14} className="text-blue-600" />
              <span>Weekly Executive Briefing</span>
            </div>

            <h2 className="display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Stay ahead with verifiable market intelligence.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Every Thursday: 5 minutes of high-signal market memos, founder
              playbooks, dilution frameworks, and verified thesis performance.
              Zero fluff, zero retrospection.
            </p>

            {/* Email Capture Form */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto flex max-w-md items-center justify-center gap-2.5 rounded-2xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200"
                  >
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <div className="text-left text-xs sm:text-sm">
                      <p className="font-bold">You are on the list!</p>
                      <p className="text-emerald-700">Check your inbox for our latest cap table playbook.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-lg flex-col sm:flex-row items-stretch gap-2.5"
                  >
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <NewsletterSignalIcon size={17} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your work email address"
                        className="w-full rounded-full border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-600 focus:outline-hidden focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-98 disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <span>Subscribing...</span>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              {errorMessage && (
                <p className="mt-2 text-center text-xs font-semibold text-red-600">
                  {errorMessage}
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Join 18,400+ investors and founders · Unsubscribe at any time · No spam guarantee
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
