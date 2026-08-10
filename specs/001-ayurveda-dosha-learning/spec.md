# Feature Specification: Ayurveda Fundamentals, Dosha Discovery & Lifestyle Guidance

**Feature Branch**: `001-ayurveda-dosha-learning`

**Created**: 2026-08-08

**Status**: Draft

**Input**: User description: "Build UnderstandAyurveda: a static, client-only web app that takes a complete novice from zero knowledge of Ayurveda to understanding their own constitutional type and making concrete lifestyle adjustments — via onboarding, a guided fundamentals course, quizzes, a prakriti/vikriti self-assessment, personalized lifestyle guidance, and a searchable reference. Local-only persistence, red-flag screening, source attribution on every claim, WCAG 2.1 AA, offline-capable, no accounts/backend/analytics."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover my constitutional type with results I can trust (Priority: P1)

A newcomer who has heard the word "dosha" but knows nothing else opens the app. Before answering
anything, they are told in one screen what Ayurveda is, what this app is and is not (education,
not medical care), and the difference between prakriti (the constitution you were born with) and
vikriti (how you are doing right now). They then answer a structured self-assessment about their
physical build, physiological patterns, and mental/emotional tendencies. At the end they see a
result expressed as a percentage blend across all three doshas — not a single label — with a
confidence indicator, an explanation of what the blend means in plain English, and the ability to
open up the scoring and see exactly which of their answers produced that result.

**Why this priority**: This is the user's terminal goal. On its own it delivers the complete core
value — "I now know my constitutional type and I understand where that answer came from" — and it
is the anchor every other story attaches to.

**Independent Test**: Complete the onboarding and assessment end-to-end with no other feature
present; verify a three-dosha percentage result, a confidence indicator, and an expandable
score breakdown are produced and survive a page reload.

**Acceptance Scenarios**:

1. **Given** a first-time visitor with no stored data, **When** they open the app, **Then** they
   see the introduction covering what Ayurveda is, the educational-not-medical framing, and the
   prakriti vs vikriti distinction before any assessment question is presented.
2. **Given** a user partway through the assessment, **When** they close and reopen the app,
   **Then** their answers so far are restored and they resume at the question they left.
3. **Given** a user who has answered every assessment question, **When** they submit, **Then**
   results display percentages for Vata, Pitta, and Kapha that sum to 100%, with a named dominant
   pattern shown only alongside the full distribution.
4. **Given** a displayed result, **When** the user opens the scoring breakdown, **Then** they see
   each question, the answer they chose, and the points that answer contributed to each dosha.
5. **Given** a user whose answers are close across two or more doshas, **When** results are shown,
   **Then** a low-confidence or "dual-dosha / tri-doshic" indicator is displayed with an
   explanation that the result is not clearly differentiated.
6. **Given** a user who skips optional questions, **When** they submit, **Then** results are still
   produced, with a reduced confidence indicator and a note that fewer answers lower reliability.
7. **Given** a user on any assessment or results screen, **When** the screen renders, **Then** a
   non-dismissible notice states the content is educational and not medical advice.
8. **Given** a user who indicates a red-flag condition (pregnancy, acute or severe symptoms, a
   diagnosed condition, or current medication), **When** they continue, **Then** a prominent
   prompt to consult a qualified practitioner or physician is shown before results.

---

### User Story 2 - Turn my profile into concrete lifestyle changes (Priority: P2)

Having seen their dosha blend, the user wants to know what to actually do differently on Monday
morning. They open a personalized guidance view organized into practical areas: daily routine and
sleep timing, meal timing and the qualities of food to favor or reduce, style of movement and
exercise, seasonal adjustments, and simple self-care practices. Each recommendation says which
part of their profile it follows from. They can export or print the plan to keep it.

**Why this priority**: "Adjust lifestyle" is the second half of the user's goal. It is worthless
without a profile (US1) but converts an interesting result into action.

**Independent Test**: Given a stored dosha profile, verify the guidance view renders
recommendations across all five areas, each traceable to the profile, and that export and print
both produce the complete plan.

**Acceptance Scenarios**:

1. **Given** a completed assessment, **When** the user opens their plan, **Then** guidance appears
   for daily routine, meals, movement, seasonal adjustment, and self-care.
2. **Given** any single recommendation, **When** the user inspects it, **Then** it states which
   dosha characteristic it addresses and why.
3. **Given** a tri-doshic or evenly balanced profile, **When** the plan is generated, **Then**
   balanced general guidance is shown rather than contradictory dosha-specific advice.
4. **Given** a generated plan, **When** the user exports or prints it, **Then** the output contains
   the full plan, the profile it was based on, the generation date, and the educational-not-medical
   disclaimer.
5. **Given** any generated plan, **When** it is displayed, **Then** it contains no dosing
   instructions for herbs, supplements, or medicines, and no claim to treat or cure a condition.
6. **Given** a plan, **When** the user changes the current season setting, **Then** the seasonal
   section updates to match.

---

### User Story 3 - Learn the fundamentals from zero (Priority: P3)

The user wants to actually understand the system rather than just receive a verdict. They work
through a guided course of short lessons: the five elements, the three doshas and their qualities,
the twenty paired qualities (gunas), the six tastes, digestive fire and toxins, the seven tissues,
the channels, the daily routine, and the seasonal routine. Every Sanskrit term appears with its
plain-English meaning, a pronunciation hint, and an everyday example. Each lesson ends with a short
knowledge check, and the course tracks which lessons they have completed.

**Why this priority**: This is what turns a quiz result into understanding, and it is the stated
educational purpose. It depends on nothing else and can ship independently of the assessment.

**Independent Test**: Open the course with no assessment data present; complete a lesson and its
knowledge check; verify completion is recorded and persists across reload.

**Acceptance Scenarios**:

1. **Given** the course index, **When** the user views it, **Then** lessons appear in a recommended
   order with completion state and an estimated reading time for each.
2. **Given** any lesson, **When** a Sanskrit or technical term first appears, **Then** it is shown
   with a plain-English meaning, a pronunciation hint, and a concrete example.
3. **Given** any term in a lesson, **When** the user selects it, **Then** its glossary entry opens
   without losing their place in the lesson.
4. **Given** the end of a lesson, **When** the user completes its knowledge check, **Then** the
   lesson is marked complete and the next lesson is offered.
5. **Given** a lesson containing a substantive claim, **When** the user views the lesson, **Then**
   a source attribution for that claim is visible or reachable from the lesson.
6. **Given** a user who has completed no lessons, **When** they open a later lesson directly,
   **Then** any prerequisite concepts are named with links, and access is not blocked.

---

### User Story 4 - Cement knowledge with quizzes and targeted review (Priority: P4)

The user tests themselves with per-lesson quizzes and a cumulative review quiz. Questions come in
several forms — multiple choice, matching, and applied scenarios ("a friend describes X; which
quality is dominant?"). Every answer, right or wrong, is followed by an explanation of why. Items
they get wrong come back for review later. A progress view shows mastery per topic so they can see
what they have actually absorbed.

**Why this priority**: Quizzing is the mechanism the user asked for to make learning stick, but it
requires lesson content (US3) to quiz against.

**Independent Test**: Take a quiz containing all three question types, answer some incorrectly,
verify explanations appear for both correct and incorrect answers, and confirm missed items
reappear in a later review session and that per-topic mastery reflects performance.

**Acceptance Scenarios**:

1. **Given** any quiz question, **When** the user answers, **Then** feedback states whether it was
   correct and explains why the correct answer is correct.
2. **Given** an incorrect answer, **When** feedback appears, **Then** it also explains why the
   chosen answer is wrong, not merely that it is.
3. **Given** items answered incorrectly in past sessions, **When** the user starts a review
   session, **Then** those items are prioritized over items already answered correctly.
4. **Given** repeated correct answers on a topic across separate sessions, **When** the user views
   progress, **Then** that topic's mastery indicator increases.
5. **Given** a cumulative review quiz, **When** it is generated, **Then** it draws questions across
   all lessons the user has completed.
6. **Given** an in-progress quiz, **When** the user leaves and returns, **Then** they can resume or
   restart, and completed answers are not silently lost.

---

### User Story 5 - Look things up without hunting (Priority: P5)

The user encounters an unfamiliar term — in a lesson, in their plan, or in the wild — and wants a
direct answer. They open a searchable reference covering the glossary of Sanskrit terms with
pronunciation, the three dosha profiles, the twenty gunas, the six tastes, commonly discussed herbs
(described educationally, never with dosing), the seven tissues, the channels, and seasonal guides.
Entries cross-link to the lessons that teach them.

**Why this priority**: A retrieval aid that raises the value of every other surface, but nothing
depends on it.

**Independent Test**: Search for a term by English meaning and by Sanskrit name, confirm the entry
is found by both, and confirm its cross-links reach the relevant lesson.

**Acceptance Scenarios**:

1. **Given** the reference, **When** the user searches by Sanskrit name, English meaning, or a
   common alternate spelling, **Then** matching entries are returned.
2. **Given** a reference entry, **When** the user views it, **Then** it shows a plain-English
   explanation, a pronunciation hint where the term is Sanskrit, and a source attribution.
3. **Given** a herb entry, **When** the user views it, **Then** it provides educational description
   and traditional context only, with no dosage, preparation-for-treatment, or therapeutic claim,
   and an explicit note to consult a practitioner.
4. **Given** a reference entry that a lesson teaches, **When** the user views it, **Then** a link to
   that lesson is offered.
5. **Given** a search with no matches, **When** results render, **Then** the user is offered close
   matches or browsable categories rather than an empty screen.

---

### User Story 6 - See how I'm doing right now versus my baseline (Priority: P6)

The user, having established their prakriti, takes a separate, shorter assessment about how they
have been feeling lately — sleep, digestion, energy, mood, skin, appetite. The app shows their
current state (vikriti) against their constitution and explains, in plain language, which dosha
appears elevated relative to their baseline and what that commonly indicates. Guidance shifts to
address the elevation.

**Why this priority**: This is where Ayurveda becomes actionable over time rather than a one-off
label, but it is meaningless without a baseline (US1) and adds real interpretive risk, so it comes
after the core is solid.

**Independent Test**: With a stored prakriti, complete the vikriti assessment and verify a
comparison view identifies elevation relative to baseline and adjusts guidance accordingly.

**Acceptance Scenarios**:

1. **Given** a stored prakriti, **When** the user completes a vikriti assessment, **Then** both are
   displayed side by side with the difference made explicit.
2. **Given** a vikriti result showing elevation in one dosha, **When** guidance is shown, **Then**
   it addresses reducing that elevation and states it is a temporary, changeable state.
3. **Given** no stored prakriti, **When** the user opens the vikriti assessment, **Then** they are
   told a baseline is needed first and offered the prakriti assessment.
4. **Given** repeated vikriti assessments over time, **When** the user views history, **Then**
   prior results are listed with dates.
5. **Given** vikriti responses reporting severe or persistent symptoms, **When** results are shown,
   **Then** a prompt to seek professional care is displayed prominently.

---

### User Story 7 - Keep control of my own data (Priority: P7)

The user wants assurance that their health-adjacent answers are theirs alone. They can see what is
stored, export everything as a single portable file, and delete all of it in one clearly labeled
action with a confirmation step.

**Why this priority**: A trust and compliance requirement rather than a discovery feature; small in
scope but non-negotiable before any real user is invited in.

**Independent Test**: Generate data across assessment and quizzes, export it, verify the export
contains all stored records, delete everything, and verify the app returns to first-run state.

**Acceptance Scenarios**:

1. **Given** stored data, **When** the user opens data settings, **Then** they see what categories
   of data are stored and a statement that nothing leaves their device.
2. **Given** stored data, **When** the user exports, **Then** a single portable file is produced
   containing assessment results, quiz history, and lesson progress.
3. **Given** stored data, **When** the user chooses delete-all and confirms, **Then** all stored
   data is removed and the app behaves as a first-time visit.
4. **Given** a delete-all prompt, **When** the user cancels, **Then** no data is removed.

---

### Edge Cases

- **Storage unavailable or full**: browser storage disabled (private mode, quota exceeded, or
  blocked). The app must still function for the current session and warn plainly that progress
  cannot be saved, rather than failing silently or crashing.
- **Corrupt or foreign stored data**: stored data fails to parse or comes from an incompatible
  version. The app must not crash; it offers to reset that record while preserving what remains
  readable.
- **Content updated after a user's result was stored**: a stored result references a question or
  recommendation that no longer exists. The result remains viewable, and the user is told it was
  produced under an earlier content version.
- **Abandoned assessment**: user leaves mid-assessment for days. Partial answers are retained and
  the user is offered resume-or-restart rather than being forced into stale answers.
- **Every answer identical / obviously random**: a response pattern with no discriminating power.
  Results must flag very low confidence rather than presenting a spurious precise blend.
- **Exact tie between two or three doshas**: results must present the tie honestly, never break it
  arbitrarily to produce a single winner.
- **Contradictory answers**: user reports mutually exclusive traits (e.g., both consistently oily
  and consistently dry skin). Confidence is reduced and inconsistency is surfaced.
- **Offline first visit**: user reaches the app with no network before assets are cached. They see
  a clear message rather than a blank page.
- **Print with no plan generated**: printing before an assessment exists yields an explanatory
  page, not an empty document.
- **Screen reader mid-quiz**: answer selection, correctness feedback, and progression must be
  announced, not conveyed by color or position alone.
- **Very long or very short sessions**: a user answering in under a minute or over several days
  both produce valid, storable results.

## Requirements *(mandatory)*

### Functional Requirements

**Onboarding & framing**

- **FR-001**: System MUST present, before any assessment question, an introduction covering what
  Ayurveda is, that the app is educational and not medical advice, and the prakriti/vikriti
  distinction.
- **FR-002**: System MUST display a non-dismissible educational-not-medical notice on every
  assessment screen, every results view, and every generated plan.
- **FR-003**: System MUST allow a returning user to skip the introduction while keeping it
  reachable at any time.

**Learning content**

- **FR-004**: System MUST provide a guided course covering, at minimum: the five elements, the
  three doshas and their qualities, the twenty paired qualities, the six tastes, digestive fire and
  toxins, the seven tissues, the channels, daily routine, and seasonal routine.
- **FR-005**: System MUST introduce every Sanskrit or technical term, on first use within a lesson
  or reference entry, with a plain-English meaning, a pronunciation hint, and a concrete example.
- **FR-006**: System MUST make every technical term resolvable to a glossary entry, and MUST fail
  content validation if a term used in content has no glossary entry.
- **FR-007**: System MUST attach a source attribution — a classical text with locatable citation or
  a named modern authority — to every substantive claim in lessons and reference entries.
- **FR-008**: System MUST indicate where classical sources disagree or where a claim is a modern
  popularization rather than a classical teaching.
- **FR-009**: System MUST record and persist lesson completion state per user.
- **FR-010**: System MUST allow users to access any lesson directly, naming prerequisite concepts
  without blocking access.

**Quizzing**

- **FR-011**: System MUST provide a knowledge check at the end of each lesson and a cumulative
  review quiz spanning completed lessons.
- **FR-012**: System MUST support multiple-choice, matching, and applied-scenario question types.
- **FR-013**: System MUST explain, for every answered question, why the correct answer is correct;
  and for incorrect answers, why the chosen answer is wrong.
- **FR-014**: System MUST record per-question outcomes and prioritize previously missed items in
  subsequent review sessions.
- **FR-015**: System MUST display per-topic mastery derived from quiz performance over time.
- **FR-016**: System MUST allow an interrupted quiz to be resumed or restarted without silent loss
  of recorded answers.

**Assessment & results**

- **FR-017**: System MUST provide a prakriti self-assessment covering physical traits,
  physiological patterns, and mental/emotional tendencies.
- **FR-018**: System MUST provide an optional, separate vikriti assessment about the user's recent
  state, available only once a prakriti baseline exists.
- **FR-019**: System MUST express results as percentages across all three doshas summing to 100%,
  and MUST NOT present a single rigid type label as the primary result.
- **FR-020**: System MUST display a confidence indicator with every result, reduced when answers
  are sparse, inconsistent, or insufficiently differentiated.
- **FR-021**: System MUST make the scoring inspectable: each question, the answer given, and the
  points contributed to each dosha.
- **FR-022**: System MUST present ties and near-ties as dual-dosha or tri-doshic outcomes rather
  than resolving them arbitrarily.
- **FR-023**: System MUST screen for red-flag conditions (pregnancy, acute or severe symptoms,
  diagnosed conditions, current medication) and MUST surface a prominent prompt to seek
  professional care when any is indicated.
- **FR-024**: System MUST state that self-assessment is a starting point and not a substitute for
  evaluation by a trained practitioner.
- **FR-025**: System MUST preserve partially completed assessments and offer resume-or-restart.
- **FR-026**: System MUST retain prior assessment results with their dates, allowing the user to
  view history.

**Personalized guidance**

- **FR-027**: System MUST generate guidance from the user's dosha profile covering daily routine
  and sleep timing, meal timing and food qualities, movement and exercise style, seasonal
  adjustments, and self-care practices.
- **FR-028**: System MUST state, for each recommendation, which profile characteristic it follows
  from.
- **FR-029**: System MUST NOT emit dosing instructions for herbs, supplements, or medicines, MUST
  NOT advise altering or discontinuing prescribed treatment, and MUST NOT claim to treat or cure
  any named condition.
- **FR-030**: System MUST accompany every generated guidance set with direction to consult a
  qualified practitioner and, where relevant, a licensed physician.
- **FR-031**: System MUST produce balanced general guidance rather than contradictory advice when a
  profile is evenly balanced or tri-doshic.
- **FR-032**: System MUST allow the plan to be exported and printed, including the underlying
  profile, generation date, and disclaimer.
- **FR-033**: System MUST let the user set or change the current season, and MUST reflect that in
  seasonal guidance.

**Reference**

- **FR-034**: System MUST provide a searchable, browsable reference covering the glossary, dosha
  profiles, the twenty gunas, the six tastes, commonly discussed herbs, the seven tissues, the
  channels, and seasonal guides.
- **FR-035**: System MUST match searches on Sanskrit name, English meaning, and common alternate
  spellings/transliterations.
- **FR-036**: System MUST restrict herb entries to educational description and traditional context,
  with no dosing, no preparation-for-treatment instruction, and no therapeutic claim.
- **FR-037**: System MUST cross-link reference entries to the lessons that teach them.
- **FR-038**: System MUST offer close matches or browsable categories when a search returns nothing.

**Data, privacy & resilience**

- **FR-039**: System MUST store all user responses, results, and progress on the user's device
  only, and MUST NOT transmit user data anywhere.
- **FR-040**: System MUST NOT include analytics, telemetry, advertising, or third-party tracking.
- **FR-041**: Users MUST be able to export all stored data as a single portable file.
- **FR-042**: Users MUST be able to delete all stored data in one clearly labeled action with a
  confirmation step.
- **FR-043**: System MUST show the user what categories of data are stored and state that nothing
  leaves their device.
- **FR-044**: System MUST remain usable for the current session when device storage is unavailable,
  and MUST warn that progress cannot be saved.
- **FR-045**: System MUST recover from corrupt or version-incompatible stored data without crashing,
  offering to reset only the affected record.
- **FR-046**: System MUST keep previously generated results viewable after content updates,
  indicating when a result was produced under an earlier content version.

**Access & delivery**

- **FR-047**: System MUST meet WCAG 2.1 Level AA.
- **FR-048**: System MUST allow every flow — lessons, quizzes, assessment, plan, reference — to be
  completed using a keyboard alone.
- **FR-049**: System MUST announce quiz and assessment state changes to assistive technology and
  MUST NOT convey correctness or state by color or position alone.
- **FR-050**: System MUST function without a network connection after first load.
- **FR-051**: System MUST be usable on a phone-sized screen, with the assessment comfortably
  completable there.

### Key Entities

- **Lesson**: A short unit of the fundamentals course. Title, topic, ordered position, estimated
  reading time, body content, terms introduced, source attributions, associated knowledge check.
- **Glossary Term**: A Sanskrit or technical term. Canonical name, alternate spellings,
  pronunciation hint, plain-English meaning, everyday example, related terms, lessons that teach it,
  source attribution.
- **Quiz Question**: An assessable item. Type (multiple choice / matching / scenario), prompt,
  options, correct answer(s), explanation for correctness, explanation per incorrect option, topic
  tag, difficulty, source lesson.
- **Quiz Attempt**: A user's answer record. Question reference, answer given, correctness,
  timestamp, session reference — the basis for spaced review and mastery.
- **Assessment Question**: An item in the prakriti or vikriti assessment. Category (physical /
  physiological / mental-emotional), prompt, answer options, and the dosha weighting each option
  carries. Optional vs required.
- **Assessment Response**: A user's answer set for one assessment run. Assessment type, answers,
  completion state, timestamp, content version.
- **Dosha Profile**: A computed result. Vata/Pitta/Kapha percentages, confidence level, dominant
  pattern description, tie/ambiguity flags, the response set it derives from, generation date.
- **Recommendation Rule**: A guidance unit. Applicable dosha condition, life area (routine / meals /
  movement / seasonal / self-care), guidance text, the profile characteristic it addresses, seasonal
  applicability, source attribution.
- **Lifestyle Plan**: The generated guidance set for a given profile — the selected recommendations,
  the profile it derives from, season setting, generation date.
- **Reference Entry**: A browsable knowledge item (dosha, guna, taste, herb, tissue, channel,
  season). Category, name, plain-English explanation, pronunciation, related terms, linked lessons,
  source attribution.
- **Topic Mastery**: Derived per-topic progress. Topic, attempts, correctness rate, mastery level,
  items due for review.
- **User Progress**: The aggregate local record — lessons completed, quiz history, assessment
  history, current season, preferences, storage schema version.
- **Source Attribution**: A citation. Text or authority name, locatable reference, and whether the
  claim is classical, contested between sources, or a modern interpretation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor with no prior knowledge can go from opening the app to seeing a
  dosha result they can explain in their own words within 15 minutes.
- **SC-002**: 90% of users who begin the prakriti assessment complete it in one sitting.
- **SC-003**: Every result screen presents all three dosha percentages and a confidence indicator;
  zero result screens present a single type label as the sole outcome.
- **SC-004**: 100% of assessment results can be traced by the user to the individual answers that
  produced them, without leaving the app.
- **SC-005**: 100% of substantive content claims in lessons and reference entries carry a source
  attribution; content failing this does not ship.
- **SC-006**: 100% of technical terms used in content resolve to a glossary entry.
- **SC-007**: Zero generated recommendations contain dosing instructions, treatment claims, or
  advice to alter prescribed care, verified by automated check over the full rule set.
- **SC-008**: Every assessment screen, result view, and generated plan displays the
  educational-not-medical notice — verified across 100% of those surfaces.
- **SC-009**: Every red-flag response path surfaces professional-care guidance before results are
  shown, verified for 100% of red-flag inputs.
- **SC-010**: Zero network requests carrying user data occur during any user flow, verified by
  traffic inspection across the full journey.
- **SC-011**: The complete journey — lessons, quizzes, assessment, plan, reference — is completable
  by keyboard alone and passes WCAG 2.1 AA automated and manual checks with zero Level A or AA
  violations.
- **SC-012**: After first load, all features function with the network disconnected.
- **SC-013**: Users who complete a lesson and its knowledge check score at least 70% on that
  lesson's topic in a later cumulative review.
- **SC-014**: Missed quiz items reappear in review sessions at a higher rate than mastered items —
  measurably prioritized in 100% of review sessions containing missed items.
- **SC-015**: A user can locate any glossary term through search in under 15 seconds.
- **SC-016**: Data export contains 100% of stored records; delete-all returns the app to verified
  first-run state with zero residual records.
- **SC-017**: The assessment is completable on a 375px-wide screen with no horizontal scrolling and
  no obscured controls.

## Assumptions

- **Single local user per browser**: no accounts or multi-profile support; each browser profile is
  one user. Sharing a device means sharing data.
- **Content corpus scale for v1**: approximately 10–14 lessons, roughly 8–15 questions per lesson
  quiz, 40–60 prakriti assessment questions across the three categories, a shorter vikriti
  assessment of roughly 15–25 questions, and a reference corpus covering the glossary plus the
  enumerated categories. Exact counts are a content-authoring decision, not a requirement.
- **Content accuracy and expert review**: content ships with source attributions, but this feature
  does not include engaging a credentialed Ayurvedic practitioner to certify it. Expert review is a
  separate gate before any public launch; until it happens, the app states that content is
  educational and not expert-certified.
- **Attribution standard**: citations reference classical texts (Charaka Samhita, Sushruta Samhita,
  Ashtanga Hridayam) at chapter level or a named modern authority. Where a commonly repeated claim
  cannot be traced to a source, it is marked as a modern interpretation rather than asserted as
  classical.
- **Scoring approach**: weighted per-answer scoring across the three doshas, normalized to
  percentages, with confidence derived from response completeness, spread between doshas, and
  internal consistency. The specific weights are a content decision and are inspectable by design.
- **Spaced review model**: a simple interval-based scheme driven by per-item correctness history —
  no adaptive learning model or external algorithm.
- **Season determination**: the user sets their season; the system may suggest a default from the
  device clock but never asks for location.
- **English only for v1**: content is authored in English, with Sanskrit terms in common Roman
  transliteration. Additional languages are out of scope.
- **No practitioner directory, no community features, no reminders/notifications, no wearable or
  health-app integration** in this feature.
- **Modern evergreen browsers** on desktop and mobile; no legacy browser support.
- **Vikriti tracking over time** is limited to storing dated results and listing them; trend
  visualization beyond a simple history list is out of scope for v1.
