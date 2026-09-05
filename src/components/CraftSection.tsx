import Eyebrow from './Eyebrow';
import Reveal, { useParallax } from './Reveal';
import { IMAGES } from '../data/products';

const PILLARS = [
  {
    n: '01',
    title: 'Materials',
    body: 'Vegetable-tanned leather, glazed stoneware, undyed wool. Chosen for how they feel today — and how they age tomorrow.',
  },
  {
    n: '02',
    title: 'Comfort',
    body: 'Edges softened, seams flattened, fabrics that breathe. Designed around how animals actually rest, eat and play.',
  },
  {
    n: '03',
    title: 'Function',
    body: 'Washable covers, weighted bowls, quiet hardware. Beauty that survives an ordinary Tuesday.',
  },
  {
    n: '04',
    title: 'Longevity',
    body: 'Made in small batches and made to be kept. Every piece is designed to be repaired, not replaced.',
  },
];

export default function CraftSection() {
  const parallax = useParallax<HTMLDivElement>(0.05);

  return (
    <section id="craft" className="bg-cocoa py-28 text-ivory lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* sticky visual */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal variant="fade">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -left-4 -top-4 hidden h-full w-full border border-cream/40 sm:block"
                />
                <div className="relative overflow-hidden">
                  <div ref={parallax} className="will-change-transform">
                    <img
                      src={IMAGES.craft}
                      alt="Artisan hands stitching a cognac leather collar at a wooden workbench"
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full scale-110 object-cover"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                </div>
              </div>
              <p className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-ivory/40">
                <span>The workshop — bench N°2</span>
                <span>Cognac, brass, waxed thread</span>
              </p>
            </Reveal>
          </div>
        </div>

        {/* editorial content */}
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal>
            <Eyebrow index="04" label="The Craft" />
          </Reveal>
          <h2 className="mt-8 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
            <Reveal variant="mask" delay={80}>
              Crafted for
            </Reveal>
            <Reveal variant="mask" delay={200}>
              <em className="italic text-cream">daily life.</em>
            </Reveal>
          </h2>
          <Reveal delay={220}>
            <p className="mt-7 max-w-lg text-[15px] font-light leading-relaxed text-ivory/60">
              Thoughtful materials. Considered details. Made for the moments that
              matter — the walk before rain, the meal after, the long sleep in between.
            </p>
          </Reveal>

          <div className="mt-14">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 110}>
                <div className="group grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-ivory/12 py-8 transition-colors duration-500 hover:border-cream/40 sm:grid-cols-[64px_200px_1fr] sm:gap-x-8">
                  <span className="font-display text-xl italic text-cream/80">{p.n}</span>
                  <h3 className="font-display text-2xl font-light text-ivory transition-transform duration-500 ease-lux group-hover:translate-x-1">
                    {p.title}
                  </h3>
                  <p className="col-span-2 text-sm font-light leading-relaxed text-ivory/55 sm:col-span-1">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-ivory/12" />
          </div>
        </div>
      </div>
    </section>
  );
}
