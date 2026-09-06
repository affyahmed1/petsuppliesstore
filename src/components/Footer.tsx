import { useState, type FormEvent } from 'react';
import { useShop, scrollToId } from '../store/ShopContext';
import { ArrowRight, InstagramIcon, MailIcon, XSocialIcon } from './Icons';
import type { CategoryId } from '../types';

export default function Footer() {
  const { setFilter, pushToast } = useShop();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    pushToast('Thank you — welcome to the household.', 'check');
  };

  const shopLinks: { label: string; act: () => void }[] = [
    { label: 'The Collection', act: () => scrollToId('collection') },
    { label: 'Dogs', act: () => { setFilter('dogs' as CategoryId); scrollToId('collection'); } },
    { label: 'Cats', act: () => { setFilter('cats' as CategoryId); scrollToId('collection'); } },
    { label: 'Care', act: () => scrollToId('care') },
    { label: 'The Craft', act: () => scrollToId('craft') },
  ];

  const studioLinks: { label: string; act: () => void }[] = [
    { label: 'About', act: () => scrollToId('about') },
    { label: 'The Concierge', act: () => scrollToId('concierge') },
    { label: 'The Bond', act: () => scrollToId('bond') },
  ];

  return (
    <footer className="bg-ink py-20 text-ivory">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr] lg:gap-10">
          <div>
            <p className="font-display text-[1.35rem] tracking-[0.22em]">
              KIN <span className="italic text-cream">&amp;</span> TAIL
            </p>
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-ivory/50">
              Considered goods for dogs, cats, and the friendship between. Made in
              small batches, made to be kept.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="#top"
                aria-label="Instagram (placeholder)"
                className="grid h-10 w-10 place-items-center text-ivory/60 transition-colors hover:text-cream"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#top"
                aria-label="X (placeholder)"
                className="grid h-10 w-10 place-items-center text-ivory/60 transition-colors hover:text-cream"
              >
                <XSocialIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#top"
                aria-label="Email (placeholder)"
                className="grid h-10 w-10 place-items-center text-ivory/60 transition-colors hover:text-cream"
              >
                <MailIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <nav aria-label="Shop">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/40">Shop</p>
            <ul className="mt-5 space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={l.act}
                    className="text-sm font-light text-ivory/65 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/40">Studio</p>
            <ul className="mt-5 space-y-2.5">
              {studioLinks.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={l.act}
                    className="text-sm font-light text-ivory/65 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              {['Shipping', 'Returns', 'Privacy', 'Terms'].map((l) => (
                <li key={l} className="text-sm font-light text-ivory/35">
                  {l}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/40">
              Quiet mail.
            </p>
            <p className="mt-5 text-sm font-light leading-relaxed text-ivory/50">
              Occasional letters on new pieces and the animals they’re made for.
              No noise.
            </p>
            {done ? (
              <p className="mt-5 font-display text-lg italic text-cream">
                Thank you — welcome to the household.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-5 flex items-center border-b border-ivory/25 transition-colors focus-within:border-cream">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm font-light text-ivory outline-none placeholder:text-ivory/35"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid h-11 w-11 place-items-center text-cream transition-transform duration-400 hover:translate-x-1"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-7 text-xs font-light text-ivory/40">
          <p>© {new Date().getFullYear()} Kin &amp; Tail. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/30">
            Design showcase — no live payments
          </p>
          <p>
            Made for the ones who wait by the door.
          </p>
        </div>
      </div>
    </footer>
  );
}
