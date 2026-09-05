import { useState, type FormEvent } from 'react';
import { useShop, scrollToId } from '../store/ShopContext';
import { scrollToId as scrollTo } from '../store/ShopContext';
import { ArrowRight, InstagramIcon, MailIcon, XSocialIcon } from './Icons';
import type { CategoryId } from '../types';

export default function Footer() {
  const { setFilter, pushToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const shopLink = (label: string, id: CategoryId) => (
    <button
      key={label}
      type="button"
      onClick={() => {
        setFilter(id);
        scrollTo('collection');
      }}
      className="u-line text-left text-sm font-light text-ivory/55 transition-colors hover:text-cream"
    >
      {label}
    </button>
  );

  const anchorLink = (label: string, id: string) => (
    <button
      key={label}
      type="button"
      onClick={() => scrollToId(id)}
      className="u-line text-left text-sm font-light text-ivory/55 transition-colors hover:text-cream"
    >
      {label}
    </button>
  );

  const soonLink = (label: string) => (
    <button
      key={label}
      type="button"
      onClick={() => pushToast(`${label} — available in the full release`, 'check')}
      className="u-line text-left text-sm font-light text-ivory/55 transition-colors hover:text-cream"
    >
      {label}
    </button>
  );

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError(true);
      return;
    }
    setError(false);
    setSubscribed(true);
  };

  return (
    <footer className="border-t border-cream/10 bg-ink pt-20 text-ivory">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <p className="font-display text-4xl tracking-[0.18em]">
              KIN <span className="italic text-cream">&amp;</span> TAIL
            </p>
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-ivory/50">
              Lifestyle goods for dogs, cats, and the friendship between. Made in
              small batches, designed to be kept.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {[
                { label: 'Instagram', Icon: InstagramIcon },
                { label: 'X', Icon: XSocialIcon },
                { label: 'Email the studio', Icon: MailIcon },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => pushToast(`${label} — available in the full release`, 'check')}
                  className="grid h-10 w-10 place-items-center border border-ivory/15 text-ivory/60 transition-all duration-300 hover:border-cream hover:text-cream"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* nav columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            <nav aria-label="Shop">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream">Shop</p>
              <div className="mt-5 flex flex-col items-start gap-3">
                {shopLink('Dogs', 'dogs')}
                {shopLink('Cats', 'cats')}
                {shopLink('Care', 'care')}
                {shopLink('Play', 'play')}
                {shopLink('Home', 'home')}
              </div>
            </nav>
            <nav aria-label="Studio">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream">Studio</p>
              <div className="mt-5 flex flex-col items-start gap-3">
                {anchorLink('About', 'about')}
                {anchorLink('The Craft', 'craft')}
                {anchorLink('Care', 'care')}
                {anchorLink('Concierge', 'concierge')}
                {soonLink('Contact')}
              </div>
            </nav>
            <nav aria-label="Support">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream">Support</p>
              <div className="mt-5 flex flex-col items-start gap-3">
                {soonLink('Shipping')}
                {soonLink('Returns')}
                {soonLink('Privacy')}
                {soonLink('Terms')}
              </div>
            </nav>
          </div>

          {/* newsletter */}
          <div className="lg:col-span-3">
            <p className="font-display text-2xl font-light">Letters from the studio.</p>
            <p className="mt-2 text-sm font-light text-ivory/45">
              One quiet email a month. New pieces, care notes, nothing loud.
            </p>
            {subscribed ? (
              <p className="mt-6 font-display text-lg italic text-cream">
                Thank you — see you next month.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-6">
                <div className="flex items-stretch gap-2">
                  <label className="flex-1">
                    <span className="sr-only">Email address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(false);
                      }}
                      placeholder="your@email.com"
                      className={`w-full border-b bg-transparent py-2.5 text-sm font-light outline-none transition-colors placeholder:text-ivory/30 ${
                        error ? 'border-mocha' : 'border-ivory/25 focus:border-cream'
                      }`}
                    />
                  </label>
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="grid h-10 w-11 place-items-center self-end border border-ivory/25 text-ivory/70 transition-all duration-300 hover:border-cream hover:bg-cream hover:text-espresso"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs font-light text-cream/80">
                    That address doesn’t look quite right.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 py-7">
          <p className="text-[11px] font-light tracking-wide text-ivory/35">
            © 2026 Kin &amp; Tail — designed for the bond.
          </p>
          <p className="text-[11px] font-light tracking-wide text-ivory/35">
            Fictional brand · demo storefront · no payments processed
          </p>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'auto'
                  : 'smooth',
              });
            }}
            className="u-line text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory/50 hover:text-cream"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
