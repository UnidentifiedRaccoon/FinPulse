import { useEffect, useState } from 'react'

type QueryState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

export function useApiQuery<T>(load: () => Promise<T>, dependencies: readonly unknown[]) {
  const [state, setState] = useState<QueryState<T>>({
    status: 'loading',
    data: null,
    error: null,
  })

  useEffect(() => {
    let isActive = true

    Promise.resolve()
      .then(() => {
        if (!isActive) return null
        setState({
          status: 'loading',
          data: null,
          error: null,
        })
        return load()
      })
      .then((data) => {
        if (!isActive || !data) return
        setState({
          status: 'success',
          data,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (!isActive) return
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error : new Error('Не удалось загрузить данные.'),
        })
      })

    return () => {
      isActive = false
    }
    // Callers pass stable route params or callbacks as this hook's query key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return state
}
