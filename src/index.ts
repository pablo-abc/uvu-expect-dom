import type { ExpectContext, ExtendExpectHelpers } from 'uvu-expect';
import * as assert from 'uvu/assert';
import {
  computeAccessibleDescription,
  computeAccessibleName,
} from 'dom-accessibility-api';
import {
  assertDisabled,
  assertEnabled,
  assertIsEmptyDomElement,
  assertIsInTheDocument,
  assertInvalid,
  assertValid,
  assertRequired,
  assertVisible,
  assertContainsHTML,
  assertHasAccessibleDescription,
  assertHasAccessibleName,
  assertHasAttribute,
  assertHasFocus,
  assertHasFormValues,
  assertHasStyle,
  assertChecked,
  assertPartiallyChecked,
} from './assertions';
import {
  getSingleElementValue,
  getDisplayedValues,
  splitClassNames,
  normalize,
  isEqual,
} from './utils';

export default function uvuDOM({
  replaceProperty,
  addProperty,
}: ExtendExpectHelpers) {
  addProperty('element', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object');
      this.assert(
        actual instanceof HTMLElement || actual instanceof SVGElement,
        'expected #{this} to be an HTML or SVG element',
        'expected #{this} not to be an HTML or SVG element'
      );
    },
  });

  addProperty('disabled', {
    onAccess(this: ExpectContext) {
      assertDisabled.call(this, this.flag('object'));
    },
  });

  addProperty('enabled', {
    onAccess(this: ExpectContext) {
      assertEnabled.call(this, this.flag('object'));
    },
  });

  replaceProperty('empty', (handler) => ({
    onAccess(this: ExpectContext) {
      const actual = this.flag('object');
      if (actual && actual instanceof Element) {
        assertIsEmptyDomElement.call(this, actual);
      } else {
        handler.onAccess?.call(this);
      }
    },
    onCall(this: ExpectContext, ...args: unknown[]) {
      handler.onCall?.apply(this, args);
    },
  }));

  addProperty('in', {
    onCall(this: ExpectContext, container: Element) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      const isInContainer = container.contains(actual);
      this.assert(
        isInContainer,
        'expected #{this} to be in #{exp}',
        'expected #{this} not to be in #{exp}'
      );
    },
  });

  addProperty('html', {
    onCall(this: ExpectContext, html: string) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      assert.type(html, 'string');
      assertContainsHTML.call(this, actual, html);
    },
  });

  addProperty('document', {
    onAccess(this: ExpectContext) {
      assertIsInTheDocument.call(this, this.flag('object') as any);
    },
  });

  addProperty('invalid', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as HTMLElement;
      assert.instance(actual, Element);
      assertInvalid.call(this, actual);
    },
  });

  addProperty('valid', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as HTMLElement;
      assert.instance(actual, Element);
      assertValid.call(this, actual);
    },
  });

  addProperty('required', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as any;
      assert.instance(actual, Element);
      assertRequired.call(this, actual);
    },
  });

  addProperty('visible', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as any;
      assert.instance(actual, Element);
      assertVisible.call(this, actual);
    },
  });

  replaceProperty(
    ['include', 'includes', 'contain', 'contains'],
    (handler) => ({
      onCall(this: ExpectContext, value: any) {
        const actual = this.flag('object');
        if (actual && actual instanceof Element) {
          this.assert(
            actual.contains(value),
            'expected #{this} to contain #{exp}',
            'expected #{this} not to contain #{exp}'
          );
        } else if (Array.isArray(actual) && this.flag('class')) {
          const splitValues = splitClassNames(value);
          this.assert(
            splitValues.every((v) => actual.includes(v)),
            'expected #{this} to contain: #{exp}',
            'expected #{this} not to contain: #{exp}',
            {
              expects: splitValues.sort().join(' '),
              actual: actual.sort().join(' '),
              showDiff: !this.flag('negate'),
            }
          );
        } else {
          handler.onCall?.apply(this, arguments as any);
        }
      },
    })
  );

  replaceProperty('members', (handler) => ({
    onCall(this: ExpectContext, values: any[], ...args: any[]) {
      if (this.flag('class') && values.every((v) => typeof v === 'string')) {
        const splitValues = splitClassNames(values.join(' '));
        handler.onCall?.call(this, splitValues, ...args);
      } else {
        handler.onCall?.call(this, values, ...args);
      }
    },
  }));

  addProperty(['description', 'accessibleDescription'], {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      assertHasAccessibleDescription.call(this, actual);
      const accessibleDescription = computeAccessibleDescription(actual);
      this.flag('object', accessibleDescription);
    },
  });

  addProperty(['name', 'accessibleName'], {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      assertHasAccessibleName.call(this, actual);
      const accessibleName = computeAccessibleName(actual);
      this.flag('object', accessibleName);
    },
  });

  addProperty('attribute', {
    onCall(this: ExpectContext, name: string) {
      const actual = this.flag('object') as any;
      assertHasAttribute.call(this, actual, name);
      this.flag('object', actual.getAttribute(name));
    },
  });

  addProperty(['class', 'className'], {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      this.flag('object', splitClassNames(actual.className));
      this.flag('class', true);
    },
  });

  function assertFocus(this: ExpectContext) {
    const actual = this.flag('object') as Element;
    assert.instance(actual, Element);
    assertHasFocus.call(this, actual);
  }

  addProperty(['focus', 'focused'], {
    onAccess(this: ExpectContext) {
      assertFocus.call(this);
    },
  });

  replaceProperty(['equal', 'equals'], (handler) => ({
    onCall(this: ExpectContext, value: string) {
      if (this.flag('class')) {
        const actual = this.flag('object') as any;
        const splitClasses = splitClassNames(value);
        this.assert(
          isEqual(splitClasses.sort(), actual.sort()),
          'expected #{this} to equal class #{exp}',
          'expected #{this} not to equal class #{exp}',
          { expects: splitClasses, actual, showDiff: !this.flag('negate') }
        );
      } else {
        handler.onCall?.apply(this, arguments as any);
      }
    },
  }));

  addProperty('formValues', {
    onCall(this: ExpectContext, values: Record<string, any>) {
      const actual = this.flag('object') as Element;
      if (
        !(
          actual instanceof HTMLFormElement ||
          actual instanceof HTMLFieldSetElement
        )
      ) {
        assert.unreachable(
          'expected target to be either a form or fieldset element'
        );
      }
      assertHasFormValues.call(this, actual, values);
    },
  });

  addProperty(['style', 'css'], {
    onCall(this: ExpectContext, css: string | Record<string, any>) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      assertHasStyle.call(this, actual, css);
    },
  });

  /* istanbul ignore next */
  addProperty('notNormalized', {
    onAccess(this: ExpectContext) {
      this.flag('notNormalized', true);
    },
  });

  addProperty(['text', 'textContent'], {
    onAccess(this: ExpectContext) {
      const notNormalized = this.flag('notNormalized');
      const actual: Element = this.flag('object') as Element;
      assert.instance(actual, Element);
      const textContent = !notNormalized
        ? actual.textContent?.replace(/\s+/g, ' ').trim()
        : actual.textContent?.replace(/\u00a0/g, ' ');
      this.assert(
        typeof textContent === 'string',
        'expected #{this} to have text content',
        'expecte #{this} not to have text content'
      );
      this.flag('object', textContent);
    },
  });

  addProperty(['display', 'displayed'], {
    onAccess(this: ExpectContext) {
      this.flag('display', true);
    },
  });

  addProperty('value', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as Element;
      assert.instance(actual, Element);
      assert.is.not(actual.tagName.toLowerCase(), 'checkbox');
      assert.is.not(actual.tagName.toLowerCase(), 'radio');
      let value;
      if (!this.flag('display')) {
        value = getSingleElementValue(actual);
      } else {
        const tagName = actual.tagName.toLowerCase();
        value = getDisplayedValues(tagName, actual);
      }
      this.assert(
        !!value,
        'expected #{this} to have a value',
        'expected #{this} not to have a value'
      );
      this.flag('object', value);
    },
  });

  addProperty('partially', {
    onAccess(this: ExpectContext) {
      this.flag('partially', true);
    },
  });

  addProperty('checked', {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as HTMLElement;
      assert.instance(actual, Element);
      const partially = this.flag('partially');
      if (partially) {
        assertPartiallyChecked.call(this, actual);
      } else {
        assertChecked.call(this, actual);
      }
    },
  });

  addProperty(['error', 'errormessage'], {
    onAccess(this: ExpectContext) {
      const actual = this.flag('object') as HTMLElement;
      assert.instance(actual, Element);
      const negate = this.flag('negate');
      this.assert(
        actual.hasAttribute('aria-invalid') &&
          actual.getAttribute('aria-invalid') !== 'false',
        'expected #{this} to have an invalid state',
        'expected #{this} not to have an invalid state',
        {
          expects: !negate ? '[aria-invalid="true"]' : '[aria-invalid="false"]',
          actual: negate ? '[aria-invalid="true"]' : '[aria-invalid="false"]',
          showDiff: true,
        }
      );
      const errormessageIDRaw = actual.getAttribute('aria-errormessage') || '';
      const errormessageIDs = errormessageIDRaw.split(/\s+/).filter(Boolean);
      let errormessage = '';
      if (errormessageIDs.length > 0) {
        const document = actual.ownerDocument;

        const errormessageEls = errormessageIDs
          .map((errormessageID) => document.getElementById(errormessageID))
          .filter(Boolean);

        errormessage = normalize(
          errormessageEls.map((el) => el?.textContent || '').join(' ')
        );
      }

      this.flag('object', errormessage);
    },
  });
}
