import type { ReactNode } from 'react';

/** Props for the StickyCardStack root component */
export interface StickyCardStackProps {
  /** Card elements; each child is rendered as one stacked card */
  children: ReactNode;
  /**
   * Height of the scroll area as a multiple of viewport height.
   * @default 8
   */
  scrollHeight?: number;
  /**
   * Vertical offset between stacked cards (in percent).
   * @default 5
   */
  cardYOffset?: number;
  /**
   * Scale reduction per card in the stack (e.g. 0.075 = 7.5% smaller per card).
   * @default 0.075
   */
  cardScaleStep?: number;
  /** Optional class name for the wrapper element */
  className?: string;
  /**
   * Optional list of background colors (e.g. ['#3d2fa9', '#ff7722']).
   * Applied per card by index (cycles if fewer colors than cards).
   * When not provided, cards use the base CSS variables (.card-1 … .card-4).
   */
  colorVariants?: string[];
}

/** Props for StickyCard: children only; color comes from StickyCardStack context. */
export interface StickyCardProps {
  children: ReactNode;
}

/** Default values for StickyCardStack animation options */
export const STICKY_CARD_STACK_DEFAULTS = {
  scrollHeight: 8,
  cardYOffset: 5,
  cardScaleStep: 0.075,
} as const;
