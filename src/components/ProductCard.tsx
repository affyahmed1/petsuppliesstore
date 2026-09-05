import { useState } from 'react';
import type { Product } from '../types';
import { formatPrice } from '../data/products';
import { useShop } from '../store/ShopContext';
import ProductImage from './ProductImage';
import { BagIcon, CheckIcon, HeartIcon } from './Icons';

export default function ProductCard({ product }: { product: Product }) {
  const { addToBag, toggleWishlist, wishlist, setDetailId } = useShop();
  const saved = wishlist.includes(product.id);
  const [added, setAdded] = useState(false);

  const openDetail = () => setDetailId(product.id);

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToBag(product.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const onWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="relative">
        <button
          type="button"
          onClick={openDetail}
          aria-label={`View ${product.name}`}
          className="block w-full cursor-pointer overflow-hidden"
        >
          <ProductImage
            image={product.image}
            crop={product.crop}
            alt={product.name}
            className="aspect-square w-full"
            imgClassName="transition-transform duration-[1200ms] ease-lux group-hover:scale-[1.045]"
          />
        </button>

        {/* wishlist */}
        <button
          type="button"
          onClick={onWish}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full transition-all duration-500 ${
            saved
              ? 'bg-espresso text-cream'
              : 'bg-ivory/90 text-espresso hover:bg-ivory hover:text-mocha'
          } ${saved ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100'}`}
        >
          <HeartIcon className="h-4 w-4" filled={saved} />
        </button>

        {/* quick add */}
        <div className="absolute inset-x-3 bottom-3 z-10">
          <button
            type="button"
            onClick={onAdd}
            className={`flex w-full items-center justify-center gap-2 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] transition-all duration-500 ${
              added ? 'bg-mocha text-ivory' : 'bg-espresso/95 text-ivory hover:bg-cocoa'
            } lg:translate-y-2 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100`}
          >
            {added ? (
              <>
                Added <CheckIcon className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Add to Bag <BagIcon className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* info */}
      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-mocha/80">
          {product.categoryLabel}
        </p>
        <div className="mt-1.5 flex items-baseline justify-between gap-4">
          <button
            type="button"
            onClick={openDetail}
            className="u-line text-left font-display text-[1.45rem] leading-tight text-espresso transition-colors duration-300 hover:text-mocha"
          >
            {product.name}
          </button>
          <p className="shrink-0 text-sm font-medium text-espresso/80">
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="mt-1.5 font-display text-[1.02rem] italic leading-snug text-espresso/55">
          {product.tagline}
        </p>
      </div>
    </article>
  );
}
