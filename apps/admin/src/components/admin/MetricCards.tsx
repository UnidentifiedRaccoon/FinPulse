import { AlertTriangle, BookOpenCheck, Clock3, Users } from 'lucide-react'

import type { AdminSummaryResponse } from '../../lib/types'

type MetricCardsProps = {
  summary: AdminSummaryResponse | null
  isLoading: boolean
}

export function MetricCards({ summary, isLoading }: MetricCardsProps) {
  const totals = summary?.totals
  const metrics = [
    {
      label: 'Пользователи',
      value: totals?.totalUsers ?? 0,
      detail: `${totals?.usersWithProgress ?? 0} с прогрессом`,
      icon: Users,
    },
    {
      label: 'Уроки',
      value: totals?.completedLessons ?? 0,
      detail: `${totals?.totalLessons ?? 0} урока в активной программе`,
      icon: BookOpenCheck,
    },
    {
      label: 'Последняя активность',
      value: totals?.activeUsersLast7Days ?? 0,
      detail: 'активны за 7 дней',
      icon: Clock3,
    },
    {
      label: 'Застрял',
      value: totals?.stuckUsers ?? 0,
      detail: `порог ${totals?.stuckThresholdDays ?? 7} дней`,
      icon: AlertTriangle,
      tone: 'warning',
    },
  ]

  return (
    <section className="metric-grid" aria-label="Агрегаты">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <article className={`metric-card ${metric.tone === 'warning' ? 'warning' : ''}`} key={metric.label}>
            <div className="metric-icon" aria-hidden="true">
              <Icon size={19} />
            </div>
            <div>
              <div className="metric-label">{metric.label}</div>
              {isLoading ? <div className="skeleton metric-skeleton" /> : <div className="metric-value">{metric.value}</div>}
              <div className="metric-detail">{metric.detail}</div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
