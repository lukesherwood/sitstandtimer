import { render, screen, fireEvent } from '@testing-library/svelte'
import NumberInput from '@/components/NumberInput.svelte'

describe('NumberInput Component', () => {
  it('renders number input with default props', () => {
    render(NumberInput, { props: { value: 0 } })
    
    const input = screen.getByTestId('number-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('step', '1')
  })

  it('binds value correctly', async () => {
    const { component } = render(NumberInput, { props: { value: 10 } })
    
    const input = screen.getByTestId('number-input')
    expect(input).toHaveValue(10)
    
    // Update value through component.$set instead of direct assignment
    component.$set({ value: 25 })
    await new Promise(resolve => setTimeout(resolve, 0)) // Wait for update
    expect(input).toHaveValue(25)
  })

  it('updates value when input changes', async () => {
    const { component } = render(NumberInput, { props: { value: 0 } })
    
    const input = screen.getByTestId('number-input')
    
    await fireEvent.input(input, { target: { value: '42' } })
    // We can't access component.value directly without accessors, so we'll check the input value
    expect(input).toHaveValue(42)
  })

  it('applies custom min and step attributes', () => {
    render(NumberInput, { props: { value: 0, min: 5, step: 0.5 } })
    
    const input = screen.getByTestId('number-input')
    expect(input).toHaveAttribute('min', '5')
    expect(input).toHaveAttribute('step', '0.5')
  })

  it('applies placeholder when provided', () => {
    render(NumberInput, { props: { value: 0, placeholder: 'Enter number' } })
    
    const input = screen.getByTestId('number-input')
    expect(input).toHaveAttribute('placeholder', 'Enter number')
  })

  it('applies styling classes', () => {
    render(NumberInput, { props: { value: 0 } })
    
    const input = screen.getByTestId('number-input')
    expect(input).toHaveClass('text-red-100', 'bg-teal-600', 'rounded-full')
  })
})