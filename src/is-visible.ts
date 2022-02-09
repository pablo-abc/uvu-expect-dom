import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertVisible(this: ExpectContext, element: HTMLElement) {
  const isVisible = matchers.toBeVisible(element);

  this.assert(
    isVisible.pass,
    'expected #{this} to be visible',
    'expected #{this} not to be visible'
  );
}
