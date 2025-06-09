import { render, screen, fireEvent } from "@testing-library/svelte"
import Main from "@/lib/Main.svelte"
import {
  timerStore,
  startNewTimer,
  completeCurrentTimer
} from "@/stores/timerStore.js"

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

    // Simulate that a timer was started (showTimer should be true)
    const sittingInput = screen
      .getByTestId("sitting-input")
      .querySelector("input")
    await fireEvent.input(sittingInput, { target: { value: "1" } })

    const startWrapper = screen.getByTestId("start-timer-button")
    const startButton = startWrapper.querySelector("button")
    await fireEvent.click(startButton)

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

  it("should return to SetTime only when user clicks New Timer button in auto-mode", async () => {
    render(Main)

    // Set single timer
    const sittingInput = screen
      .getByTestId("sitting-input")
      .querySelector("input")
    await fireEvent.input(sittingInput, { target: { value: "1" } })

    // Enable auto-transition
    const settingsButton = screen.getByTestId("settings-toggle-button")
    await fireEvent.click(settingsButton)
    const autoTransitionCheckbox = screen.getByTestId(
      "auto-transition-checkbox"
    )
    await fireEvent.click(autoTransitionCheckbox)

    // Start and complete timer
    const startWrapper = screen.getByTestId("start-timer-button")
    const startButton = startWrapper.querySelector("button")
    await fireEvent.click(startButton)

    completeCurrentTimer()
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Should be showing completion in timer view
    expect(screen.getByTestId("timer")).toBeInTheDocument()
    expect(screen.getByTestId("all-complete-message")).toBeInTheDocument()

    // User clicks "Start New Session" button
    const resetAllWrapper = screen.getByTestId("reset-all-button")
    const resetAllButton = resetAllWrapper.querySelector("button")
    await fireEvent.click(resetAllButton)

    // Wait for transition
    await new Promise((resolve) => setTimeout(resolve, 50))

    // NOW should return to SetTime component
    expect(screen.getByTestId("set-time")).toBeInTheDocument()
    expect(screen.queryByTestId("timer")).not.toBeInTheDocument()
  })

  it("should show timer display with completion message indefinitely in auto-mode", async () => {
    render(Main)

    // Set single timer and enable auto-transition
    const sittingInput = screen
      .getByTestId("sitting-input")
      .querySelector("input")
    await fireEvent.input(sittingInput, { target: { value: "1" } })

    const settingsButton = screen.getByTestId("settings-toggle-button")
    await fireEvent.click(settingsButton)
    const autoTransitionCheckbox = screen.getByTestId(
      "auto-transition-checkbox"
    )
    await fireEvent.click(autoTransitionCheckbox)

    // Start timer
    const startWrapper = screen.getByTestId("start-timer-button")
    const startButton = startWrapper.querySelector("button")
    await fireEvent.click(startButton)

    // Should now be in Timer view
    expect(screen.getByTestId("timer")).toBeInTheDocument()

    // Complete timer and ensure auto-transition is true and all timers complete
    completeCurrentTimer()

    // Update store to match expected state after completion
    timerStore.update((state) => ({
      ...state,
      autoTransition: true,
      allTimersComplete: true,
      completedTimer: "sitting"
    }))

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Should show timer interface with completion
    expect(screen.getByTestId("timer")).toBeInTheDocument()
    expect(screen.getByTestId("all-complete-message")).toBeInTheDocument()

    // Should also show timer display (countdown area)
    expect(screen.getByTestId("timer-circle")).toBeInTheDocument()

    // Wait longer to ensure it doesn't auto-transition
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Should STILL be in timer view
    expect(screen.getByTestId("timer")).toBeInTheDocument()
    expect(screen.queryByTestId("set-time")).not.toBeInTheDocument()
  })
})
