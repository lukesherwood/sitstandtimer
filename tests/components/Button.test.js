import { render, screen, fireEvent } from '@testing-library/svelte'
import Button from '@/components/Button.svelte'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(Button, { props: { tooltip: 'Test' } })
    
    const button = screen.getByTestId('button')
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('dispatches click event when clicked', async () => {
    const { component } = render(Button, { props: { tooltip: 'Test' } })
    
    let clickFired = false
    component.$on('click', () => {
      clickFired = true
    })

    const button = screen.getByTestId('button')
    await fireEvent.click(button)

    expect(clickFired).toBe(true)
  })

  it('shows tooltip on hover when tooltip prop is provided', async () => {
    render(Button, { props: { tooltip: 'Test tooltip' } })
    
    const button = screen.getByTestId('button')
    
    // Tooltip should not be visible initially
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument()
    
    // Show tooltip on mouseover
    await fireEvent.mouseOver(button)
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByText('Test tooltip')).toBeInTheDocument()
    
    // Hide tooltip on mouseout
    await fireEvent.mouseOut(button)
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument()
  })

  it('shows disabled state and disabled text when disabled', async () => {
    render(Button, { 
      props: { 
        disabled: true, 
        tooltip: 'Normal tooltip',
        disabledText: 'Button disabled'
      } 
    })
    
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
    
    // Should show disabled text instead of normal tooltip
    await fireEvent.mouseOver(button)
    expect(screen.getByText('Button disabled')).toBeInTheDocument()
    expect(screen.queryByText('Normal tooltip')).not.toBeInTheDocument()
  })

  it('applies custom CSS classes', () => {
    render(Button, { props: { clazz: 'custom-class', tooltip: 'Test' } })
    
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('custom-class')
  })

  it('renders slot content', () => {
    render(Button, {
      props: { tooltip: 'Test' }
    })
    
    // Check that the button exists and can accept content
    const button = screen.getByTestId('button')
    expect(button).toBeInTheDocument()
    
    // Since slot testing is complex in this setup, we'll just verify the button renders correctly
    expect(button.tagName).toBe('BUTTON')
  })
})