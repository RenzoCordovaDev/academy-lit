import { fixture, expect, html } from '@open-wc/testing';
import './button.js';

describe('Button', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<academy-button>Click me</academy-button>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button).to.exist;
    expect(button.textContent).to.equal('Click me');
  });

  it('emits an event on click', async () => {
    const el = await fixture(html`<academy-button>Click me</academy-button>`);
    let clicked = false;
    el.addEventListener('academy-button-click', () => (clicked = true));
    el.shadowRoot.querySelector('button').click();
    expect(clicked).to.be.true;
  });

  it('respects the disabled attribute', async () => {
    const el = await fixture(html`<academy-button disabled>Click me</academy-button>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button.disabled).to.be.true;
  });
});