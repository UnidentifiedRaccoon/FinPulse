import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders the real program overview', () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'FinPulse' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Финансовые цели/i })).toBeTruthy()
  })

  it('renders module units', () => {
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Финансовые цели' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Ваши базовые ценности/i })).toBeTruthy()
  })

  it('renders a lesson with cards', () => {
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByText(/Два человека хотят/i)).toBeTruthy()
  })

  it('renders checklist cards in the reader flow', () => {
    window.history.pushState({}, '', '/lessons/practice-1m')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Практика 1M$' })).toBeTruthy()
    expect(screen.getByText('Чеклист · 31')).toBeTruthy()
    expect(screen.getByText(/Хочу много денег/)).toBeTruthy()
  })
})
