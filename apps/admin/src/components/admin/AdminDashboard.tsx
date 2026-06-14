'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

import { AdminApiError, adminApi } from '../../lib/adminApi'
import type { AdminSummaryResponse, AdminUserProgressResponse, AdminUserSummary } from '../../lib/types'

import { AdminShell } from './AdminShell'
import { MetricCards } from './MetricCards'
import { ResizableSplitHandle } from './ResizableSplitHandle'
import { UserProgressDetail } from './UserProgressDetail'
import { UserSearch } from './UserSearch'
import { UsersTable } from './UsersTable'
import { usePersistedDetailPanelWidth } from './usePersistedDetailPanelWidth'

type LoadState = {
  summary: AdminSummaryResponse | null
  users: AdminUserSummary[]
  adminLogin: string | null
  error: string | null
  isLoading: boolean
}

export function AdminDashboard() {
  const [search, setSearch] = useState('')
  const [state, setState] = useState<LoadState>({
    summary: null,
    users: [],
    adminLogin: null,
    error: null,
    isLoading: true,
  })
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [detail, setDetail] = useState<AdminUserProgressResponse | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const { detailPanelWidth, maxWidth: detailPanelMaxWidth, setDetailPanelWidth } = usePersistedDetailPanelWidth()

  const isDetailOpen = Boolean(selectedUserId || detailLoading || detailError)
  const dashboardGridStyle = {
    '--detail-panel-width': `${detailPanelWidth}px`,
  } as CSSProperties

  useEffect(() => {
    void loadDashboard('')
  }, [])

  async function loadDashboard(nextSearch: string) {
    setState((current) => ({ ...current, isLoading: true, error: null }))

    try {
      const [me, summary, users] = await Promise.all([
        adminApi.getMe(),
        adminApi.getSummary(),
        adminApi.getUsers(nextSearch),
      ])
      setState({
        summary,
        users: users.users,
        adminLogin: me.admin.login,
        error: null,
        isLoading: false,
      })
    } catch (caught) {
      handleAuthRedirect(caught)
      setState((current) => ({
        ...current,
        isLoading: false,
        error: errorMessage(caught),
      }))
    }
  }

  async function selectUser(userId: string) {
    setSelectedUserId(userId)
    setDetailLoading(true)
    setDetailError(null)

    try {
      setDetail(await adminApi.getUserProgress(userId))
    } catch (caught) {
      handleAuthRedirect(caught)
      setDetail(null)
      setDetailError(errorMessage(caught))
    } finally {
      setDetailLoading(false)
    }
  }

  async function logout() {
    await adminApi.logout()
    window.location.assign('/login')
  }

  function closeDetail() {
    setSelectedUserId(null)
    setDetail(null)
    setDetailError(null)
    setDetailLoading(false)
  }

  return (
    <AdminShell adminLogin={state.adminLogin} onLogout={() => void logout()}>
      <div
        className={`dashboard-grid ${isDetailOpen ? 'has-detail' : 'detail-collapsed'}`}
        style={dashboardGridStyle}
        data-testid="admin-dashboard-grid"
      >
        <section className="dashboard-content" aria-label="Пользователи и прогресс">
          <MetricCards summary={state.summary} isLoading={state.isLoading} />

          <section className="table-panel" aria-labelledby="users-table-title">
            <div className="panel-heading">
              <div>
                <p className="panel-label">Пользователи</p>
                <h2 id="users-table-title">Прогресс пользователей</h2>
              </div>
              <span className="result-count">{state.users.length} строк</span>
            </div>
            <UserSearch
              value={search}
              isLoading={state.isLoading}
              onChange={setSearch}
              onSubmit={() => void loadDashboard(search)}
              onRefresh={() => void loadDashboard(search)}
            />
            {state.error ? (
              <div className="inline-error" role="alert">
                {state.error}
              </div>
            ) : null}
            <UsersTable
              users={state.users}
              isLoading={state.isLoading}
              selectedUserId={selectedUserId}
              onSelectUser={(userId) => void selectUser(userId)}
            />
          </section>
        </section>

        {isDetailOpen ? (
          <>
            <ResizableSplitHandle
              width={detailPanelWidth}
              maxWidth={detailPanelMaxWidth}
              onWidthChange={setDetailPanelWidth}
            />
            <UserProgressDetail detail={detail} isLoading={detailLoading} error={detailError} onClose={closeDetail} />
          </>
        ) : null}
      </div>
    </AdminShell>
  )
}

function handleAuthRedirect(error: unknown) {
  if (error instanceof AdminApiError && error.status === 401) {
    window.location.assign('/login')
  }
}

function errorMessage(error: unknown) {
  if (error instanceof AdminApiError) {
    if (error.code === 'admin_not_configured') {
      return 'Admin access is not configured on the backend.'
    }
    return error.message
  }

  return 'Не удалось загрузить данные админки.'
}
