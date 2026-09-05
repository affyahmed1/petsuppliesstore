import Eyebrow from './Eyebrow';
import Reveal, { useParallax } from './Reveal';
import { IMAGES } from '../data/products';
import { scrollToId } from '../store/ShopContext';
import { ArrowRight, BowlIcon, BrushIcon, MoonIcon, PulseIcon } from './Icons';

const TOPICS = [
  {
    n: '01',
    title: 'Grooming',
    body: 'Ten quiet minutes with the right brush — less maintenance, more conversation.',
    Icon: BrushIcon,
  },
  {
    n: '02',
    title: 'Nutrition',
    body: 'Bowls at the right height, meals at the right pace, water always in reach.',
    Icon: BowlIcon,
  },
  {
    n: '03',
    title: 'Comfort',
    body: 'A bed in the warm spot, a cave in the quiet one. Rest is serious business.',
    Icon: MoonIcon,
  },
  {
    n: '04',
    title: 'Wellbeing',
    body: 'Ritual, routine, presence. The things that keep a tail moving and a purr running.',
    Icon: PulseIcon,
  },
];

export default function CareSection() {
  const parallax = useParallax<HTMLDivElement>(0.05);

  return (
    <section id="care" className="bg-ivory py-28 text-espresso lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* copy + image */}
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index="05" label="Care" tone="light" />
          </Reveal>
          <h2 className="mt-8 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
            <Reveal variant="mask" delay={80}>
              Care is
            </Reveal>
            <Reveal variant="mask" delay={200}>
              <em className="italic text-mocha">a language.</em>
            </Reveal>
          </h2>
          <Reveal delay={220}>
            <p className="mt-7 max-w-sm text-[15px] font-light leading-relaxed text-espresso/65">
              Spoken in brushes and warm bowls, in the bed moved closer to the
              radiator, in the walk taken the long way. We make the vocabulary.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <button
              type="button"
              onClick={() => scrollToId('concierge')}
              className="u-line mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-mocha transition-colors hover:text-espresso"
            >
              Ask the concierge
              <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>

          <Reveal variant="fade" delay={200} className="mt-14 hidden lg:block">
            <div className="relative overflow-hidden">
              <div ref={parallax} className="will-change-transform">
                <img
                  src={IMAGES.care}
                  alt="Hands gently brushing a relaxed brown dog in warm home light"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full scale-110 object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/25 to-transparent" />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-espresso/45">
              The Sunday brush — a household ritual
            </p>
          </Reveal>
        </div>

        {/* topics */}
        <div className="lg:col-span-7">
          {TOPICS.map((t, i) => (
            <Reveal key={t.n} delay={i * 100}>
              <div className="group flex items-start gap-6 border-t border-espresso/10 px-1 py-9 transition-all duration-500 last:border-b hover:bg-cream/15 hover:pl-4 sm:gap-9">
                <span className="pt-1 font-display text-lg italic text-mocha/70">{t.n}</span>
                <t.Icon className="mt-0.5 h-8 w-8 shrink-0 text-mocha transition-colors duration-500 group-hover:text-espresso" />
                <div>
                  <h3 className="font-display text-3xl font-light text-espresso">{t.title}</h3>
                  <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-espresso/60">
                    {t.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={200} className="mt-12 lg:hidden">
            <div className="relative overflow-hidden">
              <img
                src={IMAGES.care}
                alt="Hands gently brushing a relaxed brown dog in warm home light"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
