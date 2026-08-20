import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import { ActionRow, Button, ChoiceField, CompletionActions, CopyTakeaway, ScopeFeedback } from '../components/Ui'
import {
  chapterOneSubscriptionScene,
  messageBeforeReveal,
  messageResolution,
  observerPrompts,
  sourceOptions,
} from '../demoContent'
import type { EvidencePrompt } from '../types'

type Stage = 'intro' | 'before' | 'pause' | 'after' | 'complete'
type PracticeExit = 'skipped' | 'ended-early' | null

const sourcePrompt: EvidencePrompt = {
  id: 'source',
  statement: 'Что может проверить утверждение о зависшей операции независимо от самого сообщения?',
  options: sourceOptions,
}

const takeaway = 'Что здесь наблюдается, что только утверждается и какой независимый источник может проверить именно это?'

export function ObserverPause() {
  const [stage, setStage] = useState<Stage>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)
  const [practiceExit, setPracticeExit] = useState<PracticeExit>(null)

  const activeStage = stage === 'pause' ? 1 : stage === 'after' || stage === 'complete' ? 2 : 0

  function reset() {
    setAnswers({})
    setRevealed(false)
    setPracticeExit(null)
    setStage('intro')
  }

  function skipPause() {
    setPracticeExit(stage === 'before' ? 'skipped' : 'ended-early')
    setStage('after')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="История один раз остановится перед развязкой. Отдельная практика поможет увидеть, что уже известно, а что пока нет."
      stageKey={stage}
      stageLabels={['История Саши', 'Учебная практика', 'Развязка и итог']}
      title="Что известно до развязки?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="перед развязкой отделить факты текста от утверждений и неизвестного."
          skip="Можно пропустить и сразу читать развязку."
        >
          <Button onClick={() => setStage('before')}>Читать начало истории</Button>
        </IntroPanel>
      ) : null}

      {stage === 'before' ? (
        <>
          <StoryReader paragraphs={[...chapterOneSubscriptionScene, ...messageBeforeReveal]} />
          <LearningBridge
            boundary="Вы не выбираете действие за Сашу. После практики история продолжится с его каноническим решением."
            material="Только уже прочитанная часть сцены; ответ поддержки ещё не показан."
            purpose="Сообщение выглядит убедительно, но правдоподобие ещё не равно подтверждению. Короткая сверка помогает удержать эту границу."
            status="Пауза в истории · развязка ещё впереди"
            title="Что уже известно до ответа поддержки?"
          >
            <ActionRow>
              <Button onClick={() => setStage('pause')}>Разобрать, что уже известно</Button>
              <Button onClick={skipPause} tone="text">
                Пропустить разбор и читать развязку
              </Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'pause' ? (
        <section className="interaction-section">
          <p className="section-label">Учебная практика · история на паузе</p>
          <h2>Что известно до ответа поддержки?</h2>
          <p className="supporting-copy">Разберите не решение Саши, а статус утверждений в этот момент истории.</p>
          <div className="question-stack">
            {observerPrompts.map((prompt) => (
              <ChoiceField
                key={prompt.id}
                onChange={(value) => setAnswers((current) => ({ ...current, [prompt.id]: value }))}
                prompt={prompt}
                value={answers[prompt.id]}
              />
            ))}
            <ChoiceField
              onChange={(value) => setAnswers((current) => ({ ...current, source: value }))}
              prompt={sourcePrompt}
              value={answers.source}
            />
          </div>
          {revealed ? (
            <ScopeFeedback title="Граница знания">
              <p>
                Точные детали сообщения — наблюдаемый факт. Необходимость перейти по ссылке — утверждение самого
                сообщения. Личность отправителя пока не установлена.
              </p>
              <p>
                Самостоятельно открытый канал может проверить состояние операции, но не личность отправителя и не
                содержимое ссылки.
              </p>
            </ScopeFeedback>
          ) : null}
          <ActionRow>
            {revealed ? (
              <Button onClick={() => setStage('after')}>Читать каноническую развязку</Button>
            ) : (
              <Button onClick={() => setRevealed(true)}>Показать границы знания</Button>
            )}
            <Button onClick={skipPause} tone="text">
              Закончить разбор и читать развязку
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'after' ? (
        <>
          <StoryReader
            label="Каноническое продолжение · глава 1"
            paragraphs={messageResolution}
            title="Что сделал Саша"
          />
          <ActionRow>
            <Button onClick={() => setStage('complete')}>Перейти к итогу эпизода</Button>
          </ActionRow>
        </>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceExit === 'skipped'
              ? 'Итог эпизода · практика пропущена'
              : practiceExit === 'ended-early'
                ? 'Итог эпизода · практика завершена досрочно'
                : 'Итог эпизода · история не изменилась'}
          </p>
          <h2>Ответ поддержки сузил границы предположения</h2>
          {practiceExit === 'skipped' ? (
            <p>Вы прочитали каноническую развязку без учебной паузы. Пропущено только упражнение.</p>
          ) : null}
          {practiceExit === 'ended-early' ? (
            <p>Вы начали практику и перешли к развязке до авторской сверки. Это допустимый путь; история не изменилась.</p>
          ) : null}
          <p>
            Поддержка сообщила, что зависшей операции нет. Это проверило узкое утверждение об операции, но не
            установило личность отправителя и не показало, что находилось по ссылке.
          </p>
          <blockquote>{takeaway}</blockquote>
          <ActionRow>
            <CopyTakeaway label="Скопировать вопрос" text={takeaway} />
          </ActionRow>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
