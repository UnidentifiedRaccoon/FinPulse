import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const rootDir = process.cwd()
const srcDir = join(rootDir, 'src')
const checkedExtensions = new Set(['.ts', '.tsx'])
const violations = []

for (const filePath of walk(srcDir)) {
  const relativePath = relative(rootDir, filePath)

  if (!shouldCheck(relativePath)) continue

  const source = readFileSync(filePath, 'utf8')
  const importSpecifiers = source.matchAll(/(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g)

  for (const match of importSpecifiers) {
    const specifier = match[1]
    if (isForbiddenContentImport(specifier)) {
      violations.push(`${relativePath}: ${specifier}`)
    }
  }
}

if (violations.length > 0) {
  console.error('[runtime-imports] Rendered app code must use the backend API instead of runtime content loaders:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log('[runtime-imports] OK')

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(path)
      continue
    }

    if (checkedExtensions.has(extensionOf(entry.name))) {
      yield path
    }
  }
}

function shouldCheck(relativePath) {
  if (relativePath.startsWith('src/content/')) return false
  if (relativePath.startsWith('src/test/')) return false
  if (relativePath.includes('.test.')) return false
  return true
}

function isForbiddenContentImport(specifier) {
  return (
    specifier === '@/content/loadProgram' ||
    specifier.endsWith('/content/loadProgram') ||
    (specifier.includes('/content/') && specifier.endsWith('.json')) ||
    (specifier.startsWith('@/content/') && specifier.endsWith('.json'))
  )
}

function extensionOf(fileName) {
  const match = fileName.match(/(\.[^.]+)$/)
  return match ? match[1] : ''
}
