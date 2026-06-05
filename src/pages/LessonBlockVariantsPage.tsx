import {
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronLeft,
  Coffee,
  CreditCard,
  Droplets,
  Eye,
  ShoppingBag,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const bodyParagraphs = [
  'Большие траты мы помним. А маленькие — кофе, такси, подписка, доставка — проходят мимо внимания.',
  'За месяц из них набегает заметная сумма. Главное правило: чтобы управлять деньгами, их сначала нужно увидеть.',
  'Факт из сценария урока: 5 трат по 200 ₽ в день — это 30 000 ₽ в месяц. По отдельности незаметно, в сумме ощутимо.',
]

const expenseTags = [
  { label: 'Кофе навынос', Icon: Coffee },
  { label: 'Такси или доставка', Icon: Car },
  { label: 'Подписка на сервис', Icon: CreditCard },
  { label: 'Маленькая покупка по дороге', Icon: ShoppingBag },
]

const formulaSteps = ['5 трат', '200 ₽', '30 дней', '30 000 ₽']
const formulaOperators = ['×', '×', '=']

type VariantTone = 'quiet' | 'calculation' | 'rule'

type Variant = {
  id: string
  label: string
  description: string
  tone: VariantTone
}

const variants: Variant[] = [
  {
    id: 'quiet-card',
    label: 'Вариант 1. Чистая карточка',
    description: 'Ближе к текущему reader: мягкий акцент, меньше визуального шума, лучше читаемость длинного текста.',
    tone: 'quiet',
  },
  {
    id: 'calculation-focus',
    label: 'Вариант 2. С расчётом',
    description: 'Выводит главный числовой инсайт наверх и помогает сразу понять масштаб ежедневных мелочей.',
    tone: 'calculation',
  },
  {
    id: 'rule-first',
    label: 'Вариант 3. Через правило',
    description: 'Сначала фиксирует поведенческую мысль урока, а затем раскрывает пример и категории трат.',
    tone: 'rule',
  },
]

export function LessonBlockVariantsPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1180px] flex-col gap-[var(--fr-space-6)] py-[var(--fr-space-2)] text-[var(--fr-text-primary)]">
      <div className="flex flex-col gap-[var(--fr-space-4)]">
        <Button asChild className="w-fit rounded-[var(--fr-radius-md)]" variant="outline">
          <Link to="/lessons/where-money-goes">
            <ChevronLeft data-icon="inline-start" />
            Урок
          </Link>
        </Button>

        <div className="flex flex-col gap-[var(--fr-space-3)]">
          <p className="text-[length:var(--fr-type-caption-md-size)] font-semibold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]">
            Превью дизайн-скейлов
          </p>
          <h1 className="text-[length:var(--fr-type-display-sm-size)] font-bold leading-[var(--fr-type-display-sm-line)] tracking-normal text-[var(--fr-text-primary)]">
            Варианты блока урока
          </h1>
          <p className="max-w-[720px] text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]">
            Три решения для карточки «Деньги утекают по капле». Все варианты используют текущие FinPulse-токены
            цвета, тени, радиуса, spacing и мобильной типографики.
          </p>
        </div>
      </div>

      <LessonChromePreview />

      <div className="grid gap-[var(--fr-space-5)] lg:grid-cols-3">
        {variants.map((variant, index) => (
          <VariantPreview index={index + 1} key={variant.id} variant={variant} />
        ))}
      </div>
    </section>
  )
}

function LessonChromePreview() {
  return (
    <header className="rounded-[var(--fr-radius-xl)] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-[var(--fr-space-4)] shadow-[var(--fr-shadow-sm)]">
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-[var(--fr-space-3)]">
        <span className="flex size-11 items-center justify-center rounded-[var(--fr-radius-md)] bg-[var(--fr-surface-soft)] text-[var(--fr-text-secondary)]">
          <ChevronLeft aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[length:var(--fr-type-caption-md-size)] font-semibold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]">
            T1 Старт · Юнит 1. Деньги и операции
          </p>
          <p className="truncate text-[length:var(--fr-type-heading-sm-size)] font-bold leading-[var(--fr-type-heading-sm-line)] text-[var(--fr-text-primary)]">
            Куда уходят деньги
          </p>
        </div>
        <span className="rounded-[var(--fr-radius-full)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-color-brand-700)]">
          2 из 7
        </span>
      </div>
      <div
        aria-label="Прогресс урока"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={29}
        className="mt-[var(--fr-space-4)] h-2 overflow-hidden rounded-[var(--fr-radius-full)] bg-[var(--fr-color-brand-100)]"
        role="progressbar"
      >
        <div className="h-full w-[29%] rounded-[var(--fr-radius-full)] bg-[var(--fr-color-sky-500)]" />
      </div>
    </header>
  )
}

function VariantPreview({ variant, index }: { variant: Variant; index: number }) {
  return (
    <article
      aria-labelledby={`${variant.id}-label`}
      className="flex min-h-[34rem] flex-col gap-[var(--fr-space-4)] rounded-[var(--fr-radius-xl)] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-[var(--fr-space-5)] shadow-[var(--fr-shadow-md)]"
    >
      <div className="flex flex-col gap-[var(--fr-space-2)]">
        <p
          className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]"
          id={`${variant.id}-label`}
        >
          {variant.label}
        </p>
        <p className="text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]">
          {variant.description}
        </p>
      </div>

      <div className="h-px bg-[var(--fr-border-subtle)]" />

      {variant.tone === 'quiet' ? <QuietVariant /> : null}
      {variant.tone === 'calculation' ? <CalculationVariant /> : null}
      {variant.tone === 'rule' ? <RuleVariant index={index} /> : null}
    </article>
  )
}

function QuietVariant() {
  return (
    <div className="flex flex-1 flex-col gap-[var(--fr-space-5)]">
      <div className="flex items-start gap-[var(--fr-space-3)]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--fr-radius-lg)] bg-[var(--fr-color-brand-50)] text-[var(--fr-color-sky-600)]">
          <Droplets aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-balance text-[length:var(--fr-type-heading-lg-size)] font-bold leading-[var(--fr-type-heading-lg-line)] tracking-normal text-[var(--fr-text-primary)]">
            Деньги утекают по капле
          </h2>
          <p className="mt-[var(--fr-space-1)] text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-tertiary)]">
            Одно наблюдение перед практикой
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--fr-space-4)]">
        {bodyParagraphs.map((paragraph, index) => (
          <p
            className={cn(
              'text-pretty text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]',
              index === 2 &&
                'rounded-[var(--fr-radius-lg)] border border-[var(--fr-color-brand-200)] bg-[var(--fr-color-brand-50)] p-[var(--fr-space-4)] font-medium text-[var(--fr-text-primary)]',
            )}
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <TagList />
    </div>
  )
}

function CalculationVariant() {
  return (
    <div className="flex flex-1 flex-col gap-[var(--fr-space-5)]">
      <div className="flex flex-col gap-[var(--fr-space-3)]">
        <div>
          <h2 className="text-balance text-[length:var(--fr-type-heading-lg-size)] font-bold leading-[var(--fr-type-heading-lg-line)] tracking-normal text-[var(--fr-text-primary)]">
            Деньги утекают по капле
          </h2>
          <p className="mt-[var(--fr-space-2)] text-[length:var(--fr-type-body-md-size)] leading-[var(--fr-type-body-md-line)] text-[var(--fr-text-secondary)]">
            Мелкие траты становятся понятнее, когда их видно в месячном масштабе.
          </p>
        </div>
      </div>

      <div className="rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-[var(--fr-space-4)]">
        <div className="fr-calculation-container" data-step-count={formulaSteps.length}>
          <div className="fr-calculation-steps" data-step-count={formulaSteps.length}>
            {formulaSteps.map((step, index) => (
              <FormulaStep index={index} key={step} step={step} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--fr-space-4)]">
        <p className="text-pretty text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]">
          Большие траты мы помним. А маленькие — кофе, такси, подписка, доставка — часто проходят мимо внимания.
        </p>
        <p className="text-pretty text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]">
          Управлять можно только тем, что замечаешь. Поэтому первый шаг — увидеть повторяющиеся мелочи без стыда и
          оценок.
        </p>
      </div>

      <TagList compact withIcons={false} />
    </div>
  )
}

function FormulaStep({ step, index }: { step: string; index: number }) {
  const isResult = index === formulaSteps.length - 1
  const operator = formulaOperators[index]

  return (
    <>
      <div
        className={isResult ? 'fr-calculation-step fr-calculation-step--result' : 'fr-calculation-step'}
      >
        {step}
      </div>
      {operator ? (
        <span className="fr-calculation-operator">
          {operator}
        </span>
      ) : null}
    </>
  )
}

function RuleVariant({ index }: { index: number }) {
  return (
    <div className="flex flex-1 flex-col gap-[var(--fr-space-5)]">
      <div className="flex items-start justify-between gap-[var(--fr-space-4)]">
        <div className="min-w-0">
          <h2 className="text-balance text-[length:var(--fr-type-heading-lg-size)] font-bold leading-[var(--fr-type-heading-lg-line)] tracking-normal text-[var(--fr-text-primary)]">
            Деньги утекают по капле
          </h2>
          <p className="mt-[var(--fr-space-2)] text-[length:var(--fr-type-body-md-size)] leading-[var(--fr-type-body-md-line)] text-[var(--fr-text-secondary)]">
            Сначала замечаем, потом выбираем, чем управлять.
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--fr-radius-full)] bg-[var(--fr-color-brand-50)] text-[length:var(--fr-type-number-md-size)] font-bold leading-[var(--fr-type-number-md-line)] tabular-nums text-[var(--fr-color-brand-700)]">
          {index}
        </span>
      </div>

      <div className="grid gap-[var(--fr-space-3)]">
        <RuleStep Icon={Eye} label="Увидеть" text="Найти повторяющиеся мелочи за день." />
        <RuleStep Icon={WalletCards} label="Сложить" text="Посмотреть, во что они превращаются за месяц." />
        <RuleStep Icon={CheckCircle2} label="Выбрать" text="Оставить то, что правда важно, и убрать лишнее." />
      </div>

      <p className="text-pretty text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]">
        5 трат по 200 ₽ в день — это 30 000 ₽ в месяц. По отдельности незаметно, в сумме ощутимо.
      </p>

      <div className="mt-auto rounded-[var(--fr-radius-lg)] bg-[var(--fr-color-learn-almost-50)] p-[var(--fr-space-4)] text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]">
        <span className="font-bold text-[var(--fr-text-primary)]">Мягкий фокус:</span> не запрещать себе мелкие покупки,
        а сначала увидеть картину.
      </div>
    </div>
  )
}

function RuleStep({ Icon, label, text }: { Icon: LucideIcon; label: string; text: string }) {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-[var(--fr-space-3)] rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] p-[var(--fr-space-3)]">
      <span className="flex size-9 items-center justify-center rounded-[var(--fr-radius-md)] bg-[var(--fr-surface-card)] text-[var(--fr-color-sky-600)]">
        <Icon aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-primary)]">
          {label}
        </p>
        <p className="text-[length:var(--fr-type-caption-md-size)] leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-secondary)]">
          {text}
        </p>
      </div>
    </div>
  )
}

function TagList({ compact = false, withIcons = true }: { compact?: boolean; withIcons?: boolean }) {
  return (
    <ul className={cn('mt-auto flex flex-wrap gap-[var(--fr-space-2)]', compact && 'gap-[var(--fr-space-1)]')}>
      {expenseTags.map(({ label, Icon }) => (
        <li
          className="inline-flex min-h-9 max-w-full items-center gap-[var(--fr-space-2)] rounded-[var(--fr-radius-full)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] font-semibold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
          key={label}
        >
          {withIcons ? <Icon aria-hidden="true" className="size-4 shrink-0 text-[var(--fr-color-sky-600)]" /> : null}
          <span className="truncate">{label}</span>
        </li>
      ))}
      <li className="inline-flex min-h-9 items-center gap-[var(--fr-space-2)] rounded-[var(--fr-radius-full)] bg-[var(--fr-color-brand-50)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-color-brand-700)]">
        {withIcons ? <CalendarDays aria-hidden="true" className="size-4 shrink-0" /> : null}
        За месяц
      </li>
    </ul>
  )
}
