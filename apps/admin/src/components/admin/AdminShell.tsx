'use client'

import { BookOpen, LogOut, Users } from 'lucide-react'
import type { ReactNode } from 'react'

type AdminShellProps = {
  adminLogin: string | null
  children: ReactNode
  onLogout: () => void
}

export function AdminShell({ adminLogin, children, onLogout }: AdminShellProps) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="brand-block">
          <div className="brand-mark">ФП</div>
          <div>
            <div className="brand-title">ФинПульс</div>
            <div className="brand-subtitle">internal admin</div>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Разделы админки">
          <a className="admin-nav-link active" href="/">
            <Users size={18} />
            <span>Пользователи</span>
          </a>
          <span className="admin-nav-link disabled">
            <BookOpen size={18} />
            <span>Прогресс</span>
          </span>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Кураторский борд</h1>
          </div>
          <div className="session-block">
            <div className="session-login">{adminLogin ?? 'admin'}</div>
            <button className="icon-text-button" type="button" onClick={onLogout} aria-label="Выйти из админки">
              <LogOut size={17} />
              <span>Выйти</span>
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  )
}
