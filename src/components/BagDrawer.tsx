import { useEffect, useState, type FormEvent } from 'react';
import { useShop, scrollToId } from '../store/ShopContext';
import { formatPrice, getProduct } from '../data/products';
import ProductImage from './ProductImage';
import { ArrowRight, BagIcon, CheckIcon, CloseIcon, MinusIcon, PlusIcon } from './Icons';
import type { Product } from '../types';

type View = 'bag' | 'checkout' | 'placing' | 'confirmed';

const inputCls =
  'w-full border border-espresso/20 bg-transparent px-3.5 py-3 text-sm font-light outline-none transition-colors duration-300 placeholder:text-espresso/30 focus:border-mocha';

export default function BagDrawer() {
  const { bagOpen, setBagOpen, cart, cartCount, subtotal, setQty, removeFromBag, clearCart } =
    useShop();
  const [view, setView] = useState<View>('bag');
  const [shown, setShown] = useState(false);
  const [orderNo, setOrderNo] = useState('');

  useEffect(() => {
    if (bagOpen) {
      setView('bag');
      const raf = window.requestAnimationFrame(() => setShown(true));
      return () => window.cancelAnimationFrame(raf);
    }
    setShown(false);
  }, [bagOpen]);

  useEffect(() => {
    if (!bagOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBagOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bagOpen, setBagOpen]);

  if (!bagOpen) return null;

  const lines = cart
    .map((l) => ({ ...l, product: getProduct(l.id) }))
    .filter((l): l is { id: string; qty: number; product: Product } => Boolean(l.product));

  const placeOrder = (e: FormEvent) => {
    e.preventDefault();
    setView('placing');
    window.setTimeout(() => {
      setOrderNo(`KT-${Math.floor(1000 + Math.random() * 9000)}`);
      clearCart();
      setView('confirmed');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        aria-label="Close bag"
        onClick={() => setBagOpen(false)}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/60 transition-opacity duration-500 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-ivory text-espresso transition-transform duration-500 ease-lux ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
          <h3 className="font-display text-2xl font-light">
            {view === 'confirmed' ? (
              'Order placed'
            ) : view === 'checkout' || view === 'placing' ? (
              'Checkout'
            ) : (
              <>
                Your Bag <span className="text-mocha/70">({cartCount})</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={() => setBagOpen(false)}
            aria-label="Close bag"
            className="grid h-10 w-10 place-items-center transition-colors hover:text-mocha"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* ————— bag ————— */}
        {view === 'bag' &&
          (lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <BagIcon className="h-10 w-10 text-espresso/20" />
              <p className="mt-6 font-display text-2xl font-light">Your bag is empty.</p>
              <p className="mt-2 max-w-[250px] text-sm font-light text-espresso/55">
                The good news: everything worth having is one scroll away.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBagOpen(false);
                  scrollToId('collection');
                }}
                className="mt-8 bg-espresso px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-cocoa"
              >
                Shop the Collection
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-espresso/10 overflow-y-auto">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4 p-5">
                    <ProductImage
                      image={l.product.image}
                      crop={l.product.crop}
                      alt={l.product.name}
                      className="h-20 w-20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate font-display text-lg leading-tight">{l.product.name}</p>
                        <button
                          type="button"
                          onClick={() => removeFromBag(l.id)}
                          aria-label={`Remove ${l.product.name}`}
                          className="grid h-7 w-7 shrink-0 place-items-center text-espresso/40 transition-colors hover:text-espresso"
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-mocha/80">
                        {l.product.categoryLabel}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-espresso/20">
                          <button
                            type="button"
                            onClick={() => setQty(l.id, l.qty - 1)}
                            disabled={l.qty === 1}
                            aria-label="Decrease quantity"
                            className="grid h-8 w-8 place-items-center transition-colors hover:bg-espresso/5 disabled:opacity-30"
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold" aria-live="polite">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(l.id, l.qty + 1)}
                            disabled={l.qty === 9}
                            aria-label="Increase quantity"
                            className="grid h-8 w-8 place-items-center transition-colors hover:bg-espresso/5 disabled:opacity-30"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">{formatPrice(l.product.price * l.qty)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-espresso/10 px-6 py-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso/60">
                    Subtotal
                  </span>
                  <span className="font-display text-3xl font-light">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-2 text-xs font-light text-espresso/50">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  type="button"
                  onClick={() => setView('checkout')}
                  className="group mt-5 flex w-full items-center justify-center gap-3 bg-espresso py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-cocoa"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </div>
            </>
          ))}

        {/* ————— checkout ————— */}
        {(view === 'checkout' || view === 'placing') && (
          <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 px-6 py-6">
              <button
                type="button"
                onClick={() => setView('bag')}
                className="u-line text-[10px] font-semibold uppercase tracking-[0.25em] text-espresso/50 hover:text-espresso"
              >
                ← Back to bag
              </button>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-mocha">
                    Email
                  </span>
                  <input required type="email" placeholder="you@home.com" className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-mocha">
                    Full name
                  </span>
                  <input required placeholder="Jordan Ellis" className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-mocha">
                    Address
                  </span>
                  <input required placeholder="14 Willow Lane" className={inputCls} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-mocha">
                      City
                    </span>
                    <input required placeholder="Copenhagen" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-mocha">
                      Postcode
                    </span>
                    <input required placeholder="2200" className={inputCls} />
                  </label>
                </div>
              </div>

              <div className="mt-7 border-t border-espresso/10 pt-5">
                <div className="flex justify-between text-sm font-light text-espresso/70">
                  <span>
                    {cartCount} item{cartCount === 1 ? '' : 's'}
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm font-light text-espresso/70">
                  <span>Shipping</span>
                  <span>{subtotal >= 120 ? 'Complimentary' : formatPrice(8)}</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-espresso/10 pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso/60">
                    Total
                  </span>
                  <span className="font-display text-3xl font-light">
                    {formatPrice(subtotal + (subtotal >= 120 ? 0 : 8))}
                  </span>
                </div>
              </div>

              <p className="mt-5 font-display text-sm italic text-espresso/50">
                Design showcase — no payment is processed.
              </p>
            </div>

            <div className="border-t border-espresso/10 px-6 py-6">
              <button
                type="submit"
                disabled={view === 'placing'}
                className="flex w-full items-center justify-center gap-3 bg-espresso py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-cocoa disabled:opacity-60"
              >
                {view === 'placing' ? (
                  <>
                    <span className="animate-softpulse inline-block h-2 w-2 rounded-full bg-cream" />
                    Placing order…
                  </>
                ) : (
                  <>Place Order — {formatPrice(subtotal + (subtotal >= 120 ? 0 : 8))}</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ————— confirmed ————— */}
        {view === 'confirmed' && (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-cream text-mocha">
              <CheckIcon className="h-6 w-6" />
            </span>
            <p className="mt-7 font-display text-3xl font-light leading-snug">
              Thank you — order <em className="italic text-mocha">{orderNo}</em>
            </p>
            <p className="mt-3 max-w-[280px] text-sm font-light leading-relaxed text-espresso/60">
              Your pieces are being wrapped with care. A quiet confirmation is on its
              way. (Design showcase — no payment was processed.)
            </p>
            <button
              type="button"
              onClick={() => setBagOpen(false)}
              className="mt-9 bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-cocoa"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
