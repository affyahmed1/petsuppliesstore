import Eyebrow from './Eyebrow';
import Reveal, { useParallax } from './Reveal';
import { IMAGES } from '../data/products';

export default function FriendshipStory() {
  const parallax = useParallax<HTMLDivElement>(0.06);

  return (
    <section id="bond" className="bg-ivory py-28 text-espresso lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        {/* editorial copy */}
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index="01" label="The Bond" tone="light" />
          </Reveal>
          <h2 className="mt-8 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
            <Reveal variant="mask" delay={80}>
              Different ways of
            </Reveal>
            <Reveal variant="mask" delay={180}>
              seeing the world.
            </Reveal>
            <Reveal variant="mask" delay={280}>
              <em className="italic text-mocha">One bond that</em>
            </Reveal>
            <Reveal variant="mask" delay={380}>
              <em className="italic text-mocha">makes it better.</em>
            </Reveal>
          </h2>
          <Reveal delay={200}>
            <p className="mt-8 max-w-sm text-[15px] font-light leading-relaxed text-espresso/65">
              One waits by the door. One watches from the sill. Both know exactly when
              you need them — and neither has ever asked for anything but your company.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-14 bg-cream" />
              <p className="font-display text-lg italic text-espresso/60">
                Kin &amp; Tail exists for that bond.
              </p>
            </div>
          </Reveal>
        </div>

        {/* image with offset gold frame + parallax */}
        <div className="relative lg:col-span-6 lg:col-start-7">
          <Reveal variant="fade" delay={150}>
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -right-5 hidden h-full w-full border border-cream sm:block"
            />
            <div className="relative overflow-hidden">
              <div ref={parallax} className="will-change-transform">
                <img
                  src={IMAGES.friendship}
                  alt="A tabby cat asleep against a sleeping brown dog on a knitted blanket"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full scale-110 object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/25 to-transparent" />
            </div>

            {/* floating editorial note */}
            <figure className="absolute -bottom-8 -left-4 max-w-[250px] bg-espresso px-7 py-6 text-ivory shadow-xl sm:-left-12">
              <blockquote className="font-display text-lg italic leading-snug">
                “She waits by the door. He watches the sill. The house is only whole
                with both.”
              </blockquote>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.28em] text-cream/80">
                A household, whole
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-12 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-espresso/45">
              <span>Milo &amp; June</span>
              <span>Photographed at home — Sunday, 7:42 am</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
