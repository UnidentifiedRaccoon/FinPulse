'use client'

import type { FormEvent } from 'react'
import { RefreshCw, Search } from 'lucide-react'

type UserSearchProps = {
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onRefresh: () => void
}

export function UserSearch({ value, isLoading, onChange, onSubmit, onRefresh }: UserSearchProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="table-toolbar" onSubmit={handleSubmit}>
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Поиск</span>
        <input
          type="search"
          placeholder="Поиск по login/email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <div className="toolbar-actions">
        <button className="button secondary" type="button" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw size={16} />
          <span>Обновить</span>
        </button>
        <button className="button primary" type="submit" disabled={isLoading}>
          <Search size={16} />
          <span>Найти</span>
        </button>
      </div>
    </form>
  )
}
