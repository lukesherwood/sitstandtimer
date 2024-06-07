import { writable } from "svelte/store"

export const times = writable({
  sittingTime: null,
  standingTime: null,
  walkingTime: null,
  customTime: null,
  quickSetTime: null
})
