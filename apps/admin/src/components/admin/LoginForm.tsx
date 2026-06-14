'use client'

import { LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AdminApiError, adminApi } from '../../lib/adminApi'

export function LoginForm() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await adminApi.login(login, password)
      window.location.assign('/')
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.code === 'admin_not_configured') {
        setError('Доступ администратора не настроен: нужны FINPULSE_ADMIN_LOGIN, FINPULSE_ADMIN_PASSWORD_HASH и FINPULSE_ADMIN_SESSION_SECRET.')
      } else {
        setError('Неверный логин или пароль администратора.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel" aria-labelledby="admin-login-title">
        <div className="login-mark" aria-hidden="true">
          <LockKeyhole size={22} />
        </div>
        <div>
          <p className="login-kicker">ФинПульс internal</p>
          <h1 id="admin-login-title">Кураторский борд</h1>
          <p className="login-copy">Вход для единственного внутреннего администратора.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Логин администратора</span>
            <input
              autoComplete="username"
              name="login"
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Пароль</span>
            <input
              autoComplete="current-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Проверяем...' : 'Войти'}
          </button>
        </form>
      </section>
    </main>
  )
}
