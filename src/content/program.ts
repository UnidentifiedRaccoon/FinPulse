import { z } from 'zod'

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const checkabilitySchema = z.enum(['objective', 'subjective', 'mixed'])
const choiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  isCorrect: z.boolean().optional(),
  feedback: z.string().optional(),
}).strict()

const categorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
}).strict()

const categorizationItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  correctCategoryId: z.string().min(1),
  feedback: z.string().optional(),
}).strict()

const customOptionSchema = z.object({
  label: z.string().min(1),
  placeholder: z.string().min(1).optional(),
}).strict()

const statisticItemSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
}).strict()

const cardStatisticsSchema = z.object({
  title: z.string().min(1).optional(),
  items: z.array(statisticItemSchema).min(1),
  sources: z.array(z.string().min(1)).optional(),
}).strict()

const cardBaseSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().optional(),
  sourceSection: z.string().optional(),
  thinkingType: z.string().optional(),
  develops: z.string().optional(),
  checkability: checkabilitySchema.optional(),
  statistics: cardStatisticsSchema.optional(),
}).strict()

export const cardSchema = z.discriminatedUnion('type', [
  cardBaseSchema.extend({
    type: z.literal('theory'),
    body: z.string().min(1),
    examples: z.array(z.string().min(1)).optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('video'),
    title: z.string().min(1),
    src: z.string().min(1),
    provider: z.string().optional(),
    transcript: z.string().optional(),
    timecodes: z
      .array(
        z.object({
          time: z.string().min(1),
          label: z.string().min(1),
        }).strict(),
      )
      .optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('callout'),
    tone: z.enum(['info', 'warning', 'success', 'reflection']).optional(),
    body: z.string().min(1),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('single_choice'),
    question: z.string().min(1),
    options: z.array(choiceOptionSchema).min(2),
    correctOptionId: z.string().optional(),
    feedback: z.string().optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('multi_select'),
    question: z.string().min(1),
    options: z.array(choiceOptionSchema).min(2),
    feedback: z.string().optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('categorization'),
    question: z.string().min(1),
    categories: z.array(categorySchema).min(2),
    items: z.array(categorizationItemSchema).min(2),
    feedback: z.string().optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('reflection'),
    prompt: z.string().min(1),
    inputType: z.enum(['text', 'single_select', 'multi_select', 'table', 'freeform']).optional(),
    options: z.array(z.string().min(1)).optional(),
    customOption: customOptionSchema.optional(),
    saveKey: z.string().optional(),
    guidance: z.string().optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('scenario'),
    body: z.string().min(1),
    question: z.string().optional(),
    options: z.array(choiceOptionSchema).optional(),
    correctOptionId: z.string().optional(),
    feedback: z.string().optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('artifact'),
    body: z.string().min(1),
    template: z.array(z.string().min(1)).optional(),
    variants: z.array(z.string().min(1)).optional(),
    customOption: customOptionSchema.optional(),
    readOnly: z.boolean().optional(),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('checklist'),
    body: z.string().optional(),
    items: z.array(z.string().min(1)).min(1),
  }).strict(),
  cardBaseSchema.extend({
    type: z.literal('summary'),
    body: z.string().optional(),
    points: z.array(z.string().min(1)).min(1),
    nextStep: z.string().optional(),
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
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  estimatedMinutes: z.number().int().positive().optional(),
  learningGoal: z.string().optional(),
  mainSkill: z.string().optional(),
  tags: z.array(z.string().min(1)).optional(),
  sourceSection: z.string().optional(),
  cards: z.array(cardSchema).min(1),
}).strict()

const supplementalItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  sourceSection: z.string().optional(),
  type: z.string().optional(),
  summary: z.string().min(1),
  content: z.array(z.string().min(1)).optional(),
}).strict()

const supplementalSchema = z
  .object({
    strategy: z.string().optional(),
    sourceFiles: z.array(z.string().min(1)).optional(),
    trainings: z.array(supplementalItemSchema).optional(),
    spacedRepetition: z.array(supplementalItemSchema).optional(),
    expansionScenarios: z.array(supplementalItemSchema).optional(),
    editorialRules: z.array(z.string().min(1)).optional(),
    glossary: z
      .array(
        z.object({
          term: z.string().min(1),
          definition: z.string().min(1),
        }).strict(),
      )
      .optional(),
    outcome: z.array(z.string().min(1)).optional(),
  })
  .strict()
  .optional()

export const unitFileSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  source: z.string().min(1),
  lessons: z.array(lessonSchema).min(1),
  supplemental: supplementalSchema,
}).strict()

const unitRefSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  path: z.string().min(1),
}).strict()

const moduleFileSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  source: z.string().optional(),
  units: z.array(unitRefSchema).min(1),
}).strict()

const moduleRefSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  path: z.string().min(1),
}).strict()

export const programManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  modules: z.array(moduleRefSchema).min(1),
}).strict()

export const moduleSchema = moduleFileSchema.extend({
  units: z.array(unitFileSchema).min(1),
}).strict()

export const programSchema = programManifestSchema.extend({
  modules: z.array(moduleSchema).min(1),
}).strict()

export type ProgramManifest = z.infer<typeof programManifestSchema>
export type ModuleRef = z.infer<typeof moduleRefSchema>
export type ModuleFile = z.infer<typeof moduleFileSchema>
export type UnitRef = z.infer<typeof unitRefSchema>
export type UnitFile = z.infer<typeof unitFileSchema>
export type Program = z.infer<typeof programSchema>
export type Module = Program['modules'][number]
export type Unit = Module['units'][number]
export type Lesson = Unit['lessons'][number]
export type Card = Lesson['cards'][number]

export function parseProgram(data: unknown) {
  return programSchema.safeParse(data)
}
