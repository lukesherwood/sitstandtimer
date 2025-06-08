import { writable } from "svelte/store"

// Local storage helpers
function loadFromStorage() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sitstand-timer-data')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.warn('Failed to parse stored timer data:', e)
      }
    }
  }
  return null
}

function saveToStorage(data) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sitstand-timer-data', JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save timer data:', e)
    }
  }
}

// Default state
const defaultState = {
  currentTimer: "sitting",
  sittingTime: 0,
  standingTime: 0,
  walkingTime: 0,
  needsReset: false,
  allTimersComplete: false,
  autoTransition: true,
  notifications: {
    browser: false,
    audio: true,
    visual: true
  },
  preferences: {
    lastUsedSitting: 0,
    lastUsedStanding: 0,
    lastUsedWalking: 0,
    autoTransition: false
  },
  stats: {
    totalSessions: 0,
    totalSittingTime: 0,
    totalStandingTime: 0,
    totalWalkingTime: 0,
    lastUsed: null
  }
}

const initialState = {
  ...defaultState,
  ...loadFromStorage()
}

export const timerStore = writable(initialState)

timerStore.subscribe((state) => {
  const persistentData = {
    notifications: state.notifications,
    preferences: state.preferences,
    stats: state.stats
  }
  saveToStorage(persistentData)
})

export function resetTimer() {
  timerStore.update((state) => ({
    ...state,
    needsReset: true
  }))
}

function getNextTimer(state) {
  const timers = ["sitting", "standing", "walking"]
  const currentIndex = timers.indexOf(state.currentTimer)
  return (
    timers.find(
      (timer, index) => index > currentIndex && state[`${timer}Time`] > 0
    ) || null
  )
}

export function completeCurrentTimer() {
  timerStore.update((state) => {
    const nextTimer = getNextTimer(state)
    
    const timerType = state.currentTimer
    const timeCompleted = state[`${timerType}Time`]
    const updatedStats = {
      ...state.stats,
      [`total${timerType.charAt(0).toUpperCase() + timerType.slice(1)}Time`]: 
        state.stats[`total${timerType.charAt(0).toUpperCase() + timerType.slice(1)}Time`] + timeCompleted,
      lastUsed: new Date().toISOString()
    }
    
    if (nextTimer) {
      return {
        ...state,
        currentTimer: nextTimer,
        completedTimer: timerType,
        needsReset: true,
        stats: updatedStats
      }
    } else {
      return {
        ...state,
        completedTimer: timerType,
        allTimersComplete: true,
        needsReset: false,
        stats: {
          ...updatedStats,
          totalSessions: updatedStats.totalSessions + 1
        }
      }
    }
  })
}

export function startNewTimer() {
  timerStore.update((state) => ({
    currentTimer: "sitting",
    completedTimer: null,
    sittingTime: 0,
    standingTime: 0,
    walkingTime: 0,
    needsReset: false,
    allTimersComplete: false,
    autoTransition: state.preferences.autoTransition,
    notifications: state.notifications,
    preferences: state.preferences,
    stats: state.stats
  }))
}

export function updateNotificationSettings(settings) {
  timerStore.update((state) => ({
    ...state,
    notifications: { ...state.notifications, ...settings }
  }))
}

export function updatePreferences(prefs) {
  timerStore.update((state) => ({
    ...state,
    preferences: { ...state.preferences, ...prefs }
  }))
}

export function saveLastUsedTimes(sitting, standing, walking) {
  timerStore.update((state) => ({
    ...state,
    preferences: {
      ...state.preferences,
      lastUsedSitting: sitting,
      lastUsedStanding: standing,
      lastUsedWalking: walking
    }
  }))
}
