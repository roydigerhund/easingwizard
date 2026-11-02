import type { MouseEvent } from 'react';

export function isIntegrationHash(hash: string): hash is '#integrations' | '#mcp-setup' {
  return hash === '#integrations' || hash === '#mcp-setup';
}

export function focusIntegrationTarget(hash: string) {
  if (!isIntegrationHash(hash)) return;

  if (hash === '#mcp-setup') {
    const details = document.getElementById('mcp-setup');
    if (details instanceof HTMLDetailsElement) details.open = true;
  }

  const target = document.getElementById(hash === '#mcp-setup' ? 'mcp-setup-summary' : 'integrations');
  target?.scrollIntoView({ behavior: 'auto', block: 'start' });
  target?.focus({ preventScroll: true });
}

export function handleIntegrationLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  // Reopening the current target must work even when React Router's location does not change.
  const hash = event.currentTarget.hash;
  if (isIntegrationHash(hash) && window.location.hash === hash) {
    event.preventDefault();
    focusIntegrationTarget(hash);
  }
}
