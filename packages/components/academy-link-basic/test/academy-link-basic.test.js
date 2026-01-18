import { fixture, expect, html } from '@open-wc/testing';
import './academy-link-basic.js';

describe('AcademyLinkBasic', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<academy-link-basic>Content</academy-link-basic>`);
    expect(el).to.exist;
  });

  it('renders with text-key', async () => {
    const el = await fixture(html`<academy-link-basic text-key="test-key"></academy-link-basic>`);
    expect(el).to.exist;
  });
});