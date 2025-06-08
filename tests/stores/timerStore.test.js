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

  describe('Timer Completion Flow Scenarios', () => {
    describe('Single Timer Scenarios', () => {
      it('shows sitting complete when only sitting timer finishes', () => {
        // Setup: sitting timer only
        timerStore.update(state => ({
          ...state,
          currentTimer: "sitting",
          sittingTime: 60,
          standingTime: 0,
          walkingTime: 0
        }))

        completeCurrentTimer()
        const state = get(timerStore)
        
        expect(state.completedTimer).toBe("sitting")
        expect(state.allTimersComplete).toBe(true)
      })

      it('shows standing complete when only standing timer finishes', () => {
        // Setup: standing timer only
        timerStore.update(state => ({
          ...state,
          currentTimer: "standing",
          sittingTime: 0,
          standingTime: 60,
          walkingTime: 0
        }))

        completeCurrentTimer()
        const state = get(timerStore)
        
        expect(state.completedTimer).toBe("standing")
        expect(state.allTimersComplete).toBe(true)
      })
    })

    describe('Two Timer Scenarios', () => {
      it('sitting then standing: shows sitting complete first, standing complete last', () => {
        // Setup: sitting and standing timers
        timerStore.update(state => ({
          ...state,
          currentTimer: "sitting",
          sittingTime: 60,
          standingTime: 60,
          walkingTime: 0
        }))

        // Complete sitting timer
        completeCurrentTimer()
        let state = get(timerStore)
        
        expect(state.completedTimer).toBe("sitting")
        expect(state.currentTimer).toBe("standing")
        expect(state.allTimersComplete).toBe(false) // Key test: should NOT be complete yet

        // Complete standing timer
        completeCurrentTimer()
        state = get(timerStore)

        expect(state.completedTimer).toBe("standing")
        expect(state.allTimersComplete).toBe(true) // NOW it should be complete
      })

      it('sitting then walking: shows sitting complete first, walking complete last', () => {
        // Setup: sitting and walking timers
        timerStore.update(state => ({
          ...state,
          currentTimer: "sitting",
          sittingTime: 60,
          standingTime: 0,
          walkingTime: 60
        }))

        // Complete sitting timer
        completeCurrentTimer()
        let state = get(timerStore)
        
        expect(state.completedTimer).toBe("sitting")
        expect(state.currentTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(false) // Should NOT be complete yet

        // Complete walking timer
        completeCurrentTimer()
        state = get(timerStore)

        expect(state.completedTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(true) // NOW it should be complete
      })

      it('standing then walking: shows standing complete first, walking complete last', () => {
        // Setup: standing and walking timers (no sitting)
        timerStore.update(state => ({
          ...state,
          currentTimer: "standing",
          sittingTime: 0,
          standingTime: 60,
          walkingTime: 60
        }))

        // Complete standing timer
        completeCurrentTimer()
        let state = get(timerStore)
        
        expect(state.completedTimer).toBe("standing")
        expect(state.currentTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(false) // Should NOT be complete yet

        // Complete walking timer
        completeCurrentTimer()
        state = get(timerStore)

        expect(state.completedTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(true) // NOW it should be complete
      })
    })

    describe('Three Timer Scenarios', () => {
      it('sitting -> standing -> walking: shows correct completion sequence', () => {
        // Setup: all three timers
        timerStore.update(state => ({
          ...state,
          currentTimer: "sitting",
          sittingTime: 60,
          standingTime: 60,
          walkingTime: 60
        }))

        // Complete sitting timer
        completeCurrentTimer()
        let state = get(timerStore)
        
        expect(state.completedTimer).toBe("sitting")
        expect(state.currentTimer).toBe("standing")
        expect(state.allTimersComplete).toBe(false) // Should NOT be complete yet

        // Complete standing timer
        completeCurrentTimer()
        state = get(timerStore)

        expect(state.completedTimer).toBe("standing") 
        expect(state.currentTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(false) // STILL should NOT be complete yet

        // Complete walking timer (final)
        completeCurrentTimer()
        state = get(timerStore)

        expect(state.completedTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(true) // NOW it should be complete
      })
    })

    describe('Edge Cases', () => {
      it('handles zero-time timers correctly', () => {
        // Setup: sitting and walking only (standing = 0)
        timerStore.update(state => ({
          ...state,
          currentTimer: "sitting",
          sittingTime: 60,
          standingTime: 0, // This should be skipped
          walkingTime: 60
        }))

        // Complete sitting timer
        completeCurrentTimer()
        let state = get(timerStore)
        
        expect(state.completedTimer).toBe("sitting")
        expect(state.currentTimer).toBe("walking") // Should skip standing
        expect(state.allTimersComplete).toBe(false)

        // Complete walking timer (final)
        completeCurrentTimer()
        state = get(timerStore)

        expect(state.completedTimer).toBe("walking")
        expect(state.allTimersComplete).toBe(true)
      })
    })
  })

  describe('All Timers Completed Functionality', () => {
    it('should show all-complete state after final timer in auto-transition mode', () => {
      // Setup: 2-timer sequence with auto-transition enabled
      timerStore.update(state => ({
        ...state,
        currentTimer: "standing", // Final timer
        completedTimer: "sitting", // Previous timer was completed
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 0,
        autoTransition: true,
        allTimersComplete: false
      }))

      // Complete the final timer (standing)
      completeCurrentTimer()
      const state = get(timerStore)

      // Should be in all-complete state
      expect(state.completedTimer).toBe("standing")
      expect(state.allTimersComplete).toBe(true)
      expect(state.needsReset).toBe(false) // No more timers to reset to
      
      // Auto-transition mode shouldn't affect the completion state
      expect(state.autoTransition).toBe(true)
    })

    it('should show all-complete state after final timer in manual mode', () => {
      // Setup: 2-timer sequence with auto-transition disabled
      timerStore.update(state => ({
        ...state,
        currentTimer: "walking", // Final timer
        completedTimer: "standing", // Previous timer was completed
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60,
        autoTransition: false,
        allTimersComplete: false
      }))

      // Complete the final timer (walking)
      completeCurrentTimer()
      const state = get(timerStore)

      // Should be in all-complete state
      expect(state.completedTimer).toBe("walking")
      expect(state.allTimersComplete).toBe(true)
      expect(state.needsReset).toBe(false) // No more timers to reset to
      
      // Manual mode shouldn't affect the completion state
      expect(state.autoTransition).toBe(false)
    })

    it('should maintain completedTimer info when all timers are complete', () => {
      // This test ensures the UI can show "Walking Timer Complete!" even when allTimersComplete = true
      
      // Setup: single walking timer (simulate completion of sitting/standing already)
      timerStore.update(state => ({
        ...state,
        currentTimer: "walking",
        sittingTime: 0,
        standingTime: 0,
        walkingTime: 60,
        autoTransition: false
      }))

      // Complete the walking timer
      completeCurrentTimer()
      const state = get(timerStore)

      // Should preserve both completion info AND all-complete status
      expect(state.completedTimer).toBe("walking")
      expect(state.allTimersComplete).toBe(true)
      
      // This allows the UI to show both:
      // 1. "Walking Timer Complete!" message (from completedTimer)
      // 2. "All Timers Complete!" celebration (from allTimersComplete + isLastTimer)
    })

    it('should handle session stats correctly when all timers complete', () => {
      // Setup: complete sequence of timers
      timerStore.update(state => ({
        ...state,
        currentTimer: "sitting",
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60,
        stats: {
          totalSittingTime: 0,
          totalStandingTime: 0,
          totalWalkingTime: 0,
          totalSessions: 0,
          lastUsed: null
        }
      }))

      // Complete sitting
      completeCurrentTimer()
      let state = get(timerStore)
      expect(state.allTimersComplete).toBe(false)
      expect(state.stats.totalSessions).toBe(0) // Session not complete yet

      // Complete standing  
      completeCurrentTimer()
      state = get(timerStore)
      expect(state.allTimersComplete).toBe(false)
      expect(state.stats.totalSessions).toBe(0) // Session still not complete

      // Complete walking (final timer)
      completeCurrentTimer()
      state = get(timerStore)
      
      expect(state.allTimersComplete).toBe(true)
      expect(state.stats.totalSessions).toBe(1) // Session should increment when all complete
      expect(state.stats.totalSittingTime).toBe(60)
      expect(state.stats.totalStandingTime).toBe(60)
      expect(state.stats.totalWalkingTime).toBe(60)
      expect(state.stats.lastUsed).toBeTruthy()
    })
  })
})