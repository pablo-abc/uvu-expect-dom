import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertHasFormValues(
  this: ExpectContext,
  element: Element,
  values: Record<string, any>
) {
  const hasFormValues = matchers.toHaveFormValues(element, values);

  this.assert(
    hasFormValues.pass,
    'expected #{this} to have form values: #{exp}',
    'expected #{this} not to have form values: #{exp}'
  );
}
