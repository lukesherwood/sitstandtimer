import { writable } from "svelte/store"

export const timerStore = writable({
  currentTimer: "sitting",
  sittingTime: 0,
  standingTime: 0,
  walkingTime: 0,
  needsReset: false,
  allTimersComplete: false,
  autoTransition: false
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
    if (nextTimer) {
      return {
        ...state,
        currentTimer: nextTimer,
        needsReset: true
      }
    } else {
      return {
        ...state,
        allTimersComplete: true,
        needsReset: false
      }
    }
  })
}

export function startNewTimer() {
  timerStore.set({
    currentTimer: "sitting",
    sittingTime: 0,
    standingTime: 0,
    walkingTime: 0,
    needsReset: false,
    allTimersComplete: false,
    autoTransition: false
  })
}
