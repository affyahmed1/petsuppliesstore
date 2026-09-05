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
import { PRODUCTS, getProduct } from '../data/products';
import type { CartLine, CategoryId, ToastIcon, ToastItem } from '../types';

interface ShopContextValue {
  cart: CartLine[];
  wishlist: string[];
  toasts: ToastItem[];
  bagOpen: boolean;
  wishOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  detailId: string | null;
  filter: CategoryId | 'all';
  cartCount: number;
  subtotal: number;
  setFilter: (f: CategoryId | 'all') => void;
  setBagOpen: (v: boolean) => void;
  setWishOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setDetailId: (id: string | null) => void;
  addToBag: (id: string, qty?: number) => void;
  removeFromBag: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  moveToBag: (id: string) => void;
  pushToast: (message: string, icon?: ToastIcon) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

let toastSeq = 0;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const timers = useRef<number[]>([]);

  const pushToast = useCallback((message: string, icon: ToastIcon = 'check') => {
    const id = ++toastSeq;
    setToasts((t) => [...t.slice(-2), { id, message, icon }]);
    const timer = window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3400);
    timers.current.push(timer);
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const addToBag = useCallback(
    (id: string, qty = 1) => {
      setCart((c) => {
        const line = c.find((l) => l.id === id);
        if (line) {
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
    setCart((c) => c.map((l) => (l.id === id ? { ...l, qty: Math.min(9, Math.max(1, qty)) } : l)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id: string) => {
      const p = getProduct(id);
      setWishlist((w) => {
        if (w.includes(id)) {
          pushToast(`${p?.name ?? 'Piece'} — removed from wishlist`, 'heart');
          return w.filter((x) => x !== id);
        }
        pushToast(`${p?.name ?? 'Piece'} — saved to wishlist`, 'heart');
        return [...w, id];
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

  const { cartCount, subtotal } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const line of cart) {
      const p = PRODUCTS.find((x) => x.id === line.id);
      if (!p) continue;
      count += line.qty;
      sum += p.price * line.qty;
    }
    return { cartCount: count, subtotal: sum };
  }, [cart]);

  /* lock page scroll behind any overlay */
  const overlayOpen = bagOpen || wishOpen || searchOpen || menuOpen || detailId !== null;
  useEffect(() => {
    document.documentElement.style.overflow = overlayOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [overlayOpen]);

  /* "/" opens search from anywhere */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  const value: ShopContextValue = {
    cart,
    wishlist,
    toasts,
    bagOpen,
    wishOpen,
    searchOpen,
    menuOpen,
    detailId,
    filter,
    cartCount,
    subtotal,
    setFilter,
    setBagOpen,
    setWishOpen,
    setSearchOpen,
    setMenuOpen,
    setDetailId,
    addToBag,
    removeFromBag,
    setQty,
    clearCart,
    toggleWishlist,
    moveToBag,
    pushToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}
