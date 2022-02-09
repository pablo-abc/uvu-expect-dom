import type { ExpectContext } from 'uvu-expect';
import { computeAccessibleName } from 'dom-accessibility-api';

export function assertHasAccessibleName(this: ExpectContext, element: Element) {
  const hasName = computeAccessibleName(element) !== '';

  this.assert(
    hasName,
    'expected #{this} to have an accessible name',
    'expected #{this} not to have an accessible name'
  );
}
