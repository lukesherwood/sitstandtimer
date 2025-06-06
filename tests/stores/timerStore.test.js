import { get } from 'svelte/store'
import { timerStore, resetTimer, completeCurrentTimer, startNewTimer } from '@/stores/timerStore.js'

describe('Timer Store', () => {
  beforeEach(() => {
    // Reset to initial state before each test
    startNewTimer()
  })

  it('should initialize with default state', () => {
    const state = get(timerStore)
    expect(state.currentTimer).toBe('sitting')
    expect(state.sittingTime).toBe(0)
    expect(state.standingTime).toBe(0)
    expect(state.walkingTime).toBe(0)
    expect(state.needsReset).toBe(false)
    expect(state.allTimersComplete).toBe(false)
    expect(state.autoTransition).toBe(false)
  })

  it('should set needsReset to true when resetTimer is called', () => {
    resetTimer()
    const state = get(timerStore)
    expect(state.needsReset).toBe(true)
  })

  it('should move to next timer when completeCurrentTimer is called', () => {
    // Set up timers with sitting and standing having time
    timerStore.update(state => ({
      ...state,
      sittingTime: 300,
      standingTime: 180,
      walkingTime: 0
    }))

    completeCurrentTimer()
    const state = get(timerStore)
    expect(state.currentTimer).toBe('standing')
    expect(state.needsReset).toBe(true)
  })

  it('should mark all timers complete when no next timer exists', () => {
    // Set up with only sitting timer having time
    timerStore.update(state => ({
      ...state,
      currentTimer: 'sitting',
      sittingTime: 300,
      standingTime: 0,
      walkingTime: 0
    }))

    completeCurrentTimer()
    const state = get(timerStore)
    expect(state.allTimersComplete).toBe(true)
    expect(state.needsReset).toBe(false)
  })

  it('should reset all state when startNewTimer is called', () => {
    // Modify state first
    timerStore.update(state => ({
      ...state,
      currentTimer: 'standing',
      sittingTime: 300,
      standingTime: 180,
      allTimersComplete: true,
      needsReset: true
    }))

    startNewTimer()
    const state = get(timerStore)
    expect(state.currentTimer).toBe('sitting')
    expect(state.sittingTime).toBe(0)
    expect(state.standingTime).toBe(0)
    expect(state.walkingTime).toBe(0)
    expect(state.needsReset).toBe(false)
    expect(state.allTimersComplete).toBe(false)
    expect(state.autoTransition).toBe(false)
  })
})