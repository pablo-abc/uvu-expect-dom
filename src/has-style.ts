import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertHasStyle(
  this: ExpectContext,
  element: Element,
  css: string | Record<string, any>
) {
  const hasStyle = matchers.toHaveStyle(element, css);

  this.assert(
    hasStyle.pass,
    'expected #{this} to have style: #{exp}',
    'expected #{this} not to have style: #{exp}'
  );
}
