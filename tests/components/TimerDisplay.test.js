import { render, screen } from '@testing-library/svelte'
import TimerDisplay from '@/components/TimerDisplay.svelte'

describe('TimerDisplay Component', () => {
  const defaultProps = {
    countdown: 1800,
    count: 1800,
    h: 0,
    m: 30,
    s: 0
  }

  it('renders the timer circle with correct structure', () => {
    render(TimerDisplay, { props: defaultProps })
    
    expect(screen.getByTestId('timer-circle')).toBeInTheDocument()
    expect(screen.getByTitle('Remaining seconds: 1800')).toBeInTheDocument()
  })

  it('displays the correct time format for minutes and seconds', () => {
    const propsMinutesOnly = {
      countdown: 125,
      count: 125,
      h: 0,
      m: 2,
      s: 5
    }
    
    render(TimerDisplay, { props: propsMinutesOnly })
    
    const circle = screen.getByTestId('timer-circle')
    expect(circle).toHaveTextContent('02')
    expect(circle).toHaveTextContent('05')
    expect(circle).toHaveTextContent('m')
    expect(circle).toHaveTextContent('s')
  })

  it('has proper SVG structure', () => {
    render(TimerDisplay, { props: defaultProps })
    
    const svg = screen.getByTestId('timer-circle')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg).toHaveAttribute('viewBox', '-50 -50 100 100')
    expect(svg).toHaveAttribute('width', '250')
    expect(svg).toHaveAttribute('height', '250')
  })
})