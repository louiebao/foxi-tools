# foxi-tools Design System

**Aesthetic:** Monospace Utilitarianism. One font, cream paper, borders only. The tool recedes; the task stays.

**Memorable thing:** Quiet and focused. Tools that get out of your way.

---

## Color

All surfaces and text derive from a single warm-gray scale rooted in `#f8f8f5`. No gradients. No shadows.

### Surfaces

| Token         | Value     | Usage                                              |
|---------------|-----------|----------------------------------------------------|
| `--bg`        | `#f8f8f5` | Primary surface — page background, main text areas |
| `--bg-panel`  | `#edeae3` | Secondary surface — headers, sidebars, center cols |
| `--bg-output` | `#f3f1eb` | Read-only / output areas (slightly warmer)         |

### Text

| Token       | Value  | Usage                                        |
|-------------|--------|----------------------------------------------|
| `--text`    | `#222` | Primary text — headings, labels, body        |
| `--text-2`  | `#666` | Secondary content — descriptions, help text  |
| `--text-3`  | `#777` | Muted — back-links, timestamps, pane labels  |

Do not introduce intermediate grays outside this scale. Hover states darken by stepping toward `--text` (e.g., `#999` → `#333` on hover).

### Borders

| Token          | Value     | Usage                                         |
|----------------|-----------|-----------------------------------------------|
| `--border`     | `#d0d0cc` | Structural — dividers between sections, panes |
| `--border-ui`  | `#ccc`    | Interactive — button outlines, input borders  |
| `--border-hover` | `#888`  | Hover state for interactive borders           |

### Accent

One accent token. Used for focus rings and active indicators only — nowhere else.

| Token       | Value     | Usage                                              |
|-------------|-----------|----------------------------------------------------|
| `--accent`  | `#4a7ab4` | Focus outlines, active nav underlines, selected state borders |

The accent is restrained: muted slate-blue, not vivid. It gives interactive states a landing point without breaking the monochromatic feel. Never use it as a fill or background.

### Reserved: tool-specific data colors

Tools like Da Vinci Code use colors for data visualization (character tracks, location types). These are tool-local — not part of the shared system. Do not lift them into global tokens.

---

## Typography

One font family throughout. Monospace is the identity, not a code-only choice.

```css
font-family: 'Courier New', monospace;
```

### Scale

| Role            | Size  | Weight | Letter-spacing | Transform  | Usage                              |
|-----------------|-------|--------|----------------|------------|------------------------------------|
| Tool name       | 16px  | bold   | 0.1em          | uppercase  | Header title in each tool          |
| Home tool name  | 0.93rem | normal | 0.08em        | uppercase  | Tool links on the homepage         |
| Pane label      | 12px  | normal | 0.14em         | uppercase  | Section headers within tool panes  |
| Body / content  | 16px  | normal | —              | —          | Textarea content, descriptions     |
| Secondary UI    | 14px  | normal | 0.04–0.06em    | —          | Button labels, footnotes, links    |
| Tagline / meta  | 12px  | normal | 0.06em         | —          | Tool taglines, footer text         |

`line-height: 1.75` for all multi-line content (textareas, descriptions).

### Rules

- Never use a second font. The monospace constraint is load-bearing.
- Avoid `font-weight: bold` except for tool names in headers.
- Letter-spacing is the primary tool for hierarchy — use it instead of size jumps.
- `text-transform: uppercase` on labels and tool names only, not body text.

---

## Spacing

Two density bands. No formal base unit — maintain the feel by staying within these ranges.

| Band       | Vertical   | Horizontal | Context                                      |
|------------|------------|------------|----------------------------------------------|
| Component  | 7–11px     | 14–18px    | Pane headers, button padding, cell insets    |
| Page       | 20–40px    | 20–40px    | Outer page padding, section gaps             |

Common values observed across the codebase:

- **Pane header:** `padding: 7px 14px`
- **Textarea:** `padding: 16px 18px`
- **Page header:** `padding: 11px 20px` (tool) or `28px 40px 22px` (home)
- **Page main:** `padding: 36px 40px` (home)

When in doubt, use the smaller value. The aesthetic leans compact, not airy.

---

## Layout

Each tool gets its own layout inside a shared shell. The shell is always:

```
<header>   ← tool name + tagline + home link
<main>     ← tool-specific
<footer>   ← home link only (no email, no attribution)
```

The `body` is always `display: flex; flex-direction: column; height: 100vh; overflow: hidden` so tools fill the viewport without scroll on the page level. Tools manage their own internal scrolling.

### Common main layouts

- **Editor (two-pane):** `grid-template-columns: 1fr 100px 1fr` — input | action column | output
- **Grid + sidebar:** `grid-template-columns: 1fr 20%` — main content | controls
- **Single column:** `flex: 1; overflow: auto` — scrollable content area

### Panes

Panes have a header bar (`background: --bg-panel`, bottom border) and a content area (`background: --bg` or `--bg-output`). The right border of each pane divides it from the next; the rightmost pane has no right border.

---

## Buttons

Two variants only.

```css
/* Primary — for the main action */
.btn-primary {
  background: #222;
  color: #f8f8f5;
  border: none;
  padding: 9px 14px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.btn-primary:hover { background: #444; }

/* Secondary — for supporting actions (copy, clear, save) */
.btn-secondary {
  background: transparent;
  color: #666;
  border: 1px solid #ccc;
  padding: 4px 10px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
}
.btn-secondary:hover:not(:disabled) { border-color: #888; color: #222; }
.btn-secondary:disabled { opacity: 0.35; cursor: default; }
```

No `border-radius`. No gradient. No shadow. Disabled state is `opacity: 0.35`, never `display: none`.

---

## Links

```css
a {
  color: #999;
  text-decoration: none;
  letter-spacing: 0.04–0.06em;
}
a:hover { color: #222; }
```

Navigation links (back-links, home links) always use `#999` at rest. Never underline navigation links.

---

## Motion

None. The system has no animation at the component or page level.

Exception: tool-specific animations that communicate state (e.g., the Life in Months pulsing hint) are allowed when they serve a functional purpose. They are not part of the shared system and should not be copied into other tools.

---

## Don'ts

- No `border-radius` — anywhere, ever
- No `box-shadow` — borders divide, not shadows
- No gradients — flat surfaces only
- No icons — text labels do the work
- No second font family
- No intermediate grays outside the named scale (`--text`, `--text-2`, `--text-3`)
- No color in footers beyond `#999` link text (no email, no personal attribution)
- No decorative elements — if it doesn't divide or label, remove it

---

## Adding a new tool

1. Use the shared header/footer shell from `index.html` (tool title 13px bold uppercase, tagline 10px muted, home link)
2. Choose one of the common main layouts above, or compose a new one
3. Pull colors only from this palette — no ad hoc hex values
4. Buttons: primary for the single main action, secondary for everything else
5. Textareas: `background: --bg` for editable, `--bg-output` for read-only
6. Test at `100vh` — tools should not cause page-level scroll
