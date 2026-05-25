import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import type { ApiUser } from '@/api/client'
import { Button } from '@/components/ui/button'

export type AuthControlsProps = {
  user: ApiUser | null
  isBusy: boolean
  error: string
  onLogin: (login: string, password: string) => Promise<void>
  onRegister: (login: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
}

export function AuthControls({ user, isBusy, error, onLogin, onRegister, onLogout }: AuthControlsProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">{user.login}</span>
        <Button disabled={isBusy} onClick={onLogout} size="sm" type="button" variant="outline">
          <LogOut data-icon="inline-start" />
          Выйти
        </Button>
      </div>
    )
  }

  const submit = (action: 'login' | 'register') => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (action === 'login') {
      await onLogin(login, password)
      return
    }

    await onRegister(login, password)
  }

  return (
    <form className="flex w-full flex-col gap-2 sm:w-auto" onSubmit={submit('login')}>
      <div className="grid grid-cols-2 gap-2">
        <label className="sr-only" htmlFor="auth-login">
          Логин
        </label>
        <input
          autoComplete="username"
          className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="auth-login"
          onChange={(event) => setLogin(event.target.value)}
          placeholder="login"
          value={login}
        />
        <label className="sr-only" htmlFor="auth-password">
          Пароль
        </label>
        <input
          autoComplete="current-password"
          className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="auth-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="password"
          type="password"
          value={password}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button className="min-h-9" disabled={isBusy} size="sm" type="submit">
          <LogIn data-icon="inline-start" />
          Войти
        </Button>
        <Button
          className="min-h-9"
          disabled={isBusy}
          onClick={(event) => {
            event.preventDefault()
            void onRegister(login, password)
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          <UserPlus data-icon="inline-start" />
          Регистрация
        </Button>
      </div>
      {error ? <p className="text-right text-xs leading-5 text-destructive">{error}</p> : null}
    </form>
  )
}
