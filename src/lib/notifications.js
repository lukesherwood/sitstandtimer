// Notification system for the sit/stand timer app

let notificationPermission = 'default'

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }
  
  if (Notification.permission === 'granted') {
    notificationPermission = 'granted'
    return true
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    notificationPermission = permission
    return permission === 'granted'
  }
  
  return false
}

// Check if notifications are supported and permitted
export function canShowNotifications() {
  return 'Notification' in window && Notification.permission === 'granted'
}

// Show browser notification
export function showNotification(title, options = {}) {
  if (!canShowNotifications()) {
    return null
  }
  
  const defaultOptions = {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'sit-stand-timer',
    renotify: true,
    ...options
  }
  
  return new Notification(title, defaultOptions)
}

// Show timer completion notification
export function showTimerNotification(timerType, nextTimer = null) {
  const messages = {
    sitting: {
      title: 'Time to Stand!',
      body: 'Your sitting timer is complete. Time to stand up and move around!'
    },
    standing: {
      title: 'Standing Timer Complete',
      body: nextTimer ? `Great job! ${nextTimer === 'walking' ? 'Time for a walk!' : 'Ready for the next timer?'}` : 'All timers complete!'
    },
    walking: {
      title: 'Walking Timer Complete',
      body: 'Nice work! You completed your walking break.'
    }
  }
  
  const message = messages[timerType] || { title: 'Timer Complete', body: 'Your timer has finished!' }
  
  return showNotification(message.title, {
    body: message.body,
    requireInteraction: true
  })
}

// Visual notification system
export function showVisualAlert(message, type = 'info', duration = 3000) {
  // Create visual alert element
  const alert = document.createElement('div')
  alert.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`
  
  // Style based on type
  const styles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white',
    timer: 'bg-teal-500 text-white'
  }
  
  alert.className += ` ${styles[type] || styles.info}`
  alert.textContent = message
  
  // Add close button
  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = '×'
  closeBtn.className = 'ml-4 text-xl font-bold opacity-70 hover:opacity-100'
  closeBtn.onclick = () => removeAlert(alert)
  alert.appendChild(closeBtn)
  
  // Add to page
  document.body.appendChild(alert)
  
  // Animate in
  setTimeout(() => {
    alert.classList.remove('translate-x-full')
  }, 10)
  
  // Auto remove
  setTimeout(() => {
    removeAlert(alert)
  }, duration)
  
  return alert
}

function removeAlert(alert) {
  if (alert && alert.parentNode) {
    alert.classList.add('translate-x-full')
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert)
      }
    }, 300)
  }
}

// Screen flash effect
export function flashScreen(color = 'rgba(34, 197, 94, 0.3)', duration = 500) {
  const flash = document.createElement('div')
  flash.className = 'fixed inset-0 z-50 pointer-events-none transition-opacity duration-150'
  flash.style.backgroundColor = color
  flash.style.opacity = '0'
  
  document.body.appendChild(flash)
  
  // Flash effect
  setTimeout(() => {
    flash.style.opacity = '1'
  }, 10)
  
  setTimeout(() => {
    flash.style.opacity = '0'
  }, duration / 2)
  
  setTimeout(() => {
    if (flash.parentNode) {
      flash.parentNode.removeChild(flash)
    }
  }, duration)
}

// Vibration for mobile devices
export function vibrate(pattern = [200, 100, 200]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

// Combined notification function
export function notifyTimerComplete(timerType, nextTimer, notificationSettings) {
  const { browser, audio, visual } = notificationSettings
  
  // Browser notification
  if (browser && canShowNotifications()) {
    showTimerNotification(timerType, nextTimer)
  }
  
  // Visual alerts
  if (visual) {
    const messages = {
      sitting: 'Time to stand up! 🧍‍♂️',
      standing: nextTimer ? `Standing complete! Time for ${nextTimer}` : 'Standing timer complete! 🎉',
      walking: 'Walking break complete! 🚶‍♂️'
    }
    
    showVisualAlert(messages[timerType] || 'Timer complete!', 'timer', 4000)
    flashScreen()
    vibrate()
  }
}