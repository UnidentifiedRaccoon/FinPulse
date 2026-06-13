import programJson from '@/content/program.json'

import { parseProgram } from '@/content/program'

const contentFilesByPath = Object.fromEntries(
  Object.entries(import.meta.glob<unknown>('../content/levels/**/*.json', { eager: true, import: 'default' })).map(
    ([filePath, file]) => [filePath.replace(/^\.\.\/content\//, ''), file],
  ),
)

type LoadedLevelFile = {
  sections: Array<{ path: string }>
}

function normalizeContentPath(refPath: string) {
  if (refPath.trim() !== refPath || refPath.startsWith('/') || refPath.includes('\\')) {
    return null
  }

  const parts = refPath.split('/')
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    return null
  }

  return parts.join('/')
}

function levelBasePath(levelPath: string) {
  return levelPath.split('/').slice(0, -1).join('/')
}

function joinContentPath(basePath: string, refPath: string) {
  const normalizedRef = normalizeContentPath(refPath)
  if (!normalizedRef) return null
  return basePath ? `${basePath}/${normalizedRef}` : normalizedRef
}

function hydrateProgramContent() {
  return {
    ...programJson,
    levels: programJson.levels.map((levelRef) => {
      const levelPath = normalizeContentPath(levelRef.path)
      const levelFile = levelPath ? contentFilesByPath[levelPath] : null
      if (!levelPath || !levelFile || typeof levelFile !== 'object' || Array.isArray(levelFile)) {
        return levelRef
      }

      const loadedLevel = levelFile as LoadedLevelFile
      const levelBase = levelBasePath(levelPath)
      return {
        ...levelFile,
        sections: loadedLevel.sections.map((sectionRef) => {
          const sectionPath = joinContentPath(levelBase, sectionRef.path)
          return sectionPath ? (contentFilesByPath[sectionPath] ?? sectionRef) : sectionRef
        }),
      }
    }),
  }
}

export const parsedProgram = parseProgram(hydrateProgramContent())
