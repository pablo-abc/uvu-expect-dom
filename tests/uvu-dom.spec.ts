import { suite } from 'uvu';
import { expect, extend } from 'uvu-expect';
import uvuDOM from '../src';
import { screen } from '@testing-library/dom';

extend(uvuDOM);

const Dom = suite('Test validations');

Dom.after.each(() => {
  document.body.innerHTML = '';
});

Dom('validates if value provided is an element', () => {
  const div = document.createElement('svg');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  expect(svg).to.be.an.instanceOf(SVGElement).and.not.instanceOf(HTMLElement);
  expect(div).to.be.an.instanceOf(HTMLElement).and.not.instanceOf(SVGElement);
  expect(svg).to.be.an.element;
  expect(div).to.be.an.element;
});

Dom('validates if disabled or not', () => {
  document.body.innerHTML = `
<button data-testid="button" type="submit" disabled>submit</button>
<fieldset disabled><input type="text" data-testid="input" /></fieldset>
<a href="..." disabled>link</a>`;
  expect(screen.getByTestId('button')).to.be.disabled;
  expect(screen.getByTestId('button')).to.not.be.enabled;
  expect(screen.getByTestId('input')).to.be.disabled;
  expect(screen.getByTestId('input')).to.not.be.enabled;
  expect(screen.getByText('link')).not.to.be.disabled;
  expect(screen.getByText('link')).to.be.enabled;
});

Dom('validates if empty or not', () => {
  document.body.innerHTML = `
<span data-testid="not-empty"><span data-testid="empty"></span></span>
<span data-testid="with-whitespace"> </span>
<span data-testid="with-comment"><!-- comment --></span>`;
  expect(screen.getByTestId('empty')).to.be.empty;
  expect(screen.getByTestId('not-empty')).not.to.be.empty;
  expect(screen.getByTestId('with-whitespace')).not.to.be.empty;
  expect([]).to.be.empty;
});

Dom('validates if in element or document', () => {
  const element = document.createElement('span');
  const container = document.createElement('hi');

  expect(element).not.to.be.in(container);
  container.appendChild(element);
  expect(element).to.be.in(container);
  expect(null).to.not.be.in.document;
  expect(element).to.not.be.in.document;
  document.body.appendChild(container);
  expect(element).to.be.in.document;
});

Dom('validates if invalid or not', () => {
  document.body.innerHTML = `
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>`;
  expect(screen.getByTestId('no-aria-invalid')).not.to.be.invalid;
  expect(screen.getByTestId('aria-invalid')).to.be.invalid;
  expect(screen.getByTestId('aria-invalid-value')).to.be.invalid;
  expect(screen.getByTestId('aria-invalid-false')).not.to.be.invalid;

  expect(screen.getByTestId('valid-form')).not.to.be.invalid;
  expect(screen.getByTestId('invalid-form')).to.be.invalid;

  expect(screen.getByTestId('no-aria-invalid')).to.be.valid;
  expect(screen.getByTestId('aria-invalid')).not.to.be.valid;
  expect(screen.getByTestId('aria-invalid-value')).not.to.be.valid;
  expect(screen.getByTestId('aria-invalid-false')).to.be.valid;

  expect(screen.getByTestId('valid-form')).to.be.valid;
  expect(screen.getByTestId('invalid-form')).not.to.be.valid;
});

Dom('validates if required or not', () => {
  document.body.innerHTML = `
<input data-testid="required-input" required />
<input data-testid="aria-required-input" aria-required="true" />
<input data-testid="conflicted-input" required aria-required="false" />
<input data-testid="aria-not-required-input" aria-required="false" />
<input data-testid="optional-input" />
<input data-testid="unsupported-type" type="image" required />
<select data-testid="select" required></select>
<textarea data-testid="textarea" required></textarea>
<div data-testid="supported-role" role="tree" required></div>
<div data-testid="supported-role-aria" role="tree" aria-required="true"></div>`;
  expect(screen.getByTestId('required-input')).to.be.required;
  expect(screen.getByTestId('aria-required-input')).to.be.required;
  expect(screen.getByTestId('conflicted-input')).to.be.required;
  expect(screen.getByTestId('aria-not-required-input')).not.to.be.required;
  expect(screen.getByTestId('optional-input')).not.to.be.required;
  expect(screen.getByTestId('unsupported-type')).not.to.be.required;
  expect(screen.getByTestId('select')).to.be.required;
  expect(screen.getByTestId('textarea')).to.be.required;
  expect(screen.getByTestId('supported-role')).not.to.be.required;
  expect(screen.getByTestId('supported-role-aria')).to.be.required;
});

Dom('validates if visible or not', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<div data-testid="zero-opacity" style="opacity: 0">Zero Opacity Example</div>
<div data-testid="visibility-hidden" style="visibility: hidden">
  Visibility Hidden Example
</div>
<div data-testid="display-none" style="display: none">Display None Example</div>
<div style="opacity: 0">
  <span data-testid="hidden-parent">Hidden Parent Example</span>
</div>
<div data-testid="visible">Visible Example</div>
<div data-testid="hidden-attribute" hidden>Hidden Attribute Example</div>`;
  document.body.appendChild(div);
  expect(screen.getByText('Zero Opacity Example')).not.to.be.visible;
  expect(screen.getByText('Visibility Hidden Example')).not.to.be.visible;
  expect(screen.getByText('Display None Example')).not.to.be.visible;
  expect(screen.getByText('Hidden Parent Example')).not.to.be.visible;
  expect(screen.getByText('Visible Example')).to.be.visible;
  expect(screen.getByText('Hidden Attribute Example')).not.to.be.visible;
});

Dom('validates if element contains the specified element', () => {
  const div = document.createElement('div');
  const child = document.createElement('div');
  div.appendChild(child);
  const outside = document.createElement('div');
  expect(div).to.contain(child);
  expect(div).to.not.contain(outside);
});

Dom('validates if element contains HTML provided', () => {
  const div = document.createElement('div');
  div.innerHTML = `<span data-testid="parent"><span data-testid="child"></span></span>`;
  document.body.appendChild(div);
  expect(screen.getByTestId('parent')).to.contain.html(
    '<span data-testid="child"></span>'
  );
  expect(screen.getByTestId('parent')).to.contain.html(
    '<span data-testid="child" />'
  );
  expect(screen.getByTestId('parent')).not.to.contain.html('<br />');
});

Dom('validates if element has an accessible description', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<a
  data-testid="link"
  href="/"
  aria-label="Home page"
  title="A link to start over"
  >Start</a
>
<a data-testid="extra-link" href="/about" aria-label="About page">About</a>
<img src="avatar.jpg" data-testid="avatar" alt="User profile pic" />
<img
  src="logo.jpg"
  data-testid="logo"
  alt="Company logo"
  aria-describedby="t1"
/>
<span id="t1" role="presentation">The logo of Our Company</span>`;
  document.body.appendChild(div);
  expect(screen.getByTestId('link')).to.have.a.description;
  expect(screen.getByTestId('link')).to.have.a.description.that.equals(
    'A link to start over'
  );
  expect(screen.getByTestId('link')).to.have.a.description.that.does.not.equal(
    'Home page'
  );
  expect(screen.getByTestId('extra-link')).not.to.have.a.description;
  expect(screen.getByTestId('avatar')).not.to.have.a.description;
  expect(screen.getByTestId('logo')).to.have.a.description.that.does.not.equal(
    'Compay logo'
  );
  expect(screen.getByTestId('logo')).to.have.a.description.that.equals(
    'The logo of Our Company'
  );
  expect(screen.getByTestId('logo')).to.have.a.description.that.contains(
    'Our Company'
  );
});

Dom('vallidates if element has an accessible name', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<img data-testid="img-alt" src="" alt="Test alt" />
<img data-testid="img-empty-alt" src="" alt="" />
<svg data-testid="svg-title"><title>Test title</title></svg>
<button data-testid="button-img-alt"><img src="" alt="Test" /></button>
<p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
<button data-testid="svg-button"><svg><title>Test</title></svg></p>
<div><svg data-testid="svg-without-title"></svg></div>
<input data-testid="input-title" title="test" />`;
  document.body.appendChild(div);
  expect(screen.getByTestId('img-alt')).to.have.a.name.that.equals('Test alt');
  expect(screen.getByTestId('img-empty-alt')).not.to.have.a.name;
  expect(screen.getByTestId('svg-title')).to.have.a.name.that.equals(
    'Test title'
  );
  expect(screen.getByTestId('button-img-alt')).to.have.a.name;
  expect(screen.getByTestId('img-paragraph')).not.to.have.a.name;
  expect(screen.getByTestId('svg-button')).to.have.a.name;
  expect(screen.getByTestId('svg-without-title')).not.to.have.a.name;
  expect(screen.getByTestId('input-title')).to.have.a.name;
});

Dom('validates if element has an attribute', () => {
  const div = document.createElement('div');
  div.innerHTML =
    '<button data-testid="ok-button" type="submit" disabled>ok</button>';
  document.body.appendChild(div);
  const button = screen.getByTestId('ok-button');

  expect(button).to.have.attribute('disabled');
  expect(button).to.have.attribute('type').that.equals('submit');
  expect(button).to.have.attribute('type').that.does.not.equal('button');

  expect(button).to.have.attribute('type').that.contains('sub');
  expect(button).to.have.attribute('type').that.does.not.contain('butt');
  expect(button).not.to.have.attribute('novalidate');
});

Dom('validates if element has a class', () => {
  const div = document.createElement('div');
  div.innerHTML = `
<button data-testid="delete-button" class="btn extra btn-danger">
  Delete item
</button>
<button data-testid="no-classes">No Classes</button>`;
  document.body.appendChild(div);
  const deleteButton = screen.getByTestId('delete-button');
  const noClasses = screen.getByTestId('no-classes');

  expect(deleteButton).to.have.class.that.contains('extra');
  expect(deleteButton).to.have.class.that.contains('btn-danger btn');
  expect(deleteButton).to.have.class.that.contains.members([
    'btn-danger',
    'btn',
  ]);
  expect(deleteButton).to.have.class.that.does.not.contain('btn-link');

  expect(deleteButton).to.have.class.that.has.members([
    'btn-danger',
    'extra btn',
  ]); // to check if the element has EXACTLY a set of classes
  expect(deleteButton).to.have.class.that.does.not.have.members([
    'btn-danger',
    'extra',
  ]); // if it has more than expected it is going to fail
  expect(deleteButton).to.have.class.that.equals('btn-danger extra btn'); // to check if the element has EXACTLY a set of classes
  expect(deleteButton).to.have.class.that.does.not.equal('btn-danger extra'); // if it has more than expected it is going to fail

  expect(noClasses).not.to.have.class;
});

Dom('validate if element has focus', () => {
  document.body.innerHTML =
    '<div><input type="text" data-testid="element-to-focus" /></div>';
  const input = screen.getByTestId('element-to-focus');

  input.focus();
  expect(input).to.have.focus;
  expect(input).to.be.focused;

  input.blur();
  expect(input).not.to.have.focus;
  expect(input).not.to.be.focused;
});

Dom('validate if element has form values', () => {
  document.body.innerHTML = `
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>`;
  expect(screen.getByTestId('login-form')).to.have.formValues({
    username: 'jane.doe',
    rememberMe: true,
  });
});

Dom('validate if element has style', () => {
  document.body.innerHTML = `
<button
  data-testid="delete-button"
  style="display: none; background-color: red"
>
  Delete item
</button>`;
  const button = screen.getByTestId('delete-button');

  expect(button).to.have.style('display: none');
  expect(button).to.have.style({ display: 'none' });
  expect(button).to.have.style(`
  background-color: red;
  display: none;
`);
  expect(button).to.have.style({
    backgroundColor: 'red',
    display: 'none',
  });
  expect(button).not.to.have.style(`
  background-color: blue;
  display: none;
`);
  expect(button).not.to.have.style({
    backgroundColor: 'blue',
    display: 'none',
  });
});

Dom('validate that element has specified text content', () => {
  document.body.innerHTML =
    '<span data-testid="text-content">Text Content</span>';
  const element = screen.getByTestId('text-content');

  expect(element).to.have.text.that.contains('Content');
  expect(element).to.have.text.that.matches(/^Text Content$/); // to match the whole content
  expect(element).to.have.text.that.matches(/content$/i); // to use case-insensitive match
  expect(element).to.have.text.that.does.not.contain('content');
});

Dom('validate that element has specified value', () => {
  document.body.innerHTML = `
<input type="text" value="text" data-testid="input-text" />
<input type="number" value="5" data-testid="input-number" />
<input type="text" data-testid="input-empty" />
<select multiple data-testid="select-number">
  <option value="first">First Value</option>
  <option value="second" selected>Second Value</option>
  <option value="third" selected>Third Value</option>
</select>`;
  const textInput = screen.getByTestId('input-text');
  const numberInput = screen.getByTestId('input-number');
  const emptyInput = screen.getByTestId('input-empty');
  const selectInput = screen.getByTestId('select-number');

  expect(textInput).to.have.value.that.equals('text');
  expect(numberInput).to.have.value.that.equals(5);
  expect(emptyInput).not.to.have.value;
  expect(selectInput).to.have.value.that.has.members(['second', 'third']);
});

Dom('validate that element has specified display values', () => {
  document.body.innerHTML = `
<label for="input-example">First name</label>
<input type="text" id="input-example" value="Luca" />

<label for="textarea-example">Description</label>
<textarea id="textarea-example">An example description here.</textarea>

<label for="single-select-example">Fruit</label>
<select id="single-select-example">
  <option value="">Select a fruit...</option>
  <option value="banana">Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado">Avocado</option>
</select>

<label for="multiple-select-example">Fruits</label>
<select id="multiple-select-example" multiple>
  <option value="">Select a fruit...</option>
  <option value="banana" selected>Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado" selected>Avocado</option>
</select>`;
  const input = screen.getByLabelText('First name');
  const textarea = screen.getByLabelText('Description');
  const selectSingle = screen.getByLabelText('Fruit');
  const selectMultiple = screen.getByLabelText('Fruits');

  expect(input).to.have.display.value.that.contains('Luca');
  expect(input).to.have.display.value.that.matches(/Luc/);
  expect(textarea).to.have.display.value.that.contains(
    'An example description here.'
  );
  expect(textarea).to.have.display.value.that.matches(/example/);
  expect(selectSingle).to.have.display.value.that.contains('Select a fruit...');
  expect(selectSingle).to.have.display.value.that.matches(/Select/);
  expect(selectMultiple)
    .to.have.display.value.that.contains('Banana')
    .and.matches(/Avocado/);
});

Dom('validates that element is checked', () => {
  document.body.innerHTML = `
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>

<input type="radio" checked value="foo" data-testid="input-radio-checked" />
<input type="radio" value="foo" data-testid="input-radio-unchecked" />
<div role="radio" aria-checked="true" data-testid="aria-radio-checked" />
<div role="radio" aria-checked="false" data-testid="aria-radio-unchecked" />
<div role="switch" aria-checked="true" data-testid="aria-switch-checked" />
<div role="switch" aria-checked="false" data-testid="aria-switch-unchecked" />`;
  const inputCheckboxChecked = screen.getByTestId('input-checkbox-checked');
  const inputCheckboxUnchecked = screen.getByTestId('input-checkbox-unchecked');
  const ariaCheckboxChecked = screen.getByTestId('aria-checkbox-checked');
  const ariaCheckboxUnchecked = screen.getByTestId('aria-checkbox-unchecked');
  expect(inputCheckboxChecked).to.be.checked;
  expect(inputCheckboxUnchecked).not.to.be.checked;
  expect(ariaCheckboxChecked).to.be.checked;
  expect(ariaCheckboxUnchecked).not.to.be.checked;

  const inputRadioChecked = screen.getByTestId('input-radio-checked');
  const inputRadioUnchecked = screen.getByTestId('input-radio-unchecked');
  const ariaRadioChecked = screen.getByTestId('aria-radio-checked');
  const ariaRadioUnchecked = screen.getByTestId('aria-radio-unchecked');
  expect(inputRadioChecked).to.be.checked;
  expect(inputRadioUnchecked).not.to.be.checked;
  expect(ariaRadioChecked).to.be.checked;
  expect(ariaRadioUnchecked).not.to.be.checked;

  const ariaSwitchChecked = screen.getByTestId('aria-switch-checked');
  const ariaSwitchUnchecked = screen.getByTestId('aria-switch-unchecked');
  expect(ariaSwitchChecked).to.be.checked;
  expect(ariaSwitchUnchecked).not.to.be.checked;
});

Dom('validates that element is partially checked', () => {
  document.body.innerHTML = `
<input type="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>
<input type="checkbox" data-testid="input-checkbox-indeterminate" />`;
  const ariaCheckboxMixed = screen.getByTestId('aria-checkbox-mixed');
  const inputCheckboxChecked = screen.getByTestId('input-checkbox-checked');
  const inputCheckboxUnchecked = screen.getByTestId('input-checkbox-unchecked');
  const ariaCheckboxChecked = screen.getByTestId('aria-checkbox-checked');
  const ariaCheckboxUnchecked = screen.getByTestId('aria-checkbox-unchecked');
  const inputCheckboxIndeterminate = screen.getByTestId(
    'input-checkbox-indeterminate'
  ) as HTMLInputElement;

  expect(ariaCheckboxMixed).to.be.partially.checked;
  expect(inputCheckboxChecked).not.to.be.partially.checked;
  expect(inputCheckboxUnchecked).not.to.be.partially.checked;
  expect(ariaCheckboxChecked).not.to.be.partially.checked;
  expect(ariaCheckboxUnchecked).not.to.be.partially.checked;

  inputCheckboxIndeterminate.indeterminate = true;
  expect(inputCheckboxIndeterminate).to.be.partially.checked;
});

Dom('validate if element has error message', () => {
  document.body.innerHTML = `
<label for="startTime"> Please enter a start time for the meeting: </label>
<input
  id="startTime"
  type="text"
  aria-errormessage="msgID"
  aria-invalid="true"
  value="11:30 PM"
/>
<span id="msgID" aria-live="assertive" style="visibility:visible">
  Invalid time: the time must be between 9:00 AM and 5:00 PM
</span>`;
  const timeInput = screen.getByLabelText(
    'Please enter a start time for the meeting:'
  );

  expect(timeInput).to.have.error.that.equals(
    'Invalid time: the time must be between 9:00 AM and 5:00 PM'
  );
  expect(timeInput).to.have.error.that.matches(/invalid time/i); // to partially match
  expect(timeInput).to.have.error.that.contains('Invalid time'); // to partially match
  expect(timeInput).to.have.error.that.does.not.contain('Pikachu!');
});

Dom.run();
