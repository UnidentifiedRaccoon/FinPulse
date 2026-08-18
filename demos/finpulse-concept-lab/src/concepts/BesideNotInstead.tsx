import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import { ActionRow, Button, ChoiceField, CompletionActions, ScopeFeedback } from '../components/Ui'
import { fullChapterOneFixture, relationPrompts } from '../demoContent'

type Stage = 'intro' | 'story' | 'roles' | 'transfer' | 'complete'

const helpPhrases = [
  'Могу помочь найти канал проверки; открыть данные можете вы.',
  'Давайте вместе сформулируем вопрос; отправите его вы.',
  'Сначала уточним, кому нужен доступ, кто действует и за кем остаётся решение.',
]

export function BesideNotInstead() {
  const [stage, setStage] = useState<Stage>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showMap, setShowMap] = useState(false)
  const [phrase, setPhrase] = useState<string>()
  const [practiceLeftEarly, setPracticeLeftEarly] = useState(false)

  const activeStage = stage === 'roles' || stage === 'transfer' ? 1 : stage === 'complete' ? 2 : 0

  function reset() {
    setAnswers({})
    setShowMap(false)
    setPhrase(undefined)
    setPracticeLeftEarly(false)
    setStage('intro')
  }

  function leavePractice() {
    setPracticeLeftEarly(true)
    setStage('complete')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="После законченной сцены отдельно разметим помощь, действие и решение — только по тому, что прямо сказано в тексте."
      stageKey={stage}
      stageLabels={['История Саши', 'Разбор ролей', 'Итог эпизода']}
      title="Кто помогал, кто действовал?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="разметить, кто видел, помогал, действовал и принимал решение."
          skip="Можно пропустить и сразу открыть итог."
        >
          <Button onClick={() => setStage('story')}>Читать начало истории</Button>
        </IntroPanel>
      ) : null}

      {stage === 'story' ? (
        <>
          <StoryReader paragraphs={fullChapterOneFixture} />
          <LearningBridge
            boundary="Карта не оценивает отношения героев, не устанавливает юридические права и не предлагает решить за Сашу."
            material="Четыре момента, выделенные авторами только из уже прочитанной сцены. Если ответа в тексте нет, это можно прямо отметить."
            purpose="Разбор помогает не смешивать доступ к информации, помощь другого человека, выполненное действие и окончательное решение."
            status="Сцена завершена · дальше разбор ролей"
            title="Кто помогал, кто действовал и за кем осталось решение?"
          >
            <ActionRow>
              <Button onClick={() => setStage('roles')}>Разметить роли в сцене</Button>
              <Button onClick={leavePractice} tone="text">Пропустить разбор и перейти к итогу</Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'roles' ? (
        <section className="interaction-section">
          <p className="section-label">Только явные факты</p>
          <h2>Кто видел, помогал, действовал и решал?</h2>
          <p className="supporting-copy">Если сцена не даёт ответа, выберите «Не указано».</p>
          <div className="question-stack">
            {relationPrompts.map((prompt) => (
              <ChoiceField
                key={prompt.id}
                onChange={(value) => setAnswers((current) => ({ ...current, [prompt.id]: value }))}
                prompt={prompt}
                value={answers[prompt.id]}
              />
            ))}
          </div>
          {showMap ? (
            <ScopeFeedback title="Что видно в сцене">
              <dl className="relation-map">
                <div><dt>Доступ</dt><dd>Саша и Миша видят условия; Саша и Лера видят сообщение.</dd></div>
                <div><dt>Помощь</dt><dd>Миша предлагает проверить условия; Лера замечает правдоподобие сообщения.</dd></div>
                <div><dt>Действие</dt><dd>Саша отменяет подписку и открывает поддержку.</dd></div>
                <div><dt>Решение</dt><dd>Саша не открывает ссылку и выбирает способ проверки.</dd></div>
                <div><dt>Неизвестно</dt><dd>Открывала ли Лера поддержку сама.</dd></div>
              </dl>
              <p>Карта описывает только эту сцену и не устанавливает юридические права героев.</p>
            </ScopeFeedback>
          ) : null}
          <ActionRow>
            {showMap ? (
              <Button onClick={() => setStage('transfer')}>Посмотреть необязательные фразы помощи</Button>
            ) : (
              <Button onClick={() => setShowMap(true)}>Показать, что есть в тексте</Button>
            )}
            <Button onClick={leavePractice} tone="text">Закончить разбор и перейти к итогу</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'transfer' ? (
        <LearningBridge
          boundary="Выбор не оценивается, не сохраняется и ничего не сообщает о вашей ситуации. Это не реплики героев и не продолжение сюжета."
          material="Три учебные формулировки, написанные авторами демки, а не взятые из истории."
          purpose="Если хотите, посмотрите, как словами разделить помощь и действие другого человека."
          status="Карта сцены готова · дальше только по желанию"
          title="Как предложить помощь, не забирая чужое действие?"
        >
          <div className="phrase-list">
            {helpPhrases.map((item) => (
              <button
                aria-pressed={phrase === item}
                className={phrase === item ? 'phrase-option is-selected' : 'phrase-option'}
                key={item}
                onClick={() => setPhrase(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          {phrase ? <p className="selected-note" aria-live="polite">Фраза останется только на этом экране.</p> : null}
          <ActionRow>
            <Button onClick={() => setStage('complete')}>Перейти к итогу эпизода</Button>
            <Button onClick={leavePractice} tone="text">Перейти к итогу без выбора</Button>
          </ActionRow>
        </LearningBridge>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceLeftEarly ? 'Итог эпизода · остальная практика пропущена' : 'Итог эпизода · разбор завершён'}
          </p>
          <h2>Помощь не отменила автономию Саши</h2>
          {practiceLeftEarly ? <p>Вы перешли к итогу без остальной практики. История и действия героев не изменились.</p> : null}
          <p>
            Миша и Лера участвовали в проверке, но отмену, выбор канала и дальнейшее действие выполнил Саша. Это
            наблюдение о сцене, а не универсальное правило о том, как люди обязаны помогать друг другу.
          </p>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
