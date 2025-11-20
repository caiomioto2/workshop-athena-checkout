'use client';

import { useEffect } from 'react';

export function ClientScripts() {
  useEffect(() => {
    // Run any client-side initialization after hydration
    // This prevents hydration mismatches from browser extensions
    const handleExtensionAttributes = () => {
      // Common browser extension attributes that cause hydration issues
      const extensionAttributes = [
        'data-js-focus-visible',
        'data-lt-installed',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed'
      ];

      // This is just for documentation - we let suppressHydrationWarning handle the actual mismatch
      extensionAttributes.forEach(attr => {
        if (document.documentElement.getAttribute(attr)) {
          // Extension has modified the DOM
          console.debug(`Browser extension added attribute: ${attr}`);
        }
      });
    };

    // Small delay to ensure extensions have had time to modify the DOM
    const timer = setTimeout(handleExtensionAttributes, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}