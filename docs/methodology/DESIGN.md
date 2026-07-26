---
name: FinPulse Methodology Review Artifacts
description: Calm evidence atlases for understanding coverage before inspecting the underlying registry.
colors:
  canvas: "#f3f6f4"
  surface: "#fbfcfb"
  surface-muted: "#e8eeeb"
  surface-deep: "#dce4e0"
  graphite: "#202925"
  graphite-muted: "#55635d"
  line: "#cbd4cf"
  line-strong: "#8e9b95"
  action: "#294f65"
  action-hover: "#1f4053"
  focus: "#0b659d"
  covered-ink: "#285d4d"
  covered-field: "#e7f0eb"
  partial-ink: "#8a520f"
  partial-field: "#f6ecd9"
  gap-ink: "#9f3d2d"
  gap-field: "#f7ece8"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 3.8vw, 3.9rem)"
    fontWeight: 720
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2vw, 1.9rem)"
    fontWeight: 680
    lineHeight: 1.2
    letterSpacing: "-0.018em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.52
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "0"
rounded:
  xs: "3px"
  sm: "5px"
  md: "7px"
  lg: "10px"
spacing:
  xs: "0.35rem"
  sm: "0.7rem"
  md: "1rem"
  lg: "1.75rem"
  xl: "3.6rem"
components:
  filter-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0 0.75rem"
  detail-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.action}"
    rounded: "{rounded.sm}"
    height: "2.75rem"
    padding: "0.4rem 0.55rem"
  row-covered:
    backgroundColor: "{colors.covered-field}"
    textColor: "{colors.graphite}"
  row-partial:
    backgroundColor: "{colors.partial-field}"
    textColor: "{colors.graphite}"
  row-gap:
    backgroundColor: "{colors.gap-field}"
    textColor: "{colors.graphite}"
---

# Design System: FinPulse Methodology Review Artifacts

## Overview

**Creative North Star: "The Condition Atlas"**

This system governs standalone evidence-review artifacts under
`docs/methodology/`. It does not replace `docs/DESIGN_SYSTEM.md` for the learner
SPA or define the internal admin interface.

Standalone methodology reviews behave like conservation condition reports
crossed with scientific atlases: the whole state is legible first, while every
conclusion remains traceable to a precise record. The system is role-neutral
and must be equally useful to a human reviewer and to an agent determining the
next piece of work.

The world is quiet, cool, and exact without becoming corporate. It rejects the
category-default KPI dashboard as well as the opposite editorial-paper report.
Its memorable device is one shared condition map: the same three muted status
fields govern the overview, grouped summaries, registry rows, expanded
evidence, and print.

**Key Characteristics:**

- overview before provenance and row-level detail;
- cool, nearly neutral fields with low-chroma semantic color;
- calm humanist sans-serif typography and tabular figures;
- flat layers, open spacing, and minimal ornament;
- explicit status words and marks wherever color appears.

## Colors

Use a restrained strategy: cool porcelain and graphite carry the page; muted
mineral sage, ochre, and clay-red are reserved for coverage states. The
frontmatter is the normative token source.

**The Condition Continuity Rule.** A status keeps one semantic color from the
top-level distribution through its table row and expanded evidence. General
actions never borrow a status color.

**The Quiet Field Rule.** Status backgrounds must remain pale enough for long
reading sessions while status ink and ordinary body text meet WCAG AA.

## Typography

Use a workhorse humanist/system sans-serif for headings and body copy, with
tabular numerals for counts. A compact monospaced face may appear only for
stable IDs and machine-oriented metadata; it is not a decorative label voice.

Hierarchy comes from scale, weight, and spacing. The first-viewport result is
large enough to understand at a glance, but the title must never push the
coverage picture below the fold. Body measures remain comfortable for Russian
prose and evidence excerpts.

**The One Reading Voice Rule.** Do not introduce a display serif, ornamental
font, or pervasive uppercase tracking to manufacture authority.

## Layout

The surface follows four reading depths: thesis and overall distribution,
group patterns, controls, then the full evidence registry. Desktop composition
uses a broad but bounded canvas; mobile collapses summaries into one column and
turns rows into connected status cards without horizontal scrolling.

Whitespace separates reading depths. Dense metadata is progressively
disclosed, while competency wording and status stay visible. The aggregate
coverage result belongs in the first viewport at common laptop sizes. At
860px the ledger becomes status-colored cards, and at 620px status summaries
and controls collapse to one reading column.

## Elevation & Depth

The system is flat by default. Depth comes from tonal layers, spacing, and
hairline separators rather than glass, heavy shadows, textured backgrounds, or
floating card stacks. Sticky controls may use one restrained separation cue
only when needed to remain legible over content.

**The Evidence Stays Grounded Rule.** Expanded detail remains visually joined
to its parent row instead of floating as an independent card.

## Shapes

Corners are modest and consistent. Long analytical surfaces and table rows
prefer almost-square geometry; controls may use a small radius for tactility.
Status meaning comes from fields, text, and distinct marks rather than pills,
badges, or ornamental sidebars.

## Components

### Coverage field

One horizontal field carries the full denominator. Its three segments use the
same status roles as the registry. Counts, percentages, Russian labels, and
distinct marks sit directly below it; each status fact also filters the ledger
and exposes its active state through `aria-pressed`.

### Group comparison

Four unboxed rows pair the group name and denominator with a compact stacked
field and textual counts. The category-by-level matrix is a secondary native
disclosure rather than a competing summary panel.

### Filters

Search and status remain visible. Group, subject area, category, and level live
inside the “Другие фильтры” disclosure. Inputs use the documented field token;
reset appears only while a filter is active.

### Registry rows

Every row owns an opaque semantic field: covered, partial, or gap. Status is
also written in full and paired with `✓`, `◐`, or `—`. Hover deepens the same
hue; focus uses the independent blue focus color. Expanded evidence inherits a
quieter field of the same status and stays physically joined to its row.

### Evidence controls

The open/close action is neutral blue-gray and at least 44px high. It never
uses a coverage color. Evidence excerpts remain semantic text and blockquotes,
not raster or decorative cards.

## Do's and Don'ts

### Do:

- **Do** show the complete distribution and its denominator before methodology
  detail.
- **Do** repeat status meaning with color, Russian text, and a distinct mark.
- **Do** preserve stable IDs, source order, evidence links, and offline use.
- **Do** make scanning comfortable for both a person and an automated agent.

### Don't:

- **Don't** style the report as a corporate analytics dashboard.
- **Don't** use bright semantic colors, decorative textures, gradients, or
  gratuitous illustration.
- **Don't** make every block a bordered card or expose every control at once.
- **Don't** compress the registry until competency wording becomes difficult to
  read.
