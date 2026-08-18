import { useState } from 'react'

import {
  ExperienceLayout,
  IntroPanel,
  LearningBridge,
  NonCanonBoundary,
} from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import { ActionRow, Button, ChoiceField, CompletionActions, ScopeFeedback } from '../components/Ui'
import {
  chapterThreeDecision,
  chapterThreeEditorialBridge,
  chapterThreeHousingPayoff,
  chapterThreeOfferAndCheck,
  motivePredictionPrompt,
  theatreActionPrompt,
  theatreLimitPrompt,
} from '../demoContent'

type Stage =
  | 'intro'
  | 'story'
  | 'rehearsal'
  | 'feedback'
  | 'canon'
  | 'transfer'
  | 'transfer-feedback'
  | 'complete'

const fictionalLine =
  'Теперь понятно, что доступную на тот момент сумму можно вывести к нужной дате. Но по-прежнему нет подтверждений, что прошлый результат повторится и что к этому моменту сохранится вся отложенная на жильё сумма. Эти деньги могут понадобиться, когда закончится аренда. Я сюда вкладываться не буду.'

export function ConsiliumUnchangedMotive() {
  const [stage, setStage] = useState<Stage>('intro')
  const [prediction, setPrediction] = useState<string>()
  const [theatreAction, setTheatreAction] = useState<string>()
  const [theatreLimit, setTheatreLimit] = useState<string>()
  const [practiceSkipped, setPracticeSkipped] = useState(false)

  const activeStage = ['rehearsal', 'feedback'].includes(stage)
    ? 1
    : ['canon', 'transfer', 'transfer-feedback', 'complete'].includes(stage)
      ? 2
      : 0

  function skipRehearsal() {
    setPrediction(undefined)
    setPracticeSkipped(true)
    setStage('canon')
  }

  function reset() {
    setPrediction(undefined)
    setTheatreAction(undefined)
    setTheatreLimit(undefined)
    setPracticeSkipped(false)
    setStage('intro')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="После совместной проверки изменим ровно одну вымышленную посылку, предскажем границу реплики и затем полностью восстановим канон."
      stageKey={stage}
      stageLabels={['История Саши', 'Один вымышленный дубль', 'Канон и перенос']}
      title="Какая часть реплики могла бы измениться?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="один явно вымышленный дубль с неизменными мотивом Саши, отношениями с Лерой и остальными пробелами."
          label="«Свой маршрут» · глава 3 из 6 · выбрано жюри"
          overview="Саша и Лера вместе проверяют привлекательное предложение для денег, уже отложенных на жильё. Решение остаётся за Сашей."
          routeLead="Сначала: каноническая сцена главы 3 до решения. Затем —"
          skip="Дубль можно не открывать и сразу прочитать каноническую реплику и поздний жилищный результат."
          title="Одна посылка, прежний герой"
        >
          <Button onClick={() => setStage('story')}>Читать сцену до решения Саши</Button>
        </IntroPanel>
      ) : null}

      {stage === 'story' ? (
        <>
          <StoryReader
            label="Канонический фрагмент · глава 3 из 6"
            paragraphs={chapterThreeOfferAndCheck}
            title="Мотив и совместная проверка"
          />
          <LearningBridge
            boundary="Меняется только одна вымышленная посылка. Мотив Саши, отношения с Лерой, остальные неизвестные и каноническое решение остаются прежними."
            material="Уже прочитанная сцена и одна авторская посылка только о сроке получения доступного на тот момент остатка."
            purpose="Минимальная пара показывает, какую часть реплики вообще разрешает сдвинуть новое свидетельство — без превращения его в гарантию безопасности."
            status="Канон на паузе · пробелы уже видны"
            title="Какая часть реплики могла бы измениться?"
          >
            <ActionRow>
              <Button onClick={() => setStage('rehearsal')}>Открыть один вымышленный дубль</Button>
              <Button onClick={skipRehearsal} tone="text">
                Не открывать вымышленный дубль — прочитать каноническое решение
              </Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'rehearsal' ? (
        <section className="interaction-section">
          <p className="section-label">Один вымышленный дубль · не описание реального продукта</p>
          <h2>Сдвинулся только срок доступного остатка</h2>
          <NonCanonBoundary compact title="Репетиция вне канона — изменена одна посылка">
            <p>
              В этом вымышленном варианте проверяемый источник подтверждает условия и сроки вывода: Саша может
              запросить вывод доступного на тот момент остатка и получить его к дате решения по жилью. Это закрывает
              только срок доступа; не подтверждает сохранность всей первоначально внесённой суммы, повторяемость
              результата, возможные потери или ответственность.
            </p>
          </NonCanonBoundary>
          <div className="minimal-pair" aria-label="Канон и одна вымышленная посылка" role="region">
            <article>
              <p className="section-label">Канон на паузе</p>
              <h3>Срок получения всей суммы не подтверждён</h3>
              <p>
                Известны жилищная цель и один прошлый результат. Повторяемость и возможность забрать всю сумму к
                сроку не подтверждены.
              </p>
            </article>
            <article className="minimal-pair__fiction">
              <p className="section-label">Только вымышленная посылка</p>
              <h3>Подтверждён срок доступного тогда остатка</h3>
              <p>
                Доступный на момент вывода остаток можно получить к жилищной дате. Не подтверждено, что он будет равен
                первоначально внесённой сумме.
              </p>
            </article>
          </div>
          <div className="locked-premises" aria-label="Что остаётся неизменным">
            <p className="section-label">Зафиксировано в обоих дублях</p>
            <ul>
              <li>Саша хочет сохранить возможность решить жилищный вопрос к известной дате.</li>
              <li>Лера предлагает совместную проверку, а окончательное решение принимает Саша.</li>
              <li>Повторяемость результата, сохранность всей суммы, потери и ответственность не подтверждены.</li>
            </ul>
          </div>
          <ChoiceField onChange={setPrediction} prompt={motivePredictionPrompt} value={prediction} />
          <ActionRow>
            <Button onClick={() => setStage('feedback')}>Сравнить границу реплики</Button>
            <Button onClick={skipRehearsal} tone="text">
              Закончить вымышленный дубль — прочитать каноническое решение
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Авторская сверка · вымышленный дубль не становится каноном</p>
          <h2>Новая посылка сдвигает только одну границу</h2>
          <ScopeFeedback title={prediction === 'timing-only' ? 'Дельта ограничена сроком' : 'Вывод стал шире свидетельства'}>
            <p>
              Сдвинулся срок получения доступного остатка. Не изменились сохранность всей первоначально внесённой
              суммы, повторяемость результата, возможные потери и ответственность.
            </p>
            <p>
              Из новой посылки не следует, что предложение безопасно, подходит Саше или требует иного решения. Решение
              в учебном дубле может измениться или не измениться.
            </p>
          </ScopeFeedback>
          <div className="fictional-utterance">
            <p className="section-label">Один допустимый вариант реплики · не канон</p>
            <blockquote>{fictionalLine}</blockquote>
          </div>
          <ActionRow>
            <Button onClick={() => setStage('canon')}>Восстановить канон и прочитать решение Саши</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'canon' ? (
        <>
          <section className="narrative-bridge">
            <p className="section-label">Канон восстановлен · вымышленная посылка удалена</p>
            <h2>Саша дождался ответа</h2>
            <p>{chapterThreeEditorialBridge}</p>
          </section>
          <StoryReader
            label="Каноническое продолжение · глава 3 из 6"
            paragraphs={[...chapterThreeDecision, ...chapterThreeHousingPayoff]}
            title="Решение и поздний жилищный результат"
          />
          <ActionRow>
            <Button onClick={() => setStage('transfer')}>Проверить границу в театральном дубле</Button>
            <Button onClick={() => setStage('complete')} tone="text">
              Не открывать театральный дубль — перейти к итогу механики
            </Button>
          </ActionRow>
        </>
      ) : null}

      {stage === 'transfer' ? (
        <section className="interaction-section">
          <p className="section-label">Нефинансовый перенос · одна посылка</p>
          <h2>Что разрешают два подтверждённых свойства?</h2>
          <NonCanonBoundary compact title="Отдельный театральный дубль — не часть истории Саши">
            <p>
              Представим, что для нового сценического приёма подтверждены пригодность для новичков и обратимость. Что
              можно обсуждать теперь — и какой предел всё ещё обязателен?
            </p>
          </NonCanonBoundary>
          <div className="question-stack">
            <ChoiceField onChange={setTheatreAction} prompt={theatreActionPrompt} value={theatreAction} />
            <ChoiceField onChange={setTheatreLimit} prompt={theatreLimitPrompt} value={theatreLimit} />
          </div>
          <ActionRow>
            <Button onClick={() => setStage('transfer-feedback')}>Сверить действие и явный предел</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'transfer-feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Минимальная пара · новая область</p>
          <h2>Условное действие не отменяет предел</h2>
          <ScopeFeedback
            title={theatreAction === 'bounded' && theatreLimit === 'bounded' ? 'Обе части удержаны' : 'Одной части не хватает'}
          >
            <p>
              Если пригодность новичкам и обратимость подтверждены, метод можно обсудить только как дополнительный
              приём для некритичной сцены, не заменяя основной план.
            </p>
            <p>Неизвестно, ускорит ли он всю постановку и сохранит ли готовность к премьере.</p>
          </ScopeFeedback>
          <ActionRow>
            {theatreAction === 'bounded' && theatreLimit === 'bounded' ? (
              <Button onClick={() => setStage('complete')}>Завершить механику</Button>
            ) : (
              <Button onClick={() => setStage('transfer')}>Уточнить действие и явный предел</Button>
            )}
          </ActionRow>
        </section>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceSkipped ? 'Итог истории · вымышленный дубль пропущен' : 'Итог истории · канон не изменён'}
          </p>
          <h2>Одно новое свидетельство не переписывает героя</h2>
          <p>
            Вымышленная посылка могла изменить только фразу о сроке доступного остатка. Мотив Саши, границы остальных
            сведений, его самостоятельное решение и поздний жилищный результат остались каноническими.
          </p>
          <p className="safety-note">Это образовательная история, а не индивидуальная финансовая рекомендация.</p>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
