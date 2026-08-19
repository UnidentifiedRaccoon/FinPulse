import type {
  LearnerPracticeScreen,
  LearnerPrompt,
} from '../learnerLessonCatalog'
import { chapterThreeOfferAndCheck } from '../demoContent'

export const comparisonMechanicSlugs = [
  'facts-before-reveal',
  'source-scope',
  'one-change',
  'help-and-agency',
  'question-and-source',
  'revise-explanation',
  'evidence-chain',
  'deadline-backward',
  'one-fact-one-conclusion',
] as const

export type ComparisonMechanicSlug = typeof comparisonMechanicSlugs[number]

export interface ComparisonFeedback {
  successTitle: string
  nuanceTitle: string
  explanation: string
  supported: string
  open: string
}

interface ComparisonMechanicBase {
  slug: ComparisonMechanicSlug
  title: string
  shortTitle: string
  task: string
  comparisonLens: string
  feedback: ComparisonFeedback
  rationales: Readonly<Record<string, string>>
}

export interface PracticeComparisonMechanic extends ComparisonMechanicBase {
  renderer: 'practice'
  practice: LearnerPracticeScreen
}

export interface ConclusionComparisonMechanic extends ComparisonMechanicBase {
  renderer: 'conclusion'
  prompt: LearnerPrompt
  notice: string
}

export type ComparisonMechanic = PracticeComparisonMechanic | ConclusionComparisonMechanic

export const comparisonStory = {
  title: 'Деньги на жильё и срок',
  paragraphs: chapterThreeOfferAndCheck,
} as const

export const sharedComparisonFact =
  'В условиях прямо сказано: доступный на тот момент остаток можно получить к дате, когда деньги могли понадобиться для жилья.'

const statusOptions = [
  { id: 'story', label: 'Дано как условие истории' },
  { id: 'advert', label: 'Заявлено только в рекламе' },
  { id: 'unconfirmed', label: 'В истории сказано: подтверждения не нашли' },
] as const

const evidenceOptions = [
  { id: 'confirmed', label: 'Подтверждено фрагментом' },
  { id: 'unconfirmed', label: 'Не подтверждено фрагментом' },
] as const

const deltaOptions = [
  { id: 'direct', label: 'Следует из нового факта' },
  { id: 'unknown', label: 'По-прежнему неизвестно' },
] as const

const actorOptions = [
  { id: 'sasha', label: 'Саша' },
  { id: 'lera', label: 'Лера' },
  { id: 'together', label: 'Саша и Лера вместе' },
  { id: 'unspecified', label: 'В тексте не указано' },
] as const

export const comparisonMechanics: Readonly<Record<ComparisonMechanicSlug, ComparisonMechanic>> = {
  'facts-before-reveal': {
    renderer: 'practice',
    slug: 'facts-before-reveal',
    title: 'Что известно до ответа?',
    shortTitle: 'Статус сведений',
    task: 'Разделите то, что есть в истории, обещание рекламы и то, чему пока нет подтверждения.',
    comparisonLens: 'Помогает не превращать привлекательное утверждение в установленный факт.',
    rationales: {
      'compare-status-deadline': 'Дата окончания временной аренды задана самим фрагментом, а не рекламой или результатом проверки.',
      'compare-status-return': 'Высокий доход относится к обещанию публикации; проверка не превращает его в установленный будущий результат.',
      'compare-status-access': 'Фрагмент прямо сообщает итог поиска: подтверждения получения всей суммы к дате не нашли.',
    },
    practice: {
      kind: 'status',
      title: 'Разберите три фразы',
      contextItems: [],
      prompts: [
        {
          id: 'compare-status-deadline',
          legend: 'Деньги могли понадобиться Саше к окончанию временной аренды.',
          options: statusOptions,
          expected: ['story'],
        },
        {
          id: 'compare-status-return',
          legend: 'Небольшая сумма принесёт высокий доход за короткий срок.',
          options: statusOptions,
          expected: ['advert'],
        },
        {
          id: 'compare-status-access',
          legend: 'Саша сможет получить всю сумму к дате, когда деньги могли понадобиться для жилья.',
          options: statusOptions,
          expected: ['unconfirmed'],
        },
      ],
    },
    feedback: {
      successTitle: 'Три статуса разделены',
      nuanceTitle: 'Одна из фраз получила слишком сильный статус',
      explanation: 'В истории есть цель и возможный срок. Высокий доход обещает реклама. Получение всей суммы к нужной дате проверяли, но подтверждения не нашли.',
      supported: 'Деньги могли понадобиться к окончанию аренды; реклама приводит один прошлый пример.',
      open: 'Повторится ли результат и получится ли получить всю сумму к нужной дате.',
    },
  },
  'source-scope': {
    renderer: 'practice',
    slug: 'source-scope',
    title: 'Какой источник что подтвердил?',
    shortTitle: 'Роли источников',
    task: 'Сопоставьте публикацию, источник цифр и условия с тем узким ответом, который каждый из них даёт.',
    comparisonLens: 'Показывает, что один источник не отвечает сразу на все вопросы.',
    rationales: {
      'compare-source-advert': 'Публикация содержит обещание и пример, но сама не подтверждает типичность результата или срок получения денег.',
      'compare-source-numbers': 'Проверка источника установила только период цифр — прошлое, а не повторяемость результата.',
      'compare-source-terms': 'Условия изучили именно ради срока, но в этом фрагменте нужного подтверждения всей суммы к дате не нашли.',
    },
    practice: {
      kind: 'sources',
      title: 'Определите роль каждого источника',
      contextItems: [
        { label: 'Публикация', body: 'Обещает высокий доход и приводит один удачный пример.' },
        { label: 'Источник цифр', body: 'Саша и Лера проверили период, к которому относились цифры.' },
        { label: 'Условия', body: 'В них искали, как и когда можно вернуть деньги.' },
      ],
      prompts: [
        {
          id: 'compare-source-advert',
          legend: 'Какую роль выполняет публикация?',
          options: [
            { id: 'claim', label: 'Содержит привлекательное утверждение' },
            { id: 'typical', label: 'Подтверждает типичный будущий результат' },
            { id: 'deadline', label: 'Подтверждает получение всей суммы к сроку' },
          ],
          expected: ['claim'],
        },
        {
          id: 'compare-source-numbers',
          legend: 'Что удалось установить по источнику цифр?',
          options: [
            { id: 'past', label: 'Цифры относятся к прошлому периоду' },
            { id: 'repeat', label: 'Такой результат обязательно повторится' },
            { id: 'safe', label: 'Вся сумма останется доступной' },
          ],
          expected: ['past'],
        },
        {
          id: 'compare-source-terms',
          legend: 'Что дали условия в этом фрагменте?',
          options: [
            { id: 'not-found', label: 'Подтверждения всей суммы к дате не нашли' },
            { id: 'guaranteed', label: 'Срок и вся сумма были гарантированы' },
            { id: 'decision', label: 'Они приняли решение за Сашу' },
          ],
          expected: ['not-found'],
        },
      ],
    },
    feedback: {
      successTitle: 'У каждого источника осталась своя роль',
      nuanceTitle: 'Один источник получил ответ, которого в нём нет',
      explanation: 'Публикация показывает обещание, источник цифр — прошлый период, а поиск в условиях заканчивается отсутствием нужного подтверждения. Это не одно и то же.',
      supported: 'Цифры из примера относятся к прошлому периоду.',
      open: 'Повторяемость, возможные потери и получение всей суммы к дате.',
    },
  },
  'one-change': {
    renderer: 'practice',
    slug: 'one-change',
    title: 'Что меняет один новый факт?',
    shortTitle: 'Карта изменений',
    task: 'Добавьте ровно один новый факт и отметьте только его прямые последствия.',
    comparisonLens: 'Тренирует границу между прямым следствием и догадкой.',
    rationales: {
      'compare-change-timing': 'Новое условие прямо сообщает срок получения доступного на тот момент остатка.',
      'compare-change-full-sum': 'Слово «остаток» не сообщает, что он будет равен всей первоначальной сумме.',
      'compare-change-repeat': 'Срок получения денег ничего не добавляет к вопросу о повторении прошлого результата.',
      'compare-change-decision': 'Новое свидетельство расширяет сведения, но не принимает решение за Сашу.',
    },
    practice: {
      kind: 'comparison',
      title: 'Отметьте прямые изменения',
      notice: sharedComparisonFact,
      contextItems: [
        { label: 'В общей истории', body: 'Получение всей суммы к дате окончания аренды не подтверждено.' },
        { label: 'Только в сравнении', body: 'Подтверждён срок получения доступного на тот момент остатка.' },
      ],
      prompts: [
        {
          id: 'compare-change-timing',
          legend: 'Известен срок получения доступного на тот момент остатка.',
          options: deltaOptions,
          expected: ['direct'],
        },
        {
          id: 'compare-change-full-sum',
          legend: 'К этой дате точно сохранится вся первоначальная сумма.',
          options: deltaOptions,
          expected: ['unknown'],
        },
        {
          id: 'compare-change-repeat',
          legend: 'Высокий результат обязательно повторится.',
          options: deltaOptions,
          expected: ['unknown'],
        },
        {
          id: 'compare-change-decision',
          legend: 'Саша обязательно изменит решение.',
          options: deltaOptions,
          expected: ['unknown'],
        },
      ],
    },
    feedback: {
      successTitle: 'Изменение осталось точным',
      nuanceTitle: 'Новый факт потянул за собой лишний вывод',
      explanation: 'Новое условие отвечает только о сроке получения доступного тогда остатка. Оно не сообщает, чему будет равен этот остаток, повторится ли результат и как решит Саша.',
      supported: 'Срок получения доступного на тот момент остатка.',
      open: 'Сохранность всей суммы, повторяемость результата, потери и решение Саши.',
    },
  },
  'help-and-agency': {
    renderer: 'practice',
    slug: 'help-and-agency',
    title: 'Кто помогал, кто действовал?',
    shortTitle: 'Карта действий',
    task: 'Верните каждое действие тому, кто его совершил, не додумывая неописанные детали.',
    comparisonLens: 'Разделяет предложение помощи, совместную проверку и решение героя.',
    rationales: {
      'compare-role-showed': 'В реплике именно Лера показывает публикацию и предлагает сначала всё проверить.',
      'compare-role-checked': 'Фрагмент использует «они»: публикацию, источник и условия Саша с Лерой проверяют вместе.',
      'compare-role-transfer': 'Фраза «переводить деньги Саша не стал» называет действующего человека прямо.',
      'compare-role-device': 'Совместная проверка описана, но кто нажимал каждую кнопку, текст не уточняет.',
    },
    practice: {
      kind: 'roles',
      title: 'Распределите действия',
      contextItems: [],
      prompts: [
        {
          id: 'compare-role-showed',
          legend: 'Кто показал публикацию и предложил сначала всё проверить?',
          options: actorOptions,
          expected: ['lera'],
        },
        {
          id: 'compare-role-checked',
          legend: 'Кто перечитал публикацию, нашёл источник цифр и открыл условия?',
          options: actorOptions,
          expected: ['together'],
        },
        {
          id: 'compare-role-transfer',
          legend: 'Кто не стал переводить деньги?',
          options: actorOptions,
          expected: ['sasha'],
        },
        {
          id: 'compare-role-device',
          legend: 'Кто именно управлял устройством во время каждой проверки?',
          options: actorOptions,
          expected: ['unspecified'],
        },
      ],
    },
    feedback: {
      successTitle: 'Помощь и решение не смешались',
      nuanceTitle: 'Одному участнику приписано лишнее действие',
      explanation: 'Лера показала публикацию и предложила проверку. Проверяли они вместе. Деньги не переводил Саша. Кто нажимал каждую кнопку, текст не уточняет.',
      supported: 'Предложение Леры, совместная проверка и действие Саши.',
      open: 'Кто управлял устройством на каждом шаге и каким будет окончательное решение после ответа.',
    },
  },
  'question-and-source': {
    renderer: 'practice',
    slug: 'question-and-source',
    title: 'Как меняется вопрос Саши?',
    shortTitle: 'Вопрос и источник',
    task: 'Для каждого вопроса выберите источник, который действительно способен на него ответить.',
    comparisonLens: 'Показывает, как новый вопрос требует другого источника.',
    rationales: {
      'compare-thread-period': 'Ответ о периоде проверяют по источнику самих цифр, а не по впечатлению от рекламы.',
      'compare-thread-access': 'Порядок и срок возврата относятся к условиям, а не к одному прошлому примеру.',
      'compare-thread-boundary': 'По итогам поиска фрагмент фиксирует отсутствие подтверждения всей суммы к дате.',
    },
    practice: {
      kind: 'thread',
      title: 'Соберите путь двух вопросов',
      contextItems: [
        { label: 'Сначала', body: 'К какому периоду относятся показанные цифры?' },
        { label: 'Затем', body: 'Можно ли получить всю сумму к дате окончания аренды?' },
      ],
      prompts: [
        {
          id: 'compare-thread-period',
          legend: 'Где искать ответ о периоде цифр?',
          options: [
            { id: 'number-source', label: 'В источнике цифр' },
            { id: 'advert', label: 'В обещании рекламы' },
            { id: 'calendar', label: 'В календаре Саши' },
          ],
          expected: ['number-source'],
        },
        {
          id: 'compare-thread-access',
          legend: 'Где искать ответ о возврате денег?',
          options: [
            { id: 'terms', label: 'В условиях' },
            { id: 'past-story', label: 'В истории одного человека' },
            { id: 'impression', label: 'В первом впечатлении Саши' },
          ],
          expected: ['terms'],
        },
        {
          id: 'compare-thread-boundary',
          legend: 'Чем закончилась проверка вопроса о всей сумме к дате?',
          options: [
            { id: 'unconfirmed', label: 'Нужного подтверждения не нашли' },
            { id: 'guaranteed', label: 'Получение всей суммы подтвердили' },
            { id: 'irrelevant', label: 'Срок оказался неважен' },
          ],
          expected: ['unconfirmed'],
        },
      ],
    },
    feedback: {
      successTitle: 'Каждый вопрос получил подходящий источник',
      nuanceTitle: 'Источник и вопрос не совпали',
      explanation: 'Источник цифр отвечает о прошлом периоде. Условия должны отвечать о возврате денег, но нужного подтверждения в них не нашли.',
      supported: 'Прошлый период показанных цифр.',
      open: 'Получение всей суммы к дате и повторяемость результата.',
    },
  },
  'revise-explanation': {
    renderer: 'practice',
    slug: 'revise-explanation',
    title: 'Как уточнить объяснение?',
    shortTitle: 'Уточнение вывода',
    task: 'Уточняйте объяснение по мере появления новых сведений, не делая его шире доказанного.',
    comparisonLens: 'Делает видимым, как формулировка меняется после проверки.',
    rationales: {
      'compare-revision-first': 'До проверки публикация даёт только собственное обещание и один пример.',
      'compare-revision-source': 'Источник цифр добавляет период примера, но не типичность или срок, когда деньги могли понадобиться для жилья.',
      'compare-revision-final': 'Точная формулировка соединяет найденное с пределом: прошлый пример не отвечает о будущем результате и всей сумме к дате.',
    },
    practice: {
      kind: 'revision',
      title: 'Соберите точное объяснение',
      contextItems: [
        { label: 'Реклама', body: 'Один удачный пример и обещание высокого дохода.' },
        { label: 'После проверки', body: 'Цифры относятся к прошлому периоду; получение всей суммы к дате не подтверждено.' },
      ],
      prompts: [
        {
          id: 'compare-revision-first',
          legend: 'Что можно сказать по одной публикации?',
          options: [
            { id: 'claim', label: 'Она приводит один привлекательный пример' },
            { id: 'future', label: 'Она доказывает будущий результат Саши' },
            { id: 'safe', label: 'Она подтверждает сохранность суммы' },
          ],
          expected: ['claim'],
        },
        {
          id: 'compare-revision-source',
          legend: 'Что добавил источник цифр?',
          options: [
            { id: 'past', label: 'Пример относится к прошлому периоду' },
            { id: 'typical', label: 'Результат типичен для всех' },
            { id: 'deadline', label: 'Вся сумма будет доступна к дате' },
          ],
          expected: ['past'],
        },
        {
          id: 'compare-revision-final',
          legend: 'Какая итоговая формулировка точнее?',
          options: [
            { id: 'bounded', label: 'Прошлый пример не подтверждает повторение результата или всю сумму к новой дате' },
            { id: 'bad', label: 'Предложение точно плохое для всех' },
            { id: 'good', label: 'Предложение точно подходит Саше' },
          ],
          expected: ['bounded'],
        },
      ],
    },
    feedback: {
      successTitle: 'Объяснение стало точнее, а не увереннее',
      nuanceTitle: 'Итоговая формулировка вышла за пределы проверки',
      explanation: 'Проверка уточняет период цифр и сохраняет открытым вопрос о будущем результате и всей сумме к дате. Она не превращает предложение в универсально хорошее или плохое.',
      supported: 'Один пример относится к прошлому периоду.',
      open: 'Будущий результат, вся сумма к дате, возможные потери и пригодность предложения.',
    },
  },
  'evidence-chain': {
    renderer: 'practice',
    slug: 'evidence-chain',
    title: 'На чём держится вывод?',
    shortTitle: 'Цепочка подтверждений',
    task: 'Проверьте каждое звено и оставьте неподтверждённые части видимыми.',
    comparisonLens: 'Показывает, где вывод становится шире имеющихся свидетельств.',
    rationales: {
      'compare-evidence-goal': 'Фрагмент прямо связывает отложенные деньги с возможными расходами после окончания аренды.',
      'compare-evidence-past': 'После проверки цифры остаются одним примером из прошлого периода.',
      'compare-evidence-repeat': 'Один прошлый пример не устанавливает повторяемость результата.',
      'compare-evidence-sum': 'Во фрагменте нет подтверждения сохранности всей первоначальной суммы.',
      'compare-evidence-deadline': 'Поиск заканчивается отсутствием подтверждения всей суммы к дате окончания аренды.',
      'compare-evidence-losses': 'Публикация почти не описывает потери и ответственность, а нового подтверждения фрагмент не даёт.',
    },
    practice: {
      kind: 'evidence',
      title: 'Проверьте шесть звеньев',
      contextItems: [],
      prompts: [
        {
          id: 'compare-evidence-goal',
          legend: 'Деньги могли понадобиться для жилья к окончанию аренды.',
          options: evidenceOptions,
          expected: ['confirmed'],
        },
        {
          id: 'compare-evidence-past',
          legend: 'Реклама приводит один пример из прошлого периода.',
          options: evidenceOptions,
          expected: ['confirmed'],
        },
        {
          id: 'compare-evidence-repeat',
          legend: 'Повторяемость результата подтверждена.',
          options: evidenceOptions,
          expected: ['unconfirmed'],
        },
        {
          id: 'compare-evidence-sum',
          legend: 'Сохранность всей первоначальной суммы подтверждена.',
          options: evidenceOptions,
          expected: ['unconfirmed'],
        },
        {
          id: 'compare-evidence-deadline',
          legend: 'Получение всей суммы к дате окончания аренды подтверждено.',
          options: evidenceOptions,
          expected: ['unconfirmed'],
        },
        {
          id: 'compare-evidence-losses',
          legend: 'Возможные потери и ответственность достаточно описаны.',
          options: evidenceOptions,
          expected: ['unconfirmed'],
        },
      ],
    },
    feedback: {
      successTitle: 'Граница цепочки осталась видимой',
      nuanceTitle: 'В цепочке появилось неподтверждённое звено',
      explanation: 'Фрагмент подтверждает цель и один прошлый пример. Остальные звенья в нём не подтверждены. Отсутствие подтверждения не доказывает обратное — оно ограничивает вывод.',
      supported: 'Возможные расходы после окончания аренды и один пример из прошлого периода.',
      open: 'Повторяемость, сохранность и получение всей суммы к дате, потери и ответственность.',
    },
  },
  'deadline-backward': {
    renderer: 'practice',
    slug: 'deadline-backward',
    title: 'Что проверить до срока?',
    shortTitle: 'Проверка от срока назад',
    task: 'Начните с даты окончания временной аренды и поставьте проверку до момента, когда план начнёт зависеть от ответа.',
    comparisonLens: 'Связывает информационную проверку с реальным ограничением во времени.',
    rationales: {
      'compare-deadline-place': 'Проверка полезна до возникновения зависимости: после даты окончания аренды она уже не помогает заранее сопоставить сроки.',
      'compare-deadline-boundary': 'Даже известный срок отвечает только о датах, а не о сохранности суммы, результате или решении.',
    },
    practice: {
      kind: 'deadline',
      title: 'Расположите проверку во времени',
      contextItems: [
        { label: 'Дата окончания аренды', body: 'Деньги могли понадобиться, когда закончится временная аренда.' },
        { label: 'Вся сумма к дате', body: 'Получение всей суммы к этой дате не подтверждено.' },
      ],
      prompts: [
        {
          id: 'compare-deadline-place',
          legend: 'Когда проверять срок получения денег?',
          options: [
            { id: 'before-dependence', label: 'До того, как план на жильё начнёт зависеть от этого срока' },
            { id: 'after-deadline', label: 'Уже после даты окончания аренды' },
            { id: 'never', label: 'Срок можно не проверять' },
          ],
          expected: ['before-dependence'],
        },
        {
          id: 'compare-deadline-boundary',
          legend: 'Что такая проверка способна установить сама по себе?',
          options: [
            { id: 'timing-only', label: 'Только совместимость сроков' },
            { id: 'all-risks', label: 'Все риски и будущий результат' },
            { id: 'decision', label: 'Какое решение обязан принять Саша' },
          ],
          expected: ['timing-only'],
        },
      ],
    },
    feedback: {
      successTitle: 'Проверка оказалась раньше зависимости',
      nuanceTitle: 'Проверка поставлена слишком поздно или получила лишнюю роль',
      explanation: 'Срок стоит проверять до того, как план на жильё начнёт от него зависеть. Даже подтверждённый срок отвечает только о совместимости дат, а не обо всех рисках или решении Саши.',
      supported: 'У решения по жилью есть дата, а срок получения всей суммы не подтверждён.',
      open: 'Сохранность суммы, повторяемость, потери и окончательное решение.',
    },
  },
  'one-fact-one-conclusion': {
    renderer: 'conclusion',
    slug: 'one-fact-one-conclusion',
    title: 'Что изменил один новый факт?',
    shortTitle: 'Один факт — один вывод',
    task: 'Измените только ту часть вывода, на которую прямо отвечает новый факт.',
    comparisonLens: 'Проверяет, останется ли новая реплика такой же ограниченной, как новое свидетельство.',
    rationales: {
      'compare-conclusion': 'Новое условие подтверждает срок получения доступного тогда остатка, но не его размер, повторяемость результата или решение Саши.',
    },
    notice: sharedComparisonFact,
    prompt: {
      id: 'compare-conclusion',
      legend: 'Как теперь точнее продолжить вывод?',
      options: [
        {
          id: 'bounded',
          label: 'Известен срок получения доступного тогда остатка; остальные вопросы и решение остаются открытыми.',
        },
        {
          id: 'whole-sum',
          label: 'Теперь известно, что вся первоначальная сумма сохранится и будет доступна к дате.',
        },
        {
          id: 'automatic-decision',
          label: 'Теперь Саша обязательно должен принять предложение.',
        },
      ],
      expected: ['bounded'],
    },
    feedback: {
      successTitle: 'Новый вывод не стал шире нового факта',
      nuanceTitle: 'В реплике появилось больше, чем в новом факте',
      explanation: 'Подтверждён только срок получения доступного на тот момент остатка. Сколько денег останется, повторится ли результат и как решит Саша, из этого не следует.',
      supported: 'Срок получения доступного на тот момент остатка.',
      open: 'Размер остатка, повторяемость, потери, ответственность и решение Саши.',
    },
  },
}

export const comparisonMechanicEntries = comparisonMechanicSlugs.map(
  (slug) => comparisonMechanics[slug],
)

export function isComparisonMechanicSlug(value: string | null): value is ComparisonMechanicSlug {
  return value !== null && comparisonMechanicSlugs.includes(value as ComparisonMechanicSlug)
}

export function mechanicPrompts(mechanic: ComparisonMechanic): readonly LearnerPrompt[] {
  return mechanic.renderer === 'practice' ? mechanic.practice.prompts : [mechanic.prompt]
}
