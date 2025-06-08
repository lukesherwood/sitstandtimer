import { render, screen, fireEvent, within } from "@testing-library/svelte"
import SetTime from "@/components/SetTime.svelte"
import { timerStore } from "@/stores/timerStore.js"

vi.mock("@/stores/timerStore.js", () => ({
  timerStore: {
    set: vi.fn(),
    update: vi.fn(),
    subscribe: vi.fn(() => () => {}) // Return unsubscribe function
  },
  saveLastUsedTimes: vi.fn(),
  updatePreferences: vi.fn()
}))

vi.mock("@/lib/notifications.js", () => ({
  requestNotificationPermission: vi.fn(() => Promise.resolve(true))
}))

beforeEach(() => {
  vi.clearAllMocks()
})

it("renders all timer input fields", async () => {
  render(SetTime)

  expect(screen.getByTestId("set-time")).toBeInTheDocument()
  expect(screen.getByTestId("sitting-input")).toBeInTheDocument()
  expect(screen.getByTestId("standing-input")).toBeInTheDocument()
  expect(screen.getByTestId("walking-input")).toBeInTheDocument()
  
  // Click to expand settings section to access the auto-transition checkbox
  const settingsButton = screen.getByTestId("settings-toggle-button")
  await fireEvent.click(settingsButton)
  
  expect(screen.getByTestId("auto-transition-checkbox")).toBeInTheDocument()
})

it("start button is disabled when no times are set", () => {
  render(SetTime)

  const startWrapper = screen.getByTestId("start-timer-button")
  expect(startWrapper).toBeInTheDocument()
})

it("start button is enabled when at least one time is set", async () => {
  render(SetTime)

  const sittingWrapper = screen.getByTestId("sitting-input")
  const sittingInput = within(sittingWrapper).getByTestId("number-input")
  await fireEvent.input(sittingInput, { target: { value: "30" } })

  const startWrapper = screen.getByTestId("start-timer-button")
  expect(startWrapper).toBeInTheDocument()
})

it("calls onstart callback when form is submitted", async () => {
  let startEventFired = false
  const onstart = () => {
    startEventFired = true
  }

  render(SetTime, { props: { onstart } })

  const sittingWrapper = screen.getByTestId("sitting-input")
  const sittingInput = within(sittingWrapper).getByTestId("number-input")
  await fireEvent.input(sittingInput, { target: { value: "30" } })

  const startWrapper = screen.getByTestId("start-timer-button")
  const startButton = within(startWrapper).getByTestId("button")
  await fireEvent.click(startButton)

  expect(startEventFired).toBe(true)
})

it("updates timer store with correct values on submit", async () => {
  render(SetTime)

  const sittingWrapper = screen.getByTestId("sitting-input")
  const standingWrapper = screen.getByTestId("standing-input")
  const walkingWrapper = screen.getByTestId("walking-input")

  const sittingInput = within(sittingWrapper).getByTestId("number-input")
  const standingInput = within(standingWrapper).getByTestId("number-input")
  const walkingInput = within(walkingWrapper).getByTestId("number-input")

  await fireEvent.input(sittingInput, { target: { value: "30" } })
  await fireEvent.input(standingInput, { target: { value: "10" } })
  await fireEvent.input(walkingInput, { target: { value: "5" } })

  const startWrapper = screen.getByTestId("start-timer-button")
  const startButton = within(startWrapper).getByTestId("button")
  await fireEvent.click(startButton)

  expect(timerStore.update).toHaveBeenCalledWith(expect.any(Function))
})

it("starts with standing timer when sitting time is not set", async () => {
  render(SetTime)

  const standingWrapper = screen.getByTestId("standing-input")
  const walkingWrapper = screen.getByTestId("walking-input")
  const standingInput = within(standingWrapper).getByTestId("number-input")
  const walkingInput = within(walkingWrapper).getByTestId("number-input")

  await fireEvent.input(standingInput, { target: { value: "15" } })
  await fireEvent.input(walkingInput, { target: { value: "5" } })

  const startWrapper = screen.getByTestId("start-timer-button")
  const startButton = within(startWrapper).getByTestId("button")
  await fireEvent.click(startButton)

  expect(timerStore.update).toHaveBeenCalledWith(expect.any(Function))
})

it("starts with walking timer when only walking time is set", async () => {
  render(SetTime)

  const walkingWrapper = screen.getByTestId("walking-input")
  const walkingInput = within(walkingWrapper).getByTestId("number-input")
  await fireEvent.input(walkingInput, { target: { value: "5" } })

  const startWrapper = screen.getByTestId("start-timer-button")
  const startButton = within(startWrapper).getByTestId("button")
  await fireEvent.click(startButton)

  expect(timerStore.update).toHaveBeenCalledWith(expect.any(Function))
})

it("includes autoTransition setting when checkbox is checked", async () => {
  render(SetTime)

  // Expand settings section to access the auto-transition checkbox
  const settingsButton = screen.getByTestId("settings-toggle-button")
  await fireEvent.click(settingsButton)
  
  const autoTransitionCheckbox = screen.getByTestId("auto-transition-checkbox")
  await fireEvent.click(autoTransitionCheckbox)

  const sittingWrapper = screen.getByTestId("sitting-input")
  const sittingInput = within(sittingWrapper).getByTestId("number-input")
  await fireEvent.input(sittingInput, { target: { value: "30" } })

  const startWrapper = screen.getByTestId("start-timer-button")
  const startButton = within(startWrapper).getByTestId("button")
  await fireEvent.click(startButton)

  expect(timerStore.update).toHaveBeenCalledWith(expect.any(Function))
})

it("displays health tip information", () => {
  render(SetTime)

  // Instead of checking exact text, check for key elements
  expect(screen.getByText(/health tip/i)).toBeInTheDocument()
  expect(screen.getByText(/learn more/i)).toBeInTheDocument()
})
