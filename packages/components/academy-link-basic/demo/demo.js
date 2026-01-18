import '../index.js';
import '@academy-lit-components/academy-helper-demo';

function applySettingsTo(el, msg) {
	if (!el || !msg) return;
	try { if (typeof el.setLocale === 'function') el.setLocale(msg.locale); } catch (_) {}
	try { if (el.mode !== undefined) el.mode = msg.mode; } catch (_) {}
	try { if (el.ambient !== undefined) el.ambient = msg.ambient; } catch (_) {}
	try { if (typeof el.setViewport === 'function') el.setViewport(msg.viewport); else if ('viewport' in el) el.viewport = msg.viewport; else el.setAttribute && el.setAttribute('data-viewport', msg.viewport); } catch (_) {}
}

function getTargetElement() {
	const explicit = document.querySelector('[data-demo-target]');
	if (explicit) return explicit;
	const candidates = Array.from(document.querySelectorAll('*'))
		.filter(n => n.tagName?.includes('-'))
		.filter(n => n.tagName.toLowerCase() !== 'academy-helper-demo' && n.tagName.toLowerCase() !== 'academy-helper-demo-case');
	return candidates[0] || null;
}

window.addEventListener('message', (e) => {
	const msg = e.data;
	if (!msg || msg.type !== 'academy-demo-settings') return;
	const el = getTargetElement();
	if (!el) return;
	applySettingsTo(el, msg);
});

// Forward any CustomEvent with type starting with 'academy-' to parent via postMessage
(() => {
	const originalDispatch = EventTarget.prototype.dispatchEvent;
	try {
		EventTarget.prototype.dispatchEvent = function(event) {
			try {
				if (event && typeof event.type === 'string' && event.type.startsWith('academy-') && (event instanceof CustomEvent)) {
					const detail = event.detail;
					const safeDetail = (() => {
						try {
							// Avoid serializing native Events or DOM nodes
							return JSON.stringify(detail, (key, value) => {
								if (typeof Event !== 'undefined' && value instanceof Event) {
									return { eventType: value.type };
								}
								if (typeof Node !== 'undefined' && value instanceof Node) {
									return { nodeName: value.nodeName };
								}
								if (typeof value === 'function') return undefined;
								return value;
							});
						} catch (_) {
							return undefined;
						}
					})();
					try {
						window.parent && window.parent.postMessage({ __academyDemoEvent: true, event: { type: event.type, detail: safeDetail ? JSON.parse(safeDetail) : undefined, isCustomEvent: true } }, '*');
					} catch (_) {}
				}
			} catch (_) {}
			return originalDispatch.call(this, event);
		};
	} catch (_) {}
})();