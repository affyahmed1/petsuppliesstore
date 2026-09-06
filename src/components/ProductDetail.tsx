import { useEffect, useState } from 'react';
import { useShop } from '../store/ShopContext';
import { formatPrice, getProduct } from '../data/products';
import ProductImage from './ProductImage';
import { BagIcon, CloseIcon, HeartIcon, MinusIcon, PlusIcon } from './Icons';

export default function ProductDetail() {
  const { detailId, setDetailId, addToBag, toggleWishlist, wishlist } = useShop();
  const product = getProduct(detailId);
  const [shown, setShown] = useState(false);
  const [qty, setQtyLocal] = useState(1);

  useEffect(() => {
    if (detailId) {
      setQtyLocal(1);
      const raf = window.requestAnimationFrame(() => setShown(true));
      return () => window.cancelAnimationFrame(raf);
    }
    setShown(false);
  }, [detailId]);

  useEffect(() => {
    if (!detailId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailId, setDetailId]);

  if (!product) return null;
  const saved = wishlist.includes(product.id);
  const close = () => setDetailId(null);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={product.name}>
      <button
        type="button"
        aria-label="Close product details"
        onClick={close}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/60 transition-opacity duration-500 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-ivory text-espresso transition-transform duration-500 ease-lux ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative">
          <ProductImage
            image={product.image}
            crop={product.crop}
            alt={product.name}
            className="aspect-square w-full"
            eager
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center bg-espresso text-ivory transition-colors hover:bg-cocoa"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
          <span className="absolute left-4 top-4 bg-espresso/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-cream">
            {product.categoryLabel}
          </span>
        </div>

        <div className="flex-1 px-7 py-8 sm:px-9">
          <h3 className="font-display text-4xl font-light leading-tight">{product.name}</h3>
          <p className="mt-2 text-lg font-medium text-espresso/85">{formatPrice(product.price)}</p>
          <p className="mt-3 font-display text-lg italic text-mocha">{product.tagline}</p>

          <div className="my-7 h-px w-full bg-espresso/10" />

          <p className="text-[15px] font-light leading-relaxed text-espresso/70">
            {product.description}
          </p>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-mocha">
            Materials &amp; details
          </p>
          <ul className="mt-4 space-y-2.5">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm font-light text-espresso/75">
                <span className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-cream" />
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex items-stretch gap-3">
            <div className="flex items-center border border-espresso/20">
              <button
                type="button"
                onClick={() => setQtyLocal((q) => Math.max(1, q - 1))}
                disabled={qty === 1}
                aria-label="Decrease quantity"
                className="grid h-12 w-10 place-items-center text-espresso transition-colors hover:bg-espresso/5 disabled:opacity-30"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQtyLocal((q) => Math.min(9, q + 1))}
                disabled={qty === 9}
                aria-label="Increase quantity"
                className="grid h-12 w-10 place-items-center text-espresso transition-colors hover:bg-espresso/5 disabled:opacity-30"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => addToBag(product.id, qty)}
              className="flex h-12 flex-1 items-center justify-center gap-3 bg-espresso text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors duration-300 hover:bg-cocoa"
            >
              Add to Bag <BagIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={saved}
            className={`mt-3 flex h-12 w-full items-center justify-center gap-3 border text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors duration-300 ${
              saved
                ? 'border-espresso bg-espresso text-cream'
                : 'border-espresso/25 text-espresso hover:border-espresso'
            }`}
          >
            <HeartIcon className="h-4 w-4" filled={saved} />
            {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
          </button>

          <p className="mt-8 text-xs font-light leading-relaxed text-espresso/45">
            Sizes — {product.sizes} · Complimentary shipping over $120 · 30-day considered
            returns. Demo storefront — no payment is processed.
          </p>
        </div>
      </aside>
    </div>
  );
}
