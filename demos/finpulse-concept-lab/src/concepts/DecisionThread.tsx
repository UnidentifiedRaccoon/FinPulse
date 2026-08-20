import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import {
  ActionRow,
  Button,
  CheckboxList,
  ChoiceField,
  CompletionActions,
  CopyTakeaway,
  ScopeFeedback,
} from '../components/Ui'
import { chapterOneSubscriptionScene, messageBeforeReveal, messageResolution } from '../demoContent'
import type { ChoiceOption, EvidencePrompt } from '../types'
import { toggleId } from '../utils'

type Stage = 'intro' | 'subscription' | 'snapshot' | 'message' | 'revision' | 'thread' | 'complete'

const signals: ChoiceOption[] = [
  { id: 'unfinished', label: 'Сообщение утверждало, что отмена не завершилась.' },
  { id: 'time', label: 'Отправитель знал точное время отмены.' },
  { id: 'urgent', label: 'Сообщение требовало срочно перейти по ссылке.' },
  { id: 'price', label: 'Месячная стоимость подписки изменилась.' },
]

const sourcePrompt: EvidencePrompt = {
  id: 'thread-source',
  statement: 'Какой источник в сцене мог ответить именно на вопрос о статусе отмены?',
  options: [
    { id: 'terms', label: 'Условия подписки' },
    { id: 'message-link', label: 'Ссылка во входящем сообщении' },
    { id: 'app-support', label: 'Поддержка в приложении, которое Саша открыл сам' },
    { id: 'lera', label: 'Мнение Леры' },
    { id: 'unspecified', label: 'Не указано' },
  ],
}

const takeaway = 'Что уже известно? Чего не хватает? Какой источник может подтвердить именно это? Какой следующий обратимый шаг возможен?'

export function DecisionThread() {
  const [stage, setStage] = useState<Stage>('intro')
  const [selectedSignals, setSelectedSignals] = useState<string[]>([])
  const [source, setSource] = useState<string>()
  const [revealed, setRevealed] = useState(false)
  const [practiceLeftEarly, setPracticeLeftEarly] = useState(false)
  const [firstRecordSkipped, setFirstRecordSkipped] = useState(false)

  const activeStage = ['snapshot', 'revision', 'thread'].includes(stage) ? 1 : stage === 'complete' ? 2 : 0

  function reset() {
    setSelectedSignals([])
    setSource(undefined)
    setRevealed(false)
    setPracticeLeftEarly(false)
    setFirstRecordSkipped(false)
    setStage('intro')
  }

  function leavePractice() {
    setPracticeLeftEarly(true)
    setStage('complete')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="Две законченные сцены покажут, как вместе с вопросом Саши меняются источник проверки и следующий шаг."
      stageKey={stage}
      stageLabels={['История Саши', 'Разбор по тексту', 'Итог эпизода']}
      title="Как меняется вопрос Саши?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="собрать по двум сценам вопрос, источник, известное, неизвестное и шаг Саши."
          skip="Первую запись можно пропустить до второй сцены, второй разбор — до итога."
        >
          <Button onClick={() => setStage('subscription')}>Читать начало истории</Button>
        </IntroPanel>
      ) : null}

      {stage === 'subscription' ? (
        <>
          <StoryReader paragraphs={chapterOneSubscriptionScene} />
          <LearningBridge
            boundary="Это редакционное резюме поступка Саши, а не оценка его характера и не рекомендация пользователю."
            material="Авторы собрали запись только из прочитанной сцены: вопрос, найденные факты, источник и шаг Саши."
            purpose="Схема делает видимой связь между вопросом Саши, найденной информацией и его следующим шагом."
            status="Первая сцена завершена · дальше схема по тексту"
            title="Как из условий получился следующий шаг Саши?"
          >
            <ActionRow>
              <Button onClick={() => setStage('snapshot')}>Посмотреть первую запись по сцене</Button>
              <Button
                onClick={() => {
                  setFirstRecordSkipped(true)
                  setStage('message')
                }}
                tone="text"
              >
                Пропустить запись и читать следующую сцену
              </Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'snapshot' ? (
        <section className="thread-snapshot">
          <p className="section-label">Авторская запись по первой сцене</p>
          <h2>Вопрос, источник и шаг Саши</h2>
          <dl>
            <div><dt>Вопрос</dt><dd>Что произойдёт после пробного периода?</dd></div>
            <div><dt>Из текста</dt><dd>Начнётся ежемесячная плата; заказы всё равно оплачиваются отдельно.</dd></div>
            <div><dt>Ограничение Саши</dt><dd>Он не планирует регулярно пользоваться услугами.</dd></div>
            <div><dt>Источник</dt><dd>Условия подписки.</dd></div>
            <div><dt>Канонический шаг</dt><dd>Отменить подписку.</dd></div>
          </dl>
          <p className="safety-note">Это критерий Саши в конкретной ситуации, не рекомендация другим пользователям подписки.</p>
          <ActionRow><Button onClick={() => setStage('message')}>Читать следующую сцену Саши</Button></ActionRow>
        </section>
      ) : null}

      {stage === 'message' ? (
        <>
          <StoryReader
            label="Каноническое продолжение · глава 1"
            paragraphs={[...messageBeforeReveal, ...messageResolution]}
            title="Сообщение после отмены"
          />
          <LearningBridge
            boundary="Вы восстанавливаете ход решения по тексту, а не выбираете действие за Сашу."
            material="Только детали второй прочитанной сцены и ответ поддержки в самостоятельно открытом приложении."
            purpose="Теперь вопрос другой: нужно понять, завершилась ли отмена. Отметим повод для проверки и источник, отвечающий именно на этот вопрос."
            status="Вторая сцена завершена · появился другой вопрос"
            title="Почему Саше понадобился другой источник?"
          >
            <ActionRow>
              <Button onClick={() => setStage('revision')}>Разобрать вторую запись по сцене</Button>
              <Button onClick={leavePractice} tone="text">Пропустить разбор и перейти к итогу</Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'revision' ? (
        <section className="interaction-section">
          <p className="section-label">Учебная практика · вторая запись</p>
          <h2>Что стало поводом перепроверить ситуацию?</h2>
          <CheckboxList
            legend="Можно отметить несколько деталей, прямо названных в сцене"
            onToggle={(id) => setSelectedSignals((current) => toggleId(current, id))}
            options={signals}
            selected={selectedSignals}
          />
          <ChoiceField onChange={setSource} prompt={sourcePrompt} value={source} />
          {revealed ? (
            <ScopeFeedback title="Что добавил текст">
              <p>
                Утверждение о незавершённой операции, точная деталь и требование срочности создают повод для проверки,
                но не устанавливают личность отправителя. Данных об изменении цены в сцене нет.
              </p>
              <p>
                Поддержка в самостоятельно открытом приложении сообщила, что зависшей операции нет. Она не установила
                личность отправителя и не показала, что произошло бы после перехода по ссылке.
              </p>
            </ScopeFeedback>
          ) : null}
          <ActionRow>
            {revealed ? (
              <Button onClick={() => setStage('thread')}>Сопоставить две записи</Button>
            ) : (
              <Button onClick={() => setRevealed(true)}>Сверить с текстом</Button>
            )}
            <Button onClick={leavePractice} tone="text">Закончить разбор и перейти к итогу</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'thread' ? (
        <LearningBridge
          boundary="Сопоставление не добавляет событий и не оценивает решение героя."
          material={firstRecordSkipped
            ? 'Первую запись вы пропустили; для этой таблицы авторы снова собрали обе записи только из двух прочитанных сцен.'
            : 'Таблица составлена авторами только из двух уже прочитанных сцен.'}
          purpose="Поставим записи рядом, чтобы увидеть, как вместе с вопросом изменились источник, установленное, неизвестное и шаг Саши."
          status="Сверка с текстом завершена · две записи готовы"
          title="Теперь две записи можно поставить рядом"
        >
          <div aria-label="Сравнение нити решения до и после сообщения" className="table-scroll" role="region" tabIndex={0}>
            <table className="comparison-table">
              <thead><tr><th>Элемент</th><th>После условий</th><th>После сообщения</th></tr></thead>
              <tbody>
                <tr><th>Вопрос</th><td>Что будет после пробного периода?</td><td>Завершилась ли отмена?</td></tr>
                <tr><th>Источник</th><td>Условия подписки</td><td>Поддержка в самостоятельно открытом приложении</td></tr>
                <tr><th>Установлено</th><td>Ежемесячная плата; заказы отдельно</td><td>Зависшей операции нет</td></tr>
                <tr><th>Неизвестно</th><td>Будущий статус отмены ещё не проверялся</td><td>Кто отправил сообщение и что было по ссылке</td></tr>
                <tr><th>Шаг Саши</th><td>Отменить подписку</td><td>Не открывать ссылку; проверить статус отдельно</td></tr>
              </tbody>
            </table>
          </div>
          <p>Один источник не отвечает на все вопросы: условия объяснили списание, поддержка — статус операции.</p>
          <ActionRow><Button onClick={() => setStage('complete')}>Перейти к итогу эпизода</Button></ActionRow>
        </LearningBridge>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceLeftEarly ? 'Итог эпизода · остальная практика пропущена' : 'Итог эпизода · разбор завершён'}
          </p>
          <h2>Другой вопрос потребовал другого источника</h2>
          {practiceLeftEarly ? <p>Вы перешли к итогу без остальной практики. Сцены и решения Саши остались прежними.</p> : null}
          <p>Поддержка установила отсутствие зависшей операции, но не доказала, кто отправил сообщение.</p>
          <blockquote>{takeaway}</blockquote>
          <ActionRow><CopyTakeaway text={takeaway} /></ActionRow>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
