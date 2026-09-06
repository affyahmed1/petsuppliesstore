import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getProduct } from '../data/products';
import type { CartLine, CategoryId, ToastIcon, ToastItem } from '../types';

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

interface ShopState {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToBag: (id: string, qty?: number) => void;
  removeFromBag: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  moveToBag: (id: string) => void;

  wishlist: string[];
  toggleWishlist: (id: string) => void;

  bagOpen: boolean;
  setBagOpen: (v: boolean) => void;
  wishOpen: boolean;
  setWishOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  detailId: string | null;
  setDetailId: (id: string | null) => void;

  filter: CategoryId | 'all';
  setFilter: (f: CategoryId | 'all') => void;

  toasts: ToastItem[];
  pushToast: (message: string, icon?: ToastIcon) => void;
}

const ShopContext = createContext<ShopState | null>(null);

let toastSeq = 1;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<number[]>([]);

  const pushToast = useCallback((message: string, icon: ToastIcon = 'check') => {
    const id = toastSeq++;
    setToasts((t) => [...t.slice(-2), { id, message, icon }]);
    const timer = window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
    timers.current.push(timer);
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const addToBag = useCallback(
    (id: string, qty = 1) => {
      setCart((c) => {
        const existing = c.find((l) => l.id === id);
        if (existing) {
          return c.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + qty) } : l));
        }
        return [...c, { id, qty }];
      });
      const p = getProduct(id);
      if (p) pushToast(`${p.name} — added to your bag`, 'bag');
    },
    [pushToast],
  );

  const removeFromBag = useCallback((id: string) => {
    setCart((c) => c.filter((l) => l.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => l.id !== id)
        : c.map((l) => (l.id === id ? { ...l, qty: Math.min(9, qty) } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((w) => {
        const has = w.includes(id);
        const p = getProduct(id);
        if (p) {
          pushToast(
            has ? `${p.name} — removed from wishlist` : `${p.name} — saved to wishlist`,
            'heart',
          );
        }
        return has ? w.filter((x) => x !== id) : [...w, id];
      });
    },
    [pushToast],
  );

  const moveToBag = useCallback(
    (id: string) => {
      setWishlist((w) => w.filter((x) => x !== id));
      addToBag(id, 1);
    },
    [addToBag],
  );

  /* scroll lock while any overlay is open */
  useEffect(() => {
    const anyOpen = bagOpen || wishOpen || searchOpen || menuOpen || detailId !== null;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [bagOpen, wishOpen, searchOpen, menuOpen, detailId]);

  /* "/" opens search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.key === '/' && target && !/INPUT|TEXTAREA|SELECT/.test(target.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const subtotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const p = getProduct(l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0),
    [cart],
  );

  const value: ShopState = {
    cart,
    cartCount,
    subtotal,
    addToBag,
    removeFromBag,
    setQty,
    clearCart,
    moveToBag,
    wishlist,
    toggleWishlist,
    bagOpen,
    setBagOpen,
    wishOpen,
    setWishOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    detailId,
    setDetailId,
    filter,
    setFilter,
    toasts,
    pushToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
