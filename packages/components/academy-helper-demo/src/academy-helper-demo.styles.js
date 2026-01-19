import { css } from 'lit';
import '../../../base/academy-core/src/tokens/modern-warm-palette.css';

export const academyHelperDemoStyles = css`
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    color: black;
    background: white;
  }

  .events-badge {
    position: absolute;
    top: -6px;
    left: -6px;
    /* default accent (blue) - override with --academy-events-badge-bg if needed */
    background: var(--academy-events-badge-bg, var(--academy-accent, #0066FF));
    color: var(--academy-events-badge-fg, #ffffff);
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    border-radius: 9px;
    display: inline-block;
    text-align: center;
    padding: 0 5px;
    box-shadow: 0 1px 0 rgba(0,0,0,0.15);
  }

  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .controls {
    background: var(--demo-controls-bg, var(--color-primary-700));
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    color: var(--demo-controls-active-text, var(--color-primary-50));
  }

  .controls-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .controls-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .control-group label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--demo-label-color, var(--color-primary-50));
  }

  .control-group select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    font-size: 0.875rem;
    min-width: 150px;
  }

  .content {
    border: 1px solid var(--color-primary-50);
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .event-log {
    /* Softer background than controls: light translucent in LTR, subtle tint in dark */
    background: var(--demo-log-bg, rgba(255,255,255,0.95));
    padding: 1rem;
    border-radius: 8px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0,0,0,0.16);
    border: 1px solid rgba(0,0,0,0.06);
    width: 320px;
    max-width: calc(100vw - 16px);
    transition: transform 160ms ease, opacity 160ms ease;
    will-change: transform, opacity;
    background-clip: padding-box;
    backdrop-filter: blur(4px);
    pointer-events: auto;
  }

  .event-log h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }

  /* Root for floating log positioning */
  #__event-log-root {
    position: relative;
  }

  /* Hidden by default, animate into view */
  .event-log {
    opacity: 0;
    transform: translateY(-6px);
  }

  .event-log[style] {
    /* When inline styles are applied (JS positioning), ensure visible */
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 520px) {
    .event-log {
      width: calc(100vw - 16px);
      left: 8px !important;
      right: 8px !important;
      top: auto !important;
      bottom: 16px !important;
      max-height: 50vh;
    }
  }

  .event-entry {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-left: 3px solid var(--color-primary-500);
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: monospace;
  }

  .event-time {
    color: #666;
    margin-right: 0.5rem;
  }

  :host([mode="dark"]) {
    --demo-controls-bg: #2d2d2d;
    --demo-content-bg: #1a1a1a;
    --demo-log-bg: rgba(255,255,255,0.03);
    --demo-label-color: #e0e0e0;
    color: var(--color-bg);
    background: #111;
  }

  :host([mode="dark"]) .control-group select {
    background: #333;
    color: var(--color-bg);
    border-color: #555;
  }

  :host([mode="dark"]) .event-entry {
    background: #333;
    color: #e0e0e0;
  }

  /* Mode toggle styles */
  .mode-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mode-toggle button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: transparent;
    color: var(--color-primary-50);
    cursor: pointer;
    padding: 4px;
  }

  .mode-toggle button:hover {
    background: rgba(255,255,255,0.02);
  }

  .mode-toggle svg {
    width: 20px;
    height: 20px;
    display: block;
  }

  /* Events icon button - match mode toggle */
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: transparent;
    color: var(--color-primary-50);
    cursor: pointer;
    padding: 4px;
  }

  .icon-btn:hover {
    background: rgba(255,255,255,0.02);
  }

  /* Active state: invert colors when the events log is open */
  #show-events-toggle[aria-pressed="true"],
  .icon-btn[aria-pressed="true"] {
    background: var(--academy-toggle-active-bg, var(--academy-accent, #0066FF));
    color: var(--academy-toggle-active-fg, #ffffff);
    border-color: transparent;
    box-shadow: 0 10px 30px rgba(0,0,0,0.18);
  }

  #show-events-toggle[aria-pressed="true"] svg,
  .icon-btn[aria-pressed="true"] svg {
    fill: currentColor;
    stroke: currentColor;
  }

  :host([mode="dark"]) #show-events-toggle[aria-pressed="true"],
  :host([mode="dark"]) .icon-btn[aria-pressed="true"] {
    background: var(--academy-toggle-active-bg-dark, var(--academy-accent-dark, #3399FF));
    color: var(--academy-toggle-active-fg-dark, #ffffff);
    border-color: transparent;
  }

  /* Clear button modern style */
  .clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.6rem;
    border-radius: 8px;
    border: 1px solid var(--academy-clear-border, rgba(0,0,0,0.08));
    /* Clear button should be red to indicate destructive action */
    background: var(--academy-clear-bg, var(--academy-clear-accent, #FF3B30));
    color: var(--academy-clear-fg, #ffffff);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    min-height: 36px;
  }

  .clear-btn svg {
    width: 16px;
    height: 16px;
    display: block;
    opacity: 0.95;
  }

  .clear-btn .clear-label {
    display: inline-block;
  }

  .clear-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.18);
  }

  :host([mode="dark"]) .clear-btn {
    border-color: var(--academy-clear-border-dark, rgba(255,255,255,0.06));
    background: var(--academy-clear-bg-dark, var(--academy-clear-accent-dark, #FF6B61));
    color: var(--academy-clear-fg-dark, #111111);
  }

  /* Ensure clear label hides on very small screens to save space */
  @media (max-width: 420px) {
    .clear-btn .clear-label { display: none; }
  }

  .icon-chooser {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .icon-choice {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.04);
    background: transparent;
    color: var(--color-primary-50);
    cursor: pointer;
    padding: 2px;
  }

  .icon-choice[aria-pressed="true"] {
    background: rgba(255,255,255,0.04);
  }

  /* Viewport segmented control */
  .viewport-segment {
    display: flex;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.08);
    width: 100%;
  }

  .viewport-segment__item {
    flex: 1 1 0;
    padding: 0.5rem 0.75rem;
    text-align: center;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--viewport-inactive-color, #9aa0a6);
    background: var(--viewport-inactive-bg, rgba(255,255,255,0.02));
    border-right: 1px solid rgba(0,0,0,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .viewport-segment__item:last-child { border-right: none; }

  .viewport-segment__item[aria-pressed="true"] {
    color: var(--demo-controls-bg, var(--color-primary-700));
    background: var(--demo-controls-bg, var(--color-primary-700));
    color: var(--demo-controls-active-text, var(--color-primary-50));
  }
`;
