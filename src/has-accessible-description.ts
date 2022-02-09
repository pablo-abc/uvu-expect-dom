import type { ExpectContext } from 'uvu-expect';
import { computeAccessibleDescription } from 'dom-accessibility-api';

export function assertHasAccessibleDescription(
  this: ExpectContext,
  element: Element
) {
  const hasDescription = computeAccessibleDescription(element) !== '';

  this.assert(
    hasDescription,
    'expected #{this} to have an accessible description',
    'expected #{this} not to have an accessible description'
  );
}
