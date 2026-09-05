import Eyebrow from './Eyebrow';
import Reveal from './Reveal';
import ProductCard from './ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { useShop, scrollToId } from '../store/ShopContext';
import { ArrowRight } from './Icons';

export default function Collection() {
  const { filter, setFilter } = useShop();
  const filtered =
    filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.categories.includes(filter));

  const countFor = (id: string) =>
    id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.categories.includes(id as never)).length;

  return (
    <section id="collection" className="bg-ivory py-28 text-espresso lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
          <div>
            <Reveal>
              <Eyebrow index="03" label="The Collection" tone="light" />
            </Reveal>
            <h2 className="mt-7 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
              <Reveal variant="mask" delay={80}>
                Objects for the
              </Reveal>
              <Reveal variant="mask" delay={200}>
                <em className="italic text-mocha">everyday ceremony.</em>
              </Reveal>
            </h2>
          </div>

          <Reveal delay={200}>
            <div className="flex flex-wrap gap-x-6 gap-y-3" role="group" aria-label="Filter collection">
              {CATEGORIES.map((c) => {
                const active = filter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(c.id)}
                    className={`border-b pb-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-400 ${
                      active
                        ? 'border-cream text-espresso'
                        : 'border-transparent text-espresso/40 hover:text-espresso'
                    }`}
                  >
                    {c.label}
                    <sup className={`ml-1 text-[9px] ${active ? 'text-mocha' : 'text-espresso/30'}`}>
                      {countFor(c.id)}
                    </sup>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-espresso/10 pt-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-espresso/45">
              Made in small batches — numbered and finished by hand
            </p>
            <button
              type="button"
              onClick={() => scrollToId('concierge')}
              className="u-line inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-mocha transition-colors hover:text-espresso"
            >
              Not sure where to begin? Ask the concierge
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
