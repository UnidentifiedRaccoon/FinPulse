'use client'

import { CheckCircle2, ChevronRight, RotateCcw, Save } from 'lucide-react'
import type { ReactNode, UIEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MemoryRouter } from 'react-router'

import { LearningContentProvider, type LearningContentClient } from '@/api/contentClient'
import type { ApiUser, LessonDetails, ProgressResponse, ReflectionAnswer, ReflectionAnswerPayload, ReflectionAnswersResponse, SectionDetails } from '@/api/client'
import { DialogPortalBoundaryProvider } from '@/components/ui/dialog'
import { getAllLessons, getOrderedLevels } from '@/content/order'
import { cardSchema, programSchema, type Card, type Lesson, type Level, type Program, type Section } from '@/content/program'
import { LearnerAppShell } from '@/app/LearnerAppShell'
import type { PreviewScreenResetPayload } from '@/features/lesson-reader/LessonSession'

import { AdminApiError, adminApi } from '../../lib/adminApi'
import type {
  AdminContentPreview,
  AdminContentSelection,
  AdminContentTreeResponse,
} from '../../lib/types'

import { AdminShell } from './AdminShell'

type LoadState = {
  adminLogin: string | null
  tree: AdminContentTreeResponse['tree'] | null
  isLoading: boolean
  error: string | null
}

type JsonParseState =
  | {
      ok: true
      value: unknown
    }
  | {
      ok: false
      error: string
    }

type PreviewConfig = {
  client: LearningContentClient
  initialCardId?: string
  initialPath: string
  program: Program
  selectionKey: string
  version: string
}

type PreviewBuildResult =
  | {
      ok: true
      config: PreviewConfig
    }
  | {
      ok: false
      error: string
    }

const PREVIEW_USER: ApiUser = {
  id: 'admin-preview-user',
  login: 'preview@finpulse.local',
  createdAt: '2026-07-04T00:00:00.000Z',
}

const EMPTY_PROGRESS: ProgressResponse = {
  lessons: [],
  cards: [],
}

const EMPTY_REFLECTION_ANSWERS: ReflectionAnswersResponse = {
  answers: [],
}

const UNSAVED_CONTENT_SWITCH_MESSAGE = 'Несохранённые изменения в JSON будут потеряны при переключении. Продолжить?'
const JSON_HIGHLIGHT_TOKEN_PATTERN = /"(?:\\.|[^"\\])*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}[\]:,]/g
const JSON_NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/

export function ContentEditor() {
  const [state, setState] = useState<LoadState>({
    adminLogin: null,
    tree: null,
    isLoading: true,
    error: null,
  })
  const [selection, setSelection] = useState<AdminContentSelection | null>(null)
  const [preview, setPreview] = useState<AdminContentPreview | null>(null)
  const [editorText, setEditorText] = useState('')
  const [lastSavedEditorText, setLastSavedEditorText] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [previewScreenResetKey, setPreviewScreenResetKey] = useState(0)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [editorError, setEditorError] = useState<string | null>(null)

  useEffect(() => {
    void loadInitialState()
  }, [])

  useEffect(() => {
    if (!state.tree || selection) return
    const firstSelection = getInitialSelection(state.tree)
    if (firstSelection) {
      setSelection(firstSelection)
    }
  }, [selection, state.tree])

  useEffect(() => {
    if (!selection) return
    void loadPreview(selection)
  }, [selection])

  const parsedEditor = useMemo(() => parseEditorJson(editorText), [editorText])
  const hasUnsavedEditorChanges = editorText !== lastSavedEditorText

  async function loadInitialState() {
    setState((current) => ({ ...current, isLoading: true, error: null }))

    try {
      const [me, tree] = await Promise.all([adminApi.getMe(), adminApi.getContentTree()])
      setState({
        adminLogin: me.admin.login,
        tree: tree.tree,
        isLoading: false,
        error: null,
      })
    } catch (caught) {
      handleAuthRedirect(caught)
      setState((current) => ({
        ...current,
        isLoading: false,
        error: errorMessage(caught),
      }))
    }
  }

  async function loadPreview(nextSelection: AdminContentSelection) {
    setPreviewLoading(true)
    setEditorError(null)
    setStatusMessage(null)

    try {
      const response = await adminApi.getContentPreview(nextSelection)
      const nextEditorText = formatJson(response.preview.slice)
      setPreview(response.preview)
      setEditorText(nextEditorText)
      setLastSavedEditorText(nextEditorText)
    } catch (caught) {
      handleAuthRedirect(caught)
      setPreview(null)
      setEditorText('')
      setLastSavedEditorText('')
      setEditorError(errorMessage(caught))
    } finally {
      setPreviewLoading(false)
    }
  }

  function selectContent(nextSelection: AdminContentSelection) {
    if (isSameSelection(selection, nextSelection)) return
    if (hasUnsavedEditorChanges && !window.confirm(UNSAVED_CONTENT_SWITCH_MESSAGE)) return
    setSelection(nextSelection)
  }

  async function saveSlice() {
    if (!selection || !preview) return
    const parsed = parseEditorJson(editorText)
    if (!parsed.ok) {
      setEditorError(parsed.error)
      return
    }

    setSaveLoading(true)
    setEditorError(null)
    setStatusMessage(null)

    try {
      const response = await adminApi.updateContentSlice(selection, preview.revision, parsed.value)
      const tree = await adminApi.getContentTree()
      const nextEditorText = formatJson(response.preview.slice)
      setPreview(response.preview)
      setEditorText(nextEditorText)
      setLastSavedEditorText(nextEditorText)
      setState((current) => ({
        ...current,
        tree: tree.tree,
      }))
      setStatusMessage('Сохранено. Learner API уже отдаёт обновлённый контент.')
    } catch (caught) {
      handleAuthRedirect(caught)
      setEditorError(errorMessage(caught))
    } finally {
      setSaveLoading(false)
    }
  }

  async function logout() {
    await adminApi.logout()
    window.location.assign('/login')
  }

  return (
    <AdminShell adminLogin={state.adminLogin} onLogout={() => void logout()}>
      <div className="content-editor-grid">
        <section className="content-tree-panel" aria-label="Дерево контента">
          <div className="content-panel-heading">
            <div>
              <p className="panel-label">Контент</p>
              <h2>{state.tree?.program.title ?? 'Программа'}</h2>
            </div>
          </div>
          {state.error ? (
            <div className="inline-error" role="alert">
              {state.error}
            </div>
          ) : null}
          {state.isLoading ? <ContentTreeSkeleton /> : null}
          {state.tree ? (
            <ContentTree tree={state.tree} selection={selection} onSelect={selectContent} />
          ) : null}
        </section>

        <section className="content-json-panel" aria-label="JSON редактор">
          <div className="content-panel-heading">
            <div>
              <p className="panel-label">JSON slice</p>
              <h2>{selection ? selectionLabel(selection) : 'Выберите экран'}</h2>
            </div>
          </div>
          <JsonEditorTextarea
            disabled={!preview || previewLoading || saveLoading}
            value={editorText}
            onChange={(nextValue) => {
              setEditorText(nextValue)
              setEditorError(null)
              setStatusMessage(null)
            }}
          />
          <div className="content-editor-actions">
            <div className="content-editor-status">
              {!parsedEditor.ok ? <span className="status-text danger">{parsedEditor.error}</span> : null}
              {editorError ? <span className="status-text danger">{editorError}</span> : null}
              {statusMessage ? (
                <span className="status-text success">
                  <CheckCircle2 size={16} />
                  {statusMessage}
                </span>
              ) : null}
            </div>
            <button
              className="button primary"
              disabled={!preview || !parsedEditor.ok || previewLoading || saveLoading}
              type="button"
              onClick={() => void saveSlice()}
            >
              <Save size={17} />
              {saveLoading ? 'Сохраняем' : 'Сохранить'}
            </button>
          </div>
        </section>

        <section className="content-preview-panel" aria-label="Live preview">
          <div className="content-panel-heading">
            <div>
              <p className="panel-label">Preview</p>
              <h2>Как увидит пользователь</h2>
            </div>
            <button
              aria-label="Сбросить текущий экран preview"
              className="icon-button"
              disabled={!preview || previewLoading}
              onClick={() => setPreviewScreenResetKey((current) => current + 1)}
              title="Сбросить текущий экран preview"
              type="button"
            >
              <RotateCcw size={17} />
            </button>
          </div>
          {previewLoading ? (
            <div className="detail-loading">Загружаем preview...</div>
          ) : (
            <ContentPreviewPane
              parsedEditor={parsedEditor}
              previewScreenResetKey={previewScreenResetKey}
              preview={preview}
              selection={selection}
              tree={state.tree}
            />
          )}
        </section>
      </div>
    </AdminShell>
  )
}

function JsonEditorTextarea({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean
  onChange: (value: string) => void
  value: string
}) {
  const highlightRef = useRef<HTMLPreElement | null>(null)
  const highlightedJson = useMemo(() => renderHighlightedJson(value), [value])

  function syncHighlightScroll(event: UIEvent<HTMLTextAreaElement>) {
    const highlight = highlightRef.current
    if (!highlight) return

    highlight.scrollLeft = event.currentTarget.scrollLeft
    highlight.scrollTop = event.currentTarget.scrollTop
  }

  return (
    <div className="json-editor-shell">
      <pre aria-hidden="true" className="json-editor-highlight" data-testid="json-editor-highlight" ref={highlightRef}>
        <code>{highlightedJson}</code>
      </pre>
      <textarea
        aria-label="Редактируемый JSON фрагмент"
        className="json-editor"
        disabled={disabled}
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={syncHighlightScroll}
      />
    </div>
  )
}

function renderHighlightedJson(value: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0
  let tokenIndex = 0
  JSON_HIGHLIGHT_TOKEN_PATTERN.lastIndex = 0

  for (const match of value.matchAll(JSON_HIGHLIGHT_TOKEN_PATTERN)) {
    const token = match[0]
    const index = match.index ?? 0
    if (index > cursor) {
      nodes.push(value.slice(cursor, index))
    }

    nodes.push(
      <span className={`json-token ${jsonTokenType(value, token, index)}`} key={`json-token-${tokenIndex}`}>
        {token}
      </span>,
    )
    cursor = index + token.length
    tokenIndex += 1
  }

  if (cursor < value.length) {
    nodes.push(value.slice(cursor))
  }

  return nodes.length ? nodes : ['']
}

function jsonTokenType(source: string, token: string, index: number) {
  if (token.startsWith('"')) {
    return isJsonObjectKey(source, index + token.length) ? 'key' : 'string'
  }

  if (JSON_NUMBER_PATTERN.test(token)) return 'number'
  if (token === 'true' || token === 'false') return 'boolean'
  if (token === 'null') return 'null'
  return 'punctuation'
}

function isJsonObjectKey(source: string, afterTokenIndex: number) {
  for (let index = afterTokenIndex; index < source.length; index += 1) {
    const character = source[index]
    if (character === ':' || !/\s/.test(character)) {
      return character === ':'
    }
  }

  return false
}

function ContentTree({
  tree,
  selection,
  onSelect,
}: {
  tree: AdminContentTreeResponse['tree']
  selection: AdminContentSelection | null
  onSelect: (selection: AdminContentSelection) => void
}) {
  return (
    <div className="content-tree">
      {tree.levels.map((level) => (
        <div className="content-tree-group" key={level.slug}>
          <button
            className={treeButtonClass(selection, { kind: 'level', levelSlug: level.slug })}
            type="button"
            onClick={() => onSelect({ kind: 'level', levelSlug: level.slug })}
          >
            <ChevronRight size={15} />
            <span>{level.title}</span>
          </button>
          {level.sections.map((section) => (
            <div className="content-tree-nested" key={section.slug}>
              <button
                className={treeButtonClass(selection, {
                  kind: 'section',
                  levelSlug: level.slug,
                  sectionSlug: section.slug,
                })}
                type="button"
                onClick={() =>
                  onSelect({
                    kind: 'section',
                    levelSlug: level.slug,
                    sectionSlug: section.slug,
                  })
                }
              >
                <ChevronRight size={15} />
                <span>{section.title}</span>
              </button>
              {section.lessons.map((lesson) => (
                <div className="content-tree-lesson" key={lesson.slug}>
                  <div className="content-tree-lesson-title">{lesson.title}</div>
                  <div className="content-tree-cards">
                    {lesson.cards.map((card) => (
                      <button
                        className={treeButtonClass(selection, {
                          kind: 'card',
                          levelSlug: level.slug,
                          sectionSlug: section.slug,
                          lessonSlug: lesson.slug,
                          cardId: card.id,
                        })}
                        key={card.id}
                        type="button"
                        onClick={() =>
                          onSelect({
                            kind: 'card',
                            levelSlug: level.slug,
                            sectionSlug: section.slug,
                            lessonSlug: lesson.slug,
                            cardId: card.id,
                          })
                        }
                      >
                        <span>{card.order}</span>
                        <span>{card.title ?? card.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ContentPreviewPane({
  preview,
  parsedEditor,
  previewScreenResetKey,
  selection,
  tree,
}: {
  preview: AdminContentPreview | null
  parsedEditor: JsonParseState
  previewScreenResetKey: number
  selection: AdminContentSelection | null
  tree: AdminContentTreeResponse['tree'] | null
}) {
  const buildResult = useMemo(
    () => buildPreviewConfig(preview, selection, parsedEditor, tree),
    [parsedEditor, preview, selection, tree],
  )
  const [lastValidConfig, setLastValidConfig] = useState<PreviewConfig | null>(null)
  const [dialogBoundary, setDialogBoundary] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!preview) {
        setLastValidConfig(null)
        return
      }

      if (buildResult.ok) {
        setLastValidConfig(buildResult.config)
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [buildResult, preview])

  if (!preview) {
    return (
      <div className="empty-state">
        <h2>Выберите фрагмент</h2>
        <p>Слева выберите уровень, раздел или экран урока.</p>
      </div>
    )
  }

  const activeConfig = buildResult.ok ? buildResult.config : lastValidConfig
  const previewError = buildResult.ok ? null : buildResult.error

  if (!activeConfig) {
    return (
      <div className="admin-route-preview-shell">
        <div className="inline-error" role="alert">
          {previewError ?? 'Preview API не вернул достаточный learner-контекст.'}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-route-preview-shell" data-testid="production-learner-route-preview" ref={setDialogBoundary}>
      {previewError ? (
        <div className="inline-error" role="alert">
          Preview показывает последнюю валидную версию. Текущий JSON не применён: {previewError}
        </div>
      ) : null}
      <EmbeddedLearnerPreview
        config={activeConfig}
        dialogBoundary={dialogBoundary}
        previewScreenResetKey={previewScreenResetKey}
      />
    </div>
  )
}

function EmbeddedLearnerPreview({
  config,
  dialogBoundary,
  previewScreenResetKey,
}: {
  config: PreviewConfig
  dialogBoundary: HTMLElement | null
  previewScreenResetKey: number
}) {
  return (
    <DialogPortalBoundaryProvider boundary={dialogBoundary}>
      <LearningContentProvider client={config.client} version={config.version}>
        <MemoryRouter initialEntries={[config.initialPath]} key={config.selectionKey}>
          <EmbeddedLearnerPreviewSession config={config} previewScreenResetKey={previewScreenResetKey} />
        </MemoryRouter>
      </LearningContentProvider>
    </DialogPortalBoundaryProvider>
  )
}

function EmbeddedLearnerPreviewSession({
  config,
  previewScreenResetKey,
}: {
  config: PreviewConfig
  previewScreenResetKey: number
}) {
  const [progress, setProgress] = useState<ProgressResponse>(EMPTY_PROGRESS)
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswersResponse>(EMPTY_REFLECTION_ANSWERS)

  async function markLessonProgress(lessonSlug: string, payload: { viewed?: boolean; completed?: boolean }) {
    setProgress((current) => updateLessonProgress(current, lessonSlug, payload))
  }

  async function markCardProgress(cardId: string, payload: { viewed?: boolean; completed?: boolean }) {
    setProgress((current) => updateCardProgress(current, cardId, payload))
  }

  async function saveReflectionAnswer(cardId: string, payload: ReflectionAnswerPayload) {
    setReflectionAnswers((current) => upsertPreviewReflectionAnswer(current, config.program, cardId, payload))
  }

  function resetPreviewScreen({ cardId, lessonSlug, resetLessonCompletion }: PreviewScreenResetPayload) {
    setProgress((current) => resetPreviewProgress(current, cardId, lessonSlug, resetLessonCompletion))
    setReflectionAnswers((current) => resetPreviewReflectionAnswer(current, cardId))
  }

  async function noopAuthAction() {}

  async function logoutPreview() {
    setProgress(EMPTY_PROGRESS)
    setReflectionAnswers(EMPTY_REFLECTION_ANSWERS)
    return true
  }

  return (
    <LearnerAppShell
      authError=""
      chrome="embedded-preview"
      initialCardId={config.initialCardId}
      isAuthBusy={false}
      isAuthReady
      markCardProgress={markCardProgress}
      markLessonProgress={markLessonProgress}
      onLogin={noopAuthAction}
      onLogout={logoutPreview}
      onPreviewScreenReset={resetPreviewScreen}
      onRegister={noopAuthAction}
      progress={progress}
      progressError=""
      previewScreenResetKey={previewScreenResetKey}
      reflectionAnswers={reflectionAnswers}
      reflectionError=""
      saveReflectionAnswer={saveReflectionAnswer}
      user={PREVIEW_USER}
    />
  )
}

function buildPreviewConfig(
  preview: AdminContentPreview | null,
  selection: AdminContentSelection | null,
  parsedEditor: JsonParseState,
  tree: AdminContentTreeResponse['tree'] | null,
): PreviewBuildResult {
  if (!preview || !selection) {
    return { ok: false, error: 'Выберите фрагмент контента.' }
  }

  if (preview.kind !== selection.kind) {
    return { ok: false, error: 'Preview API вернул другой тип фрагмента. Обновите выбор.' }
  }

  if (!parsedEditor.ok) {
    return { ok: false, error: parsedEditor.error }
  }

  const programResult = buildPreviewProgram(preview, selection, parsedEditor.value, tree)
  if (!programResult.ok) {
    return programResult
  }

  const parsedProgram = programSchema.safeParse(programResult.program)
  if (!parsedProgram.success) {
    return {
      ok: false,
      error: `content model: ${formatContentIssue(parsedProgram.error.issues[0])}`,
    }
  }

  const key = selectionKey(selection)
  const serializedSlice = formatJson(parsedEditor.value)

  return {
    ok: true,
    config: {
      client: createPreviewContentClient(parsedProgram.data),
      initialCardId: selection.kind === 'card' ? selection.cardId : undefined,
      initialPath: getInitialPreviewPath(selection),
      program: parsedProgram.data,
      selectionKey: key,
      version: `${key}:${preview.revision}:${serializedSlice}`,
    },
  }
}

function buildPreviewProgram(
  preview: AdminContentPreview,
  selection: AdminContentSelection,
  slice: unknown,
  tree: AdminContentTreeResponse['tree'] | null,
): { ok: true; program: Program } | { ok: false; error: string } {
  if (preview.kind === 'level' && selection.kind === 'level') {
    const level = parseLevelPreview(preview)
    if (!level) return { ok: false, error: 'Preview API не вернул learner-уровень.' }

    const metadata = parseMetadataSlice(slice)
    if (!metadata.ok) return metadata

    return {
      ok: true,
      program: createPreviewProgram(tree, applyMetadataSlice(level, metadata.slice)),
    }
  }

  if (preview.kind === 'section' && selection.kind === 'section') {
    const details = parseSectionPreview(preview)
    if (!details) return { ok: false, error: 'Preview API не вернул learner-раздел.' }

    const metadata = parseMetadataSlice(slice)
    if (!metadata.ok) return metadata

    const nextSection = applyMetadataSlice(details.section, metadata.slice)
    const nextLevel = replaceSectionInLevel(details.level, details.section.slug, nextSection)
    if (!nextLevel) {
      return { ok: false, error: 'Раздел не найден в learner-графе preview.' }
    }

    return {
      ok: true,
      program: createPreviewProgram(tree, nextLevel),
    }
  }

  if (preview.kind === 'card' && selection.kind === 'card') {
    const context = parseCardPreview(preview)
    if (!context) return { ok: false, error: 'Preview API не вернул learner-урок для карточки.' }

    const card = cardSchema.safeParse(slice)
    if (!card.success) {
      return {
        ok: false,
        error: `content model: ${formatContentIssue(card.error.issues[0])}`,
      }
    }

    const protectedFieldError = getProtectedCardFieldError(context.sourceCard, card.data)
    if (protectedFieldError) {
      return { ok: false, error: protectedFieldError }
    }

    const nextLesson = replaceCardInLesson(context.details.lesson, context.sourceCard.id, card.data)
    if (!nextLesson) {
      return { ok: false, error: 'Карточка не найдена в learner-уроке preview.' }
    }

    const nextSection = replaceLessonInSection(context.details.section, context.details.lesson.slug, nextLesson)
    if (!nextSection) {
      return { ok: false, error: 'Урок не найден в learner-разделе preview.' }
    }

    const nextLevel = replaceSectionInLevel(context.details.level, context.details.section.slug, nextSection)
    if (!nextLevel) {
      return { ok: false, error: 'Раздел не найден в learner-графе preview.' }
    }

    return {
      ok: true,
      program: createPreviewProgram(tree, nextLevel),
    }
  }

  return { ok: false, error: 'Неподдерживаемый тип preview.' }
}

function createPreviewContentClient(program: Program): LearningContentClient {
  return {
    getProgram: async () => clone(program),
    getLevels: async () => clone(getOrderedLevels(program)),
    getLevel: async (levelSlug) => {
      const level = getOrderedLevels(program).find((candidate) => candidate.slug === levelSlug)
      if (!level) throw new Error('Level not found')
      return clone(level)
    },
    getSection: async (sectionSlug) => {
      const section = findSection(program, sectionSlug)
      if (!section) throw new Error('Section not found')
      return clone(section)
    },
    getLesson: async (lessonSlug) => {
      const lesson = findLesson(program, lessonSlug)
      if (!lesson) throw new Error('Lesson not found')
      return clone(lesson)
    },
  }
}

function createPreviewProgram(tree: AdminContentTreeResponse['tree'] | null, level: Level): Program {
  const programSlug = tree?.program.slug ?? 'finpulse-preview'

  return {
    schemaVersion: 1,
    id: programSlug,
    slug: programSlug,
    title: tree?.program.title ?? 'ФинПульс',
    levels: [level],
  }
}

function parseLevelPreview(preview: AdminContentPreview): Level | null {
  const level = preview.preview.level
  return isRecord(level) ? (level as Level) : null
}

function parseSectionPreview(preview: AdminContentPreview): SectionDetails | null {
  const level = preview.preview.level
  const section = preview.preview.section
  if (!isRecord(level) || !isRecord(section)) return null

  return {
    level: level as Level,
    section: section as Section,
  }
}

function parseCardPreview(preview: AdminContentPreview) {
  const details = preview.preview.details
  const sourceCard = preview.preview.card
  const parsedSourceCard = cardSchema.safeParse(sourceCard)
  if (!isRecord(details) || !isRecord(details.lesson) || !Array.isArray(details.lesson.cards) || !parsedSourceCard.success) {
    return null
  }

  return {
    details: details as LessonDetails,
    sourceCard: parsedSourceCard.data,
  }
}

function parseMetadataSlice(value: unknown): { ok: true; slice: { title: string; description?: string } } | { ok: false; error: string } {
  if (!isRecord(value) || typeof value.title !== 'string') {
    return { ok: false, error: 'Метаданные должны содержать строковое поле title.' }
  }

  if ('description' in value && value.description !== undefined && typeof value.description !== 'string') {
    return { ok: false, error: 'Поле description должно быть строкой.' }
  }

  return {
    ok: true,
    slice: {
      title: value.title,
      ...(typeof value.description === 'string' ? { description: value.description } : {}),
    },
  }
}

function applyMetadataSlice<Entity extends { title: string; description?: string }>(
  entity: Entity,
  slice: { title: string; description?: string },
): Entity {
  return {
    ...entity,
    title: slice.title,
    ...('description' in slice ? { description: slice.description } : {}),
  }
}

function getProtectedCardFieldError(previous: Card, next: Card) {
  if (previous.id !== next.id) return 'Нельзя менять card.id в preview slice.'
  if (previous.type !== next.type) return 'Нельзя менять card.type в preview slice.'
  if (previous.order !== next.order) return 'Нельзя менять card.order в preview slice.'
  return null
}

function replaceSectionInLevel(level: Level, sectionSlug: string, section: Section): Level | null {
  if (!Array.isArray(level.sections)) return null

  let didReplace = false
  const sections = level.sections.map((candidate) => {
    if (candidate.slug !== sectionSlug) return candidate
    didReplace = true
    return section
  })

  return didReplace ? { ...level, sections } : null
}

function replaceLessonInSection(section: Section, lessonSlug: string, lesson: Lesson): Section | null {
  if (!Array.isArray(section.lessons)) return null

  let didReplace = false
  const lessons = section.lessons.map((candidate) => {
    if (candidate.slug !== lessonSlug) return candidate
    didReplace = true
    return lesson
  })

  return didReplace ? { ...section, lessons } : null
}

function replaceCardInLesson(lesson: Lesson, cardId: string, card: Card): Lesson | null {
  if (!Array.isArray(lesson.cards)) return null

  let didReplace = false
  const cards = lesson.cards.map((candidate) => {
    if (candidate.id !== cardId) return candidate
    didReplace = true
    return card
  })

  return didReplace ? { ...lesson, cards } : null
}

function findSection(program: Program, sectionSlug: string): SectionDetails | null {
  for (const level of getOrderedLevels(program)) {
    const section = level.sections.find((candidate) => candidate.slug === sectionSlug)
    if (section) return { level, section }
  }

  return null
}

function findLesson(program: Program, lessonSlug: string): LessonDetails | null {
  const lessons = getAllLessons(program)
  const currentIndex = lessons.findIndex(({ lesson }) => lesson.slug === lessonSlug)
  if (currentIndex < 0) return null

  return {
    ...lessons[currentIndex],
    previous: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
  }
}

function getInitialPreviewPath(selection: AdminContentSelection) {
  if (selection.kind === 'level') return `/levels/${selection.levelSlug}`
  if (selection.kind === 'section') return `/levels/${selection.levelSlug}/sections/${selection.sectionSlug}`
  return `/lessons/${selection.lessonSlug}`
}

function updateLessonProgress(
  progress: ProgressResponse,
  lessonSlug: string,
  payload: { viewed?: boolean; completed?: boolean },
): ProgressResponse {
  const now = new Date().toISOString()
  const current = progress.lessons.find((entry) => entry.lessonSlug === lessonSlug)
  const next = {
    lessonSlug,
    viewed: payload.viewed ?? payload.completed ?? current?.viewed ?? false,
    completed: payload.completed ?? current?.completed ?? false,
    viewedAt: payload.viewed || payload.completed ? (current?.viewedAt ?? now) : (current?.viewedAt ?? null),
    completedAt: payload.completed ? (current?.completedAt ?? now) : (current?.completedAt ?? null),
    updatedAt: now,
  }

  return {
    ...progress,
    lessons: upsertBy(progress.lessons, (entry) => entry.lessonSlug === lessonSlug, next),
  }
}

function updateCardProgress(
  progress: ProgressResponse,
  cardId: string,
  payload: { viewed?: boolean; completed?: boolean },
): ProgressResponse {
  const now = new Date().toISOString()
  const current = progress.cards.find((entry) => entry.cardId === cardId)
  const next = {
    cardId,
    viewed: payload.viewed ?? payload.completed ?? current?.viewed ?? false,
    completed: payload.completed ?? current?.completed ?? false,
    viewedAt: payload.viewed || payload.completed ? (current?.viewedAt ?? now) : (current?.viewedAt ?? null),
    completedAt: payload.completed ? (current?.completedAt ?? now) : (current?.completedAt ?? null),
    updatedAt: now,
  }

  return {
    ...progress,
    cards: upsertBy(progress.cards, (entry) => entry.cardId === cardId, next),
  }
}

function resetPreviewProgress(
  progress: ProgressResponse,
  cardId: string,
  lessonSlug: string,
  resetLessonCompletion: boolean,
): ProgressResponse {
  return {
    lessons: resetLessonCompletion
      ? progress.lessons.filter((entry) => entry.lessonSlug !== lessonSlug)
      : progress.lessons,
    cards: progress.cards.filter((entry) => entry.cardId !== cardId),
  }
}

function resetPreviewReflectionAnswer(current: ReflectionAnswersResponse, cardId: string): ReflectionAnswersResponse {
  return {
    answers: current.answers.filter((answer) => answer.cardId !== cardId),
  }
}

function upsertPreviewReflectionAnswer(
  current: ReflectionAnswersResponse,
  program: Program,
  cardId: string,
  payload: ReflectionAnswerPayload,
): ReflectionAnswersResponse {
  const cardDetails = findCard(program, cardId)
  if (!cardDetails || (cardDetails.card.type !== 'reflection' && cardDetails.card.type !== 'artifact')) {
    return current
  }

  const existing = current.answers.find((answer) => answer.cardId === cardId)
  const now = new Date().toISOString()
  const nextAnswer: ReflectionAnswer = {
    answer: payload,
    cardId,
    cardTitle: cardDetails.card.title ?? null,
    cardType: cardDetails.card.type,
    createdAt: existing?.createdAt ?? now,
    levelSlug: cardDetails.level.slug,
    levelTitle: cardDetails.level.title,
    lessonSlug: cardDetails.lesson.slug,
    lessonTitle: cardDetails.lesson.title,
    prompt: cardDetails.card.type === 'reflection' ? cardDetails.card.prompt : cardDetails.card.body,
    saveKey: cardDetails.card.type === 'reflection' ? (cardDetails.card.saveKey ?? null) : null,
    sectionSlug: cardDetails.section.slug,
    sectionTitle: cardDetails.section.title,
    template: cardDetails.card.type === 'artifact' ? (cardDetails.card.template ?? null) : null,
    updatedAt: now,
  }

  return {
    answers: upsertBy(current.answers, (answer) => answer.cardId === cardId, nextAnswer),
  }
}

function findCard(program: Program, cardId: string) {
  for (const { level, section, lesson } of getAllLessons(program)) {
    const card = lesson.cards.find((candidate) => candidate.id === cardId)
    if (card) return { level, section, lesson, card }
  }

  return null
}

function upsertBy<Item>(items: Item[], predicate: (item: Item) => boolean, nextItem: Item) {
  const nextItems = [...items]
  const existingIndex = nextItems.findIndex(predicate)
  if (existingIndex >= 0) {
    nextItems[existingIndex] = nextItem
    return nextItems
  }

  return [...nextItems, nextItem]
}

function clone<Value>(value: Value): Value {
  return structuredClone(value) as Value
}

function ContentTreeSkeleton() {
  return (
    <div className="content-tree loading">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  )
}

function getInitialSelection(tree: AdminContentTreeResponse['tree']): AdminContentSelection | null {
  const level = tree.levels[0]
  const section = level?.sections[0]
  const lesson = section?.lessons[0]
  const card = lesson?.cards[0]

  if (level && section && lesson && card) {
    return {
      kind: 'card',
      levelSlug: level.slug,
      sectionSlug: section.slug,
      lessonSlug: lesson.slug,
      cardId: card.id,
    }
  }

  if (level) {
    return {
      kind: 'level',
      levelSlug: level.slug,
    }
  }

  return null
}

function treeButtonClass(current: AdminContentSelection | null, candidate: AdminContentSelection) {
  return isSameSelection(current, candidate) ? 'content-tree-button active' : 'content-tree-button'
}

function isSameSelection(left: AdminContentSelection | null, right: AdminContentSelection) {
  return left ? selectionKey(left) === selectionKey(right) : false
}

function selectionKey(selection: AdminContentSelection) {
  if (selection.kind === 'level') return `level:${selection.levelSlug}`
  if (selection.kind === 'section') return `section:${selection.levelSlug}/${selection.sectionSlug}`
  return `card:${selection.levelSlug}/${selection.sectionSlug}/${selection.lessonSlug}/${selection.cardId}`
}

function selectionLabel(selection: AdminContentSelection) {
  if (selection.kind === 'level') return selection.levelSlug
  if (selection.kind === 'section') return selection.sectionSlug
  return selection.cardId
}

function parseEditorJson(value: string): JsonParseState {
  try {
    return {
      ok: true,
      value: JSON.parse(value) as unknown,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'JSON невалиден',
    }
  }
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function handleAuthRedirect(error: unknown) {
  if (error instanceof AdminApiError && error.status === 401) {
    window.location.assign('/login')
  }
}

function errorMessage(error: unknown) {
  if (error instanceof AdminApiError) {
    if (error.code === 'content_revision_conflict') {
      return 'Контент уже изменился. Обновите экран и повторите правку.'
    }
    return error.message
  }

  return 'Не удалось выполнить действие.'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function formatContentIssue(issue: { path: Array<PropertyKey>; message: string } | undefined) {
  if (!issue) return 'неизвестная ошибка валидации'
  const path = issue.path.length ? `${issue.path.join('.')}: ` : ''
  return `${path}${issue.message}`
}
