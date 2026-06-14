export function formatDateTime(value: string | null) {
  if (!value) return 'нет данных'

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatRatio(value: number, total: number) {
  return `${value} / ${total}`
}

export function statusLabel(status: 'not_started' | 'viewed' | 'completed') {
  switch (status) {
    case 'completed':
      return 'Завершён'
    case 'viewed':
      return 'Просмотрен'
    case 'not_started':
      return 'Не начат'
  }
}

export function stuckLabel(stuckDays: number | null) {
  if (stuckDays === null) return 'нет данных'
  return `${stuckDays} дн.`
}
