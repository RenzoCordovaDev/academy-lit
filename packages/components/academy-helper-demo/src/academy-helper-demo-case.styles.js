import { css } from 'lit';

export const academyHelperDemoCaseStyles = css`
  :host { display: block; }
  .case { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
  .case__header { font-weight: 600; margin-bottom: 0.25rem; }
  .case__description { color: black; margin-bottom: 0.75rem; }
  .case__frame { width: 100%; height: 420px; border: 1px solid #ccc; border-radius: 4px; display: block; margin: 0 auto; }

  /* Visual helper classes inside the frame wrapper (applied via inline styles on iframe) */
  .case__frame[data-viewport="mobile"] { width: 360px; height: 720px; }
  .case__frame[data-viewport="tablet"] { width: 820px; height: 1080px; }
  .case__frame[data-viewport="desktop"] { width: 100%; height: 420px; }
`;
