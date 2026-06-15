import { z } from 'zod'

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const markdownMarkerPattern = /(\*\*|\*[^*\n]+\*|__|`|\[[^\]\n]+\]\([^)]+\)|<\/?u>)/iu
const markdownHeadingPattern = /^\s{0,3}#{1,6}\s/um
const markdownListPattern = /^\s*(?:[-*+]|\d+[.)])\s+/um
const unsupportedHtmlTagPattern = /<\/?(?!u\b)[a-z][^>]*>/iu
const unsafeUnderlineTagPattern = /<u\s+[^>]*>/iu

function isPlainText(value: string) {
  return !markdownMarkerPattern.test(value) && !markdownHeadingPattern.test(value) && !markdownListPattern.test(value)
}

function isSupportedMarkdownText(value: string) {
  return (
    !unsupportedHtmlTagPattern.test(value) &&
    !unsafeUnderlineTagPattern.test(value) &&
    !markdownHeadingPattern.test(value) &&
    !markdownListPattern.test(value)
  )
}

const plainStringSchema = z.string().refine(isPlainText, 'Markdown is not supported in this plain-text field')
const markdownStringSchema = z.string().refine(
  isSupportedMarkdownText,
  'Markdown text supports paragraphs, inline emphasis, links, and <u> only; headings, lists, and arbitrary HTML are not supported',
)
const nonEmptyPlainTextSchema = plainStringSchema.min(1)
const nonEmptyMarkdownTextSchema = markdownStringSchema.min(1)
const optionalPlainTextSchema = plainStringSchema.optional()
const optionalMarkdownTextSchema = markdownStringSchema.optional()
const checkabilitySchema = z.enum(['objective', 'subjective', 'mixed'])

export type MarkdownText = string
export type PlainText = string

const choiceOptionSchema = z.object({
  id: nonEmptyPlainTextSchema,
  label: nonEmptyPlainTextSchema,
  isCorrect: z.boolean().optional(),
  feedback: optionalMarkdownTextSchema,
}).strict()

const categorySchema = z.object({
  id: nonEmptyPlainTextSchema,
  label: nonEmptyPlainTextSchema,
}).strict()

const categorizationItemSchema = z.object({
  id: nonEmptyPlainTextSchema,
  label: nonEmptyPlainTextSchema,
  correctCategoryId: nonEmptyPlainTextSchema,
  feedback: optionalMarkdownTextSchema,
}).strict()

const customOptionSchema = z.object({
  label: nonEmptyPlainTextSchema,
  placeholder: nonEmptyPlainTextSchema.optional(),
}).strict()

const statisticItemSchema = z.object({
  value: nonEmptyPlainTextSchema,
  label: nonEmptyMarkdownTextSchema,
}).strict()

const cardStatisticsSchema = z.object({
  title: nonEmptyPlainTextSchema.optional(),
  items: z.array(statisticItemSchema).min(1),
  sources: z.array(nonEmptyMarkdownTextSchema).optional(),
}).strict()

const cardBaseSchema = z.object({
  id: nonEmptyPlainTextSchema,
  order: z.number().int().nonnegative(),
  title: optionalPlainTextSchema,
  sourceSection: optionalPlainTextSchema,
  ctaLabel: nonEmptyPlainTextSchema.optional(),
  thinkingType: optionalPlainTextSchema,
  develops: optionalPlainTextSchema,
  checkability: checkabilitySchema.optional(),
  statistics: cardStatisticsSchema.optional(),
}).strict()

export const cardSchema = z.discriminatedUnion('type', [
  cardBaseSchema.extend({
    type: z.literal('theory'),
    body: nonEmptyMarkdownTextSchema,
    examples: z.array(nonEmptyPlainTextSchema).optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('video'),
    title: nonEmptyPlainTextSchema,
    src: nonEmptyPlainTextSchema,
    provider: optionalPlainTextSchema,
    transcript: optionalMarkdownTextSchema,
    timecodes: z
      .array(
        z.object({
          time: nonEmptyPlainTextSchema,
          label: nonEmptyPlainTextSchema,
        }).strict(),
      )
      .optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('callout'),
    tone: z.enum(['info', 'warning', 'success', 'reflection']).optional(),
    body: nonEmptyMarkdownTextSchema,
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('single_choice'),
    question: nonEmptyMarkdownTextSchema,
    options: z.array(choiceOptionSchema).min(2),
    correctOptionId: optionalPlainTextSchema,
    feedback: optionalMarkdownTextSchema,
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('multi_select'),
    question: nonEmptyMarkdownTextSchema,
    options: z.array(choiceOptionSchema).min(2),
    feedback: optionalMarkdownTextSchema,
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('categorization'),
    question: nonEmptyMarkdownTextSchema,
    categories: z.array(categorySchema).min(2),
    items: z.array(categorizationItemSchema).min(2),
    feedback: optionalMarkdownTextSchema,
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('reflection'),
    prompt: nonEmptyMarkdownTextSchema,
    inputType: z.enum(['text', 'single_select', 'multi_select', 'table', 'freeform']).optional(),
    options: z.array(nonEmptyPlainTextSchema).optional(),
    customOption: customOptionSchema.optional(),
    saveKey: optionalPlainTextSchema,
    guidance: optionalMarkdownTextSchema,
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('scenario'),
    body: nonEmptyMarkdownTextSchema,
    question: optionalMarkdownTextSchema,
    options: z.array(choiceOptionSchema).optional(),
    correctOptionId: optionalPlainTextSchema,
    feedback: optionalMarkdownTextSchema,
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('artifact'),
    body: nonEmptyMarkdownTextSchema,
    template: z.array(nonEmptyMarkdownTextSchema).optional(),
    variants: z.array(nonEmptyPlainTextSchema).optional(),
    customOption: customOptionSchema.optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('checklist'),
    body: optionalMarkdownTextSchema,
    items: z.array(nonEmptyPlainTextSchema).min(1),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('summary'),
    body: optionalMarkdownTextSchema,
    points: z.array(nonEmptyMarkdownTextSchema).min(1),
    nextStep: optionalMarkdownTextSchema,
  }).strict(),
]).superRefine((card, ctx) => {
  if (card.type === 'reflection' && card.customOption && card.inputType !== 'single_select') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'customOption is only supported for inputType single_select',
      path: ['customOption'],
    })
  }

  if (card.type === 'artifact' && card.customOption && !card.variants?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'customOption requires variants',
      path: ['customOption'],
    })
  }

  if ('correctOptionId' in card && card.correctOptionId) {
    if (!('options' in card) || !card.options) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'correctOptionId requires options',
        path: ['correctOptionId'],
      })
      return
    }

    if (!card.options.some((option) => option.id === card.correctOptionId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'correctOptionId must match one of the option ids',
        path: ['correctOptionId'],
      })
    }
  }

  if (card.type === 'multi_select') {
    const hasCorrectOption = card.options.some((option) => option.isCorrect === true)
    const hasIncorrectOption = card.options.some((option) => option.isCorrect !== true)

    if (!hasCorrectOption) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'multi_select requires at least one correct option',
        path: ['options'],
      })
    }

    if (!hasIncorrectOption) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'multi_select requires at least one incorrect option',
        path: ['options'],
      })
    }
  }

  if (card.type === 'categorization') {
    const categoryIds = new Set<string>()
    for (const [categoryIndex, category] of card.categories.entries()) {
      if (categoryIds.has(category.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'category id must be unique',
          path: ['categories', categoryIndex, 'id'],
        })
      }
      categoryIds.add(category.id)
    }

    const itemIds = new Set<string>()
    for (const [itemIndex, item] of card.items.entries()) {
      if (itemIds.has(item.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'item id must be unique',
          path: ['items', itemIndex, 'id'],
        })
      }
      itemIds.add(item.id)

      if (!categoryIds.has(item.correctCategoryId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'correctCategoryId must match one of the category ids',
          path: ['items', itemIndex, 'correctCategoryId'],
        })
      }
    }
  }
})

export const lessonSchema = z.object({
  id: nonEmptyPlainTextSchema,
  slug: slugSchema,
  title: nonEmptyPlainTextSchema,
  subtitle: optionalPlainTextSchema,
  description: optionalPlainTextSchema,
  order: z.number().int().nonnegative(),
  estimatedMinutes: z.number().int().positive().optional(),
  learningGoal: optionalPlainTextSchema,
  mainSkill: optionalPlainTextSchema,
  tags: z.array(nonEmptyPlainTextSchema).optional(),
  sourceSection: optionalPlainTextSchema,
  cards: z.array(cardSchema).min(1),
}).strict()

const supplementalItemSchema = z.object({
  id: nonEmptyPlainTextSchema,
  title: nonEmptyPlainTextSchema,
  sourceSection: optionalPlainTextSchema,
  type: optionalPlainTextSchema,
  summary: nonEmptyPlainTextSchema,
  content: z.array(nonEmptyPlainTextSchema).optional(),
}).strict()

const supplementalSchema = z
  .object({
    strategy: optionalPlainTextSchema,
    sourceFiles: z.array(nonEmptyPlainTextSchema).optional(),
    trainings: z.array(supplementalItemSchema).optional(),
    spacedRepetition: z.array(supplementalItemSchema).optional(),
    expansionScenarios: z.array(supplementalItemSchema).optional(),
    editorialRules: z.array(nonEmptyPlainTextSchema).optional(),
    glossary: z
      .array(
        z.object({
          term: nonEmptyPlainTextSchema,
          definition: nonEmptyPlainTextSchema,
        }).strict(),
      )
      .optional(),
    outcome: z.array(nonEmptyPlainTextSchema).optional(),
  })
  .strict()
  .optional()

export const sectionFileSchema = z.object({
  schemaVersion: z.literal(1),
  id: nonEmptyPlainTextSchema,
  slug: slugSchema,
  title: nonEmptyPlainTextSchema,
  description: optionalPlainTextSchema,
  order: z.number().int().nonnegative(),
  source: nonEmptyPlainTextSchema,
  lessons: z.array(lessonSchema).min(1),
  supplemental: supplementalSchema,
}).strict()

const sectionRefSchema = z.object({
  id: nonEmptyPlainTextSchema,
  slug: slugSchema,
  title: nonEmptyPlainTextSchema,
  description: optionalPlainTextSchema,
  order: z.number().int().nonnegative(),
  path: nonEmptyPlainTextSchema,
}).strict()

const levelFileSchema = z.object({
  schemaVersion: z.literal(1),
  id: nonEmptyPlainTextSchema,
  slug: slugSchema,
  title: nonEmptyPlainTextSchema,
  description: optionalPlainTextSchema,
  order: z.number().int().nonnegative(),
  source: optionalPlainTextSchema,
  sections: z.array(sectionRefSchema).min(1),
}).strict()

const levelRefSchema = z.object({
  id: nonEmptyPlainTextSchema,
  slug: slugSchema,
  title: nonEmptyPlainTextSchema,
  description: optionalPlainTextSchema,
  order: z.number().int().nonnegative(),
  path: nonEmptyPlainTextSchema,
}).strict()

const programManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: nonEmptyPlainTextSchema,
  slug: slugSchema,
  title: nonEmptyPlainTextSchema,
  description: optionalPlainTextSchema,
  levels: z.array(levelRefSchema).min(1),
}).strict()

export const levelSchema = levelFileSchema.extend({
  sections: z.array(sectionFileSchema).min(1),
}).strict()

export const programSchema = programManifestSchema.extend({
  levels: z.array(levelSchema).min(1),
}).strict()

export type Program = z.infer<typeof programSchema>
export type Level = Program['levels'][number]
export type Section = Level['sections'][number]
export type Lesson = Section['lessons'][number]
export type Card = Lesson['cards'][number]

export function parseProgram(data: unknown) {
  return programSchema.safeParse(data)
}
