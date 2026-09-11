import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

const images = [
  {
    src: "/images/life-craft.jpg",
    alt: "Two colleagues reviewing product analytics on a large monitor",
    title: "Two makers, one decision",
    body: "Small pairs own whole surfaces, end to end.",
    wide: true,
  },
  {
    src: "/images/life-remote.jpg",
    alt: "A team member working remotely at a bright minimal desk",
    title: "Remote, genuinely",
    body: "Async by default, with two overlap hours a day.",
    wide: false,
  },
  {
    src: "/images/growth-session.jpg",
    alt: "Colleagues mapping out plans on a whiteboard",
    title: "Strategy in the open",
    body: "Roadmaps are argued about, not handed down.",
    wide: false,
  },
];

export function LifeAtCompany() {
  return (
    <section id="life" className="scroll-mt-24 border-t border-border bg-card py-20 sm:py-28">
      <div className={section}>
        <Reveal>
          <p className="eyebrow">Life here</p>
          <h2 className="display mt-5 max-w-3xl text-[clamp(1.9rem,4.5vw,3.2rem)]">
            Deep work, loud opinions, quiet calendars.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {images.map((img, i) => (
            <Reveal
              key={img.title}
              delay={i * 0.08}
              className={img.wide ? "md:col-span-2" : ""}
            >
              <figure className="lift group h-full overflow-hidden rounded-3xl border border-border bg-background">
                <div className={`relative ${img.wide ? "aspect-[21/9]" : "aspect-[16/9]"}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    fill
                    sizes={img.wide ? "(min-width: 768px) 1190px, 100vw" : "(min-width: 768px) 585px, 100vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-6 py-5">
                  <h3 className="display text-lg">{img.title}</h3>
                  <p className="text-sm text-text-secondary">{img.body}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
