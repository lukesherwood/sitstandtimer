import { render, screen, fireEvent } from "@testing-library/svelte"
import SetTime from "@/components/SetTime.svelte"
import { timerStore } from "@/stores/timerStore.js"

vi.mock("@/stores/timerStore.js", () => ({
  timerStore: {
    set: vi.fn()
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
})

it("renders all timer input fields", () => {
  render(SetTime)

  expect(screen.getByTestId("set-time")).toBeInTheDocument()
  expect(screen.getByTestId("sitting-input")).toBeInTheDocument()
  expect(screen.getByTestId("standing-input")).toBeInTheDocument()
  expect(screen.getByTestId("walking-input")).toBeInTheDocument()
  expect(screen.getByTestId("auto-transition-checkbox")).toBeInTheDocument()
})

it("start button is disabled when no times are set", () => {
  render(SetTime)

  const startButton = screen.getByTestId("start-timer-button")
  expect(startButton).toBeInTheDocument()
})

it("start button is enabled when at least one time is set", async () => {
  render(SetTime)

  const sittingWrapper = screen.getByTestId("sitting-input")
  const sittingInput = sittingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  await fireEvent.input(sittingInput, { target: { value: "30" } })

  const startButton = screen.getByTestId("start-timer-button")
  expect(startButton).toBeInTheDocument()
})

it("dispatches start event when form is submitted", async () => {
  const { component } = render(SetTime)

  let startEventFired = false
  component.$on("start", () => {
    startEventFired = true
  })

  const sittingWrapper = screen.getByTestId("sitting-input")
  const sittingInput = sittingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  await fireEvent.input(sittingInput, { target: { value: "30" } })

  const startButtonWrapper = screen.getByTestId("start-timer-button")
  const startButton = startButtonWrapper.querySelector("button")
  await fireEvent.click(startButton)

  expect(startEventFired).toBe(true)
})

it("updates timer store with correct values on submit", async () => {
  render(SetTime)

  const sittingWrapper = screen.getByTestId("sitting-input")
  const standingWrapper = screen.getByTestId("standing-input")
  const walkingWrapper = screen.getByTestId("walking-input")

  const sittingInput = sittingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  const standingInput = standingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  const walkingInput = walkingWrapper.querySelector(
    '[data-testid="number-input"]'
  )

  await fireEvent.input(sittingInput, { target: { value: "30" } })
  await fireEvent.input(standingInput, { target: { value: "10" } })
  await fireEvent.input(walkingInput, { target: { value: "5" } })

  const startButtonWrapper = screen.getByTestId("start-timer-button")
  const startButton = startButtonWrapper.querySelector("button")
  await fireEvent.click(startButton)

  expect(timerStore.set).toHaveBeenCalledWith({
    currentTimer: "sitting",
    sittingTime: 1800, // 30 * 60
    standingTime: 600, // 10 * 60
    walkingTime: 300, // 5 * 60
    needsReset: true,
    allTimersComplete: false,
    autoTransition: false
  })
})

it("starts with standing timer when sitting time is not set", async () => {
  render(SetTime)

  const standingWrapper = screen.getByTestId("standing-input")
  const walkingWrapper = screen.getByTestId("walking-input")
  const standingInput = standingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  const walkingInput = walkingWrapper.querySelector(
    '[data-testid="number-input"]'
  )

  await fireEvent.input(standingInput, { target: { value: "15" } })
  await fireEvent.input(walkingInput, { target: { value: "5" } })

  const startButtonWrapper = screen.getByTestId("start-timer-button")
  const startButton = startButtonWrapper.querySelector("button")
  await fireEvent.click(startButton)

  expect(timerStore.set).toHaveBeenCalledWith(
    expect.objectContaining({
      currentTimer: "standing"
    })
  )
})

it("starts with walking timer when only walking time is set", async () => {
  render(SetTime)

  const walkingWrapper = screen.getByTestId("walking-input")
  const walkingInput = walkingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  await fireEvent.input(walkingInput, { target: { value: "5" } })

  const startButtonWrapper = screen.getByTestId("start-timer-button")
  const startButton = startButtonWrapper.querySelector("button")
  await fireEvent.click(startButton)

  expect(timerStore.set).toHaveBeenCalledWith(
    expect.objectContaining({
      currentTimer: "walking"
    })
  )
})

it("includes autoTransition setting when checkbox is checked", async () => {
  render(SetTime)

  const autoTransitionCheckbox = screen.getByTestId("auto-transition-checkbox")
  await fireEvent.click(autoTransitionCheckbox)

  const sittingWrapper = screen.getByTestId("sitting-input")
  const sittingInput = sittingWrapper.querySelector(
    '[data-testid="number-input"]'
  )
  await fireEvent.input(sittingInput, { target: { value: "30" } })

  const startButtonWrapper = screen.getByTestId("start-timer-button")
  const startButton = startButtonWrapper.querySelector("button")
  await fireEvent.click(startButton)

  expect(timerStore.set).toHaveBeenCalledWith(
    expect.objectContaining({
      autoTransition: true
    })
  )
})

it("displays helpful recommendation text", () => {
  render(SetTime)

  expect(
    screen.getByText(
      /recommended that you get up and stand at least every 50 minutes/i
    )
  ).toBeInTheDocument()
})
