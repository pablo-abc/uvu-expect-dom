import type { ExpectContext } from 'uvu-expect';
import * as matchers from '@testing-library/jest-dom/matchers';

export function assertDisabled(this: ExpectContext, element: unknown) {
  const negate = this.flag('negate');
  const isDisabled = matchers.toBeDisabled(element);

  this.assert(
    isDisabled.pass,
    'expected #{this} to be disabled',
    'expected #{this} not to be disabled',
    {
      expects: !negate ? '[disabled=true]' : '[disabled=false]',
      actual: negate ? '[disabled=true]' : '[disabled=false]',
      showDiff: true,
    }
  );
}

export function assertEnabled(this: ExpectContext, element: unknown) {
  const negate = this.flag('negate');
  const isEnabled = matchers.toBeEnabled(element);

  this.assert(
    isEnabled.pass,
    'expected #{this} to be enabled',
    'expected #{this} not to be enabled',
    {
      expects: negate ? '[disabled=true]' : '[disabled=false]',
      actual: !negate ? '[disabled=true]' : '[disabled=false]',
      showDiff: true,
    }
  );
}
