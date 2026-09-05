import Eyebrow from './Eyebrow';
import Reveal from './Reveal';
import { PawIcon } from './Icons';

export default function BrandStory() {
  return (
    <section id="about" className="relative overflow-hidden bg-espresso py-32 text-ivory lg:py-44">
      {/* ambient watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[44vw] italic leading-none text-cream/[0.05]"
      >
        &amp;
      </span>

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <Eyebrow index="06" label="About" center />
        </Reveal>
        <h2 className="mt-9 font-display text-4xl font-light leading-[1.06] sm:text-6xl lg:text-7xl">
          <Reveal variant="mask" delay={100}>
            For the ones who give us
          </Reveal>
          <Reveal variant="mask" delay={240}>
            <em className="italic text-cream">everything.</em>
          </Reveal>
        </h2>
        <Reveal delay={280}>
          <p className="mx-auto mt-9 max-w-xl text-[15px] font-light leading-relaxed text-ivory/60">
            Kin &amp; Tail began with a simple observation: the ones who love us most
            ask for the least. They wait. They watch. They forgive the late nights and
            the missed walks and greet us like heroes anyway.
          </p>
        </Reveal>
        <Reveal delay={380}>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-ivory/60">
            So we make objects worthy of that devotion — quiet, useful, beautiful —
            for the animals who turn houses into homes.
          </p>
        </Reveal>
        <Reveal delay={460}>
          <PawIcon className="mx-auto mt-10 h-7 w-7 text-cream" />
          <p className="mt-5 font-display text-lg italic text-cream/80">
            — Kin &amp; Tail, Studio Notes N°4
          </p>
        </Reveal>
        <Reveal delay={540}>
          <p className="mt-12 text-[10px] uppercase tracking-[0.35em] text-ivory/35">
            Est. 2021 &nbsp;·&nbsp; Small-batch &nbsp;·&nbsp; Dogs &amp; Cats
          </p>
        </Reveal>
      </div>
    </section>
  );
}
