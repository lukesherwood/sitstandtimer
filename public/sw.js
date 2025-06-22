// Service Worker for Sit Stand Timer PWA

const CACHE_NAME = 'sit-stand-timer-v1'
const urlsToCache = [
  '/',
  '/about',
  '/favicon.svg',
  '/alarm.wav',
  // Add other static assets as needed
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        // Try to cache each resource individually to avoid complete failure
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error)
              return null
            })
          )
        )
      })
      .catch((error) => {
        console.error('Failed to open cache:', error)
      })
  )
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle navigation requests (PWA routing)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          
          // For navigation requests, try to fetch from network
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful navigation responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone()
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
                  .catch((error) => {
                    console.warn('Failed to cache navigation response:', error)
                  })
              }
              return networkResponse
            })
            .catch((error) => {
              console.error('Navigation fetch failed:', error)
              // If we're offline and trying to navigate to /about, serve from cache
              if (url.pathname === '/about') {
                return caches.match('/about')
              }
              // Otherwise serve the home page from cache as fallback
              return caches.match('/')
            })
        })
    )
    return
  }

  // Handle other requests (assets, etc.)
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request)
      })
      .catch((error) => {
        console.error('Fetch failed:', error)
        throw error
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim()
    })
  )
})

// Background sync for timer persistence
self.addEventListener('sync', (event) => {
  if (event.tag === 'timer-sync') {
    event.waitUntil(
      // Sync timer data if needed
      console.log('Background sync triggered for timer data')
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

// Handle push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Timer notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'sit-stand-timer',
    requireInteraction: true
  }
  
  event.waitUntil(
    self.registration.showNotification('Sit Stand Timer', options)
  )
})