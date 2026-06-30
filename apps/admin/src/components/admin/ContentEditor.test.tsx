import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { adminApi } from '../../lib/adminApi'
import type {
  AdminContentPreviewResponse,
  AdminContentSelection,
  AdminContentTreeResponse,
  AdminMeResponse,
} from '../../lib/types'

import { ContentEditor } from './ContentEditor'

vi.mock('next/navigation', () => ({
  usePathname: () => '/content',
}))

vi.mock('../../lib/adminApi', async () => {
  const actual = await vi.importActual<typeof import('../../lib/adminApi')>('../../lib/adminApi')

  return {
    AdminApiError: actual.AdminApiError,
    adminApi: {
      getMe: vi.fn(),
      getContentTree: vi.fn(),
      getContentPreview: vi.fn(),
      updateContentSlice: vi.fn(),
      logout: vi.fn(),
    },
  }
})

const scope = {
  access: 'global_all_users',
  organizationFiltering: {
    enabled: false,
    mode: 'not_enabled',
  },
  rbac: {
    enabled: false,
  },
  reflectionAnswerText: {
    includedByDefault: false,
  },
} as const

const meResponse: AdminMeResponse = {
  admin: {
    login: 'admin@example.com',
  },
  scope,
}

const selectedCard: AdminContentSelection = {
  kind: 'card',
  levelSlug: 'level-1-start',
  sectionSlug: 'money-and-operations',
  lessonSlug: 'where-money-goes',
  cardId: 'card_l1s1l1_01_hook',
}

const treeResponse: AdminContentTreeResponse = {
  scope,
  tree: {
    program: {
      slug: 'finpulse-mvp',
      title: 'ФинПульс',
    },
    levels: [
      {
        slug: 'level-1-start',
        title: 'Уровень 1 · Старт',
        revision: 1,
        sections: [
          {
            slug: 'money-and-operations',
            title: 'Раздел 1. Деньги и операции',
            revision: 1,
            lessons: [
              {
                slug: 'where-money-goes',
                title: 'Куда уходят деньги',
                revision: 1,
                cards: [
                  {
                    id: 'card_l1s1l1_01_hook',
                    type: 'single_choice',
                    title: 'Деньги были... или нет?',
                    order: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}

const initialSlice = {
  id: 'card_l1s1l1_01_hook',
  type: 'single_choice',
  order: 1,
  title: 'Деньги были... или нет?',
  question: 'Узнаёшь себя?',
}

const updatedSlice = {
  ...initialSlice,
  title: 'Обновлённый экран',
  question: 'Узнаёшь себя после правки?',
}

const initialPreviewResponse: AdminContentPreviewResponse = {
  scope,
  preview: {
    kind: 'card',
    revision: 1,
    slice: initialSlice,
    preview: {
      card: initialSlice,
    },
  },
}

const updatedPreviewResponse: AdminContentPreviewResponse = {
  scope,
  preview: {
    kind: 'card',
    revision: 2,
    slice: updatedSlice,
    preview: {
      card: updatedSlice,
    },
  },
}

describe('ContentEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(adminApi.getMe).mockResolvedValue(meResponse)
    vi.mocked(adminApi.getContentTree).mockResolvedValue(treeResponse)
    vi.mocked(adminApi.getContentPreview).mockResolvedValue(initialPreviewResponse)
    vi.mocked(adminApi.updateContentSlice).mockResolvedValue(updatedPreviewResponse)
    vi.mocked(adminApi.logout).mockResolvedValue(undefined)
  })

  it('loads a card slice, previews edits, and publishes the selected slice', async () => {
    const actor = userEvent.setup()
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })

    fireEvent.change(editor, {
      target: {
        value: JSON.stringify(updatedSlice, null, 2),
      },
    })
    expect(await screen.findByText('Обновлённый экран')).toBeInTheDocument()

    await actor.click(screen.getByRole('button', { name: /Опубликовать/u }))

    await waitFor(() => {
      expect(adminApi.updateContentSlice).toHaveBeenCalledWith(selectedCard, 1, updatedSlice)
    })
    expect(await screen.findByText('Опубликовано. Learner API уже отдаёт обновлённый контент.')).toBeInTheDocument()
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(updatedSlice, null, 2))
    })
  })
})
