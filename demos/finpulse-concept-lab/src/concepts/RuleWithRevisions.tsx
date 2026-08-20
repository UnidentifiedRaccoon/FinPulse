import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import {
  ActionRow,
  Button,
  CheckboxList,
  CompletionActions,
  ScopeFeedback,
} from '../components/Ui'
import {
  chapterThreeLetter,
  fChapterThreeContext,
  fullChapterOneFixture,
  revisionFragments,
  teachBackFragments,
} from '../demoContent'
import type { ChoiceOption } from '../types'
import { toggleId } from '../utils'

type Stage = 'intro' | 'first-story' | 'teachback' | 'delay' | 'contrast-story' | 'contrast' | 'revision' | 'feedback' | 'complete'

const firstFragments: ChoiceOption[] = teachBackFragments.map((label, index) => ({ id: `first-${index}`, label }))
const secondFragments: ChoiceOption[] = revisionFragments.map((label, index) => ({ id: `second-${index}`, label }))

export function RuleWithRevisions() {
  const [stage, setStage] = useState<Stage>('intro')
  const [firstText, setFirstText] = useState('')
  const [firstSelected, setFirstSelected] = useState<string[]>([])
  const [didTeachback, setDidTeachback] = useState(false)
  const [revisionText, setRevisionText] = useState('')
  const [revisionSelected, setRevisionSelected] = useState<string[]>([])

  const activeStage = ['teachback', 'contrast', 'revision', 'feedback'].includes(stage)
    ? 1
    : stage === 'complete'
      ? 2
      : 0

  function leaveTeachback(didWrite: boolean) {
    setFirstText('')
    setFirstSelected([])
    setDidTeachback(didWrite)
    setStage('delay')
  }

  function leaveRevision() {
    setRevisionText('')
    setRevisionSelected([])
    setStage('feedback')
  }

  function reset() {
    setFirstText('')
    setFirstSelected([])
    setDidTeachback(false)
    setRevisionText('')
    setRevisionSelected([])
    setStage('intro')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="Две канонические сцены помогут сначала сформулировать мысль, а затем уточнить её границы без оценки личного ответа."
      stageKey={stage}
      stageLabels={['История Саши', 'Учебная практика', 'Итог эпизода']}
      title="Как уточнить объяснение?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="по желанию сформулировать мысль, а после главы 3 уточнить её границы."
          skip="Обе формулировки можно пропустить; сцены и итог останутся доступны."
        >
          <Button onClick={() => setStage('first-story')}>Читать начало истории</Button>
        </IntroPanel>
      ) : null}

      {stage === 'first-story' ? (
        <>
          <StoryReader paragraphs={fullChapterOneFixture} />
          <LearningBridge
            boundary="Формулировка не оценивается, не отправляется, очищается перед следующей сценой и не влияет на историю."
            material="Одна ваша фраза или готовые фрагменты, составленные авторами только по фактам прочитанной главы."
            purpose="Короткая формулировка делает первую мысль заметной. Позже другая каноническая сцена даст повод уточнить границы объяснения."
            status="Первая сцена завершена · дальше формулировка по желанию"
            title="Как вы сейчас объяснили бы способ проверки?"
          >
            <ActionRow>
              <Button onClick={() => setStage('teachback')}>Сформулировать первую мысль</Button>
              <Button onClick={() => leaveTeachback(false)} tone="text">Перейти к главе 3 без формулировки</Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'teachback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">По желанию · текст исчезнет перед продолжением</p>
          <h2>Что здесь стоило заметить?</h2>
          <p>Объясните будущему читателю одной фразой — или соберите объяснение из правдивых фрагментов.</p>
          <div className="text-field">
            <label htmlFor="first-teachback">Необязательная фраза</label>
            <textarea
              autoComplete="off"
              id="first-teachback"
              maxLength={180}
              onChange={(event) => setFirstText(event.target.value)}
              placeholder="Например: точные детали сообщения ещё не…"
              value={firstText}
            />
            <small>{firstText.length}/180 · текст не отправляется</small>
          </div>
          <CheckboxList
            legend="Или включите любые подходящие фрагменты"
            onToggle={(id) => setFirstSelected((current) => toggleId(current, id))}
            options={firstFragments}
            selected={firstSelected}
          />
          <ActionRow>
            <Button onClick={() => leaveTeachback(true)}>Очистить формулировку и перейти к главе 3</Button>
            <Button onClick={() => leaveTeachback(false)} tone="text">Перейти к главе 3 без формулировки</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'delay' ? (
        <section className="narrative-bridge">
          <p className="section-label">Новая каноническая сцена · глава 3</p>
          <h2>Несколько месяцев спустя</h2>
          <p>{fChapterThreeContext}</p>
          <p>
            Следующий фрагмент начинается через несколько дней после описанного обращения Саши в организацию. Это
            другая ситуация из той же истории, а не последствие вашей формулировки.
          </p>
          <p className="selected-note" aria-live="polite">
            {didTeachback
              ? 'Ваша первая формулировка удалена. Система не будет сравнивать её с образцом.'
              : 'Вы продолжили без своей формулировки. Следующая сцена и сопоставление доступны полностью.'}
          </p>
          <ActionRow><Button onClick={() => setStage('contrast-story')}>Читать сцену из главы 3</Button></ActionRow>
        </section>
      ) : null}

      {stage === 'contrast-story' ? (
        <>
          <StoryReader
            label="Канонический фрагмент · глава 3 из 6"
            paragraphs={chapterThreeLetter}
            title="Письмо по обращению"
          />
          <LearningBridge
            boundary="Парное сопоставление не сравнивает ваши ответы и не превращает два случая в универсальное правило."
            material="Авторы собрали парное сопоставление только из двух прочитанных сцен: признаки сообщения, способ проверки и узкий результат."
            purpose="Сопоставление покажет, почему похожий внешний вид сообщения не даёт готового вывода о его подлинности."
            status="Обе сцены завершены · дальше авторское сопоставление"
            title="Что подтвердили две разные проверки?"
          >
            <ActionRow>
              <Button onClick={() => setStage('contrast')}>Сопоставить две прочитанные сцены</Button>
              <Button onClick={() => setStage('revision')} tone="text">Не сравнивать самому — перейти к формулировке</Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'contrast' ? (
        <section className="interaction-section">
          <p className="section-label">Авторское сопоставление двух прочитанных сцен</p>
          <h2>Похожие детали — разные результаты проверки</h2>
          <div aria-label="Сравнение двух канонических сцен" className="scene-comparison" role="region">
            <div>
              <p><strong>Совпадающие детали</strong></p>
              <dl><dt>Глава 1 · сообщение об отмене</dt><dd>Название сервиса и время отмены совпадали.</dd></dl>
              <dl><dt>Глава 3 · письмо по обращению</dt><dd>Тема, дата и номер обращения совпадали.</dd></dl>
            </div>
            <div>
              <p><strong>Что насторожило</strong></p>
              <dl><dt>Глава 1 · сообщение об отмене</dt><dd>Требование срочно открыть ссылку.</dd></dl>
              <dl><dt>Глава 3 · письмо по обращению</dt><dd>Незнакомый адрес и непривычное оформление.</dd></dl>
            </div>
            <div>
              <p><strong>Что удалось установить</strong></p>
              <dl><dt>Глава 1 · сообщение об отмене</dt><dd>Поддержка подтвердила: зависшей операции нет.</dd></dl>
              <dl><dt>Глава 3 · письмо по обращению</dt><dd>Отдельно найденный контакт подтвердил: письмо настоящее.</dd></dl>
            </div>
            <div>
              <p><strong>Граница проверки</strong></p>
              <dl><dt>Глава 1 · сообщение об отмене</dt><dd>Личность отправителя не установлена.</dd></dl>
              <dl><dt>Глава 3 · письмо по обращению</dt><dd>Ответ прочитан в привычном личном кабинете.</dd></dl>
            </div>
          </div>
          <p>
            Внешний вид и совпадающие детали сами по себе не доказывают ни подлинность, ни подделку. Независимый канал
            подтверждает только тот вопрос, который через него проверили.
          </p>
          <ActionRow>
            <Button onClick={() => setStage('revision')}>
              {didTeachback ? 'Уточнить первоначальное объяснение' : 'Сформулировать вывод после двух сцен'}
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'revision' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">По желанию · свежая формулировка</p>
          <h2>{didTeachback ? 'Какую границу стоит добавить теперь?' : 'Как объяснить способ проверки после двух сцен?'}</h2>
          <p className="supporting-copy">
            {didTeachback
              ? 'Первая формулировка уже удалена. Соберите мысль снова с учётом второй сцены — система не сравнивает тексты.'
              : 'Вы не формулировали первую мысль. Теперь можно собрать объяснение только на основе двух прочитанных сцен.'}
          </p>
          <CheckboxList
            legend="Выберите любые правдивые фрагменты — скрытого правильного набора нет"
            onToggle={(id) => setRevisionSelected((current) => toggleId(current, id))}
            options={secondFragments}
            selected={revisionSelected}
          />
          <div className="text-field">
            <label htmlFor="revision-note">Добавить одну необязательную оговорку</label>
            <textarea
              autoComplete="off"
              id="revision-note"
              maxLength={140}
              onChange={(event) => setRevisionText(event.target.value)}
              placeholder="Если…, пока…, в зависимости от…"
              value={revisionText}
            />
            <small>{revisionText.length}/140 · не пишите о личных данных</small>
          </div>
          <ActionRow>
            <Button onClick={leaveRevision}>Очистить формулировку и показать вывод</Button>
            <Button onClick={leaveRevision} tone="text">Не формулировать самому — показать вывод</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Авторский вывод по двум сценам</p>
          <h2>Что добавила вторая сцена?</h2>
          <ScopeFeedback title="Точнее, а не «правильнее»">
            <p>
              Глава 1 не установила, кто отправил срочное сообщение: поддержка подтвердила только отсутствие зависшей
              операции. Глава 3 показала другой случай: настоящее письмо выглядело непривычно, и его подлинность
              подтвердили через отдельно найденный контакт.
            </p>
          </ScopeFeedback>
          <ScopeFeedback title="Инвестиционный вопрос остался отдельным">
            <p>
              Ответ не подтвердил повторение прошлого результата и доступность всей суммы к сроку Саши. Его отказ
              относится к этому предложению и этим жилищным деньгам, а не ко всем инвестициям.
            </p>
          </ScopeFeedback>
          <ActionRow><Button onClick={() => setStage('complete')}>Перейти к итогу эпизода</Button></ActionRow>
        </section>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">Правило выдержало поправку</p>
          <h2>Вид сообщения — повод проверить, не готовый вывод</h2>
          <p>
            Саша не доверяет и не отвергает сообщение только по виду: он проверяет конкретный вопрос через независимо
            открытый канал.
          </p>
          <blockquote>Что именно подтвердил этот источник — и чего он не подтвердил?</blockquote>
          <p className="safety-note">Это образовательная история, а не индивидуальная финансовая рекомендация.</p>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
