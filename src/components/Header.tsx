import { useEffect, useState } from 'react';
import { useShop, scrollToId } from '../store/ShopContext';
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
} from './Icons';
import type { CategoryId } from '../types';

const NAV: { label: string; href: string }[] = [
  { label: 'Shop', href: '#collection' },
  { label: 'Dogs', href: '#worlds' },
  { label: 'Cats', href: '#worlds' },
  { label: 'Care', href: '#care' },
  { label: 'About', href: '#about' },
];

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <a
      href="#top"
      className={`font-display text-[1.35rem] tracking-[0.22em] text-ivory transition-colors hover:text-champagne ${className}`}
      aria-label="Kin & Tail — back to top"
    >
      KIN <span className="italic text-cream">&amp;</span> TAIL
    </a>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      key={count}
      className="animate-badgepop absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-cream px-1 text-[10px] font-bold leading-none text-espresso"
    >
      {count}
    </span>
  );
}

export default function Header() {
  const {
    cartCount,
    wishlist,
    bagOpen,
    setBagOpen,
    setWishOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    setFilter,
  } = useShop();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goWorld = (f: CategoryId) => {
    setFilter(f);
    scrollToId('collection');
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-cream/10 bg-espresso/90 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 transition-all duration-500 sm:px-8 ${
            scrolled ? 'py-3' : 'py-5'
          }`}
        >
          {/* left — desktop nav / mobile menu */}
          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center text-ivory transition-colors hover:text-cream lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  className="u-line text-[11px] font-medium uppercase tracking-[0.28em] text-ivory/70 transition-colors hover:text-cream"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>

          {/* centre — wordmark */}
          <Wordmark />

          {/* right — actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search (press /)"
              className="grid h-10 w-10 place-items-center text-ivory transition-colors hover:text-cream"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setWishOpen(true)}
              aria-label={`Open wishlist, ${wishlist.length} saved`}
              className="relative grid h-10 w-10 place-items-center text-ivory transition-colors hover:text-cream"
            >
              <HeartIcon className="h-[18px] w-[18px]" />
              <CountBadge count={wishlist.length} />
            </button>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label={`Open bag, ${cartCount} items`}
              className="relative grid h-10 w-10 place-items-center text-ivory transition-colors hover:text-cream"
            >
              <BagIcon className="h-[18px] w-[18px]" />
              <CountBadge count={cartCount} />
            </button>
          </div>
        </div>
      </header>

      {/* ————— mobile menu ————— */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-espresso transition-all duration-500 lg:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Wordmark />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center text-ivory hover:text-cream"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {[
            { label: 'The Collection', act: () => scrollToId('collection') },
            { label: 'For Dogs', act: () => goWorld('dogs') },
            { label: 'For Cats', act: () => goWorld('cats') },
            { label: 'The Craft', act: () => scrollToId('craft') },
            { label: 'Care', act: () => scrollToId('care') },
            { label: 'The Concierge', act: () => scrollToId('concierge') },
            { label: 'About', act: () => scrollToId('about') },
          ].map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.act();
                setMenuOpen(false);
              }}
              className={`text-left font-display text-4xl font-light text-ivory transition-all duration-500 hover:italic hover:text-cream ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms' }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <p className="px-8 pb-10 text-[10px] uppercase tracking-[0.3em] text-ivory/35">
          Dogs &amp; Cats — Est. 2021
        </p>
      </div>
    </>
  );
}
