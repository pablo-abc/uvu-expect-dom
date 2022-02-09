import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertChecked(this: ExpectContext, element: HTMLElement) {
  const isChecked = matchers.toBeChecked(element);

  this.assert(
    isChecked.pass,
    'expected #{this} to be checked',
    'expected #{this} not to be checked'
  );
}
