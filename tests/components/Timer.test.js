import { render, screen, fireEvent } from "@testing-library/svelte"
import Timer from "@/components/Timer.svelte"

vi.mock("@/lib/notifications.js", () => ({
  notifyTimerComplete: vi.fn()
}))

const defaultTimerState = {
  currentTimer: "sitting",
  sittingTime: 1800,
  standingTime: 600,
  walkingTime: 300,
  needsReset: false,
  allTimersComplete: false,
  autoTransition: false
}
it("renders all sub-components correctly", () => {
  render(Timer, { props: { timerState: defaultTimerState } })

  expect(screen.getByTestId("timer")).toBeInTheDocument()
  expect(screen.getByTestId("timer-title")).toBeInTheDocument()
  expect(screen.getByTestId("timer-audio")).toBeInTheDocument()
  expect(screen.getByTestId("timer-circle")).toBeInTheDocument()
  expect(screen.getByTestId("reset-button")).toBeInTheDocument()
  expect(screen.getByTestId("pause-resume-button")).toBeInTheDocument()
  expect(screen.getByTestId("new-timer-button")).toBeInTheDocument()
})

it("displays correct timer title and info", () => {
  render(Timer, { props: { timerState: defaultTimerState } })

  const title = screen.getByTestId("timer-title")
  expect(title).toBeInTheDocument()
  expect(title).toHaveTextContent(/sitting timer/i)
  expect(screen.getByText("30 minutes total")).toBeInTheDocument()
})

it("calls onnewTimer callback when new timer button is clicked", async () => {
  let newTimerFired = false
  const onnewTimer = () => {
    newTimerFired = true
  }

  render(Timer, {
    props: { timerState: defaultTimerState, onnewTimer }
  })

  const newTimerButton = screen
    .getByTestId("new-timer-button")
    .querySelector("button")
  await fireEvent.click(newTimerButton)

  expect(newTimerFired).toBe(true)
})

it("works without timerState prop (uses store)", () => {
  render(Timer)

  expect(screen.getByTestId("timer")).toBeInTheDocument()
  expect(screen.getByTestId("timer-title")).toBeInTheDocument()
})

it("reset button works when timer is paused", async () => {
  const resetState = {
    ...defaultTimerState,
    sittingTime: 10, // 10 seconds for easier testing
    needsReset: false
  }

  render(Timer, { props: { timerState: resetState } })

  await new Promise(resolve => setTimeout(resolve, 1200))

  const pauseButton = screen.getByTestId("pause-resume-button").querySelector("button")
  await fireEvent.click(pauseButton)

  const pauseButtonAfterPause = screen.getByTestId("pause-resume-button")
  const svg = pauseButtonAfterPause.querySelector("svg")
  const polygon = svg.querySelector("polygon")
  expect(polygon).toBeInTheDocument()

  const timerDisplayBefore = screen.getByText(/\d{2}:\d{2}/)
  expect(timerDisplayBefore.textContent).not.toBe("00:10")

  const resetButton = screen.getByTestId("reset-button").querySelector("button")
  await fireEvent.click(resetButton)

  await new Promise(resolve => setTimeout(resolve, 100))

  const timerDisplayAfter = screen.getByText(/\d{2}:\d{2}/)
  expect(timerDisplayAfter.textContent).toBe("00:10")
  
  const pauseButtonAfterReset = screen.getByTestId("pause-resume-button")
  const svgAfterReset = pauseButtonAfterReset.querySelector("svg")
  const polygonAfterReset = svgAfterReset.querySelector("polygon")
  expect(polygonAfterReset).toBeInTheDocument()
  
  expect(pauseButtonAfterReset.textContent).toContain("Resume")

  await new Promise(resolve => setTimeout(resolve, 500))
  const timerDisplayFinal = screen.getByText(/\d{2}:\d{2}/)
  expect(timerDisplayFinal.textContent).toBe("00:10")
})
