import module1Json from '@/content/modules/module_1/module.json'
import unit01ValuesJson from '@/content/modules/module_1/units/unit_01_values_and_goals.json'
import programJson from '@/content/program.json'

import { parseProgram } from './program'

const moduleFilesByPath: Record<string, unknown> = {
  'modules/module_1/module.json': module1Json,
}

const unitFilesByPath: Record<string, unknown> = {
  'modules/module_1/units/unit_01_values_and_goals.json': unit01ValuesJson,
}

type LoadedModuleFile = {
  units: Array<{ path: string }>
}

function moduleBasePath(modulePath: string) {
  return modulePath.split('/').slice(0, -1).join('/')
}

function hydrateProgramContent() {
  return {
    ...programJson,
    modules: programJson.modules.map((moduleRef) => {
      const moduleFile = moduleFilesByPath[moduleRef.path]
      if (!moduleFile || typeof moduleFile !== 'object' || Array.isArray(moduleFile)) {
        return moduleRef
      }

      const loadedModule = moduleFile as LoadedModuleFile
      const moduleBase = moduleBasePath(moduleRef.path)
      return {
        ...moduleFile,
        units: loadedModule.units.map((unitRef) => {
          const unitPath = `${moduleBase}/${unitRef.path}`
          return unitFilesByPath[unitPath] ?? unitRef
        }),
      }
    }),
  }
}

export const parsedProgram = parseProgram(hydrateProgramContent())
