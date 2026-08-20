import type { LearnerPracticeKind } from '../learnerLessonCatalog'

const actionLabels: Record<LearnerPracticeKind, string> = {
  status: 'Проверить разметку',
  sources: 'Сверить источники',
  comparison: 'Сравнить последствия',
  roles: 'Сверить карту ролей',
  thread: 'Проверить вопросы',
  revision: 'Сверить вывод',
  evidence: 'Проверить факты',
  deadline: 'Сопоставить сроки',
}

export function practiceActionLabel(kind: LearnerPracticeKind) {
  return actionLabels[kind]
}
