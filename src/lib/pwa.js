// PWA utilities and service worker registration

let deferredPrompt

// Register service worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers not supported")
    return null
  }

  try {
    // Check if we're in a secure context
    if (!window.isSecureContext) {
      console.warn("Service Worker requires secure context (HTTPS)")
      return null
    }

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none"
    })

    console.log("Service Worker registered:", registration)

    // Handle service worker updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("New service worker available")
            // Optionally notify user about update
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

// Handle PWA install prompt
export function handleInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    try {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      deferredPrompt = e
      // Show install button or notification
      showInstallPrompt()
    } catch (error) {
      console.error("Error handling install prompt:", error)
    }
  })

  // Handle any errors that might occur
  window.addEventListener("error", (e) => {
    if (e.message && e.message.includes("beforeinstallprompt")) {
      console.error("PWA install prompt error:", e)
    }
  })
}

// Show install prompt to user
function showInstallPrompt() {
  // Don't show if already exists
  if (document.getElementById("install-banner")) {
    return
  }

  try {
    // Create install notification
    const installBanner = document.createElement("div")
    installBanner.id = "install-banner"
    installBanner.className =
      "fixed bottom-4 left-4 right-4 bg-teal-600 text-white p-4 rounded-lg shadow-lg z-50 flex justify-between items-center"

    // Create elements safely
    const contentDiv = document.createElement("div")
    const titleElement = document.createElement("strong")
    titleElement.textContent = "Install Sit Stand Timer"
    const descElement = document.createElement("p")
    descElement.className = "text-sm"
    descElement.textContent = "Add to your home screen for a better experience!"
    contentDiv.appendChild(titleElement)
    contentDiv.appendChild(descElement)

    const buttonDiv = document.createElement("div")
    buttonDiv.className = "flex gap-2"

    const installButton = document.createElement("button")
    installButton.id = "install-button"
    installButton.className =
      "bg-white text-teal-600 px-3 py-1 rounded font-medium"
    installButton.textContent = "Install"

    const dismissButton = document.createElement("button")
    dismissButton.id = "dismiss-install"
    dismissButton.className = "text-white opacity-75 hover:opacity-100"
    dismissButton.textContent = "×"

    buttonDiv.appendChild(installButton)
    buttonDiv.appendChild(dismissButton)

    installBanner.appendChild(contentDiv)
    installBanner.appendChild(buttonDiv)

    document.body.appendChild(installBanner)

    // Handle install button click with error handling
    installButton.addEventListener("click", async () => {
      try {
        if (deferredPrompt) {
          await deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          console.log(`User choice: ${outcome}`)
          deferredPrompt = null
        }
      } catch (error) {
        console.error("Install prompt failed:", error)
      } finally {
        removeBanner()
      }
    })

    // Handle dismiss button
    dismissButton.addEventListener("click", () => {
      removeBanner()
    })

    // Function to safely remove banner
    function removeBanner() {
      try {
        const banner = document.getElementById("install-banner")
        if (banner && banner.parentNode) {
          banner.parentNode.removeChild(banner)
        }
      } catch (error) {
        console.error("Error removing install banner:", error)
      }
    }

    // Auto-hide after 10 seconds
    setTimeout(removeBanner, 10000)
  } catch (error) {
    console.error("Error creating install prompt:", error)
  }
}

// Check if app is running in standalone mode
export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  )
}

// Handle app install event
export function handleAppInstalled() {
  window.addEventListener("appinstalled", () => {
    console.log("App installed successfully")
    // Hide install prompt if visible
    const installBanner = document.getElementById("install-banner")
    if (installBanner) {
      installBanner.remove()
    }

    // Show success message
    if (window.showVisualAlert) {
      window.showVisualAlert("App installed successfully! 🎉", "success")
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
    document.body.classList.add("pwa-mode")
  }

  // Handle online/offline status
  window.addEventListener("online", () => {
    console.log("App is online")
    if (window.showVisualAlert) {
      window.showVisualAlert("Connection restored", "success", 2000)
    }
  })

  window.addEventListener("offline", () => {
    console.log("App is offline")
    if (window.showVisualAlert) {
      window.showVisualAlert(
        "App is offline - some features may be limited",
        "warning",
        5000
      )
    }
  })
}
