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

it("displays correct timer title with duration", () => {
  render(Timer, { props: { timerState: defaultTimerState } })

  expect(screen.getByText(/sitting timer \(30 minutes\)/i)).toBeInTheDocument()
})

it("dispatches newTimer event when new timer button is clicked", async () => {
  const { component } = render(Timer, {
    props: { timerState: defaultTimerState }
  })

  let newTimerFired = false
  component.$on("newTimer", () => {
    newTimerFired = true
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
