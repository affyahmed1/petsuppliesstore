import { useEffect, useMemo, useRef, useState } from 'react';
import { useShop, scrollToId } from '../store/ShopContext';
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products';
import ProductImage from './ProductImage';
import { ArrowUpRight, CloseIcon, SearchIcon } from './Icons';
import type { CategoryId } from '../types';

export default function SearchModal() {
  const { searchOpen, setSearchOpen, setDetailId, setFilter } = useShop();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (searchOpen) {
      setQ('');
      setActive(0);
      const raf = window.requestAnimationFrame(() => {
        setShown(true);
        inputRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(raf);
    }
    setShown(false);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.categoryLabel, p.tagline, p.species, ...p.tags, ...p.categories]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [q]);

  useEffect(() => setActive(0), [q]);

  const openProduct = (id: string) => {
    setSearchOpen(false);
    setDetailId(id);
  };

  const pickCategory = (id: CategoryId | 'all') => {
    setSearchOpen(false);
    setFilter(id);
    scrollToId('collection');
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results.length) {
      openProduct(results[Math.min(active, results.length - 1)].id);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/70 transition-opacity duration-400 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`relative mx-auto mt-16 w-[calc(100%-2.5rem)] max-w-2xl border border-cream/15 bg-espresso shadow-2xl transition-all duration-500 ease-lux sm:mt-24 ${
          shown ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        {/* input row */}
        <div className="flex items-center gap-4 border-b border-ivory/10 px-6 py-5">
          <SearchIcon className="h-5 w-5 shrink-0 text-cream" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search the collection…"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent font-display text-2xl font-light text-ivory outline-none placeholder:text-ivory/30"
          />
          <kbd className="hidden rounded-sm border border-ivory/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ivory/40 sm:block">
            esc
          </kbd>
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="grid h-9 w-9 shrink-0 place-items-center text-ivory/60 transition-colors hover:text-cream"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-6 py-6">
          {!q.trim() && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/40">
                Suggested
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickCategory(c.id)}
                    className="border border-ivory/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:border-cream hover:text-cream"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/40">
                Often sought
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {['leather', 'bed', 'stoneware', 'play', 'brush'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="font-display text-lg italic text-ivory/60 transition-colors hover:text-cream"
                  >
                    “{s}”
                  </button>
                ))}
              </div>
            </>
          )}

          {q.trim() && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/40" aria-live="polite">
                {results.length ? `${results.length} piece${results.length > 1 ? 's' : ''} found` : 'Nothing found'}
              </p>
              {results.length > 0 && (
                <ul className="mt-4">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => openProduct(p.id)}
                        onMouseEnter={() => setActive(i)}
                        className={`flex w-full items-center gap-4 px-2 py-3 text-left transition-colors duration-300 ${
                          active === i ? 'bg-cocoa' : ''
                        }`}
                      >
                        <ProductImage
                          image={p.image}
                          crop={p.crop}
                          alt={p.name}
                          className="h-14 w-14 shrink-0"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-xl leading-tight text-ivory">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.25em] text-ivory/45">
                            {p.categoryLabel}
                          </span>
                        </span>
                        <span className="text-sm font-medium text-ivory/80">{formatPrice(p.price)}</span>
                        <ArrowUpRight className={`h-4 w-4 ${active === i ? 'text-cream' : 'text-ivory/30'}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {results.length === 0 && (
                <div className="mt-6 pb-2">
                  <p className="font-display text-2xl italic text-ivory/70">
                    Nothing on our shelves for “{q.trim()}”.
                  </p>
                  <p className="mt-3 text-sm font-light text-ivory/50">
                    Try “leather”, “bed” or “play” — or browse the full collection.
                  </p>
                  <button
                    type="button"
                    onClick={() => pickCategory('all')}
                    className="u-line mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream"
                  >
                    Browse the collection
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
