import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import { ActionRow, Button, ChoiceField, CompletionActions, ScopeFeedback } from '../components/Ui'
import {
  chapterThreeDecision,
  chapterThreeEditorialBridge,
  chapterThreeHousingPayoff,
  chapterThreeOfferAndCheck,
  theatreTrustPrompt,
  trustEvidenceExpected,
  trustEvidencePrompts,
} from '../demoContent'

type Stage =
  | 'intro'
  | 'story'
  | 'audit'
  | 'audit-feedback'
  | 'transfer'
  | 'transfer-feedback'
  | 'outcome'
  | 'complete'

const boundedPassport =
  'Деньги нужны Саше для жилья к окончанию аренды. Источник подтверждает один прошлый результат, но не подтверждает повторяемость, сохранность всей первоначально внесённой суммы, возможные потери, ответственность и получение всей суммы к жилищной дате. Поэтому вывод относится только к этому предложению и этим деньгам.'

export function ConsiliumTrustThreshold() {
  const [stage, setStage] = useState<Stage>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [theatreAnswer, setTheatreAnswer] = useState<string>()
  const [practiceSkipped, setPracticeSkipped] = useState(false)

  const activeStage = ['audit', 'audit-feedback', 'transfer', 'transfer-feedback'].includes(stage)
    ? 1
    : ['outcome', 'complete'].includes(stage)
      ? 2
      : 0
  const answeredCount = Object.keys(answers).length
  const exactMatch = trustEvidencePrompts.every((prompt) => answers[prompt.id] === trustEvidenceExpected[prompt.id])

  function skipPractice() {
    setAnswers({})
    setTheatreAnswer(undefined)
    setPracticeSkipped(true)
    setStage('outcome')
  }

  function reset() {
    setAnswers({})
    setTheatreAnswer(undefined)
    setPracticeSkipped(false)
    setStage('intro')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="Сначала прочитаем причинную сцену по порядку, затем проверим, какие сведения выдерживают ограниченный вывод, а какие оставляют разрыв."
      stageKey={stage}
      stageLabels={['История Саши', 'Редакторский разбор', 'Канонический итог']}
      title="На чём держится вывод Саши?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="редакторский разбор причинной связи и такой же перенос в театральную ситуацию."
          label="«Свой маршрут» · глава 3 из 6"
          overview="Саша выбирает жильё на более долгий срок. Деньги уже отложены на возможный переезд, а привлекательная реклама обещает ускорить накопление."
          routeLead="Сначала: каноническая сцена главы 3. Затем —"
          skip="Разбор можно пропустить и сразу открыть каноническое решение и поздний жилищный результат."
          title="Деньги к жилищному сроку"
        >
          <Button onClick={() => setStage('story')}>Читать сцену главы 3</Button>
        </IntroPanel>
      ) : null}

      {stage === 'story' ? (
        <>
          <StoryReader
            label="Канонический фрагмент · глава 3 из 6"
            paragraphs={chapterThreeOfferAndCheck}
            title="Предложение и совместная проверка"
          />
          <LearningBridge
            boundary="Вы проверяете достаточность связей в уже прочитанной сцене, а не выбираете действие за Сашу. Его решение появится после разбора."
            material="Цель и срок Саши, один прошлый пример, найденные условия и явно названные пробелы из канонической сцены."
            purpose="Один подтверждённый фрагмент легко принять за основание для более широкого вывода. Редакторская разметка удерживает границу между ними."
            status="Канон на паузе · совместная проверка завершена"
            title="Хватает ли сведений для этого вывода?"
          >
            <ActionRow>
              <Button onClick={() => setStage('audit')}>Проверить причинные связи</Button>
              <Button onClick={skipPractice} tone="text">
                Пропустить редакторский разбор — открыть канонический итог
              </Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'audit' ? (
        <section className="interaction-section">
          <p className="section-label">Редакторский разбор · только прочитанная сцена</p>
          <h2>Что подтверждено, а где связь обрывается?</h2>
          <p className="supporting-copy">
            Отметьте статус каждой опоры. Здесь нет балла: итог покажет одну ограниченную причинную цепочку.
          </p>
          <div className="evidence-matrix">
            {trustEvidencePrompts.map((prompt) => (
              <ChoiceField
                key={prompt.id}
                layout="inline"
                onChange={(value) => setAnswers((current) => ({ ...current, [prompt.id]: value }))}
                prompt={prompt}
                value={answers[prompt.id]}
              />
            ))}
          </div>
          <ActionRow>
            <Button onClick={() => setStage('audit-feedback')}>
              Сверить причинную цепочку · отмечено {answeredCount} из {trustEvidencePrompts.length}
            </Button>
            <Button onClick={skipPractice} tone="text">
              Закончить разбор — открыть канонический итог
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'audit-feedback' ? (
        <section className="interaction-section">
          <p className="section-label">Авторская сверка · без балла</p>
          <h2>Какой вывод выдерживает сцена?</h2>
          <ScopeFeedback title={exactMatch ? 'Цепочка ограничена сценой' : 'Сломанная связь найдена'}>
            <p>
              Один прошлый удачный пример подтверждает только то, что такой результат однажды был описан. Он не
              подтверждает повторение результата, сохранность всей внесённой суммы или её доступность к сроку Саши.
            </p>
            {!exactMatch ? (
              <p>
                Верните формулировку к тому, что прямо установлено: цель и срок известны, прошлый пример найден, а
                остальные переходы остаются неподтверждёнными.
              </p>
            ) : null}
          </ScopeFeedback>
          <div className="causal-passport" aria-label="Ограниченная причинная цепочка">
            <p className="section-label">Редакторская запись по сцене</p>
            <dl>
              <div>
                <dt>Цель и срок</dt>
                <dd>Отложенные деньги могут понадобиться для жилья к окончанию аренды.</dd>
              </div>
              <div>
                <dt>Свидетельство</dt>
                <dd>Описан один удачный результат из прошлого периода.</dd>
              </div>
              <div>
                <dt>Разрыв</dt>
                <dd>Не подтверждены повторяемость, сохранность всей суммы, потери, ответственность и доступность к сроку.</dd>
              </div>
              <div>
                <dt>Граница вывода</dt>
                <dd>Решение относится к этому предложению, этим деньгам, цели и сроку Саши.</dd>
              </div>
            </dl>
            <blockquote>{boundedPassport}</blockquote>
          </div>
          <ActionRow>
            <Button onClick={() => setStage('transfer')}>Проверить ту же связь в театре</Button>
            <Button onClick={skipPractice} tone="text">
              Не открывать театральный перенос — открыть канонический итог
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'transfer' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Нефинансовый перенос · не часть истории Саши</p>
          <h2>Выдержит ли связь другую ситуацию?</h2>
          <ChoiceField onChange={setTheatreAnswer} prompt={theatreTrustPrompt} value={theatreAnswer} />
          <ActionRow>
            <Button onClick={() => setStage('transfer-feedback')}>Показать границу театрального вывода</Button>
            <Button onClick={skipPractice} tone="text">
              Закончить перенос — открыть канонический итог
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'transfer-feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Та же причинная проверка · новая область</p>
          <h2>Один случай не подтверждает новый срок</h2>
          <ScopeFeedback title={theatreAnswer === 'bounded' ? 'Граница сохранена' : 'Связь снова расширилась'}>
            <p>
              Анонс подтверждает, что похожую постановку однажды быстро приняли в репертуар. Он не подтверждает, что
              новую постановку примут к указанной дате.
            </p>
          </ScopeFeedback>
          <ActionRow>
            <Button onClick={() => setStage('outcome')}>Восстановить канон и прочитать итог</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'outcome' ? (
        <>
          <section className="narrative-bridge">
            <p className="section-label">Редакционный мост · события канона не изменены</p>
            <h2>Саша дождался ответа</h2>
            <p>{chapterThreeEditorialBridge}</p>
          </section>
          <StoryReader
            label="Каноническое продолжение · глава 3 из 6"
            paragraphs={[...chapterThreeDecision, ...chapterThreeHousingPayoff]}
            title="Решение и жилищный результат"
          />
          <ActionRow>
            <Button onClick={() => setStage('complete')}>Перейти к итогу механики</Button>
          </ActionRow>
        </>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceSkipped ? 'Итог истории · редакторский разбор пропущен' : 'Итог истории · причинная граница сохранена'}
          </p>
          <h2>Поздний результат не расширяет раннее свидетельство</h2>
          <p>
            Саша сам отказался от конкретного предложения. Позже отложенные деньги были использованы для первого
            месяца продлённой аренды. Канон показывает последующее использование денег, но не доказывает, что без них
            продление было бы невозможно.
          </p>
          <p className="safety-note">Это образовательная история, а не индивидуальная финансовая рекомендация.</p>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
