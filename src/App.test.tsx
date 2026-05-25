import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders the program overview', () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'FinPulse Foundations' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Start here/i })).toBeTruthy()
  })

  it('renders a lesson route', () => {
    window.history.pushState({}, '', '/lessons/welcome-to-finpulse')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Welcome to FinPulse' })).toBeTruthy()
    expect(screen.getByText(/Read first, expand later/i)).toBeTruthy()
  })
})
