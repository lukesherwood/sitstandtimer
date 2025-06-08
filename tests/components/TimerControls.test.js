import { render, screen, fireEvent } from '@testing-library/svelte'
import TimerControls from '@/components/TimerControls.svelte'

  const defaultProps = {
    isPaused: false
  }

  it('renders all control buttons', () => {
    render(TimerControls, { props: defaultProps })
    
    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
    expect(screen.getByTestId('pause-resume-button')).toBeInTheDocument()
    expect(screen.getByTestId('new-timer-button')).toBeInTheDocument()
  })

  it('shows pause icon when timer is not paused', () => {
    render(TimerControls, { props: { isPaused: false } })
    
    const pauseButton = screen.getByTestId('pause-resume-button')
    const svg = pauseButton.querySelector('svg')
    const rects = svg.querySelectorAll('rect')
    
    expect(rects).toHaveLength(2)
  })

  it('shows play icon when timer is paused', () => {
    render(TimerControls, { props: { isPaused: true } })
    
    const resumeButton = screen.getByTestId('pause-resume-button')
    const svg = resumeButton.querySelector('svg')
    const polygon = svg.querySelector('polygon')
    
    expect(polygon).toBeInTheDocument()
    expect(polygon).toHaveAttribute('points', '5 3 19 12 5 21 5 3')
  })

  it('calls onreset callback when reset button is clicked', async () => {
    let resetFired = false
    const onreset = () => {
      resetFired = true
    }
    
    render(TimerControls, { props: { ...defaultProps, onreset } })
    
    const resetButton = screen.getByTestId('reset-button').querySelector('button')
    await fireEvent.click(resetButton)
    
    expect(resetFired).toBe(true)
  })

  it('calls onpauseResume callback when pause/resume button is clicked', async () => {
    let pauseResumeFired = false
    const onpauseResume = () => {
      pauseResumeFired = true
    }
    
    render(TimerControls, { props: { ...defaultProps, onpauseResume } })
    
    const pauseResumeButton = screen.getByTestId('pause-resume-button').querySelector('button')
    await fireEvent.click(pauseResumeButton)
    
    expect(pauseResumeFired).toBe(true)
  })

  it('calls onnewTimer callback when new timer button is clicked', async () => {
    let newTimerFired = false
    const onnewTimer = () => {
      newTimerFired = true
    }
    
    render(TimerControls, { props: { ...defaultProps, onnewTimer } })
    
    const newTimerButton = screen.getByTestId('new-timer-button').querySelector('button')
    await fireEvent.click(newTimerButton)
    
    expect(newTimerFired).toBe(true)
  })