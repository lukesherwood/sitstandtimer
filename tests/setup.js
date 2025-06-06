import * as matchers from '@testing-library/jest-dom/matchers'

// Extend expect with jest-dom matchers
expect.extend(matchers)

// Mock Audio for timer tests since jsdom doesn't support it
global.Audio = class MockAudio {
  constructor() {
    this.play = vi.fn()
    this.pause = vi.fn()
    this.load = vi.fn()
  }
}

// Mock timer functions are automatically available with vi.useFakeTimers()
// We'll use real timers for the store tests since they don't need time manipulation

// Clean up after each test
afterEach(() => {
  vi.clearAllTimers()
  vi.clearAllMocks()
})