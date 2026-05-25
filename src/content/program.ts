import { z } from 'zod'

const blockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('heading'),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('paragraph'),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('list'),
    items: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal('quote'),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('callout'),
    tone: z.string().optional(),
    title: z.string().optional(),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('image'),
    src: z.string().min(1),
    alt: z.string(),
  }),
  z.object({
    type: z.literal('video'),
    src: z.string().min(1),
    title: z.string().min(1),
  }),
])

export const programSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  modules: z.array(
    z.object({
      id: z.string().min(1),
      slug: z.string().min(1),
      title: z.string().min(1),
      description: z.string().optional(),
      order: z.number().int(),
      lessons: z.array(
        z.object({
          id: z.string().min(1),
          slug: z.string().min(1),
          title: z.string().min(1),
          description: z.string().optional(),
          order: z.number().int(),
          estimatedMinutes: z.number().int().positive().optional(),
          blocks: z.array(blockSchema),
        }),
      ),
    }),
  ),
})

export type Program = z.infer<typeof programSchema>
export type Module = Program['modules'][number]
export type Lesson = Module['lessons'][number]
export type LessonBlock = Lesson['blocks'][number]

export function parseProgram(data: unknown) {
  return programSchema.safeParse(data)
}

export function getOrderedModules(program: Program) {
  return [...program.modules].sort((a, b) => a.order - b.order)
}

export function getOrderedLessons(module: Module) {
  return [...module.lessons].sort((a, b) => a.order - b.order)
}

export function getAllLessons(program: Program) {
  return getOrderedModules(program).flatMap((module) =>
    getOrderedLessons(module).map((lesson) => ({ module, lesson })),
  )
}
