import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertContainsHTML(
  this: ExpectContext,
  element: Element,
  htmlText: string
) {
  const contained = matchers.toContainHTML(element, htmlText);

  this.assert(
    contained.pass,
    'expected #{this} to contain HTML #{exp}',
    'expected #{this} not to contain HTML ${exp}',
    {
      expects: htmlText,
      actual: element.outerHTML,
      showDiff: !this.flag('negate'),
    }
  );
}
