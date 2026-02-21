import { createContext, useEffect, useRef, Children } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StickyCardStackProps } from './types';
import { STICKY_CARD_STACK_DEFAULTS } from './types';
import './StickyCardStack.css';

/** Injected by StickyCardStack: variant (1–4) and per-card color (from colorVariants or defaults). */
export interface StickyCardContextValue {
  variant: number;
  color: string;
}

const DEFAULT_CARD_COLORS: readonly string[] = ['#3d2fa9', '#ff7722', '#ff3d33', '#785f47'];
const defaultContextValue: StickyCardContextValue = { variant: 1, color: DEFAULT_CARD_COLORS[0] };
export const StickyCardVariantContext = createContext<StickyCardContextValue>(defaultContextValue);

const VARIANT_COUNT = 4;

gsap.registerPlugin(ScrollTrigger);

/**
 * A sticky stack of cards that animate on scroll (GSAP + ScrollTrigger).
 * Use with useScrollTrigger() at app root for smooth scrolling.
 */
export function StickyCardStack({
  children,
  scrollHeight = STICKY_CARD_STACK_DEFAULTS.scrollHeight,
  cardYOffset = STICKY_CARD_STACK_DEFAULTS.cardYOffset,
  cardScaleStep = STICKY_CARD_STACK_DEFAULTS.cardScaleStep,
  className,
  colorVariants,
}: StickyCardStackProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const cards = inner.querySelectorAll<HTMLElement>('.scs-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    const segmentSize = 1 / totalCards;

    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + i * cardYOffset,
        scale: 1 - i * cardScaleStep,
      });
    });

    const scrollHeightPx = window.innerHeight * scrollHeight;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: `+=${scrollHeightPx}px`,
      onUpdate(self) {
        const progress = self.progress;
        const activeIndex = Math.min(
          Math.floor(progress / segmentSize),
          totalCards - 1
        );
        const segmentProgress =
          (progress - activeIndex * segmentSize) / segmentSize;

        cards.forEach((card, i) => {
          if (i < activeIndex) {
            gsap.set(card, {
              yPercent: -250,
              rotationX: 35,
            });
          } else if (i === activeIndex) {
            gsap.set(card, {
              yPercent: gsap.utils.interpolate(-50, -200, segmentProgress),
              rotationX: gsap.utils.interpolate(0, 35, segmentProgress),
              scale: 1,
            });
          } else {
            const behindIndex = i - activeIndex;
            const currentYOffset = (behindIndex - segmentProgress) * cardYOffset;
            const currentScale =
              1 - (behindIndex - segmentProgress) * cardScaleStep;
            gsap.set(card, {
              yPercent: -50 + currentYOffset,
              rotationX: 0,
              scale: currentScale,
            });
          }
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [scrollHeight, cardYOffset, cardScaleStep]);

  const wrapStyle = {
    height: `calc(100svh * ${scrollHeight})`,
  };

  return (
    <div
      ref={wrapRef}
      className={className ? `scs-wrap ${className}` : 'scs-wrap'}
      style={wrapStyle}
    >
      <section className="scs-stack">
        <div ref={innerRef} className="scs-stack-inner">
          {Children.map(children, (child, index) => {
            const totalCards = Children.count(children);
            const variant = (index % VARIANT_COUNT) + 1;
            const color =
              colorVariants && colorVariants.length > 0
                ? colorVariants[index % colorVariants.length]
                : DEFAULT_CARD_COLORS[(index % VARIANT_COUNT)];
            return (
              <StickyCardVariantContext.Provider value={{ variant, color }}>
                <div
                  className="scs-card"
                  style={{ zIndex: totalCards - index }}
                >
                  {child}
                </div>
              </StickyCardVariantContext.Provider>
            );
          })}
        </div>
      </section>
    </div>
  );
}
