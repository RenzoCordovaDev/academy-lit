import { fixture, expect, html } from '@open-wc/testing';
import './academy-button-basic.js';

describe('AcademyButtonBasic', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<academy-button-basic>Content</academy-button-basic>`);
    expect(el).to.exist;
  });

  it('renders with text-key', async () => {
    const el = await fixture(html`<academy-button-basic text-key="test-key"></academy-button-basic>`);
    expect(el).to.exist;
  });
});