import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertIsInTheDocument(
  this: ExpectContext,
  element: HTMLElement | null
) {
  const newThis = { ...this, isNot: this.flag('negate') };
  const isInDocument = matchers.toBeInTheDocument.call(newThis, element);

  this.assert(
    isInDocument.pass,
    'expected #{this} to be in the document',
    'expected #{this} not to be in the document'
  );
}
