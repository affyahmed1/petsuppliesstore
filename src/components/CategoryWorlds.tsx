import Eyebrow from './Eyebrow';
import Reveal from './Reveal';
import { IMAGES } from '../data/products';
import { useShop, scrollToId } from '../store/ShopContext';
import { ArrowRight } from './Icons';
import type { CategoryId } from '../types';

interface WorldProps {
  id: CategoryId;
  index: string;
  title: string;
  copy: string;
  cta: string;
  image: string;
  alt: string;
  offset?: boolean;
}

function WorldPanel({ id, index, title, copy, cta, image, alt, offset }: WorldProps) {
  const { setFilter } = useShop();

  const enter = () => {
    setFilter(id);
    scrollToId('collection');
  };

  return (
    <button
      type="button"
      onClick={enter}
      aria-label={`${cta} — browse the ${title.toLowerCase()} collection`}
      className={`group relative block w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-cream ${
        offset ? 'lg:col-span-5 lg:mt-28' : 'lg:col-span-7'
      }`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10 transition-opacity duration-700 group-hover:opacity-80" />
        <span className="absolute left-6 top-6 text-[10px] font-semibold uppercase tracking-[0.35em] text-cream/80">
          {index}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-7 transition-transform duration-700 ease-lux group-hover:-translate-y-1.5 sm:p-9">
          <h3 className="font-display text-6xl font-light tracking-[0.04em] text-ivory sm:text-7xl">
            {title}
          </h3>
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-ivory/70">
            {copy}
          </p>
          <span className="u-line mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-cream">
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function CategoryWorlds() {
  return (
    <section id="worlds" className="bg-espresso py-28 text-ivory lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <Eyebrow index="02" label="Two Worlds" />
            </Reveal>
            <h2 className="mt-7 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
              <Reveal variant="mask" delay={80}>
                Two temperaments.
              </Reveal>
              <Reveal variant="mask" delay={200}>
                <em className="italic text-cream">One standard of care.</em>
              </Reveal>
            </h2>
          </div>
          <Reveal delay={250}>
            <p className="max-w-xs text-sm font-light leading-relaxed text-ivory/55">
              Choose a world below — or keep both close. Most households we know
              belong to neither entirely.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" delay={100}>
            <WorldPanel
              id="dogs"
              index="N° 01 — Canis"
              title="DOGS"
              copy="Loyal, loud, always first to the door. Goods for walk rituals, deep sleeps and the space between."
              cta="Shop Dogs"
              image={IMAGES.dogPanel}
              alt="A dignified lurcher dog in warm golden studio light"
            />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={250}>
            <WorldPanel
              id="cats"
              index="N° 02 — Felis"
              title="CATS"
              copy="Quiet, exacting, endlessly opinionated. Goods for sunlit perches and slow, considered afternoons."
              cta="Shop Cats"
              image={IMAGES.catPanel}
              alt="An elegant cream cat with amber eyes in warm studio light"
              offset
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
