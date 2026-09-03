# Design Brief

## Direction

Cinnabar Ink — a dark, editorial learning app for the 500-word Chinese deck, styled like calligraphy brushed on warm ink paper at night, with the UI in Thai.

## Tone

Refined, high-contrast "ink night" aesthetic — calm and premium, letting the Chinese characters and Thai text command focus without decorative noise.

## Differentiation

A culturally resonant cinnabar-red (traditional Chinese seal) primary on warm ink charcoal, pairing large display Chinese glyphs with crisp Thai body text — instantly recognizable and anti-generic.

## Color Palette

| Token      | OKLCH (dark)   | Role                     |
| ---------- | -------------- | ------------------------ |
| background | 0.145 0.02 25  | warm ink charcoal        |
| foreground | 0.93 0.01 60   | primary text             |
| card       | 0.19 0.02 25   | elevated surface         |
| primary    | 0.62 0.19 27   | cinnabar red (CTA/seal)  |
| accent     | 0.72 0.14 70   | warm gold (highlights)   |
| muted      | 0.23 0.02 25   | secondary surface        |
| success    | 0.6 0.16 150   | correct answers          |
| destructive| 0.55 0.22 25   | wrong answers / errors   |

Light mode mirrors as "paper": background 0.97 0.012 75, primary 0.5 0.19 27 (deep cinnabar), accent 0.62 0.12 70.

## Typography

- Display: Space Grotesk — large Chinese characters, headings, hero numerals (card N / 500)
- Body: DM Sans — Thai text, pinyin, UI labels, paragraphs (clean Latin + Thai rendering)
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Layered surfaces via `shadow-subtle` on cards and `shadow-elevated` on the active flashcard; depth comes from tonal card steps (background → card → popover), not heavy borders.

## Structural Zones

| Zone    | Background    | Border   | Notes                              |
| ------- | ------------- | -------- | ---------------------------------- |
| Header  | card          | border-b | app title + 3-mode nav tabs        |
| Content | background    | —        | alternating muted sections         |
| Footer  | muted/40      | border-t | credits / mode hints               |

## Spacing & Rhythm

Generous section gaps (`space-y-12 md:space-y-16`), consistent card padding (`p-6`), micro-gaps `gap-3` within cards; tight grid (`gap-3 sm:gap-4`) for the 500-word list.

## Component Patterns

- Buttons: rounded-lg, primary cinnabar with dark ink text, hover `brightness-110` + `shadow-subtle`, focus ring
- Cards: rounded-xl, `bg-card`, `shadow-subtle`, hover lift `-translate-y-0.5` + `shadow-elevated`
- Badges: rounded-full, pill, muted surface with colored text for mode/success/warning states

## Motion

- Entrance: `animate-fade-up` on mode views (0.4s)
- Hover: interactive elements lift + shadow change over 0.3s `transition-smooth`
- Flip: `animate-flip-in` rotateY reveal on flashcard toggle
- Decorative: none — restraint keeps focus on learning

## Constraints

- Token-only styling: no raw hex/rgb in components, no arbitrary Tailwind color classes
- AA+ contrast in both light and dark; tuned via lightness, not opacity
- UI language is Thai; Chinese glyphs render from bundled Hanzi data (no API key)
- 3–5 core colors max; cinnabar + gold + ink + success/warning

## Signature Detail

The cinnabar-red seal accent — a single vermilion stamp motif used for the primary CTA, active nav state, and correct-answer feedback — ties the whole app to Chinese calligraphy culture.
