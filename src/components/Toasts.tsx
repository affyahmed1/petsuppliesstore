import { useShop } from '../store/ShopContext';
import { BagIcon, CheckIcon, HeartIcon } from './Icons';

export default function Toasts() {
  const { toasts } = useShop();

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-5 z-[90] flex flex-col gap-2.5 sm:left-8"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toastin flex items-center gap-3.5 border border-cream/25 bg-espresso py-3.5 pl-4 pr-6 text-ivory shadow-2xl"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cocoa text-cream">
            {t.icon === 'bag' ? (
              <BagIcon className="h-4 w-4" />
            ) : t.icon === 'heart' ? (
              <HeartIcon className="h-4 w-4" filled />
            ) : (
              <CheckIcon className="h-4 w-4" />
            )}
          </span>
          <p className="text-sm font-light">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
