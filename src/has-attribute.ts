import type { ExpectContext } from 'uvu-expect';

export function assertHasAttribute(
  this: ExpectContext,
  element: Element,
  name: string
) {
  const hasAttribute = element.hasAttribute(name);

  this.assert(
    hasAttribute,
    'expected #{this} to have an attribute with name #{exp}',
    'expected #{this} not to have an attribute with name #{exp}'
  );
}
