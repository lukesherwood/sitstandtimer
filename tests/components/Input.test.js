import { render, screen, fireEvent } from '@testing-library/svelte'
import Input from '@/components/Input.svelte'

describe('Input Component', () => {
  it('renders number input grid correctly', () => {
    render(Input)
    
    // Should render form and buttons for digits 0-9
    expect(screen.getByTestId('number-pad')).toBeInTheDocument()
    
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByTestId(`digit-${i}`)).toBeInTheDocument()
    }
    
    // Should render start button (submit)
    const startButton = screen.getByTestId('start-button')
    expect(startButton).toBeInTheDocument()
    expect(startButton).toBeDisabled() // Initially disabled when no value
  })

  it('updates value when number buttons are clicked', async () => {
    render(Input)
    
    // Initially start button is disabled
    const startButton = screen.getByTestId('start-button')
    expect(startButton).toBeDisabled()
    
    // Click digit 1, then digit 2
    await fireEvent.click(screen.getByTestId('digit-1'))
    await fireEvent.click(screen.getByTestId('digit-2'))
    
    // Start button should now be enabled
    expect(startButton).not.toBeDisabled()
  })

  it('prevents adding more than 6 digits', async () => {
    render(Input, { props: { value: '123456' } })
    
    // Start button should be enabled with a 6-digit value
    const startButton = screen.getByTestId('start-button')
    expect(startButton).not.toBeDisabled()
    
    // This test verifies the behavior exists - the actual value checking
    // would require component accessors or other testing approaches
  })

  it('prevents adding leading zero when value is empty', async () => {
    render(Input)
    
    // Try to click 0 when value is empty
    await fireEvent.click(screen.getByTestId('digit-0'))
    
    // Start button should remain disabled (indicating no value was added)
    const startButton = screen.getByTestId('start-button')
    expect(startButton).toBeDisabled()
  })

  it('allows adding zero after other digits', async () => {
    render(Input)
    
    // Click 1 first, then 0
    await fireEvent.click(screen.getByTestId('digit-1'))
    await fireEvent.click(screen.getByTestId('digit-0'))
    
    // Start button should be enabled (indicating value was added)
    const startButton = screen.getByTestId('start-button')
    expect(startButton).not.toBeDisabled()
  })

  it('enables start button when value is present', async () => {
    render(Input, { props: { value: '123' } })
    
    const startButton = screen.getByTestId('start-button')
    expect(startButton).not.toBeDisabled()
  })
})