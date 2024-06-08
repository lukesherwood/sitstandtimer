import { writable } from 'svelte/store';

export const timerStore = writable({
  currentTimer: 'sitting',
  sittingTime: 60,  // 1 minute
  standingTime: 60, // 1 minute
  walkingTime: 60,  // 1 minute
  needsReset: false,
  allTimersComplete: false,
});

export function resetTimer() {
  timerStore.update(state => {
    state.needsReset = true;
    return state;
  });
}

export function completeCurrentTimer() {
  timerStore.update(state => {
    if (state.currentTimer === 'sitting') {
      if (state.standingTime > 0) {
        state.currentTimer = 'standing';
        state.needsReset = true;
      } else if (state.walkingTime > 0) {
        state.currentTimer = 'walking';
        state.needsReset = true;
      } else {
        state.allTimersComplete = true;
        state.needsReset = false;
      }
    } else if (state.currentTimer === 'standing') {
      if (state.walkingTime > 0) {
        state.currentTimer = 'walking';
        state.needsReset = true;
      } else {
        state.allTimersComplete = true;
        state.needsReset = false;
      }
    } else if (state.currentTimer === 'walking') {
      state.allTimersComplete = true;
      state.needsReset = false;
    }
    return state;
  });
}
