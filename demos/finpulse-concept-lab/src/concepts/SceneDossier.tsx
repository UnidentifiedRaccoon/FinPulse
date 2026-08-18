import { useState } from 'react'

import { ExperienceLayout, IntroPanel, LearningBridge } from '../components/ExperienceLayout'
import { StoryReader } from '../components/StoryReader'
import { ActionRow, Button, ChoiceField, CompletionActions, CopyTakeaway, ScopeFeedback } from '../components/Ui'
import { artifactRoleOptions, dossierArtifacts, fullChapterOneFixture } from '../demoContent'
import type { EvidencePrompt } from '../types'

type Stage = 'intro' | 'story' | 'dossier' | 'status' | 'feedback' | 'complete'

const centralClaim = 'Существует зависшая операция, для завершения которой нужно перейти по ссылке из сообщения.'

const statusPrompt: EvidencePrompt = {
  id: 'claim-status',
  statement: 'Какой статус получает центральное утверждение после сопоставления трёх фрагментов?',
  options: [
    { id: 'supported', label: 'Подтверждено в пределах источников' },
    { id: 'unsupported', label: 'Подтверждения нет' },
    { id: 'contradicted', label: 'Противоречит результату независимой проверки' },
    { id: 'unknown', label: 'Остаётся полностью неизвестным' },
  ],
}

const takeaway = 'Источник подтверждает только то, что действительно входит в область его проверки.'

export function SceneDossier() {
  const [stage, setStage] = useState<Stage>('intro')
  const [roles, setRoles] = useState<Record<string, string>>({})
  const [claimStatus, setClaimStatus] = useState<string>()
  const [practiceLeftEarly, setPracticeLeftEarly] = useState(false)

  const activeStage = stage === 'dossier' || stage === 'status' || stage === 'feedback' ? 1 : stage === 'complete' ? 2 : 0

  function reset() {
    setRoles({})
    setClaimStatus(undefined)
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
      description="После законченной сцены отдельно разберём три её фрагмента и границы одного проверяемого утверждения."
      stageKey={stage}
      stageLabels={['История Саши', 'Разбор источников', 'Итог эпизода']}
      title="Какой источник что подтвердил?"
    >
      {stage === 'intro' ? (
        <IntroPanel
          activity="сопоставить три фрагмента сцены и проверить одно узкое утверждение."
          skip="Можно пропустить и сразу открыть итог."
        >
          <Button onClick={() => setStage('story')}>Читать начало истории</Button>
        </IntroPanel>
      ) : null}

      {stage === 'story' ? (
        <>
          <StoryReader paragraphs={fullChapterOneFixture} />
          <LearningBridge
            boundary="Поступок Саши уже произошёл. Разбор не устанавливает личность отправителя и содержимое ссылки."
            material="Три коротких фрагмента, выделенные авторами из уже прочитанной сцены: условия, сообщение и ответ поддержки. Это не новые документы."
            purpose="Сопоставление показывает, какой источник что подтвердил и где заканчивается область его ответа."
            status="Сцена завершена · дальше разбор источников"
            title="Какой источник что подтвердил?"
          >
            <ActionRow>
              <Button onClick={() => setStage('dossier')}>Разобрать три фрагмента сцены</Button>
              <Button onClick={leavePractice} tone="text">
                Пропустить разбор и перейти к итогу
              </Button>
            </ActionRow>
          </LearningBridge>
        </>
      ) : null}

      {stage === 'dossier' ? (
        <section className="interaction-section">
          <p className="section-label">Центральное утверждение</p>
          <h2>Три фрагмента из прочитанной сцены</h2>
          <p className="supporting-copy">
            Сначала отметьте роль каждого фрагмента. На следующем шаге они будут сопоставлены вокруг одного узкого
            утверждения.
          </p>
          <blockquote>{centralClaim}</blockquote>
          <div className="dossier-list">
            {dossierArtifacts.map((artifact, index) => {
              const prompt: EvidencePrompt = {
                id: `artifact-${artifact.id}`,
                statement: `Какую роль играет фрагмент ${index + 1}?`,
                options: artifactRoleOptions,
              }
              return (
                <article className="artifact" key={artifact.id}>
                  <p className="artifact-number">0{index + 1}</p>
                  <h3>{artifact.title}</h3>
                  <blockquote>{artifact.text}</blockquote>
                  <p><strong>Происхождение:</strong> {artifact.provenance}</p>
                  <p><strong>Область:</strong> {artifact.scope}</p>
                  <ChoiceField
                    onChange={(value) => setRoles((current) => ({ ...current, [artifact.id]: value }))}
                    prompt={prompt}
                    value={roles[artifact.id]}
                  />
                </article>
              )
            })}
          </div>
          <ActionRow>
            <Button onClick={() => setStage('status')}>Перейти к общему выводу</Button>
            <Button onClick={leavePractice} tone="text">Закончить разбор и перейти к итогу</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'status' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Разбор источников · шаг 2 из 2</p>
          <h2>Какой вывод выдерживают три источника?</h2>
          <p className="supporting-copy">
            Сопоставьте только центральное утверждение. Личность отправителя и содержимое ссылки остаются за пределами
            вывода.
          </p>
          <blockquote>{centralClaim}</blockquote>
          <ChoiceField onChange={setClaimStatus} prompt={statusPrompt} value={claimStatus} />
          <ActionRow>
            <Button onClick={() => setStage('feedback')}>Показать вывод по источникам</Button>
            <Button onClick={leavePractice} tone="text">Закончить разбор и перейти к итогу</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'feedback' ? (
        <section className="interaction-section narrow-section">
          <p className="section-label">Сверка с источниками завершена</p>
          <h2>Что выдержал разбор источников?</h2>
          <ScopeFeedback title="Область подтверждения">
            <p>
              Поддержка в самостоятельно открытом приложении сообщила, что зависшей операции нет. Это противоречит
              именно узкому утверждению о такой операции.
            </p>
            <p>Разбор источников не устанавливает, кто отправил сообщение и что произошло бы после перехода по ссылке.</p>
            {claimStatus && claimStatus !== 'contradicted' ? (
              <p className="selected-note">Ваш вариант сохранён только на этом экране. Канонические источники дают более узкую границу: подтверждено отсутствие зависшей операции.</p>
            ) : null}
          </ScopeFeedback>
          <ActionRow>
            <Button onClick={() => setStage('complete')}>Перейти к итогу эпизода</Button>
          </ActionRow>
        </section>
      ) : null}

      {stage === 'complete' ? (
        <section className="completion">
          <p className="section-label">
            {practiceLeftEarly ? 'Итог эпизода · остальная практика пропущена' : 'Итог эпизода · разбор завершён'}
          </p>
          <h2>Следы не переписали сцену</h2>
          <p>
            {practiceLeftEarly
              ? 'Вы перешли к итогу без остальной практики. Это допустимый путь; история Саши не изменилась.'
              : 'Разметка не меняла действие Саши и не оценивала его личный выбор.'}
          </p>
          <blockquote>{takeaway}</blockquote>
          <ActionRow><CopyTakeaway text={takeaway} /></ActionRow>
          <CompletionActions onRepeat={reset} />
        </section>
      ) : null}
    </ExperienceLayout>
  )
}
