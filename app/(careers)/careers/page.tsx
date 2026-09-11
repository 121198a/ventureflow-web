import { Hero } from "@/components/careers/Hero";
import { Stats } from "@/components/careers/Stats";
import { WhyJoin } from "@/components/careers/WhyJoin";
import { LifeAtCompany } from "@/components/careers/LifeAtCompany";
import { Growth } from "@/components/careers/Growth";
import { JobBoard } from "@/components/careers/JobBoard";
import { HiringProcess } from "@/components/careers/HiringProcess";
import { ClosingCTA } from "@/components/careers/ClosingCTA";
import { Reveal } from "@/components/motion/Reveal";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <WhyJoin />
      <LifeAtCompany />
      <Growth />

      <section id="roles" className="scroll-mt-24 border-t border-border bg-card py-20 sm:py-28">
        <div className={section}>
          <Reveal>
            <p className="eyebrow">Open positions</p>
            <h2 className="display mt-5 text-[clamp(1.9rem,4.5vw,3.2rem)]">Find your seat.</h2>
          </Reveal>
          <div className="mt-10">
            <JobBoard />
          </div>
        </div>
      </section>

      <HiringProcess />
      <ClosingCTA />
    </main>
  );
}
