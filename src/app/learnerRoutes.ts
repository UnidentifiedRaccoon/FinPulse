export const CATEGORIZATION_COLUMNS_PREVIEW_PATH = '/design/categorization-columns'

export function isCategorizationColumnsPreviewPath(pathname: string) {
  return pathname === CATEGORIZATION_COLUMNS_PREVIEW_PATH
}
