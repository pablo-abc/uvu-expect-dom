import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertRequired(this: ExpectContext, element: HTMLElement) {
  const isRequired = matchers.toBeRequired(element);

  this.assert(
    isRequired.pass,
    'expected #{this} to be required',
    'expected #{this} not to be required'
  );
}
