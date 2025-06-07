// PWA utilities and service worker registration

let deferredPrompt

// Register service worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  } else {
    console.warn('Service Workers not supported')
    return null
  }
}

// Handle PWA install prompt
export function handleInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Save the event so it can be triggered later
    deferredPrompt = e
    // Show install button or notification
    showInstallPrompt()
  })
}

// Show install prompt to user
function showInstallPrompt() {
  // Create install notification
  const installBanner = document.createElement('div')
  installBanner.id = 'install-banner'
  installBanner.className = 'fixed bottom-4 left-4 right-4 bg-teal-600 text-white p-4 rounded-lg shadow-lg z-50 flex justify-between items-center'
  installBanner.innerHTML = `
    <div>
      <strong>Install Sit Stand Timer</strong>
      <p class="text-sm">Add to your home screen for a better experience!</p>
    </div>
    <div class="flex gap-2">
      <button id="install-button" class="bg-white text-teal-600 px-3 py-1 rounded font-medium">Install</button>
      <button id="dismiss-install" class="text-white opacity-75 hover:opacity-100">×</button>
    </div>
  `
  
  document.body.appendChild(installBanner)
  
  // Handle install button click
  document.getElementById('install-button')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User choice: ${outcome}`)
      deferredPrompt = null
    }
    installBanner.remove()
  })
  
  // Handle dismiss button
  document.getElementById('dismiss-install')?.addEventListener('click', () => {
    installBanner.remove()
  })
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.getElementById('install-banner')) {
      installBanner.remove()
    }
  }, 10000)
}

// Check if app is running in standalone mode
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://')
}

// Handle app install event
export function handleAppInstalled() {
  window.addEventListener('appinstalled', () => {
    console.log('App installed successfully')
    // Hide install prompt if visible
    const installBanner = document.getElementById('install-banner')
    if (installBanner) {
      installBanner.remove()
    }
    
    // Show success message
    if (window.showVisualAlert) {
      window.showVisualAlert('App installed successfully! 🎉', 'success')
    }
  })
}

// Initialize PWA features
export function initializePWA() {
  registerServiceWorker()
  handleInstallPrompt()
  handleAppInstalled()
  
  // Add PWA class to body if running as PWA
  if (isStandalone()) {
    document.body.classList.add('pwa-mode')
  }
  
  // Handle online/offline status
  window.addEventListener('online', () => {
    console.log('App is online')
    if (window.showVisualAlert) {
      window.showVisualAlert('Connection restored', 'success', 2000)
    }
  })
  
  window.addEventListener('offline', () => {
    console.log('App is offline')
    if (window.showVisualAlert) {
      window.showVisualAlert('App is offline - some features may be limited', 'warning', 5000)
    }
  })
}