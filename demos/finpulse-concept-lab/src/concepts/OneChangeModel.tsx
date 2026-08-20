import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge, NonCanonBoundary } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import { ActionRow, Button, ChoiceField, CompletionActions, CopyTakeaway, ScopeFeedback } from '../components/Ui'
import { fullChapterOneFixture, modelConsequences, modelStatusOptions } from '../demoContent'
import type { EvidencePrompt } from '../types'

type Stage = 'intro' | 'story' | 'model' | 'feedback' | 'complete'
type PracticeExit = 'skipped' | 'ended-early' | null

const takeaway = 'Измените один параметр. Отметьте только прямые различия. Остальное оставьте неизвестным до подтверждения.'

export function OneChangeModel() {
  const [stage, setStage] = useState<Stage>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [practiceExit, setPracticeExit] = useState<PracticeExit>(null)
  const answeredCount = Object.keys(answers).length

  const activeStage = stage === 'model' || stage === 'feedback' ? 1 : stage === 'complete' ? 2 : 0

  function reset() {
    setAnswers({})
    setPracticeExit(null)
    setStage('intro')
  }

  function skipPractice() {
    setPracticeExit(stage === 'story' ? 'skipped' : 'ended-early')
    setStage('complete')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="После законченной сцены отдельно сравним два пути к проверке и отделим прямое изменение от догадки."
      stageKey={stage}
      stageLabels={['История Саши', 'Учебное сравнение', 'Итог эпизода']}
      title="Что меняет путь к проверке?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="сравнить путь из истории с придуманным вариантом и отметить только прямые следствия."
          skip="Можно пропустить и сразу открыть фактический итог."
        >
          <Button onClick={() => setStage('story')}>Читать начало истории</Button>
        </IntroPanel>
      ) : null}

      {stage === 'story' ? (
        <>
          <StoryReader paragraphs={fullChapterOneFixture} />
          <LearningBridge
            boundary="Придуманный вариант не предсказывает последствие и не доказывает мошенничество. Саша по-прежнему самостоятельно открывает приложение."
            material="Авторы демки заменили только один параметр: самостоятельно открытое приложение — на ссылку из сообщения. Такого действия в истории не было."
            purpose="Сравнение тренирует точность: что следует из замены пути напрямую, а что всё ещё нельзя установить."
            status="Сцена завершена · дальше отдельное учебное сравнение"
            title="Что действительно следует из одного изменения?"
          >
            <ActionRow>
              <Button onClick={() => setStage('model')}>Сравнить два пути проверки</Button>
              <Button onClick={skipPractice} tone="text">Не открывать придуманный вариант — перейти к итогу</Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'model' ? (
        <section className="interaction-section model-section">
          <p className="section-label">Учебное сравнение · не часть истории</p>
          <h2>Что меняется, если путь задан сообщением?</h2>
          <NonCanonBoundary compact />
          <div className="parameter-compare" aria-label="Два пути проверки">
            <div>
              <strong>Как было в истории</strong>
              <span>Саша самостоятельно открыл приложение сервиса.</span>
            </div>
            <div>
              <strong>Придуманный вариант для сравнения</strong>
              <span>Путь к проверке задан ссылкой из сообщения.</span>
            </div>
          </div>
          <p className="supporting-copy">Что следует прямо из замены пути, а что всё ещё нельзя установить?</p>
          <div className="evidence-matrix">
            {modelConsequences.map((statement, index) => {
              const id = `consequence-${index}`
              const prompt: EvidencePrompt = { id, statement, options: modelStatusOptions }
              return (
                <ChoiceField
                  key={id}
                  layout="inline"
                  onChange={(value) => setAnswers((current) => ({ ...current, [id]: value }))}
                  prompt={prompt}
                  value={answers[id]}
                />
              )
            })}
          </div>
          <ActionRow>
            <Button onClick={() => setStage('feedback')}>
              {answeredCount === modelConsequences.length
                ? 'Сопоставить мои отметки с разбором'
                : answeredCount === 0
                  ? 'Показать разбор без заполнения'
                  : `Показать разбор · отмечено ${answeredCount} из ${modelConsequences.length}`}
            </Button>
            <Button onClick={skipPractice} tone="text">Закончить сравнение и перейти к итогу</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'feedback' ? (
        <section className="interaction-section narrow-section">
          <h2>Что показало сравнение?</h2>
          <NonCanonBoundary compact />
          <ScopeFeedback title="Ваши отметки · без балла">
            {answeredCount === 0 ? (
              <p>Вы открыли авторский разбор без своих отметок. Это допустимый путь.</p>
            ) : (
              <ul className="answer-summary">
                {modelConsequences.map((statement, index) => {
                  const selected = modelStatusOptions.find((option) => option.id === answers[`consequence-${index}`])
                  return (
                    <li key={statement}>
                      <span>{statement}</span>
                      <strong>{selected?.label ?? 'Не отмечено'}</strong>
                    </li>
                  )
                })}
              </ul>
            )}
          </ScopeFeedback>
          <ScopeFeedback title="Прямо меняется">
            <p>Путь входа и то, был ли он выбран независимо от исходного сообщения.</p>
          </ScopeFeedback>
          <ScopeFeedback title="Остаётся неизвестным">
            <p>Владелец ссылки, личность отправителя, содержимое страницы, результат перехода и ответ другого канала.</p>
          </ScopeFeedback>
          <p className="safety-note">
            Сравнение не доказывает, что сообщение было мошенническим. В истории подтверждено только отсутствие
            зависшей операции через поддержку в самостоятельно открытом приложении.
          </p>
          <ActionRow><Button onClick={() => setStage('complete')}>Перейти к итогу эпизода</Button></ActionRow>
        </section>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceExit === 'skipped'
              ? 'Итог эпизода · сравнение пропущено'
              : practiceExit === 'ended-early'
                ? 'Итог эпизода · сравнение завершено досрочно'
                : 'Итог эпизода · история не изменилась'}
          </p>
          <h2>История Саши не изменилась</h2>
          <p>
            {practiceExit === 'skipped'
              ? 'Вы завершили версию после истории. Пропущено только учебное сравнение; Саша самостоятельно открыл приложение и получил ответ поддержки.'
              : practiceExit === 'ended-early'
                ? 'Вы начали сравнение и перешли к итогу до авторского разбора. Это допустимый путь; история Саши не изменилась.'
                : 'Саша самостоятельно открыл приложение и получил ответ поддержки. Учебное сравнение не добавило новых событий.'}
          </p>
          <blockquote>{takeaway}</blockquote>
          <ActionRow><CopyTakeaway text={takeaway} /></ActionRow>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
