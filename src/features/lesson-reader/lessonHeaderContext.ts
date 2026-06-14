const LEVEL_CONTEXT_PREFIX = /^Уровень\s+\d+\s*(?:[·.]\s*)?/i
const SECTION_CONTEXT_PREFIX = /^Раздел\s+\d+\s*(?:[·.]\s*)?/i

export function formatLessonHeaderContext(levelTitle: string, sectionTitle: string) {
  const compactLevelTitle = stripContextPrefix(levelTitle, LEVEL_CONTEXT_PREFIX)
  const compactSectionTitle = stripContextPrefix(sectionTitle, SECTION_CONTEXT_PREFIX)

  return `${compactLevelTitle} · ${compactSectionTitle}`
}

function stripContextPrefix(title: string, prefix: RegExp) {
  const compactTitle = title.replace(prefix, '').trim()

  return compactTitle || title
}
