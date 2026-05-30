import { type FormEvent, useState } from 'react'

import type { ApiUser } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type AuthControlsProps = {
  user: ApiUser | null
  isBusy: boolean
  error: string
  onLogin: (login: string, password: string) => Promise<void>
  onRegister: (login: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
  variant?: 'compact' | 'entry'
}

export function AuthControls({
  user,
  isBusy,
  error,
  onLogin,
  onRegister,
  onLogout,
  variant = 'compact',
}: AuthControlsProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const isEntry = variant === 'entry'
  const loginLabel = 'Email или логин'

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">{user.login}</span>
        <Button disabled={isBusy} onClick={onLogout} size="sm" type="button" variant="outline">
          Выйти
        </Button>
      </div>
    )
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    const action = submitter instanceof HTMLButtonElement && submitter.value === 'register' ? 'register' : 'login'

    if (action === 'login') {
      await onLogin(login, password)
      return
    }

    await onRegister(login, password)
  }

  return (
    <form className={cn('flex w-full flex-col', isEntry ? 'gap-4' : 'gap-2 sm:w-auto')} onSubmit={submit}>
      <FieldGroup className={isEntry ? 'gap-4' : 'grid grid-cols-2 gap-2'}>
        <Field>
          <FieldLabel className={isEntry ? undefined : 'sr-only'} htmlFor="auth-login">
            {loginLabel}
          </FieldLabel>
          <Input
            autoComplete="username"
            className={isEntry ? 'h-11' : 'h-9'}
            disabled={isBusy}
            id="auth-login"
            inputMode="email"
            name="login"
            onChange={(event) => setLogin(event.target.value)}
            placeholder={loginLabel}
            required
            spellCheck={false}
            value={login}
          />
        </Field>
        <Field>
          <FieldLabel className={isEntry ? undefined : 'sr-only'} htmlFor="auth-password">
            Пароль
          </FieldLabel>
          <Input
            autoComplete="current-password"
            className={isEntry ? 'h-11' : 'h-9'}
            disabled={isBusy}
            id="auth-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Пароль"
            required
            type="password"
            value={password}
          />
        </Field>
      </FieldGroup>
      <div className={cn('flex flex-wrap gap-2', isEntry ? 'flex-col sm:flex-row' : 'justify-end')}>
        <Button className={cn('min-h-9', isEntry && 'min-h-11 flex-1')} disabled={isBusy} size={isEntry ? 'lg' : 'sm'} type="submit" value="login">
          Войти
        </Button>
        <Button
          className={cn('min-h-9', isEntry && 'min-h-11 flex-1')}
          disabled={isBusy}
          size={isEntry ? 'lg' : 'sm'}
          type="submit"
          value="register"
          variant="outline"
        >
          Регистрация
        </Button>
      </div>
      {error ? <FieldError className={isEntry ? undefined : 'text-right'}>{error}</FieldError> : null}
    </form>
  )
}
