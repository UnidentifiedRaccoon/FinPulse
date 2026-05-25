import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { AuthControls } from './AuthControls'

describe('AuthControls', () => {
  it('submits login credentials', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn().mockResolvedValue(undefined)

    render(
      <AuthControls
        error=""
        isBusy={false}
        onLogin={onLogin}
        onLogout={vi.fn()}
        onRegister={vi.fn()}
        user={null}
      />,
    )

    await user.type(screen.getByLabelText('Логин'), 'learner')
    await user.type(screen.getByLabelText('Пароль'), 'secure-passphrase')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(onLogin).toHaveBeenCalledWith('learner', 'secure-passphrase')
  })

  it('renders logout for an authenticated user', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn().mockResolvedValue(undefined)

    render(
      <AuthControls
        error=""
        isBusy={false}
        onLogin={vi.fn()}
        onLogout={onLogout}
        onRegister={vi.fn()}
        user={{ id: 'user-1', login: 'learner' }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
