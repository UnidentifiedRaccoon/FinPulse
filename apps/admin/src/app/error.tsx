'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="admin-loading-shell">
      <section className="admin-error-card">
        <h1>Не удалось открыть админку</h1>
        <p>Обновите экран или проверьте, что backend запущен локально.</p>
        <button className="button primary" type="button" onClick={reset}>
          Повторить
        </button>
      </section>
    </main>
  )
}
