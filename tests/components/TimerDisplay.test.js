import { render, screen } from "@testing-library/svelte"
import TimerDisplay from "@/components/TimerDisplay.svelte"

const defaultProps = {
  countdown: 1800,
  count: 1800,
  h: 0,
  m: 30,
  s: 0
}

it("renders the timer circle with correct structure", () => {
  render(TimerDisplay, { props: defaultProps })

  expect(screen.getByTestId("timer-circle")).toBeInTheDocument()
  // Check that accessibility text is provided
  expect(screen.getByText(/time remaining/i)).toBeInTheDocument()
})

it("displays time information correctly", () => {
  const propsMinutesOnly = {
    countdown: 125,
    count: 125,
    h: 0,
    m: 2,
    s: 5
  }

  render(TimerDisplay, { props: propsMinutesOnly })

  // Check that time display elements are present rather than specific text
  expect(screen.getByText(/02:05/)).toBeInTheDocument()
  expect(screen.getByText(/minutes : seconds/i)).toBeInTheDocument()
})

it("has proper SVG structure", () => {
  render(TimerDisplay, { props: defaultProps })

  const svg = screen.getByTestId("timer-circle")
  expect(svg).toBeInTheDocument()
  expect(svg.tagName.toLowerCase()).toBe("svg")
  expect(svg).toHaveAttribute("viewBox", "-50 -50 100 100")
  // Check that width and height are present (size may vary)
  expect(svg).toHaveAttribute("width")
  expect(svg).toHaveAttribute("height")
})
