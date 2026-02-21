import { useContext, type ReactElement } from 'react';
import { StickyCardVariantContext } from './StickyCardStack';
import type { StickyCardProps } from './types';

/**
 * A single card for use inside StickyCardStack.
 * Pass children; background uses context color from the stack.
 */
export function StickyCard({ children }: StickyCardProps): ReactElement {
  const { color } = useContext(StickyCardVariantContext);
  return (
    <div style={{ backgroundColor: color }}>
      {children}
    </div>
  );
}
