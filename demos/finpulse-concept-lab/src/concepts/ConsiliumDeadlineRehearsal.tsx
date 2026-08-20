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
  deadlinePlacementPrompt,
  theatreDeadlinePrompt,
} from '../demoContent'

type Stage =
  | 'intro'
  | 'payoff'
  | 'rehearsal'
  | 'deadline-feedback'
  | 'theatre'
  | 'theatre-feedback'
  | 'canon'
  | 'complete'

export function ConsiliumDeadlineRehearsal() {
  const [stage, setStage] = useState<Stage>('intro')
  const [placement, setPlacement] = useState<string>()
  const [theatrePlacement, setTheatrePlacement] = useState<string>()
  const [practiceSkipped, setPracticeSkipped] = useState(false)

  const activeStage = ['rehearsal', 'deadline-feedback', 'theatre', 'theatre-feedback'].includes(stage)
    ? 1
    : ['canon', 'complete'].includes(stage)
      ? 2
      : 0

  function skipRehearsal() {
    setPlacement(undefined)
    setTheatrePlacement(undefined)
    setPracticeSkipped(true)
    setStage('canon')
  }

  function reset() {
    setPlacement(undefined)
    setTheatrePlacement(undefined)
    setPracticeSkipped(false)
    setStage('intro')
  }

  return (
    <ExperienceLayout
      activeStage={activeStage}
      description="Сначала увидим поздний жилищный результат, затем развернём две качественные дорожки назад к проверке срока и вернёмся к канону."
      stageKey={stage}
      stageLabels={['Канонический результат', 'Обратная репетиция', 'История и итог']}
      title="Что должно остаться доступным к сроку?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="поздний канонический результат, после которого одна вымышленная дорожка разворачивается назад к сроку."
          label="«Свой маршрут» · глава 3 из 6"
          overview="Саша выбирает жильё на более долгий срок. Эта версия намеренно начинает с позднего последствия и предупреждает об этом до открытия."
          routeLead="Сначала: спойлер — результат позднее в главе 3. Затем —"
          skip="Обратную репетицию можно не открывать и прочитать всю сцену по порядку."
          title="Срок виден от результата назад"
        >
          <Button onClick={() => setStage('payoff')}>Открыть поздний канонический результат</Button>
        </IntroPanel>
      ) : null}

      {stage === 'payoff' ? (
        <>
          <StoryReader
            label="Канонический результат · позже в главе 3"
            paragraphs={chapterThreeHousingPayoff}
            title="Часть отложенных денег позже использовали для жилья"
          />
          <LearningBridge
            boundary="В учебной дорожке меняется ровно одно условие о сроке. Она не показывает, что Саша сделал бы, и не предлагает переводить деньги."
            material="Один уже показанный канонический результат и одна явно вымышленная задержка срока доступа."
            purpose="Обратный просмотр помогает поставить информационную проверку до момента, когда жилищный план начнёт зависеть от неподтверждённого срока."
            status="Поздний результат показан · дальше смотрим назад"
            title="Где дорожки начинают расходиться?"
          >
            <ActionRow>
              <Button onClick={() => setStage('rehearsal')}>Развернуть две дорожки назад</Button>
              <Button onClick={skipRehearsal} tone="text">
                Не открывать обратную репетицию — прочитать канон по порядку
              </Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'rehearsal' ? (
        <section className="interaction-section">
          <p className="section-label">Обратная репетиция · качественные сроки, не прогноз</p>
          <h2>Две дорожки от жилищной даты назад</h2>
          <NonCanonBoundary compact title="Одно учебное изменение — не часть канона">
            <p>
              Только для репетиции представим: в условиях прямо указан срок вывода, и он заканчивается после даты,
              когда Саше могут понадобиться деньги на жильё. Такого условия в истории не было.
            </p>
          </NonCanonBoundary>
          <div className="reverse-tracks" aria-label="Две обратные дорожки срока" role="region">
            <article>
              <p className="section-label">Канон · от результата назад</p>
              <h3>Деньги остались в жилищном плане</h3>
              <ol reversed>
                <li><strong>Жилищный результат:</strong> оплачен первый месяц продлённой аренды.</li>
                <li><strong>До результата:</strong> отложенная сумма оставалась в плане на жильё.</li>
                <li><strong>До решения:</strong> подтверждения всей суммы к сроку не было; Саша денег не переводил.</li>
              </ol>
            </article>
            <article className="reverse-track--noncanon">
              <p className="section-label">Учебная дорожка · одно изменение</p>
              <h3>Срок доступа заканчивается позже</h3>
              <ol reversed>
                <li><strong>Жилищная дата:</strong> доступность части денег ещё не подтверждена.</li>
                <li><strong>До даты:</strong> план уже зависит от более позднего срока вывода.</li>
                <li><strong>Точка проверки:</strong> нужно сопоставить даты до изменения жилищного плана.</li>
              </ol>
            </article>
          </div>
          <div className="information-test">
            <p className="section-label">Только информационная проверка</p>
            <dl>
              <div>
                <dt>Проверить</dt>
                <dd>Когда можно запросить вывод доступного остатка и к какой дате его перечисляют.</dd>
              </div>
              <div>
                <dt>Закончить проверку</dt>
                <dd>Когда даты найдены и сопоставлены. Это ничего не говорит о решении Саши.</dd>
              </div>
              <div>
                <dt>Вернуться</dt>
                <dd>К плану на жильё до того, как он начнёт зависеть от неподтверждённого срока доступа.</dd>
              </div>
            </dl>
          </div>
          <ChoiceField onChange={setPlacement} prompt={deadlinePlacementPrompt} value={placement} />
          <ActionRow>
            <Button onClick={() => setStage('deadline-feedback')}>Сопоставить сроки дорожек</Button>
            <Button onClick={skipRehearsal} tone="text">
              Закончить обратную репетицию — прочитать канон по порядку
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'deadline-feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Результат сопоставления · без финансового действия</p>
          <h2>Дорожки расходятся по доступности к сроку</h2>
          <ScopeFeedback title={placement === 'before-plan' ? 'Проверка поставлена до зависимости' : 'Результат появляется слишком поздно'}>
            <p>
              {placement === 'before-plan'
                ? 'Проверка стоит до того, как жилищный план начинает зависеть от срока доступа.'
                : 'К моменту изменения плана результат ещё не поддерживает его: дорожки расходятся именно по доступности ресурса.'}
            </p>
            <p>
              Такое сопоставление уточняет только сроки. Оно не подтверждает сохранность всей первоначально внесённой
              суммы, повторяемость результата, возможные потери или ответственность.
            </p>
          </ScopeFeedback>
          <ActionRow>
            <Button onClick={() => setStage('theatre')}>Проверить обратный срок в театре</Button>
            <Button onClick={skipRehearsal} tone="text">
              Не открывать театральную репетицию — прочитать канон по порядку
            </Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'theatre' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Нефинансовая репетиция · от премьеры назад</p>
          <h2>Когда расписанию ещё не нужен новый приём?</h2>
          <p className="supporting-copy">
            Режиссёр хочет проверить новый сценический приём. Основной план пока работает, а дата премьеры уже назначена.
          </p>
          <ChoiceField onChange={setTheatrePlacement} prompt={theatreDeadlinePrompt} value={theatrePlacement} />
          <ActionRow>
            <Button onClick={() => setStage('theatre-feedback')}>Сопоставить срок репетиции</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'theatre-feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Обратный срок · та же механика</p>
          <h2>Проверка предшествует зависимости плана</h2>
          <ScopeFeedback title={theatrePlacement === 'before-plan' ? 'Расписание остаётся обратимым' : 'Расписание уже зависит от результата'}>
            <p>
              Результат проверки нужен до перестройки расписания. Проверка заканчивается оценкой пригодности приёма;
              она не заменяет основной план и не обещает готовность всей постановки к премьере.
            </p>
          </ScopeFeedback>
          <ActionRow>
            <Button onClick={() => setStage('canon')}>Вернуться к истории и прочитать канон по порядку</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'canon' ? (
        <>
          <StoryReader
            headingId="deadline-canon-start"
            label="Каноническая сцена по порядку · глава 3 из 6"
            paragraphs={chapterThreeOfferAndCheck}
            title="Предложение и совместная проверка"
          />
          <section className="narrative-bridge">
            <p className="section-label">Редакционный мост · события канона не изменены</p>
            <h2>Саша дождался ответа</h2>
            <p>{chapterThreeEditorialBridge}</p>
          </section>
          <StoryReader
            headingId="deadline-canon-outcome"
            label="Каноническое продолжение · глава 3 из 6"
            paragraphs={[...chapterThreeDecision, ...chapterThreeHousingPayoff]}
            title="Решение и поздний жилищный результат"
          />
          <ActionRow>
            <Button onClick={() => setStage('complete')}>Перейти к итогу механики</Button>
          </ActionRow>
        </>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceSkipped ? 'Итог истории · обратная репетиция пропущена' : 'Итог истории · канон восстановлен'}
          </p>
          <h2>Срок проверен без действия за Сашу</h2>
          <p>
            В каноне конкретный поздний срок не был установлен. Не было подтверждения, что Саша сможет забрать всю
            сумму к жилищной дате; решение не вкладывать принял сам Саша.
          </p>
          <p className="safety-note">Это образовательная история, а не индивидуальная финансовая рекомендация.</p>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
