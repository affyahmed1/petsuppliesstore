import Eyebrow from './Eyebrow';
import Reveal from './Reveal';
import { IMAGES } from '../data/products';

const POINTS = [
  {
    title: 'Materials',
    body: 'Vegetable-tanned leather, undyed wool, glazed stoneware — chosen for how they age, not just how they look.',
  },
  {
    title: 'Construction',
    body: 'Hand-stitched seams, weighted bases, replaceable parts. Nothing glued that could be sewn.',
  },
  {
    title: 'Comfort',
    body: 'Tested by the harshest critics we know — our own. If it isn’t chosen first, it isn’t finished.',
  },
  {
    title: 'Longevity',
    body: 'Designed to be repaired, refilled and passed on. A collar should outlive a decade of walks.',
  },
];

export default function CraftSection() {
  return (
    <section id="craft" className="bg-espresso py-28 text-ivory lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* sticky visual */}
        <div className="lg:col-span-6">
          <Reveal variant="fade">
            <div className="relative overflow-hidden lg:sticky lg:top-24">
              <img
                src={IMAGES.craft}
                alt="Hands stitching a leather collar at a wooden workbench"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-display text-3xl font-light leading-tight">
                  Made slowly, <em className="italic text-cream">on purpose.</em>
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-ivory/60">
                  The studio bench — where every piece begins
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* editorial column */}
        <div className="lg:col-span-6 lg:pl-8">
          <Reveal>
            <Eyebrow index="04" label="The Craft" />
          </Reveal>
          <h2 className="mt-7 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
            <Reveal variant="mask" delay={80}>
              Crafted for
            </Reveal>
            <Reveal variant="mask" delay={200}>
              <em className="italic text-cream">daily life.</em>
            </Reveal>
          </h2>
          <Reveal delay={220}>
            <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-ivory/60">
              Thoughtful materials. Considered details. Made for the moments that
              matter — the long walk, the slow meal, the deep sleep.
            </p>
          </Reveal>

          <div className="mt-10">
            {POINTS.map((pt, i) => (
              <Reveal key={pt.title} delay={i * 90}>
                <div className="group grid grid-cols-[2rem_1fr] gap-5 border-t border-ivory/12 px-1 py-7 transition-all duration-500 last:border-b hover:bg-cream/5 hover:pl-4">
                  <span className="font-display italic text-cream/70">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl font-light">{pt.title}</h3>
                    <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ivory/55">
                      {pt.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 grid grid-cols-3 border-t border-ivory/12">
              {[
                { value: '08', label: 'Pieces' },
                { value: '100%', label: 'Small-batch' },
                { value: '0', label: 'Shortcuts' },
              ].map((s, i) => (
                <div key={s.label} className={`py-6 ${i > 0 ? 'border-l border-ivory/12 pl-6' : ''}`}>
                  <p className="font-display text-4xl font-light text-cream">{s.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
