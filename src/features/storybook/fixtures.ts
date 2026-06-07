import type { Card, Lesson, Module, Unit } from '@/content/program'
import type { ModulePathItem } from '@/features/program-navigation/learningPath'

export const theoryCard = {
  id: 'story-theory-card',
  order: 1,
  type: 'theory',
  title: 'Цель должна быть видимой',
  body: 'Финансовая цель работает лучше, когда в ней есть понятный смысл, сумма и первый маленький шаг.',
  examples: ['Накопить резерв на 1 месяц', 'Отложить 5 000 ₽ до конца месяца', 'Закрыть один небольшой долг'],
} satisfies Extract<Card, { type: 'theory' }>

export const choiceCard = {
  id: 'story-choice-card',
  order: 2,
  type: 'single_choice',
  title: 'Выберите формулировку',
  question: 'Какая цель звучит так, чтобы ее было проще начать выполнять?',
  correctOptionId: 'measurable',
  feedback: 'В хорошей цели есть действие, срок или сумма. Так мозгу проще понять следующий шаг.',
  options: [
    {
      id: 'abstract',
      label: 'Хочу лучше обращаться с деньгами',
      feedback: 'Это направление, но пока не понятно, что именно сделать завтра.',
    },
    {
      id: 'measurable',
      label: 'Отложить 3 000 ₽ на резерв до следующей зарплаты',
      isCorrect: true,
      feedback: 'Есть сумма, срок и понятное действие. Такую цель легче встроить в неделю.',
    },
    {
      id: 'pressure',
      label: 'Никогда больше не тратить лишнего',
      feedback: 'Формулировка звучит жестко и может быстро демотивировать.',
    },
  ],
} satisfies Extract<Card, { type: 'single_choice' }>

export const longChoiceCard = {
  id: 'story-long-choice-card',
  order: 2,
  type: 'single_choice',
  title: 'Деньги были... и нет?',
  question:
    'Конец месяца. Смотришь на баланс — почти ноль. А на что ушло? Крупных покупок вроде не было. Знакомо?',
  correctOptionId: 'middle',
  feedback: 'В этом задании важнее заметить привычный сценарий, а не оценивать себя.',
  options: [
    {
      id: 'often',
      label: 'Да, постоянно так: деньги будто растворяются между обычными платежами, кофе, доставкой и мелкими покупками',
      feedback: 'Это частая ситуация. Первый шаг — увидеть повторяющиеся мелкие траты.',
    },
    {
      id: 'middle',
      label: 'Иногда бывает, особенно когда неделю не записываю расходы и потом трудно вспомнить детали',
      isCorrect: true,
      feedback: 'Подходит: здесь есть наблюдение и конкретный момент, где учет начинает помогать.',
    },
    {
      id: 'clear',
      label: 'Нет, я знаю, куда уходят деньги, но хочу проверить, не прячутся ли утечки в автоматических тратах',
      feedback: 'Хороший повод перепроверить регулярные списания и привычные мелкие расходы.',
    },
  ],
} satisfies Extract<Card, { type: 'single_choice' }>

export const videoCard = {
  id: 'story-video-card',
  order: 3,
  type: 'video',
  title: 'Видео: базовые ценности и финансовые цели',
  src: 'https://rutube.ru/play/embed/98b1d47fb6794e189e48bc2d16496429/?p=YZO74pElZsnRBGF7kooKIQ',
  provider: 'rutube',
  timecodes: [
    { time: '00:20', label: 'О важности постановки финансовых целей' },
    { time: '01:05', label: 'Как поставить финансовую цель' },
  ],
} satisfies Extract<Card, { type: 'video' }>

export const scenarioCard = {
  id: 'story-scenario-card',
  order: 4,
  type: 'scenario',
  title: 'Ситуация',
  body: 'В конце месяца осталось немного свободных денег. Нужно выбрать действие, которое поддержит спокойный прогресс.',
  question: 'Что сделать сначала?',
  correctOptionId: 'reserve',
  feedback: 'Сначала лучше усилить ближайшую финансовую устойчивость, а потом повышать сложность.',
  options: [
    { id: 'invest', label: 'Сразу купить рискованный актив', feedback: 'Это может быть слишком резкий шаг без резерва.' },
    { id: 'reserve', label: 'Отложить часть в резерв', isCorrect: true, feedback: 'Это укрепляет базу без давления.' },
    { id: 'ignore', label: 'Оставить как есть', feedback: 'Так прогресс может снова раствориться в обычных тратах.' },
  ],
} satisfies Extract<Card, { type: 'scenario' }>

export const multiSelectCard = {
  id: 'story-multi-select-card',
  order: 5,
  type: 'multi_select',
  title: 'Где поможет резерв?',
  question: 'Отметьте ситуации, для которых подходит финансовая подушка.',
  feedback: 'Подушка нужна для непредвиденного и важного, а не для импульсивных покупок.',
  options: [
    { id: 'repair', label: 'Внезапная поломка техники', isCorrect: true },
    { id: 'income-gap', label: 'Задержка или потеря дохода', isCorrect: true },
    { id: 'treatment', label: 'Срочное лечение', isCorrect: true },
    { id: 'status-phone', label: 'Новый телефон для статуса' },
    { id: 'sale', label: 'Спонтанный шопинг на распродаже' },
  ],
} satisfies Extract<Card, { type: 'multi_select' }>

export const categorizationCard = {
  id: 'story-categorization-card',
  order: 6,
  type: 'categorization',
  title: 'Разделите траты',
  question: 'Распределите траты по группам.',
  feedback: 'Категории помогают увидеть, где необходимость, а где свобода выбора.',
  categories: [
    { id: 'required', label: 'Обязательное' },
    { id: 'desired', label: 'Желаемое' },
  ],
  items: [
    { id: 'utilities', label: 'Оплата ЖКХ', correctCategoryId: 'required' },
    { id: 'transport', label: 'Проездной на месяц', correctCategoryId: 'required' },
    { id: 'streaming', label: 'Подписка на стриминг', correctCategoryId: 'desired' },
    { id: 'console', label: 'Новая игровая приставка', correctCategoryId: 'desired' },
  ],
} satisfies Extract<Card, { type: 'categorization' }>

export const checklistCard = {
  id: 'story-checklist-card',
  order: 7,
  type: 'checklist',
  title: 'Мини-проверка цели',
  body: 'Отметьте признаки, которые уже есть в вашей формулировке.',
  items: ['Есть сумма или диапазон', 'Есть срок', 'Понятен первый шаг'],
} satisfies Extract<Card, { type: 'checklist' }>

export const reflectionCard = {
  id: 'story-reflection-card',
  order: 8,
  type: 'reflection',
  title: 'Личное наблюдение',
  prompt: 'Какая денежная цель сейчас кажется достаточно маленькой, чтобы начать без напряжения?',
  inputType: 'freeform',
  guidance: 'Ответ хранится только локально в этой карточке Storybook.',
} satisfies Extract<Card, { type: 'reflection' }>

export const reflectionSelectCard = {
  id: 'story-reflection-select-card',
  order: 9,
  type: 'reflection',
  title: 'Выбор фокуса',
  prompt: 'Что важнее поддержать в ближайшие две недели?',
  inputType: 'single_select',
  options: ['Резерв', 'Планирование трат', 'Спокойное закрытие долга'],
  guidance: 'Выберите один мягкий фокус.',
} satisfies Extract<Card, { type: 'reflection' }>

export const reflectionMultiCard = {
  id: 'story-reflection-multi-card',
  order: 10,
  type: 'reflection',
  title: 'Опоры',
  prompt: 'Какие опоры уже есть?',
  inputType: 'multi_select',
  options: ['Есть регулярный доход', 'Есть список обязательных платежей', 'Есть сумма для первого шага'],
} satisfies Extract<Card, { type: 'reflection' }>

export const artifactCard = {
  id: 'story-artifact-card',
  order: 11,
  type: 'artifact',
  title: 'Черновик плана',
  body: 'Соберите короткий план на неделю. Данные не сохраняются за пределами текущего экрана.',
  variants: ['Резерв', 'Долг', 'Покупка'],
  template: ['Сумма первого шага', 'Когда выполнить', 'Что может помешать'],
} satisfies Extract<Card, { type: 'artifact' }>

export const summaryCard = {
  id: 'story-summary-card',
  order: 12,
  type: 'summary',
  title: 'Что забрать с собой',
  body: 'Спокойный прогресс начинается с небольшой конкретной формулировки.',
  points: ['Смысл понятен', 'Сумма или срок видны', 'Первый шаг небольшой'],
  nextStep: 'Вернитесь к цели через неделю и проверьте, стало ли легче действовать.',
} satisfies Extract<Card, { type: 'summary' }>

export const lessonFixture = {
  id: 'story-lesson',
  slug: 'money-goal-first-step',
  title: 'Первый спокойный шаг к цели',
  subtitle: 'Мини-урок',
  description: 'Короткий урок о том, как сделать финансовую цель конкретной и не давящей.',
  order: 1,
  estimatedMinutes: 4,
  learningGoal: 'Сформулировать одну финансовую цель как небольшой следующий шаг.',
  mainSkill: 'Планирование',
  tags: ['цели', 'резерв'],
  cards: [
    theoryCard,
    choiceCard,
    videoCard,
    scenarioCard,
    multiSelectCard,
    categorizationCard,
    checklistCard,
    reflectionCard,
    reflectionSelectCard,
    reflectionMultiCard,
    artifactCard,
    summaryCard,
  ],
} satisfies Lesson

export const completedLessonFixture = {
  ...lessonFixture,
  id: 'story-lesson-completed',
  slug: 'money-goal-completed',
  title: 'Цель уже собрана',
} satisfies Lesson

export const lockedLessonFixture = {
  ...lessonFixture,
  id: 'story-lesson-locked',
  slug: 'money-goal-locked',
  title: 'Следующий шаг маршрута',
} satisfies Lesson

export const unitFixture = {
  schemaVersion: 1,
  id: 'story-unit',
  slug: 'first-money-route',
  title: 'Маршрут спокойного старта',
  description: 'Первые уроки без перегруза и жесткой мотивации.',
  order: 1,
  source: 'storybook-fixture',
  lessons: [completedLessonFixture, lessonFixture, lockedLessonFixture],
} satisfies Unit

export const moduleFixture = {
  schemaVersion: 1,
  id: 'story-module',
  slug: 'personal-finance-start',
  title: 'Личные финансы без давления',
  description: 'Базовый модуль про цели, резерв и первые финансовые привычки.',
  order: 1,
  source: 'storybook-fixture',
  units: [unitFixture],
} satisfies Module

export const modulePathItems = {
  completed: {
    module: moduleFixture,
    units: [],
    state: 'completed',
    completedLessons: 3,
    totalLessons: 3,
  },
  current: {
    module: moduleFixture,
    units: [],
    state: 'current',
    completedLessons: 1,
    totalLessons: 3,
  },
  locked: {
    module: {
      ...moduleFixture,
      id: 'story-module-locked',
      slug: 'future-money-habits',
      title: 'Будущие денежные привычки',
    },
    units: [],
    state: 'locked',
    completedLessons: 0,
    totalLessons: 3,
  },
} satisfies Record<'completed' | 'current' | 'locked', ModulePathItem>
