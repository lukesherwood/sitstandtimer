import { render, screen, fireEvent } from "@testing-library/svelte"
import Main from "@/lib/Main.svelte"
import { timerStore, startNewTimer } from "@/stores/timerStore.js"

// Mock notifications
vi.mock("@/lib/notifications.js", () => ({
  requestNotificationPermission: vi.fn(() => Promise.resolve(true)),
  showVisualAlert: vi.fn()
}))

// Mock PWA
vi.mock("@/lib/pwa.js", () => ({
  initializePWA: vi.fn()
}))

beforeEach(() => {
  startNewTimer()
  // Clear any global window properties that might be set
  delete window.showVisualAlert

  // Mock Web Animations API for Svelte transitions
  Element.prototype.animate = vi.fn(() => ({
    finished: Promise.resolve(),
    cancel: vi.fn(),
    finish: vi.fn()
  }))
})

describe("Auto-Mode Completion Behavior", () => {
  it("should NOT return to SetTime automatically when all timers complete in auto-mode", async () => {
    render(Main)

    // Should start in SetTime component
    expect(screen.getByTestId("set-time")).toBeInTheDocument()

    // Manually simulate the completion state with auto-transition enabled
    // This tests the Main component logic directly
    timerStore.update((state) => ({
      ...state,
      currentTimer: "sitting",
      completedTimer: "sitting",
      sittingTime: 60,
      standingTime: 0,
      walkingTime: 0,
      autoTransition: true, // This is the key - auto-transition enabled
      allTimersComplete: true, // All timers are complete
      needsReset: false
    }))

    // Helper function to expand custom timer and set value
    const setTimerAndStart = async (value) => {
      const customTimerButton = screen.getByTestId("custom-timer-toggle-button")
      await fireEvent.click(customTimerButton)

      const sittingInput = screen
        .getByTestId("sitting-input")
        .querySelector("input")
      await fireEvent.input(sittingInput, { target: { value: value } })

      const startWrapper = screen.getByTestId("start-timer-button")
      const startButton = startWrapper.querySelector("button")
      await fireEvent.click(startButton)
    }

    // Simulate that a timer was started (showTimer should be true)
    await setTimerAndStart("1")

    // Should now be in Timer view
    expect(screen.getByTestId("timer")).toBeInTheDocument()

    // Now trigger the all-complete state while in auto-transition mode
    timerStore.update((state) => ({
      ...state,
      autoTransition: true,
      allTimersComplete: true,
      completedTimer: "sitting"
    }))

    await new Promise((resolve) => setTimeout(resolve, 50))

    // In auto-mode, should STAY in timer view showing completion
    // The Main component should NOT set showTimer = false because autoTransition is true
    expect(screen.getByTestId("timer")).toBeInTheDocument()
    expect(screen.queryByTestId("set-time")).not.toBeInTheDocument()
  })
})
