import { writable } from "svelte/store"

export const timerStore = writable({
  currentTimer: "sitting",
  sittingTime: "",
  standingTime: "",
  walkingTime: "",
  needsReset: false,
  allTimersComplete: false
})

export function resetTimer() {
  timerStore.update((state) => {
    state.needsReset = true
    return state
  })
}

function getNextTimer(state) {
  const timers = ["sitting", "standing", "walking"]
  const currentIndex = timers.indexOf(state.currentTimer)

  for (let i = currentIndex + 1; i < timers.length; i++) {
    if (state[`${timers[i]}Time`] > 0) {
      return timers[i]
    }
  }
  return null
}

export function completeCurrentTimer() {
  timerStore.update((state) => {
    const nextTimer = getNextTimer(state)
    if (nextTimer) {
      state.currentTimer = nextTimer
      state.needsReset = true
    } else {
      state.allTimersComplete = true
      state.needsReset = false
    }
    return state
  })
}
