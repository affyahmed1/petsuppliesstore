interface EyebrowProps {
  index: string;
  label: string;
  tone?: 'light' | 'dark';
  center?: boolean;
  className?: string;
}

export default function Eyebrow({ index, label, tone = 'dark', center, className = '' }: EyebrowProps) {
  return (
    <div
      className={`flex items-center gap-4 ${center ? 'justify-center' : ''} ${className}`}
    >
      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.35em] text-cream">
        {index}
      </span>
      <span aria-hidden="true" className="h-px w-12 bg-cream/60" />
      <span
        className={`font-body text-[10px] font-semibold uppercase tracking-[0.35em] ${
          tone === 'light' ? 'text-mocha' : 'text-ivory/60'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
