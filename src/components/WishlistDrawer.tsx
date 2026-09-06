import { useEffect, useState } from 'react';
import { useShop, scrollToId } from '../store/ShopContext';
import { formatPrice, getProduct } from '../data/products';
import ProductImage from './ProductImage';
import { BagIcon, CloseIcon, HeartIcon } from './Icons';
import type { Product } from '../types';

export default function WishlistDrawer() {
  const { wishOpen, setWishOpen, wishlist, moveToBag, toggleWishlist, setDetailId } = useShop();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (wishOpen) {
      const raf = window.requestAnimationFrame(() => setShown(true));
      return () => window.cancelAnimationFrame(raf);
    }
    setShown(false);
  }, [wishOpen]);

  useEffect(() => {
    if (!wishOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setWishOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [wishOpen, setWishOpen]);

  if (!wishOpen) return null;
  const items = wishlist.map(getProduct).filter((p): p is Product => Boolean(p));

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Wishlist">
      <button
        type="button"
        aria-label="Close wishlist"
        onClick={() => setWishOpen(false)}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/60 transition-opacity duration-500 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-ivory text-espresso transition-transform duration-500 ease-lux ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
          <h3 className="font-display text-2xl font-light">
            Wishlist <span className="text-mocha/70">({items.length})</span>
          </h3>
          <button
            type="button"
            onClick={() => setWishOpen(false)}
            aria-label="Close wishlist"
            className="grid h-10 w-10 place-items-center transition-colors hover:text-mocha"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <HeartIcon className="h-10 w-10 text-espresso/20" />
            <p className="mt-6 font-display text-2xl font-light">Nothing saved yet.</p>
            <p className="mt-2 max-w-[240px] text-sm font-light text-espresso/55">
              Tap the heart on any piece to keep it here for later.
            </p>
            <button
              type="button"
              onClick={() => {
                setWishOpen(false);
                scrollToId('collection');
              }}
              className="mt-8 bg-espresso px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-cocoa"
            >
              Discover the collection
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-espresso/10 overflow-y-auto">
              {items.map((p) => (
                <li key={p.id} className="flex gap-4 p-5">
                  <button
                    type="button"
                    onClick={() => {
                      setWishOpen(false);
                      setDetailId(p.id);
                    }}
                    aria-label={`View ${p.name}`}
                    className="h-20 w-20 shrink-0 overflow-hidden"
                  >
                    <ProductImage image={p.image} crop={p.crop} alt={p.name} className="h-20 w-20" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg leading-tight">{p.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-mocha/80">
                      {p.categoryLabel}
                    </p>
                    <p className="mt-1 text-sm font-medium">{formatPrice(p.price)}</p>
                    <div className="mt-2.5 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => moveToBag(p.id)}
                        className="inline-flex items-center gap-2 bg-espresso px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-cocoa"
                      >
                        <BagIcon className="h-3.5 w-3.5" /> Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        className="u-line text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso/50 hover:text-espresso"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-espresso/10 px-6 py-5">
              <p className="text-xs font-light text-espresso/50">
                Saved pieces stay here until you’re ready — no rush, no reminders.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
