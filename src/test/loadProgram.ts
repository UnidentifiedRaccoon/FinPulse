import programJson from '@/content/program.json'

import { parseProgram } from '@/content/program'

const contentFilesByPath = Object.fromEntries(
  Object.entries(import.meta.glob<unknown>('../content/modules/**/*.json', { eager: true, import: 'default' })).map(
    ([filePath, file]) => [filePath.replace(/^\.\.\/content\//, ''), file],
  ),
)

type LoadedModuleFile = {
  units: Array<{ path: string }>
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

function moduleBasePath(modulePath: string) {
  return modulePath.split('/').slice(0, -1).join('/')
}

function joinContentPath(basePath: string, refPath: string) {
  const normalizedRef = normalizeContentPath(refPath)
  if (!normalizedRef) return null
  return basePath ? `${basePath}/${normalizedRef}` : normalizedRef
}

function hydrateProgramContent() {
  return {
    ...programJson,
    modules: programJson.modules.map((moduleRef) => {
      const modulePath = normalizeContentPath(moduleRef.path)
      const moduleFile = modulePath ? contentFilesByPath[modulePath] : null
      if (!modulePath || !moduleFile || typeof moduleFile !== 'object' || Array.isArray(moduleFile)) {
        return moduleRef
      }

      const loadedModule = moduleFile as LoadedModuleFile
      const moduleBase = moduleBasePath(modulePath)
      return {
        ...moduleFile,
        units: loadedModule.units.map((unitRef) => {
          const unitPath = joinContentPath(moduleBase, unitRef.path)
          return unitPath ? (contentFilesByPath[unitPath] ?? unitRef) : unitRef
        }),
      }
    }),
  }
}

export const parsedProgram = parseProgram(hydrateProgramContent())
