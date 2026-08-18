# FinPulse Concept Lab — accepted design spec

## Accepted visual references

- `design/concept-library-desktop.png` — desktop library, native `1536 × 1045`.
- `design/concept-player-mobile.png` — mobile player, native `852 × 1856`.

The references define composition, typography relationships, palette,
container model and control treatment. The story paragraph visible in the
generated mobile reference is explicitly rejected: it is not Sasha canon.
Implementation copy must come from
`docs/methodology/lore_v2/lore_story_v2_book.md`. The original A–F collection
uses chapter 1, with the compact chapter-3 contrast retained by concept F. The
new A0/B1/C2 consilium collection uses the canonical chapter-3 housing-money
scene, Sasha's bounded decision and its later housing payoff. Every original
route still starts with the same continuous canonical opening: Sasha's arrival,
new work, temporary room, four reminders and agreed rent date, before
continuing to the subscription fixture.

## Product surface

One isolated, no-backend concept lab:

- `/` — one library containing the original six-concept collection and a
  separate three-mechanic consilium collection;
- `/#/concept/a` through `/#/concept/f` — six original independent experiences;
- `/#/concept/a0`, `/#/concept/b1`, `/#/concept/c2` — three independent
  consilium experiences;
- unknown hashes return to a deliberate not-found state;
- leaving a route destroys all interaction and free-text state.

No registration, API, fetch, cookies, local/session storage, analytics,
session replay, scoring, mastery, profile, recommendation or story branching.

## Visible-copy lock: library first viewport

- Brand: `ФинПульс`
- Utility action: `О демке`
- H1: `Один эпизод — шесть самостоятельных версий`
- Story premise: `«Свой маршрут» — история в шести главах о первом годе Саши после переезда ради новой работы.`
- Alternative-model copy: `Шесть ссылок ниже — альтернативные версии одной демки, не уроки по порядку. История везде одинакова; различается только явно отмеченная практика, которую можно пропустить без изменения сюжета.`
- Primary action: `Пройти рекомендованную версию`
- A: `Пауза наблюдателя` / `Замечать факт, утверждение и неизвестное` / `5–7 мин`
- B: `Досье сцены` / `Проверять утверждение по следам` / `6–8 мин`
- C: `Модель одного изменения` / `Отделять прямое изменение от догадки` / `6–8 мин`
- D: `Рядом, не вместо` / `Различать помощь, действие и решение` / `7–9 мин`
- E: `Нить решения` / `Следить, как меняется критерий` / `7–9 мин`
- F: `Правило с поправками` / `Уточнять правило после нового факта` / `8–10 мин`
- Recommendation line on C: `Рекомендуем начать здесь`
- Privacy note: `Без регистрации. Ответы не отправляются и исчезают после выхода.`

No eyebrow, badge, score, completion percentage or account action may be
added above the fold.

## New-section copy lock

The consilium collection begins after the full original A–F index and before
the shared privacy note. It does not alter the locked first viewport.

- Label: `Новая подборка · глава 3 из 6`
- H2: `Деньги на жильё — три самостоятельные версии`
- Premise: `Саша хочет ускорить переезд, но отложенные деньги могут понадобиться к окончанию аренды. Во всех трёх демках канон один; меняется только учебная практика.`
- Orientation: `Версии независимы. Можно открыть любую и пропустить практику без изменения решения Саши.`
- A0: `Порог доверия` / `Связать цель, свидетельство и границу вывода` / `7–9 мин`
- B1: `Обратная репетиция срока` / `Проверить доступность денег от жилищного срока назад` / `7–9 мин`
- C2: `Неизменный мотив` / `Увидеть, как одно свидетельство меняет допустимую реплику` / `6–8 мин`
- Section-local recommendation on C2: `Выбрано жюри`

The existing primary action and recommendation on C remain unchanged. C2 gets
its own section-local primary action and marker so the two research rounds do
not collapse into one ranking.

## Wayfinding contract

The A–F labels and concept names belong to the researcher-facing library. Once
a version opens, learner-facing headings name the concrete intellectual action
rather than the internal model.

Every original version starts with a compact orientation explaining:

- the six-chapter, first-year story premise and Sasha's move for work;
- that the current material is the beginning of chapter 1 and one episode from it;
- story first;
- the exact activity that may appear around it;
- the destination of its skip path;
- that skipping removes only the activity and never changes Sasha's story.

Every consilium version uses the same contract with chapter 3 named explicitly:
the housing-money premise, its exact story position, the mechanism-specific
activity, the precise skip destination and the unchanged canonical decision.
B1 additionally warns before revealing the late payoff.

Every first boundary between story and practice names four things in the same
place: current story status, purpose, authored source material and the canon or
privacy boundary. Skip actions name both the skipped object and destination.
Generic `Продолжить`, `Пропустить`, `Вернуться к истории`, learner-facing
`evidence node`, `teach-back` and `learning loop` are prohibited.

Concept C has one story-to-practice bridge. Its two paths are a static
side-by-side comparison, never a switch that can be mistaken for story
branching. Concept F identifies the chapter-3 timeline before the excerpt and
shows comparison pairs as stacked labelled blocks on narrow screens, not a
wide table.

## Visual system

### Color lock

- Background: true white `#ffffff`.
- Primary text: charcoal `#171a21`.
- Secondary text: `#656b75`.
- Hairline/border: `#d9dde5`.
- Cobalt: `#164ee8`; soft state `#eef3ff`; pressed `#0e3bc2`.
- NONCANON coral: `#c43c34`; soft surface `#fff5f3`.
- Focus: cobalt `#164ee8`.
- No gradients, cream/beige background, glass or glow.

### Typography

- Story and display serif: `Iowan Old Style`, `Baskerville`, `Georgia`, serif.
- UI grotesk: Geist Variable with `Inter`, system-ui fallbacks.
- Display: clamp `2.5rem–4.5rem`, line-height `0.98–1.05`.
- Player heading: clamp `2rem–3.2rem`, line-height `1.05`.
- Story: `1.125rem–1.35rem`, line-height `1.7–1.8`, max width `44rem`.
- Controls: `0.95rem–1.05rem`, deliberate weight `560–650`.

### Layout and rhythm

- Desktop library max width `1320px`, gutters `48–72px`.
- Player reading column max width `760px`; interaction column may expand to
  `920px` for matrices.
- Mobile gutters `20px`; tablet/desktop `32–48px`.
- Open editorial bands and ruled lists; no default card grid or nested cards.
- Hairline separators; corners mostly `0–10px`; primary buttons at `8px`.
- Touch targets at least `48px`; sticky mobile action may use a white surface
  with a top hairline, never an opaque floating card.

### Icon inventory

Use Lucide outline icons at `1.75–2px` stroke:

- `ArrowLeft`, `ArrowRight` — navigation;
- `LockKeyhole` — privacy note;
- `RotateCcw` — repeat/re-read;
- `Info`, `CircleAlert` — scope and NONCANON boundary;
- `ChevronDown` — disclosure only.

Icons never replace a visible action label on mobile.

## Component families

- `LabHeader`: quiet brand, back/library action, optional about disclosure.
- `ConceptIndexRow`: large letter or two-character code, title, one-line
  hypothesis, duration and arrow; C and C2 receive a cobalt rule and their own
  collection-local recommendation line.
- `ExperienceIntro`: shared story premise, current chapter position, version
  contract, privacy line and one start action.
- `StoryReader`: canonical paragraphs with chapter number/title and reading typography.
- `StageRail`: semantic labels such as story / practice / continuation; it is
  not progress or a score.
- `ChoiceGroup`: semantic `fieldset` and 48px radio-like rows.
- `EvidenceRow`: open ruled row with status controls.
- `ScopeFeedback`: descriptive canon/source boundary in `aria-live=polite`.
- `NonCanonBoundary`: coral outline/surface and persistent compact reminder.
- `StickyActions`: primary action plus equal secondary skip.
- `Completion`: canon return, static takeaway and routes to repeat/library.

## Six interaction contracts

- A: one pause before the reveal; three epistemic-status rows and one source
  question; then canonical continuation.
- B: full scene first; exactly three authored artifacts and one claim status.
- C: full scene first; explicit NONCANON; exactly one operational parameter;
  direct delta versus unknown.
- D: full scene first; explicit access/help/action/decision facts with
  `не указано`; no legal interpretation.
- E: two naturally completed sub-scenes; a prefilled Sasha-only decision thread
  whose question/source changes; no learner profile.
- F: chapter-1 scene; optional ephemeral teach-back; chapter-3 canonical
  contrast; reconstruction from truthful fragments; all typed text is cleared
  before moving on.

Every route has a real skip path. Skipping cannot produce a failed or
incomplete state. Every route returns to the same canonical outcome.

## Three consilium interaction contracts

- A0 — `Порог доверия`: chronological chapter-3 read; a third-person causal
  record connecting Sasha's goal and date, one past example, unresolved links
  and a bounded conclusion; scene-specific broken-link feedback; the same
  sufficiency check transferred to a theatre announcement.
- B1 — `Обратная репетиция срока`: spoiler-aware housing payoff first; two
  reverse deadline tracks shown simultaneously; exactly one persistent
  NONCANON adverse condition; an information-only timing check with an exit
  criterion and return point; the same deadline placement transferred to a
  theatre rehearsal.
- C2 — `Неизменный мотив`: character-locked minimal pair after the shared
  check; exactly one NONCANON premise confirms only the timing for receiving
  the balance available then; motive, relationship, canon and every other gap
  stay locked; learner predicts the bounded utterance delta before canonical
  decision and housing payoff return; theatre transfer requires both a
  conditional action and an explicit limit.

The C2 premise never confirms preservation of the initially contributed sum,
repeatability, losses or responsibility. It cannot be shortened to “the money
can be withdrawn by the date”. None of the three mechanics asks the learner to
choose an investment action for Sasha or themselves.

## Responsive continuation

- At `<= 720px`, library rows become a two-column composition: letter rail plus
  content; duration and arrow remain on the same final row.
- A0/B1/C2 codes remain legible in the same rail without widening the page.
- Player header keeps brand and a single library action; stage labels may
  horizontally scroll but never truncate.
- Evidence matrices stack label above controls; no horizontal page scroll.
- B1 reverse tracks and the C2 minimal pair stack vertically with their canon
  and NONCANON labels intact.
- Sticky actions respect `env(safe-area-inset-bottom)`.
- At reduced motion, all transitions become immediate.

## Motion

- Route/state entry: `160ms` opacity plus `6px` vertical movement.
- Selected rows: `120ms` border/background transition.
- No animated progress bars, confetti, parallax or decorative motion.

## Design acceptance notes

The desktop reference is accepted for its open index, typographic hierarchy,
true-white palette and cobalt rail. The mobile reference is accepted for its
reading rhythm, NONCANON boundary, ruled evidence controls and sticky action.
The following generated details are intentionally superseded by this spec:

- invented noncanonical story paragraph;
- generated 10–14 minute labels;
- any implication that state remains on the device after leaving the route.

## Final fidelity ledger

Compared again at native reference size and against browser captures on
2026-08-16. The implementation preserves the intended visual system in these
specific ways:

1. The library keeps the true-white editorial canvas, quiet hairline header,
   oversized serif title and restrained grotesk supporting copy.
2. The six concepts remain an open ruled index on one cobalt rail, rather than
   becoming a card grid; C alone receives the stronger cobalt marker.
3. The mobile library preserves the letter/title/hypothesis hierarchy and
   moves duration plus arrow below the copy without horizontal page overflow.
4. The player retains the compact brand header and semantic stage rail; the
   rail names the current mode (story, practice or outcome), never a score or
   completion percentage.
5. The NONCANON boundary uses the locked coral treatment and remains visible
   before the one-change controls.
6. Evidence choices use full-width ruled rows with measured 49px mobile touch
   targets; primary actions measure 50px and parameter choices 82px.

The 2026-08-16 wayfinding repair intentionally supersedes the original raw-image
library headline and route-transition copy while retaining its editorial
composition, palette and typography. The copy changes are product corrections:
they separate the researcher library from learner mode, explain provenance and
make skip consequences explicit rather than representing visual drift.

The later story-entry repair intentionally adds the uninterrupted canonical
opening before the shared fixture and a concise, non-duplicative six-chapter
premise inside the existing intro state. It adds no extra step, story branch
or learning unit.

The consilium extension intentionally adds a second ruled index rather than
altering the accepted first viewport. Its three routes reuse the same editorial
canvas, focus management and local-state privacy contract, while adding only
the component grammar required for a causal record, reverse tracks and a
minimal pair. Coral remains reserved for explicit NONCANON material; no card
grid, gradient, score or persistence was introduced.
