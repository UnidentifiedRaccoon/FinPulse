import { z } from 'zod'

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const checkabilitySchema = z.enum(['objective', 'subjective', 'mixed'])
const choiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  isCorrect: z.boolean().optional(),
  feedback: z.string().optional(),
})

const cardBaseSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().optional(),
  sourceSection: z.string().optional(),
  thinkingType: z.string().optional(),
  develops: z.string().optional(),
  checkability: checkabilitySchema.optional(),
})

const cardSchema = z.discriminatedUnion('type', [
  cardBaseSchema.extend({
    type: z.literal('theory'),
    body: z.string().min(1),
    examples: z.array(z.string().min(1)).optional(),
  }),
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
        }),
      )
      .optional(),
  }),
  cardBaseSchema.extend({
    type: z.literal('callout'),
    tone: z.enum(['info', 'warning', 'success', 'reflection']).optional(),
    body: z.string().min(1),
  }),
  cardBaseSchema.extend({
    type: z.literal('single_choice'),
    question: z.string().min(1),
    options: z.array(choiceOptionSchema).min(2),
    correctOptionId: z.string().optional(),
    feedback: z.string().optional(),
    readOnly: z.boolean().optional(),
  }),
  cardBaseSchema.extend({
    type: z.literal('reflection'),
    prompt: z.string().min(1),
    inputType: z.enum(['text', 'single_select', 'multi_select', 'table', 'freeform']).optional(),
    options: z.array(z.string().min(1)).optional(),
    saveKey: z.string().optional(),
    guidance: z.string().optional(),
    readOnly: z.boolean().optional(),
  }),
  cardBaseSchema.extend({
    type: z.literal('scenario'),
    body: z.string().min(1),
    question: z.string().optional(),
    options: z.array(choiceOptionSchema).optional(),
    correctOptionId: z.string().optional(),
    feedback: z.string().optional(),
    readOnly: z.boolean().optional(),
  }),
  cardBaseSchema.extend({
    type: z.literal('artifact'),
    body: z.string().min(1),
    template: z.array(z.string().min(1)).optional(),
    variants: z.array(z.string().min(1)).optional(),
    readOnly: z.boolean().optional(),
  }),
  cardBaseSchema.extend({
    type: z.literal('checklist'),
    body: z.string().optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
  cardBaseSchema.extend({
    type: z.literal('summary'),
    body: z.string().optional(),
    points: z.array(z.string().min(1)).min(1),
    nextStep: z.string().optional(),
  }),
])

const lessonSchema = z.object({
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
})

const supplementalItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  sourceSection: z.string().optional(),
  type: z.string().optional(),
  summary: z.string().min(1),
})

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
        }),
      )
      .optional(),
    outcome: z.array(z.string().min(1)).optional(),
  })
  .optional()

const unitFileSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  source: z.string().min(1),
  lessons: z.array(lessonSchema).min(1),
  supplemental: supplementalSchema,
})

const unitRefSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  path: z.string().min(1),
})

const moduleFileSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  source: z.string().optional(),
  units: z.array(unitRefSchema).min(1),
})

const moduleRefSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative(),
  path: z.string().min(1),
})

export const programManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  modules: z.array(moduleRefSchema).min(1),
})

export const moduleSchema = moduleFileSchema.extend({
  units: z.array(unitFileSchema).min(1),
})

export const programSchema = programManifestSchema.extend({
  modules: z.array(moduleSchema).min(1),
})

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

export function parseProgramManifest(data: unknown) {
  return programManifestSchema.safeParse(data)
}

export function parseModuleFile(data: unknown) {
  return moduleFileSchema.safeParse(data)
}

export function parseUnitFile(data: unknown) {
  return unitFileSchema.safeParse(data)
}

export function parseProgram(data: unknown) {
  return programSchema.safeParse(data)
}

export function getOrderedModules(program: Program) {
  return [...program.modules].sort((a, b) => a.order - b.order)
}

export function getOrderedUnits(module: Module) {
  return [...module.units].sort((a, b) => a.order - b.order)
}

export function getOrderedLessons(unit: Unit) {
  return [...unit.lessons].sort((a, b) => a.order - b.order)
}

export function getOrderedCards(lesson: Lesson) {
  return [...lesson.cards].sort((a, b) => a.order - b.order)
}

export function getAllLessons(program: Program) {
  return getOrderedModules(program).flatMap((module) =>
    getOrderedUnits(module).flatMap((unit) =>
      getOrderedLessons(unit).map((lesson) => ({ module, unit, lesson })),
    ),
  )
}
