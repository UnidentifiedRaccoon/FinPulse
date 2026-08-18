import { ArrowRight, LockKeyhole, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { LabHeader } from '../components/LabHeader'
import { concepts, consiliumConcepts } from '../demoContent'

export function LibraryPage() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = 'ФинПульс · Лаборатория историй'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (aboutOpen && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
    } else if (!aboutOpen && dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close()
      } else {
        dialog.removeAttribute('open')
      }
    }
  }, [aboutOpen])

  return (
    <div className="app-shell library-shell">
      <a className="skip-link" href="#library-title">К основному содержанию</a>
      <LabHeader onAbout={() => setAboutOpen(true)} />
      <main className="library-main">
        <section className="library-intro">
          <h1 id="library-title" ref={titleRef} tabIndex={-1}>Один эпизод — шесть самостоятельных версий</h1>
          <p>
            «Свой маршрут» — история в шести главах о первом годе Саши после переезда ради новой работы. В демке —
            непрерывное начало первой главы и эпизод о подписке и срочном сообщении «поддержки».
          </p>
          <p className="library-orientation">
            Шесть ссылок ниже — альтернативные версии одной демки, не уроки по порядку. История везде одинакова;
            различается только явно отмеченная практика, которую можно пропустить без изменения сюжета.
          </p>
          <Link className="button button--primary library-primary" to="/concept/c">
            Пройти рекомендованную версию
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <nav className="concept-index" aria-label="Самостоятельные версии демки">
          {concepts.map((concept) => (
            <Link
              className={concept.recommended ? 'concept-row is-recommended' : 'concept-row'}
              key={concept.id}
              to={`/concept/${concept.id}`}
            >
              <span className="concept-letter" aria-hidden="true">
                {concept.letter}
              </span>
              <span className="concept-copy">
                <strong>{concept.title}</strong>
                <span>{concept.hypothesis}</span>
                {concept.recommended ? <em>Рекомендуем начать здесь</em> : null}
              </span>
              <span className="concept-duration">{concept.duration}</span>
              <ArrowRight className="concept-arrow" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <section className="consilium-library" aria-labelledby="consilium-library-title">
          <div className="consilium-library__intro">
            <p className="section-label">Новая подборка · глава 3 из 6</p>
            <h2 id="consilium-library-title">Деньги на жильё — три самостоятельные версии</h2>
            <p>
              Саша хочет ускорить переезд, но отложенные деньги могут понадобиться к окончанию аренды. Во всех трёх
              демках канон один; меняется только учебная практика.
            </p>
            <p className="consilium-library__orientation">
              Версии независимы. Можно открыть любую и пропустить практику без изменения решения Саши.
            </p>
            <Link className="button button--primary consilium-library__primary" to="/concept/c2">
              Открыть выбранную жюри C2
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <nav className="concept-index concept-index--consilium" aria-label="Новые механики консилиума">
            {consiliumConcepts.map((concept) => (
              <Link
                className={concept.recommended ? 'concept-row concept-row--code is-recommended' : 'concept-row concept-row--code'}
                key={concept.id}
                to={`/concept/${concept.id}`}
              >
                <span className="concept-letter concept-code" aria-hidden="true">
                  {concept.code}
                </span>
                <span className="concept-copy">
                  <strong>{concept.title}</strong>
                  <span>{concept.hypothesis}</span>
                  {concept.recommended ? <em>Выбрано жюри</em> : null}
                </span>
                <span className="concept-duration">{concept.duration}</span>
                <ArrowRight className="concept-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>

        <p className="library-privacy">
          <LockKeyhole aria-hidden="true" />
          Без регистрации. Ответы не отправляются и исчезают после выхода.
        </p>
      </main>

      <dialog
        aria-labelledby="about-title"
        className="about-dialog"
        onCancel={() => setAboutOpen(false)}
        ref={dialogRef}
      >
        <button className="dialog-close" onClick={() => setAboutOpen(false)} type="button" aria-label="Закрыть">
          <X aria-hidden="true" />
        </button>
        <h2 id="about-title">О демке</h2>
        <p>
          Здесь два эпизода из шестиглавной истории Саши собраны в двух независимых подборках: шесть исходных версий
          главы 1 и три новые механики консилиума по главе 3. Вы проходите одну версию, а не последовательность уроков.
        </p>
        <p>
          Демо не регистрирует пользователя, не сохраняет ответы, не строит профиль и не даёт персональных финансовых
          рекомендаций.
        </p>
        <button className="button button--primary" onClick={() => setAboutOpen(false)} type="button">
          Понятно
        </button>
      </dialog>
    </div>
  )
}
