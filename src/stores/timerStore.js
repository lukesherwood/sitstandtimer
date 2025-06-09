import { writable } from "svelte/store"

// Local storage helpers
function loadFromStorage() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sitstand-timer-data")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.warn("Failed to parse stored timer data:", e)
      }
    }
  }
  return null
}

function saveToStorage(data) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("sitstand-timer-data", JSON.stringify(data))
    } catch (e) {
      console.warn("Failed to save timer data:", e)
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
  completedTimer: null,
  autoTransition: false,
  notifications: {
    browser: false,
    audio: true,
    visual: true
  },
  preferences: {
    lastUsedSitting: 0,
    lastUsedStanding: 0,
    lastUsedWalking: 0
  },
  stats: {
    totalSessions: 0,
    totalSittingTime: 0,
    totalStandingTime: 0,
    totalWalkingTime: 0,
    lastUsed: null
  }
}

function createInitialState() {
  const stored = loadFromStorage()
  return {
    ...defaultState,
    autoTransition: stored?.preferences?.autoTransition ?? false,
    notifications: { ...defaultState.notifications, ...stored?.notifications },
    preferences: { ...defaultState.preferences, ...stored?.preferences },
    stats: { ...defaultState.stats, ...stored?.stats }
  }
}

const initialState = createInitialState()

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
  timerStore.update((state) => ({ ...state, needsReset: true }))
}

const TIMERS = ["sitting", "standing", "walking"]

function getNextTimer(state) {
  const currentIndex = TIMERS.indexOf(state.currentTimer)
  return (
    TIMERS.find(
      (timer, index) => index > currentIndex && state[`${timer}Time`] > 0
    ) || null
  )
}

export function completeCurrentTimer() {
  timerStore.update((state) => {
    const nextTimer = getNextTimer(state)
    const timerType = state.currentTimer
    const statKey = `total${timerType.charAt(0).toUpperCase() + timerType.slice(1)}Time`

    const baseUpdate = {
      ...state,
      completedTimer: timerType,
      stats: {
        ...state.stats,
        [statKey]: state.stats[statKey] + state[`${timerType}Time`],
        lastUsed: new Date().toISOString()
      }
    }

    if (nextTimer) {
      return { ...baseUpdate, currentTimer: nextTimer, needsReset: true }
    }

    return {
      ...baseUpdate,
      allTimersComplete: true,
      stats: {
        ...baseUpdate.stats,
        totalSessions: baseUpdate.stats.totalSessions + 1
      }
    }
  })
}

export function startNewTimer() {
  timerStore.update((state) => ({
    ...state,
    currentTimer: "sitting",
    completedTimer: null,
    sittingTime: 0,
    standingTime: 0,
    walkingTime: 0,
    needsReset: false,
    allTimersComplete: false
  }))
}

export function updateSettings(updates) {
  timerStore.update((state) => ({ ...state, ...updates }))
}

export function updatePreferences(prefs) {
  timerStore.update((state) => ({
    ...state,
    preferences: { ...state.preferences, ...prefs }
  }))
}
