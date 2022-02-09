import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertPartiallyChecked(
  this: ExpectContext,
  element: HTMLElement
) {
  const isPartiallyChecked = matchers.toBePartiallyChecked(element);

  this.assert(
    isPartiallyChecked.pass,
    'expected #{this} to be partially checked',
    'expected #{this} not to be partially checked'
  );
}
