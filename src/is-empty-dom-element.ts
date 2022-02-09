import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertIsEmptyDomElement(this: ExpectContext, element: Element) {
  const isEmpty = matchers.toBeEmptyDOMElement(element);
  this.assert(
    isEmpty.pass,
    'expected #{this} to be empty',
    'expected #{this} not to be empty'
  );
}
