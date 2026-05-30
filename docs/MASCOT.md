# FinPulse Mascot

Last updated: 2026-05-30

## Status

The accepted mascot direction is a small cream-and-sky-blue fennec/fox guide with a compass badge.

Source reference:
- user-provided mascot image in the 2026-05-30 product/design thread;
- user-provided text description stored outside the repo in the Codex attachment for that thread.

No production mascot asset is checked into the repository yet. Before using the mascot in the app, add an approved asset file to the repo and confirm source rights for public product use.

## Product role

The mascot represents a calm financial navigator: friendly, lightweight, supportive, and focused on small next steps.

It may be used as:
- a static supportive illustration;
- a small guide/avatar in empty, welcome, transition, or completion states;
- a visual cue for navigation, route, or progress context.

It must not become:
- a reward, streak, pressure, or retention mechanic;
- a substitute for clear UI labels and accessible state;
- a childish character that shifts the app toward a game;
- the only way to understand instructions, progress, or feedback.

Mascot-led product experience remains deferred for the MVP. The approved scope is the visual identity asset and its usage guidance.

## Visual description

The mascot is a cute small fennec or fox in a clean vector / kawaii style. The body uses warm cream-white fur, while the ears, cheeks, shadows, eyes, tail tip, and compass badge use cold sky-blue accents. The head is oversized relative to the body, with very large ears, large expressive blue eyes, a small dark blue nose, a gentle smile, and a confident but non-aggressive standing pose.

The compass badge on the chest is part of the identity. It connects the character to navigation, financial orientation, learning routes, and the idea of a helpful guide.

## Core palette

Approximate colors from the supplied reference:

| Role | Hex values |
|---|---|
| Background | `#FFFFFF`, `#FDFDFD`, `#FDFCFD` |
| Main fur | `#F7F1EB`, `#F7F0EB`, `#FBF8F6`, `#FCFAF8` |
| Warm fur shadows | `#F2EDE9`, `#EEE6DE`, `#F9F3EE` |
| Light blue accents | `#C0DDFB`, `#C1DDFB`, `#C4DFFA`, `#E4F0FC` |
| Richer blue accents | `#A0CEFB`, `#A1CFFB`, `#A5CDF5`, `#98BFE6` |
| Bright blue / cyan | `#18A6FA`, `#0E99EF`, `#0E90E6`, `#31A4EE` |
| Medium blue | `#0D5397`, `#155592`, `#0561B6`, `#024D95` |
| Dark blue detail | `#011B3B`, `#011D3D`, `#031D3E`, `#07203B` |
| Blue-gray shadows | `#DBE4EE`, `#D2E3F5`, `#C6D2E0`, `#A0BCDB` |

The mascot palette should stay close to the current FinPulse design tokens. Use existing `brand.*` and `sky.*` values for UI integration where possible, instead of introducing a separate full token family for the mascot.

## Anatomy

| Part | Specification |
|---|---|
| Head | Large rounded head with soft cheek shapes. Main fur is warm cream, with a cold blue shadow along the lower edge. |
| Tuft | Three small rounded fur strands on top of the head, matching the main fur. |
| Ears | Very large upward and outward ears with cream outer shapes and large sky-blue inner areas. |
| Inner ear details | White feather-like soft shapes with pale blue smoothing and shadows. |
| Eyes | Large oval eyes with dark blue upper areas, blue gradient irises, and round white highlights. |
| Brows | Short curved medium-blue brows that keep the expression friendly and attentive. |
| Nose and mouth | Small dark blue rounded nose with a tiny highlight; thin dark blue smile line. |
| Cheeks | Small pale-blue side marks that look soft and semi-transparent. |
| Body | Small rounded chibi body. The head is much larger than the torso. |
| Belly | Light oval belly in near-white cream. |
| Arms | One arm bent at the side for a confident friendly pose; the other rests along the body. |
| Legs and feet | Short stable legs and small rounded feet with very soft toe lines. |
| Tail | Large fluffy tail on the right, with a cream base and sky-blue upper/tip area. The blue shape has soft wavy cut-ins. |
| Badge | Round chest medallion with bright blue ring and diagonal compass/navigation arrow. |
| Ground shadow | Very soft horizontal pale-blue oval under the feet. |

## Style rules

Use:
- clean vector-like rendering;
- soft gradients and low-contrast shadows;
- dark blue details instead of hard black outlines;
- front-facing, friendly, non-judgmental expression;
- high readability at small mobile sizes.

Avoid:
- photorealism;
- casino, trading, luxury, or aggressive finance aesthetics;
- heavy black outlines;
- red/black danger styling;
- busy backgrounds;
- exaggerated childish props;
- money symbols as the primary character cue.

## Usage guidance

Recommended placements:
- entry/welcome state;
- empty state where a next learning step is available;
- module transition;
- lesson completion;
- small illustration near "route", "map", or "next step" concepts.

Constraints:
- do not show the mascot on every screen by default;
- do not make it compete with lesson content;
- keep the mascot decorative when surrounding text already explains the state;
- provide meaningful alt text only when the mascot conveys product meaning.

Suggested alt text when non-decorative:

```txt
Friendly cream-and-blue FinPulse fennec mascot with a compass badge.
```

## Asset requirements before implementation

Before the mascot is used in the app:

1. Add the approved source or optimized export under `public/assets/mascot/` or another documented asset location.
2. Prefer transparent-background PNG or WebP exports for app use; keep the original reference file separately if licensing allows it.
3. Include at least one mobile-safe size and verify it remains readable around `80-160px`.
4. Confirm whether the white background is intentional or whether a transparent export is required.
5. Confirm source rights for public product use.

Open product questions:
- mascot name;
- final production asset variants;
- whether the compass badge should become a broader visual identity motif;
- exact UI surfaces where the mascot should first appear.
