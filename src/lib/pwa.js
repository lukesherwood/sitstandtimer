// PWA initialization with careful error handling to avoid conflicts
export function initializePWA() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Wait for page to be fully loaded to avoid conflicts with Vite
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePWA);
    return;
  }

  try {
    registerServiceWorker();
  } catch (error) {
    console.warn('PWA initialization failed:', error);
  }
}

async function registerServiceWorker() {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  try {
    // Wait a bit to avoid conflicts with development tools
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('Service Worker registered successfully:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is available
            console.log('New service worker available');
            showUpdateAvailable();
          }
        });
      }
    });

  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

function showUpdateAvailable() {
  // Simple update notification - you can customize this
  if (confirm('A new version of the app is available. Reload to update?')) {
    window.location.reload();
  }
}

// Listen for service worker messages
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('Cache updated');
    }
  });
}