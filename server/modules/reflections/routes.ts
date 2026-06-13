import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import type { Card } from '../../../src/content/program'
import type { AppDatabase } from '../../db/connection'
import type { ReflectionAnswerEntry, ReflectionAnswerUpsert } from '../../db/reflectionAnswersRepository'
import { sendError } from '../../lib/http'
import { getSessionUser } from '../../lib/sessions'
import type { CardDetails, ContentService } from '../content/contentService'

const MAX_SHORT_TEXT_LENGTH = 2_000
const MAX_TEXT_LENGTH = 20_000

const answerStringSchema = z.string().trim().max(MAX_SHORT_TEXT_LENGTH)
const answerTextSchema = z.string().trim().max(MAX_TEXT_LENGTH)

const reflectionAnswerBodySchema = z
  .object({
    textValue: answerTextSchema.optional(),
    singleValue: answerStringSchema.optional(),
    multiValues: z.array(answerStringSchema).max(100).optional(),
    selectedVariant: answerStringSchema.optional(),
    checkedRows: z.array(answerStringSchema).max(200).optional(),
    templateValues: z.array(answerTextSchema).max(200).optional(),
    fallbackValue: answerTextSchema.optional(),
  })
  .strict()

const paramsSchema = z
  .object({
    cardId: z.string().min(1).optional(),
  })
  .strict()

type ReflectionAnswerPayload = z.infer<typeof reflectionAnswerBodySchema>
type PersistableCard = Extract<Card, { type: 'reflection' | 'artifact' }>
type PersistableCardDetails = Omit<CardDetails, 'card'> & { card: PersistableCard }

export function registerReflectionRoutes(app: FastifyInstance, db: AppDatabase, content: ContentService) {
  app.get('/api/reflections', async (request, reply) => {
    const user = await getSessionUser(db, request)
    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    return {
      answers: withContentTemplates(await db.reflectionAnswers.listReflectionAnswers(user.id), content),
    }
  })

  app.put('/api/reflections/:cardId', async (request, reply) => {
    const user = await getSessionUser(db, request)
    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    const params = paramsSchema.parse(request.params)
    const cardDetails = params.cardId ? content.getCardDetails(params.cardId) : null
    if (!cardDetails) {
      return sendError(reply, 404, 'not_found', 'Card not found')
    }

    if (!isPersistableCard(cardDetails)) {
      return sendError(reply, 400, 'non_persistable_card', 'Only reflection and artifact cards can store answers')
    }

    const parsed = reflectionAnswerBodySchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_reflection_payload', 'Reflection answer payload is invalid')
    }

    if (!hasRequiredAnswerValue(cardDetails.card, parsed.data)) {
      return sendError(reply, 400, 'empty_reflection_answer', 'Reflection answer is empty')
    }

    await db.reflectionAnswers.upsertReflectionAnswer(toReflectionAnswerUpsert(user.id, cardDetails, parsed.data))

    return {
      answers: withContentTemplates(await db.reflectionAnswers.listReflectionAnswers(user.id), content),
    }
  })
}

function withContentTemplates(answers: ReflectionAnswerEntry[], content: ContentService): ReflectionAnswerEntry[] {
  return answers.map((answer) => {
    if (answer.cardType !== 'artifact') return answer

    const cardDetails = content.getCardDetails(answer.cardId)
    const template = cardDetails?.card.type === 'artifact' && cardDetails.card.template?.length ? cardDetails.card.template : null

    return {
      ...answer,
      template,
    }
  })
}

function toReflectionAnswerUpsert(
  userId: string,
  cardDetails: PersistableCardDetails,
  answer: ReflectionAnswerPayload,
): ReflectionAnswerUpsert {
  const context = getReflectionContext(cardDetails)

  return {
    userId,
    cardId: cardDetails.card.id,
    saveKey: context.saveKey,
    lessonSlug: cardDetails.lesson.slug,
    levelSlug: cardDetails.level.slug,
    sectionSlug: cardDetails.section.slug,
    cardType: cardDetails.card.type,
    title: context.title,
    prompt: context.prompt,
    contextTitle: context.contextTitle,
    sourceSection: context.sourceSection,
    levelTitle: cardDetails.level.title,
    sectionTitle: cardDetails.section.title,
    lessonTitle: cardDetails.lesson.title,
    answer: toJsonRecord(answer),
  }
}

function getReflectionContext(cardDetails: PersistableCardDetails) {
  const { card, lesson } = cardDetails

  return {
    saveKey: card.type === 'reflection' ? (card.saveKey ?? null) : null,
    title: card.title ?? null,
    prompt: card.type === 'reflection' ? card.prompt : card.body,
    contextTitle: card.title ?? lesson.title,
    sourceSection: card.sourceSection ?? lesson.sourceSection ?? null,
  }
}

function isPersistableCard(cardDetails: CardDetails): cardDetails is PersistableCardDetails {
  return cardDetails.card.type === 'reflection' || cardDetails.card.type === 'artifact'
}

function hasRequiredAnswerValue(card: PersistableCard, answer: ReflectionAnswerPayload) {
  if (card.type === 'reflection') {
    const inputType = card.inputType ?? 'freeform'
    if (inputType === 'single_select') return hasText(answer.singleValue)
    if (inputType === 'multi_select') return hasAnyText(answer.multiValues)
    return hasText(answer.textValue)
  }

  if (card.template?.length) {
    return hasAnyText(answer.templateValues)
  }

  return hasText(answer.fallbackValue) || hasText(answer.selectedVariant)
}

function hasText(value: string | undefined) {
  return Boolean(value?.trim())
}

function hasAnyText(values: string[] | undefined) {
  return Boolean(values?.some((value) => hasText(value)))
}

function toJsonRecord(answer: ReflectionAnswerPayload): Record<string, string | string[]> {
  return Object.fromEntries(Object.entries(answer).filter(([, value]) => value !== undefined)) as Record<
    string,
    string | string[]
  >
}
