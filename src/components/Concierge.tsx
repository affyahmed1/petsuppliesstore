import { useEffect, useState } from 'react';
import Eyebrow from './Eyebrow';
import Reveal from './Reveal';
import ProductImage from './ProductImage';
import { PRODUCTS, formatPrice } from '../data/products';
import { useShop } from '../store/ShopContext';
import {
  ArrowUpRight,
  BagIcon,
  CatIcon,
  CheckIcon,
  DogIcon,
  PlusIcon,
  SparkleIcon,
} from './Icons';
import type { Focus, LifeStage, Product, Temperament } from '../types';

type Step = 'species' | 'profile' | 'curating' | 'edit';
type PetSpecies = 'dog' | 'cat';

const FOCUS_OPTIONS: { id: Focus; label: string }[] = [
  { id: 'comfort', label: 'Comfort' },
  { id: 'play', label: 'Play' },
  { id: 'meals', label: 'Meals' },
  { id: 'grooming', label: 'Grooming' },
  { id: 'walk', label: 'Walks' },
];

const REASONS: Record<Focus, string> = {
  walk: 'For the walks you both look forward to.',
  comfort: 'For slow mornings and long naps.',
  play: 'For the zoomies, handled beautifully.',
  meals: 'For meals taken at their own pace.',
  grooming: 'For ten quiet minutes together.',
};

const STAGES: { id: LifeStage; dog: string; cat: string }[] = [
  { id: 'young', dog: 'Puppy', cat: 'Kitten' },
  { id: 'adult', dog: 'Adult', cat: 'Adult' },
  { id: 'senior', dog: 'Senior', cat: 'Senior' },
];

const TEMPERAMENTS: { id: Temperament; label: string }[] = [
  { id: 'calm', label: 'Calm' },
  { id: 'playful', label: 'Playful' },
  { id: 'adventurous', label: 'Adventurous' },
];

function recommend(species: PetSpecies, stage: LifeStage, temp: Temperament, focus: Focus): Product[] {
  const pool = PRODUCTS.filter((p) =>
    species === 'dog' ? p.species !== 'cat' : p.species !== 'dog',
  );
  const scored = pool.map((p) => {
    let score = p.species === 'both' ? 1 : 2;
    if (p.tags.includes(focus)) score += 4;
    if (temp === 'calm' && p.tags.includes('comfort')) score += 2;
    if (temp === 'playful' && p.tags.includes('play')) score += 2;
    if (temp === 'adventurous' && p.tags.includes('walk')) score += 2;
    if (p.lifeStages.includes(stage)) score += 1.5;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.p);
}

function StepMarker({ n, label, state }: { n: string; label: string; state: 'done' | 'active' | 'next' }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold ${
          state === 'active'
            ? 'border-cream bg-cream text-espresso'
            : state === 'done'
              ? 'border-cream/50 text-cream'
              : 'border-ivory/20 text-ivory/30'
        }`}
      >
        {state === 'done' ? <CheckIcon className="h-3 w-3" /> : n}
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
          state === 'active' ? 'text-cream' : state === 'done' ? 'text-ivory/50' : 'text-ivory/30'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function Concierge() {
  const { addToBag, setDetailId, pushToast } = useShop();
  const [step, setStep] = useState<Step>('species');
  const [species, setSpecies] = useState<PetSpecies | null>(null);
  const [stage, setStage] = useState<LifeStage | null>(null);
  const [temp, setTemp] = useState<Temperament | null>(null);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [picks, setPicks] = useState<Product[]>([]);

  useEffect(() => {
    if (step !== 'curating') return;
    const t = window.setTimeout(() => {
      if (species && stage && temp && focus) {
        setPicks(recommend(species, stage, temp, focus));
        setStep('edit');
      }
    }, 1700);
    return () => window.clearTimeout(t);
  }, [step, species, stage, temp, focus]);

  const reset = () => {
    setStep('species');
    setSpecies(null);
    setStage(null);
    setTemp(null);
    setFocus(null);
    setPicks([]);
  };

  const stepIndex = step === 'species' ? 0 : step === 'profile' || step === 'curating' ? 1 : 2;
  const ready = species !== null && stage !== null && temp !== null && focus !== null;

  const seg = (selected: boolean) =>
    `border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
      selected
        ? 'border-cream bg-cream text-espresso'
        : 'border-ivory/20 text-ivory/60 hover:border-ivory/50 hover:text-ivory'
    }`;

  return (
    <section id="concierge" className="bg-ink py-28 text-ivory lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* intro */}
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index="07" label="The Concierge" />
          </Reveal>
          <h2 className="mt-8 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
            <Reveal variant="mask" delay={80}>
              A quieter way
            </Reveal>
            <Reveal variant="mask" delay={200}>
              <em className="italic text-cream">to shop.</em>
            </Reveal>
          </h2>
          <Reveal delay={240}>
            <p className="mt-7 max-w-sm text-[15px] font-light leading-relaxed text-ivory/60">
              No scrolling, no noise. Tell the concierge a little about your companion
              and receive a small, considered edit — three pieces, chosen with care.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <ul className="mt-9 space-y-4">
              {[
                'Three questions, asked gently',
                'A considered edit of three pieces',
                'Add to your bag in one motion',
              ].map((li) => (
                <li key={li} className="flex items-center gap-4 text-sm font-light text-ivory/70">
                  <CheckIcon className="h-4 w-4 shrink-0 text-cream" />
                  {li}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={420}>
            <p className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory/35">
              <SparkleIcon className="h-4 w-4 text-cream/70" />
              Private session — nothing is stored
            </p>
          </Reveal>
        </div>

        {/* concierge panel */}
        <div className="lg:col-span-7">
          <Reveal variant="fade" delay={150}>
            <div className="relative border border-cream/15 bg-espresso p-6 sm:p-10">
              {/* corner ticks */}
              <span aria-hidden className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cream" />
              <span aria-hidden className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cream" />
              <span aria-hidden className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cream" />
              <span aria-hidden className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cream" />

              {/* panel header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory/10 pb-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cream">
                    Private Session
                  </p>
                  <p className="mt-1 text-xs font-light text-ivory/40">Kin &amp; Tail Concierge</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="animate-softpulse h-1.5 w-1.5 rounded-full bg-cream" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/50">Online</span>
                </div>
              </div>

              {/* progress */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <StepMarker n="1" label="Companion" state={stepIndex === 0 ? 'active' : 'done'} />
                <StepMarker n="2" label="Profile" state={stepIndex === 1 ? 'active' : stepIndex > 1 ? 'done' : 'next'} />
                <StepMarker n="3" label="The Edit" state={stepIndex === 2 ? 'active' : 'next'} />
              </div>

              {/* step body */}
              <div key={step} className="animate-stepin mt-9 min-h-[380px]">
                {step === 'species' && (
                  <div>
                    <h3 className="font-display text-3xl font-light sm:text-4xl">
                      Whom are we shopping for?
                    </h3>
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSpecies('dog');
                          setStep('profile');
                        }}
                        className="group border border-ivory/15 p-7 text-left transition-all duration-500 hover:border-cream hover:bg-cocoa/60"
                      >
                        <DogIcon className="h-9 w-9 text-cream transition-transform duration-500 group-hover:-translate-y-1" />
                        <p className="mt-5 font-display text-3xl font-light">A dog</p>
                        <p className="mt-1.5 text-xs font-light text-ivory/50">
                          Walks, rest &amp; a little glorious chaos
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSpecies('cat');
                          setStep('profile');
                        }}
                        className="group border border-ivory/15 p-7 text-left transition-all duration-500 hover:border-cream hover:bg-cocoa/60"
                      >
                        <CatIcon className="h-9 w-9 text-cream transition-transform duration-500 group-hover:-translate-y-1" />
                        <p className="mt-5 font-display text-3xl font-light">A cat</p>
                        <p className="mt-1.5 text-xs font-light text-ivory/50">
                          Perches, rituals &amp; quiet opinions
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {step === 'profile' && species && (
                  <div>
                    <h3 className="font-display text-3xl font-light sm:text-4xl">
                      Tell us a little about them.
                    </h3>

                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream">
                      Stage of life
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {STAGES.map((s) => (
                        <button key={s.id} type="button" onClick={() => setStage(s.id)} className={seg(stage === s.id)}>
                          {species === 'dog' ? s.dog : s.cat}
                        </button>
                      ))}
                    </div>

                    <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream">
                      Temperament
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {TEMPERAMENTS.map((t) => (
                        <button key={t.id} type="button" onClick={() => setTemp(t.id)} className={seg(temp === t.id)}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream">
                      What matters most right now
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {FOCUS_OPTIONS.filter((f) => species === 'cat' ? f.id !== 'walk' : true).map((f) => (
                        <button key={f.id} type="button" onClick={() => setFocus(f.id)} className={seg(focus === f.id)}>
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-5">
                      <button
                        type="button"
                        disabled={!ready}
                        onClick={() => setStep('curating')}
                        className="bg-cream px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso transition-all duration-300 hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Prepare my edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('species')}
                        className="u-line text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory/50 hover:text-ivory"
                      >
                        ← Back
                      </button>
                    </div>
                  </div>
                )}

                {step === 'curating' && (
                  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="animate-dot h-2 w-2 rounded-full bg-cream"
                          style={{ animationDelay: `${i * 0.22}s` }}
                        />
                      ))}
                    </div>
                    <p className="mt-7 max-w-xs font-display text-2xl italic font-light text-ivory/80">
                      Considering{' '}
                      {stage === 'young'
                        ? species === 'dog'
                          ? 'a young puppy'
                          : 'a young kitten'
                        : `a ${stage} ${species}`}{' '}
                      with {temp} instincts…
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ivory/35">
                      The concierge is reading the shelves
                    </p>
                  </div>
                )}

                {step === 'edit' && focus && (
                  <div>
                    <h3 className="font-display text-3xl font-light sm:text-4xl">
                      The Edit — for your {species}.
                    </h3>
                    <p className="mt-2 text-sm font-light text-ivory/55">
                      Three pieces, chosen with care. {REASONS[focus]}
                    </p>

                    <div className="mt-6">
                      {picks.map((p, i) => (
                        <div
                          key={p.id}
                          className="group flex items-center gap-4 border-t border-ivory/10 py-4 last:border-b sm:gap-5"
                        >
                          <span className="w-5 font-display italic text-cream/70">{i + 1}</span>
                          <button
                            type="button"
                            onClick={() => setDetailId(p.id)}
                            aria-label={`View ${p.name}`}
                            className="h-16 w-16 shrink-0 overflow-hidden"
                          >
                            <ProductImage
                              image={p.image}
                              crop={p.crop}
                              alt={p.name}
                              className="h-16 w-16"
                              imgClassName="transition-transform duration-700 group-hover:scale-105"
                            />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-xl leading-tight">{p.name}</p>
                            <p className="mt-0.5 truncate font-display text-sm italic text-ivory/50">
                              {REASONS[p.tags[0] ?? focus]}
                            </p>
                          </div>
                          <p className="hidden text-sm font-medium text-ivory/80 sm:block">
                            {formatPrice(p.price)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailId(p.id)}
                              aria-label={`View ${p.name}`}
                              className="grid h-9 w-9 place-items-center border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory/60 hover:text-ivory"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => addToBag(p.id, 1)}
                              aria-label={`Add ${p.name} to bag`}
                              className="grid h-9 w-9 place-items-center border border-ivory/20 text-ivory/70 transition-colors hover:border-cream hover:bg-cream hover:text-espresso"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          picks.forEach((p) => addToBag(p.id, 1));
                          pushToast('The full edit — added to your bag', 'bag');
                        }}
                        className="inline-flex items-center gap-3 bg-cream px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso transition-colors hover:bg-champagne"
                      >
                        Add all three <BagIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="u-line text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory/50 hover:text-ivory"
                      >
                        Start over
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
