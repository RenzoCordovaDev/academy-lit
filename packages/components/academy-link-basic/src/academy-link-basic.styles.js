import { css } from 'lit';

export const AcademyLinkBasicStyles = css`
:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

.academy-link-basic {
  padding: 1rem;
}

:host([loading]) .academy-link-basic {
  opacity: 0.5;
  pointer-events: none;
}
`;
