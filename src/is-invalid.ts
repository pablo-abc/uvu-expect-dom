import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertInvalid(this: ExpectContext, element: HTMLElement) {
  const isInvalid = matchers.toBeInvalid(element);

  this.assert(
    isInvalid.pass,
    'expected #{this} to be invalid',
    'expected #{this} not to be invalid'
  );
}

export function assertValid(this: ExpectContext, element: HTMLElement) {
  const isValid = matchers.toBeValid(element);

  this.assert(
    isValid.pass,
    'expected #{this} to be valid',
    'expected #{this} not to be valid'
  );
}
