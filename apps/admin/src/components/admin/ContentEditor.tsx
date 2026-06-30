'use client'

import { CheckCircle2, ChevronRight, RefreshCw, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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
  const [previewLoading, setPreviewLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
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
  const liveSlice = parsedEditor.ok ? parsedEditor.value : preview?.slice

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
      setPreview(response.preview)
      setEditorText(formatJson(response.preview.slice))
    } catch (caught) {
      handleAuthRedirect(caught)
      setPreview(null)
      setEditorText('')
      setEditorError(errorMessage(caught))
    } finally {
      setPreviewLoading(false)
    }
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
      setPreview(response.preview)
      setEditorText(formatJson(response.preview.slice))
      setState((current) => ({
        ...current,
        tree: tree.tree,
      }))
      setStatusMessage('Опубликовано. Learner API уже отдаёт обновлённый контент.')
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
            <button className="icon-button" type="button" onClick={() => void loadInitialState()} aria-label="Обновить дерево">
              <RefreshCw size={17} />
            </button>
          </div>
          {state.error ? (
            <div className="inline-error" role="alert">
              {state.error}
            </div>
          ) : null}
          {state.isLoading ? <ContentTreeSkeleton /> : null}
          {state.tree ? (
            <ContentTree tree={state.tree} selection={selection} onSelect={(nextSelection) => setSelection(nextSelection)} />
          ) : null}
        </section>

        <section className="content-json-panel" aria-label="JSON редактор">
          <div className="content-panel-heading">
            <div>
              <p className="panel-label">JSON slice</p>
              <h2>{selection ? selectionLabel(selection) : 'Выберите экран'}</h2>
            </div>
            <span className="result-count">rev {preview?.revision ?? '-'}</span>
          </div>
          <textarea
            aria-label="Редактируемый JSON фрагмент"
            className="json-editor"
            disabled={!preview || previewLoading || saveLoading}
            spellCheck={false}
            value={editorText}
            onChange={(event) => {
              setEditorText(event.target.value)
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
              {saveLoading ? 'Публикуем' : 'Опубликовать'}
            </button>
          </div>
        </section>

        <section className="content-preview-panel" aria-label="Live preview">
          <div className="content-panel-heading">
            <div>
              <p className="panel-label">Preview</p>
              <h2>Как увидит пользователь</h2>
            </div>
          </div>
          {previewLoading ? (
            <div className="detail-loading">Загружаем preview...</div>
          ) : (
            <ContentPreviewPane preview={preview} liveSlice={liveSlice} />
          )}
        </section>
      </div>
    </AdminShell>
  )
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

function ContentPreviewPane({ preview, liveSlice }: { preview: AdminContentPreview | null; liveSlice: unknown }) {
  if (!preview) {
    return (
      <div className="empty-state">
        <h2>Выберите фрагмент</h2>
        <p>Слева выберите уровень, раздел или экран урока.</p>
      </div>
    )
  }

  if (preview.kind === 'level') {
    const level = preview.preview.level as Record<string, unknown>
    const slice = isRecord(liveSlice) ? liveSlice : {}
    return (
      <div className="admin-preview-card">
        <p className="preview-kicker">Уровень</p>
        <h3>{stringValue(slice.title) || stringValue(level.title)}</h3>
        <p>{stringValue(slice.description) || stringValue(level.description)}</p>
      </div>
    )
  }

  if (preview.kind === 'section') {
    const section = preview.preview.section as Record<string, unknown>
    const slice = isRecord(liveSlice) ? liveSlice : {}
    return (
      <div className="admin-preview-card">
        <p className="preview-kicker">Раздел</p>
        <h3>{stringValue(slice.title) || stringValue(section.title)}</h3>
        <p>{stringValue(slice.description) || stringValue(section.description)}</p>
      </div>
    )
  }

  return <CardPreview card={isRecord(liveSlice) ? liveSlice : (preview.slice as Record<string, unknown>)} />
}

function CardPreview({ card }: { card: Record<string, unknown> }) {
  return (
    <div className="admin-phone-preview">
      <div className="admin-phone-header">
        <span>Экран {stringValue(card.order)}</span>
        <span>{stringValue(card.type)}</span>
      </div>
      <article className="admin-lesson-card-preview">
        {stringValue(card.title) ? <h3>{stringValue(card.title)}</h3> : null}
        {stringValue(card.question) ? <PreviewText text={stringValue(card.question)} /> : null}
        {stringValue(card.body) ? <PreviewText text={stringValue(card.body)} /> : null}
        {stringValue(card.prompt) ? <PreviewText text={stringValue(card.prompt)} /> : null}
        {Array.isArray(card.options) ? <PreviewOptions options={card.options} /> : null}
        {Array.isArray(card.categories) ? <PreviewLabels title="Категории" items={card.categories} /> : null}
        {Array.isArray(card.items) ? <PreviewLabels title="Элементы" items={card.items} /> : null}
        {Array.isArray(card.template) ? <PreviewStringList title="Шаблон" items={card.template} /> : null}
        {Array.isArray(card.variants) ? <PreviewStringList title="Варианты" items={card.variants} /> : null}
        {Array.isArray(card.points) ? <PreviewStringList title="Итоги" items={card.points} /> : null}
        {stringValue(card.nextStep) ? <PreviewText text={stringValue(card.nextStep)} /> : null}
      </article>
    </div>
  )
}

function PreviewText({ text }: { text: string }) {
  return (
    <div className="preview-text">
      {text.split(/\n{2,}/u).map((paragraph) => (
        <p key={paragraph}>{stripMarkdown(paragraph)}</p>
      ))}
    </div>
  )
}

function PreviewOptions({ options }: { options: unknown[] }) {
  return (
    <div className="preview-option-list">
      {options.map((option, index) => {
        const optionRecord = isRecord(option) ? option : {}
        return (
          <div className="preview-option" key={stringValue(optionRecord.id) || index}>
            {stringValue(optionRecord.label) || `Вариант ${index + 1}`}
          </div>
        )
      })}
    </div>
  )
}

function PreviewLabels({ title, items }: { title: string; items: unknown[] }) {
  return (
    <div className="preview-mini-block">
      <h4>{title}</h4>
      <div className="preview-chip-list">
        {items.map((item, index) => {
          const itemRecord = isRecord(item) ? item : {}
          return <span key={stringValue(itemRecord.id) || index}>{stringValue(itemRecord.label) || `Пункт ${index + 1}`}</span>
        })}
      </div>
    </div>
  )
}

function PreviewStringList({ title, items }: { title: string; items: unknown[] }) {
  return (
    <div className="preview-mini-block">
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={`${String(item)}-${index}`}>{stripMarkdown(String(item))}</li>
        ))}
      </ul>
    </div>
  )
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

function stringValue(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function stripMarkdown(value: string) {
  return value
    .replace(/\*\*([^*]+)\*\*/gu, '$1')
    .replace(/\*([^*]+)\*/gu, '$1')
    .replace(/<u>(.*?)<\/u>/giu, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
}
