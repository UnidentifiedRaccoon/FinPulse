import { Route, Routes, useParams } from 'react-router'

import { BesideNotInstead } from './concepts/BesideNotInstead'
import { ConsiliumDeadlineRehearsal } from './concepts/ConsiliumDeadlineRehearsal'
import { ConsiliumTrustThreshold } from './concepts/ConsiliumTrustThreshold'
import { ConsiliumUnchangedMotive } from './concepts/ConsiliumUnchangedMotive'
import { DecisionThread } from './concepts/DecisionThread'
import { ObserverPause } from './concepts/ObserverPause'
import { OneChangeModel } from './concepts/OneChangeModel'
import { RuleWithRevisions } from './concepts/RuleWithRevisions'
import { SceneDossier } from './concepts/SceneDossier'
import { LibraryPage } from './routes/LibraryPage'
import { LearnerMechanicPage } from './routes/LearnerMechanicPage'
import { NotFoundPage } from './routes/NotFoundPage'
import { UserTestLessonPage } from './routes/UserTestLessonPage'

function LearnerLessonRoute() {
  const { lessonSlug } = useParams()
  return lessonSlug === 'one-fact-one-conclusion' ? <UserTestLessonPage /> : <LearnerMechanicPage />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<UserTestLessonPage />} path="/" />
      <Route element={<UserTestLessonPage />} path="/lesson/:step" />
      <Route element={<LearnerLessonRoute />} path="/lesson/:lessonSlug/:step" />
      <Route element={<LibraryPage />} path="/lab" />
      <Route element={<ObserverPause />} path="/concept/a" />
      <Route element={<SceneDossier />} path="/concept/b" />
      <Route element={<OneChangeModel />} path="/concept/c" />
      <Route element={<BesideNotInstead />} path="/concept/d" />
      <Route element={<DecisionThread />} path="/concept/e" />
      <Route element={<RuleWithRevisions />} path="/concept/f" />
      <Route element={<ConsiliumTrustThreshold />} path="/concept/a0" />
      <Route element={<ConsiliumDeadlineRehearsal />} path="/concept/b1" />
      <Route element={<ConsiliumUnchangedMotive />} path="/concept/c2" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}
