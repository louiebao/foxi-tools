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
html { font-size: clamp(17px, 1.3vw, 26px); }
font-family: 'Courier New', monospace;
```

**Fluid typography is the standard.** Set `html { font-size: clamp(17px, 1.3vw, 26px) }` and use `rem` throughout — this makes tools feel proportional on large displays without breaking small ones. All size values in the scale below are in `rem` relative to this base.

### Scale

| Role            | rem      | ~px at min | Weight | Letter-spacing | Transform  | Usage                              |
|-----------------|----------|------------|--------|----------------|------------|------------------------------------|
| Tool name       | 1rem     | 17px       | normal | 0.18em         | uppercase  | Header h1 in each tool             |
| Home tool name  | 0.93rem  | 16px       | normal | 0.08em         | uppercase  | Tool links on the homepage         |
| Body / content  | 0.93rem  | 16px       | normal | —              | —          | Textarea content, descriptions     |
| Tagline / meta  | 0.73rem  | 12px       | normal | 0.06em         | —          | Tool taglines, footer text, links  |
| Pane label      | 0.67rem  | 11px       | normal | 0.14em         | uppercase  | Section headers within tool panes  |
| Secondary UI    | 0.67rem  | 11px       | normal | 0.04–0.10em    | —          | Button labels                      |

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

The `body` is always `display: flex; flex-direction: column; height: 100dvh; overflow: hidden` so tools fill the viewport without scroll on the page level. Use `100dvh` (not `100vh`) to account for mobile browser chrome. Tools manage their own internal scrolling.

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

## Dark Mode

Dark mode is opt-in per tool. The palette is a straight token inversion — no new colors.

```css
.dark {
  --bg:           #1a1a18;
  --bg-panel:     #232321;
  --bg-output:    #1e1e1c;
  --text:         #e8e8e5;
  --text-2:       #aaa;
  --text-3:       #777;
  --border:       #333;
  --border-ui:    #444;
  --border-hover: #666;
}
```

Toggle by adding/removing `class="dark"` on `<body>`. `--accent` (`#4a7ab4`) stays the same in both modes. See `my-portal/index.html` for the JS toggle pattern. The `_template.html` includes this block commented out.

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

1. **Copy `_template.html`** — it has all tokens, the shell, and layout options pre-wired
2. Update `<title>`, `<h1>`, and the tagline `<p>`
3. Pick one layout (two-pane, grid+sidebar, or single column) and delete the other two from the template
4. Add the tool to the list in `index.html`
5. Pull colors only from the `:root` tokens — no ad hoc hex values
6. Buttons: primary for the single main action, secondary for everything else
7. Textareas: `var(--bg)` for editable, `var(--bg-output)` for read-only
8. Test at `100dvh` — tools should not cause page-level scroll
