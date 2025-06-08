import { render, screen, fireEvent, within } from "@testing-library/svelte"
import TimerCompletion from "@/components/TimerCompletion.svelte"

const defaultTimerState = {
  currentTimer: "sitting",
  autoTransition: false
}

describe("when timer is the last timer", () => {
  it("shows all timers complete message", () => {
    render(TimerCompletion, {
      props: {
        timerState: defaultTimerState,
        isLastTimer: true
      }
    })

    expect(screen.getByTestId("all-complete-message")).toBeInTheDocument()
    expect(screen.getByText(/congratulations/i)).toBeInTheDocument()
  })

  it("shows reset all button when last timer is complete", () => {
    render(TimerCompletion, {
      props: {
        timerState: defaultTimerState,
        isLastTimer: true
      }
    })

    expect(screen.getByTestId("reset-all-button")).toBeInTheDocument()
  })

  it("calls onresetAll callback when reset all button is clicked", async () => {
    let resetAllFired = false
    const onresetAll = () => {
      resetAllFired = true
    }

    render(TimerCompletion, {
      props: {
        timerState: defaultTimerState,
        isLastTimer: true,
        onresetAll
      }
    })

    const resetAllWrapper = screen.getByTestId("reset-all-button")
    const resetAllButton = within(resetAllWrapper).getByTestId("button")
    await fireEvent.click(resetAllButton)

    expect(resetAllFired).toBe(true)
  })
})

describe("when timer is not the last timer", () => {
  it("shows timer completion message for sitting timer", () => {
    render(TimerCompletion, {
      props: {
        timerState: { ...defaultTimerState, completedTimer: "sitting" },
        isLastTimer: false
      }
    })

    expect(screen.getByTestId("timer-complete-message")).toBeInTheDocument()
    expect(screen.getByText(/sitting timer complete/i)).toBeInTheDocument()
  })

  it("shows next timer button when autoTransition is disabled", () => {
    render(TimerCompletion, {
      props: {
        timerState: { ...defaultTimerState, autoTransition: false },
        isLastTimer: false
      }
    })

    expect(screen.getByTestId("next-timer-button")).toBeInTheDocument()
  })

  it("hides next timer button when autoTransition is enabled", () => {
    render(TimerCompletion, {
      props: {
        timerState: { ...defaultTimerState, autoTransition: true },
        isLastTimer: false
      }
    })

    expect(screen.queryByTestId("next-timer-button")).not.toBeInTheDocument()
  })

  it("shows auto transition message when autoTransition is enabled", () => {
    render(TimerCompletion, {
      props: {
        timerState: { ...defaultTimerState, autoTransition: true },
        isLastTimer: false
      }
    })

    expect(
      screen.getByText(/automatically/i)
    ).toBeInTheDocument()
  })

  it("calls onnextTimer callback when next timer button is clicked", async () => {
    let nextTimerFired = false
    const onnextTimer = () => {
      nextTimerFired = true
    }

    render(TimerCompletion, {
      props: {
        timerState: { ...defaultTimerState, autoTransition: false },
        isLastTimer: false,
        onnextTimer
      }
    })

    const nextTimerWrapper = screen.getByTestId("next-timer-button")
    const nextTimerButton = within(nextTimerWrapper).getByTestId("button")
    await fireEvent.click(nextTimerButton)

    expect(nextTimerFired).toBe(true)
  })

  describe("isLastTimer Logic Testing", () => {
    it("isLastTimer should be false when completedTimer=sitting and walking still exists", () => {
      // Setup state after sitting timer completed in a 3-timer sequence
      const timerState = {
        currentTimer: "standing",
        completedTimer: "sitting", 
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60, // Walking still exists
        allTimersComplete: false,
        autoTransition: false
      }

      // Manually calculate isLastTimer using the same logic as the component
      const timerToCheck = timerState.completedTimer || timerState.currentTimer // should be "sitting"
      const timers = ["sitting", "standing", "walking"]
      const currentIndex = timers.indexOf(timerToCheck) // index 0 for "sitting"
      const isLastTimer = !timers.find(
        (timer, index) => index > currentIndex && timerState[`${timer}Time`] > 0
      )
      
      // This should be FALSE because standing (index 1) and walking (index 2) exist
      expect(isLastTimer).toBe(false)

      // Render TimerCompletion with isLastTimer = false
      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: false,
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should show individual completion, not all-complete
      expect(screen.queryByTestId("all-complete-message")).not.toBeInTheDocument()
      expect(screen.getByTestId("timer-complete-message")).toBeInTheDocument()
      expect(screen.getByText(/sitting timer complete/i)).toBeInTheDocument()
    })

    it("isLastTimer should be false when completedTimer=standing and walking still exists", () => {
      // Setup state after standing timer completed in a 3-timer sequence  
      const timerState = {
        currentTimer: "walking",
        completedTimer: "standing",
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60, // Walking still exists
        allTimersComplete: false,
        autoTransition: false
      }

      // Calculate isLastTimer using fixed logic
      const timerToCheck = timerState.completedTimer || timerState.currentTimer // should be "standing"
      const timers = ["sitting", "standing", "walking"]
      const currentIndex = timers.indexOf(timerToCheck) // index 1 for "standing"
      const isLastTimer = !timers.find(
        (timer, index) => index > currentIndex && timerState[`${timer}Time`] > 0
      )
      
      // This should be FALSE because walking (index 2) still exists
      expect(isLastTimer).toBe(false)

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: false,
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should show individual completion, not all-complete
      expect(screen.queryByTestId("all-complete-message")).not.toBeInTheDocument()
      expect(screen.getByTestId("timer-complete-message")).toBeInTheDocument()
      expect(screen.getByText(/standing timer complete/i)).toBeInTheDocument()
    })

    it("isLastTimer should be true when completedTimer=walking (final timer)", () => {
      // Setup state after walking timer completed (final timer)
      const timerState = {
        currentTimer: "walking", // doesn't matter since all are complete
        completedTimer: "walking",
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60,
        allTimersComplete: true,
        autoTransition: false
      }

      // Calculate isLastTimer using fixed logic
      const timerToCheck = timerState.completedTimer || timerState.currentTimer // should be "walking"
      const timers = ["sitting", "standing", "walking"]
      const currentIndex = timers.indexOf(timerToCheck) // index 2 for "walking"
      const isLastTimer = !timers.find(
        (timer, index) => index > currentIndex && timerState[`${timer}Time`] > 0
      )
      
      // This should be TRUE because no timers exist after walking
      expect(isLastTimer).toBe(true)

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: true,
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should show all-complete message
      expect(screen.getByTestId("all-complete-message")).toBeInTheDocument()
      expect(screen.queryByTestId("timer-complete-message")).not.toBeInTheDocument()
    })

    it("reproduces bug: 2-timer sequence incorrectly shows all-complete after first", () => {
      // This reproduces the exact bug: sitting+standing sequence shows all-complete after sitting
      
      // OLD (buggy) logic: uses currentTimer instead of completedTimer
      const timerState = {
        currentTimer: "standing", // This is what the buggy logic was checking
        completedTimer: "sitting", // This is what it SHOULD check
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 0, // No walking timer
        allTimersComplete: false,
        autoTransition: false
      }

      // OLD BUGGY LOGIC (what was happening before the fix)
      const buggyTimerToCheck = timerState.currentTimer // "standing"
      const timers = ["sitting", "standing", "walking"]
      const buggyCurrentIndex = timers.indexOf(buggyTimerToCheck) // index 1 for "standing"
      const buggyIsLastTimer = !timers.find(
        (timer, index) => index > buggyCurrentIndex && timerState[`${timer}Time`] > 0
      )
      // This would be TRUE because no timers exist after "standing" - WRONG!
      expect(buggyIsLastTimer).toBe(true)

      // FIXED LOGIC (what should happen after the fix)
      const fixedTimerToCheck = timerState.completedTimer || timerState.currentTimer // "sitting"
      const fixedCurrentIndex = timers.indexOf(fixedTimerToCheck) // index 0 for "sitting"
      const fixedIsLastTimer = !timers.find(
        (timer, index) => index > fixedCurrentIndex && timerState[`${timer}Time`] > 0
      )
      // This should be FALSE because "standing" (index 1) still exists - CORRECT!
      expect(fixedIsLastTimer).toBe(false)

      // Test the fixed behavior
      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: fixedIsLastTimer, // Should be false
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should show individual completion, not all-complete
      expect(screen.queryByTestId("all-complete-message")).not.toBeInTheDocument()
      expect(screen.getByTestId("timer-complete-message")).toBeInTheDocument()
      expect(screen.getByText(/sitting timer complete/i)).toBeInTheDocument()
    })
  })

  describe("All Timers Completed Display", () => {
    it("shows all-complete message when isLastTimer=true and allTimersComplete=true", () => {
      const timerState = {
        currentTimer: "walking",
        completedTimer: "walking", // Final timer just completed
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60,
        allTimersComplete: true,
        autoTransition: false
      }

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: true, // This is the last timer
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should show all-complete message
      expect(screen.getByTestId("all-complete-message")).toBeInTheDocument()
      expect(screen.getByText(/congratulations/i)).toBeInTheDocument()
      expect(screen.getByText(/completed all your movement timers/i)).toBeInTheDocument()
      
      // Should NOT show individual timer completion
      expect(screen.queryByTestId("timer-complete-message")).not.toBeInTheDocument()
      
      // Should show reset all button
      expect(screen.getByTestId("reset-all-button")).toBeInTheDocument()
    })

    it("shows all-complete message in auto-transition mode", () => {
      const timerState = {
        currentTimer: "standing",
        completedTimer: "standing", // Final timer just completed
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 0, // Only 2 timers
        allTimersComplete: true,
        autoTransition: true // Auto-transition enabled
      }

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: true,
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should show all-complete message regardless of auto-transition mode
      expect(screen.getByTestId("all-complete-message")).toBeInTheDocument()
      expect(screen.getByText(/congratulations/i)).toBeInTheDocument()
      
      // Should show reset all button (even in auto mode, user needs option to restart)
      expect(screen.getByTestId("reset-all-button")).toBeInTheDocument()
    })

    it("shows correct celebration content in all-complete state", () => {
      const timerState = {
        currentTimer: "sitting",
        completedTimer: "sitting", // Single timer completed
        sittingTime: 60,
        standingTime: 0,
        walkingTime: 0,
        allTimersComplete: true,
        autoTransition: false
      }

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: true,
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Check for celebration elements
      expect(screen.getByText("🎉")).toBeInTheDocument() // Celebration emoji
      expect(screen.getByText(/congratulations/i)).toBeInTheDocument()
      expect(screen.getByText(/well done/i)).toBeInTheDocument()
      
      // Check button text
      expect(screen.getByText(/start new session/i)).toBeInTheDocument()
    })

    it("calls onresetAll when reset all button is clicked in all-complete state", async () => {
      let resetAllCalled = false
      const onresetAll = () => {
        resetAllCalled = true
      }

      const timerState = {
        currentTimer: "walking",
        completedTimer: "walking",
        sittingTime: 60,
        standingTime: 60,
        walkingTime: 60,
        allTimersComplete: true,
        autoTransition: false
      }

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: true,
          onresetAll,
          onnextTimer: () => {}
        }
      })

      const resetAllWrapper = screen.getByTestId("reset-all-button")
      const resetAllButton = within(resetAllWrapper).getByTestId("button")
      await fireEvent.click(resetAllButton)

      expect(resetAllCalled).toBe(true)
    })

    it("does not show next timer button when all timers are complete", () => {
      const timerState = {
        currentTimer: "walking",
        completedTimer: "walking",
        sittingTime: 60,
        standingTime: 60, 
        walkingTime: 60,
        allTimersComplete: true,
        autoTransition: false // Even in manual mode, no next timer when all complete
      }

      render(TimerCompletion, {
        props: {
          timerState,
          isLastTimer: true,
          onresetAll: () => {},
          onnextTimer: () => {}
        }
      })

      // Should NOT show next timer button since all are complete
      expect(screen.queryByTestId("next-timer-button")).not.toBeInTheDocument()
      
      // Should show reset all button instead
      expect(screen.getByTestId("reset-all-button")).toBeInTheDocument()
    })
  })
})
