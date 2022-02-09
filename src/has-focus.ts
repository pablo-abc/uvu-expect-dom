import type { ExpectContext } from 'uvu-expect';

export function assertHasFocus(this: ExpectContext, element: Element) {
  const hasFocus = document.activeElement === element;

  this.assert(
    hasFocus,
    'expected #{this} to have focus',
    'expected #{this} not to have focus'
  );
}
