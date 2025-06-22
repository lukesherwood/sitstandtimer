import { render, screen, fireEvent, within } from "@testing-library/svelte"
import SetTime from "@/components/SetTime.svelte"
import { updateSettings } from "@/stores/timerStore.js"

vi.mock("@/stores/timerStore.js", () => ({
  timerStore: {
    set: vi.fn(),
    update: vi.fn(),
    subscribe: vi.fn(() => () => {}) // Return unsubscribe function
  },
  updateSettings: vi.fn(),
  updatePreferences: vi.fn()
}))

vi.mock("@/lib/notifications.js", () => ({
  requestNotificationPermission: vi.fn(() => Promise.resolve(true))
}))

const testHelpers = {
  async expandCustomTimer() {
    const customTimerButton = screen.getByTestId("custom-timer-toggle-button")
    await fireEvent.click(customTimerButton)
  },

  async expandSettings() {
    const settingsButton = screen.getByTestId("settings-toggle-button")
    await fireEvent.click(settingsButton)
  },

  getTimerInputs() {
    return {
      sitting: {
        wrapper: screen.getByTestId("sitting-input"),
        input: within(screen.getByTestId("sitting-input")).getByTestId(
          "number-input"
        )
      },
      standing: {
        wrapper: screen.getByTestId("standing-input"),
        input: within(screen.getByTestId("standing-input")).getByTestId(
          "number-input"
        )
      },
      walking: {
        wrapper: screen.getByTestId("walking-input"),
        input: within(screen.getByTestId("walking-input")).getByTestId(
          "number-input"
        )
      }
    }
  },

  getStartButton() {
    const startWrapper = screen.getByTestId("start-timer-button")
    return within(startWrapper).getByTestId("button")
  },

  async setTimerValues(sitting, standing, walking) {
    await this.expandCustomTimer()
    const inputs = this.getTimerInputs()

    if (sitting)
      await fireEvent.input(inputs.sitting.input, {
        target: { value: sitting.toString() }
      })
    if (standing)
      await fireEvent.input(inputs.standing.input, {
        target: { value: standing.toString() }
      })
    if (walking)
      await fireEvent.input(inputs.walking.input, {
        target: { value: walking.toString() }
      })
  },

  async submitTimer() {
    const startButton = this.getStartButton()
    await fireEvent.click(startButton)
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

it("renders all timer input fields", async () => {
  render(SetTime)

  expect(screen.getByTestId("set-time")).toBeInTheDocument()

  await testHelpers.expandCustomTimer()

  expect(screen.getByTestId("sitting-input")).toBeInTheDocument()
  expect(screen.getByTestId("standing-input")).toBeInTheDocument()
  expect(screen.getByTestId("walking-input")).toBeInTheDocument()

  // Click to expand settings section to access the auto-transition checkbox
  await testHelpers.expandSettings()

  expect(screen.getByTestId("auto-transition-checkbox")).toBeInTheDocument()
})

it("start button is disabled when no times are set", () => {
  render(SetTime)

  const startWrapper = screen.getByTestId("start-timer-button")
  expect(startWrapper).toBeInTheDocument()
})

it("start button is enabled when at least one time is set", async () => {
  render(SetTime)

  await testHelpers.setTimerValues(30, null, null)

  const startWrapper = screen.getByTestId("start-timer-button")
  expect(startWrapper).toBeInTheDocument()
})

it("calls onstart callback when form is submitted", async () => {
  let startEventFired = false
  const onstart = () => {
    startEventFired = true
  }

  render(SetTime, { props: { onstart } })

  await testHelpers.setTimerValues(30, null, null)
  await testHelpers.submitTimer()

  expect(startEventFired).toBe(true)
})

it("updates timer store with correct values on submit", async () => {
  render(SetTime)

  await testHelpers.setTimerValues(30, 10, 5)
  await testHelpers.submitTimer()

  expect(updateSettings).toHaveBeenCalledWith(expect.any(Object))
})

it("starts with standing timer when sitting time is not set", async () => {
  render(SetTime)

  await testHelpers.setTimerValues(null, 15, 5)
  await testHelpers.submitTimer()

  expect(updateSettings).toHaveBeenCalledWith(expect.any(Object))
})

it("starts with walking timer when only walking time is set", async () => {
  render(SetTime)

  await testHelpers.setTimerValues(null, null, 5)
  await testHelpers.submitTimer()

  expect(updateSettings).toHaveBeenCalledWith(expect.any(Object))
})

it("includes autoTransition setting when checkbox is checked", async () => {
  render(SetTime)

  await testHelpers.expandCustomTimer()
  await testHelpers.expandSettings()

  const autoTransitionCheckbox = screen.getByTestId("auto-transition-checkbox")
  await fireEvent.click(autoTransitionCheckbox)

  const inputs = testHelpers.getTimerInputs()
  await fireEvent.input(inputs.sitting.input, { target: { value: "30" } })
  await testHelpers.submitTimer()

  expect(updateSettings).toHaveBeenCalledWith(expect.any(Object))
})

it("displays health tip information", () => {
  render(SetTime)

  expect(screen.getByText(/health tip/i)).toBeInTheDocument()
  expect(screen.getByText(/learn more/i)).toBeInTheDocument()
})

it("renders recommended timer buttons", () => {
  render(SetTime)

  expect(screen.getByTestId("recommended-40-15-5")).toBeInTheDocument()
  expect(screen.getByTestId("recommended-30-10-5")).toBeInTheDocument()
  expect(screen.getByTestId("recommended-20-10-5")).toBeInTheDocument()
})

it("starts timer immediately when recommended timer button is clicked", async () => {
  let startEventFired = false
  const onstart = () => {
    startEventFired = true
  }

  render(SetTime, { props: { onstart } })

  const recommendedButton = screen.getByTestId("recommended-40-15-5")
  await fireEvent.click(recommendedButton)

  expect(startEventFired).toBe(true)
  expect(updateSettings).toHaveBeenCalledWith(
    expect.objectContaining({
      currentTimer: "sitting",
      sittingTime: 40 * 60,
      standingTime: 15 * 60,
      walkingTime: 5 * 60,
      needsReset: true,
      allTimersComplete: false
    })
  )
})

it("different recommended buttons start with correct timer values", async () => {
  const onstart = vi.fn()

  render(SetTime, { props: { onstart } })

  const button30105 = screen.getByTestId("recommended-30-10-5")
  await fireEvent.click(button30105)

  expect(updateSettings).toHaveBeenCalledWith(
    expect.objectContaining({
      currentTimer: "sitting",
      sittingTime: 30 * 60,
      standingTime: 10 * 60,
      walkingTime: 5 * 60
    })
  )

  vi.clearAllMocks()

  const button20105 = screen.getByTestId("recommended-20-10-5")
  await fireEvent.click(button20105)

  expect(updateSettings).toHaveBeenCalledWith(
    expect.objectContaining({
      currentTimer: "sitting",
      sittingTime: 45 * 60,
      standingTime: 15 * 60,
      walkingTime: 0 * 60
    })
  )
})

it("hides custom timer inputs by default", () => {
  render(SetTime)

  expect(screen.queryByTestId("sitting-input")).not.toBeInTheDocument()
  expect(screen.queryByTestId("standing-input")).not.toBeInTheDocument()
  expect(screen.queryByTestId("walking-input")).not.toBeInTheDocument()
})

it("shows custom timer inputs when toggle is clicked", async () => {
  render(SetTime)

  await testHelpers.expandCustomTimer()

  expect(screen.getByTestId("sitting-input")).toBeInTheDocument()
  expect(screen.getByTestId("standing-input")).toBeInTheDocument()
  expect(screen.getByTestId("walking-input")).toBeInTheDocument()
})
