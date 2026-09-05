import { PawIcon } from './Icons';

const ITEMS = [
  'Thoughtfully made',
  'Small batches',
  'Natural materials',
  'For dogs & cats',
  'Complimentary shipping over $120',
  'Designed to be kept',
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="whitespace-nowrap px-7 text-[10px] font-semibold uppercase tracking-[0.32em] sm:text-[11px]">
            {item}
          </span>
          <PawIcon className="h-3 w-3 opacity-50" />
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="ticker overflow-hidden border-y border-espresso/15 bg-cream py-3 text-espresso">
      <div className="animate-ticker flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
