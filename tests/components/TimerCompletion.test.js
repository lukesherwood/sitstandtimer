import { render, screen, fireEvent } from "@testing-library/svelte"
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
    expect(
      screen.getByText("Well done, all timers completed. Start again?")
    ).toBeInTheDocument()
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

    const resetAllButton = screen
      .getByTestId("reset-all-button")
      .querySelector("button")
    await fireEvent.click(resetAllButton)

    expect(resetAllFired).toBe(true)
  })
})

describe("when timer is not the last timer", () => {
  it("shows timer completion message for sitting timer", () => {
    render(TimerCompletion, {
      props: {
        timerState: { ...defaultTimerState, currentTimer: "sitting" },
        isLastTimer: false
      }
    })

    expect(screen.getByTestId("timer-complete-message")).toBeInTheDocument()
    expect(screen.getByText("Sitting Timer Complete!")).toBeInTheDocument()
    expect(screen.getByText("Time to stand up and move!")).toBeInTheDocument()
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
      screen.getByText("Automatically moving to next timer...")
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

    const nextTimerButton = screen
      .getByTestId("next-timer-button")
      .querySelector("button")
    await fireEvent.click(nextTimerButton)

    expect(nextTimerFired).toBe(true)
  })
})
