/**
 * Lightweight CSS syntax highlighter for @keyframes blocks.
 *
 * Returns an HTML string with inline-colored <span> elements suitable for
 * use in a `dangerouslySetInnerHTML` overlay behind a transparent <textarea>.
 * All user-supplied text is HTML-escaped before being placed in the output.
 *
 * Colors loosely follow VS Code dark-mode conventions.
 */

// ---------------------------------------------------------------------------
// Theme colors (hex, kept as constants so they can be changed in one place)
// ---------------------------------------------------------------------------
const C = {
  atKeyword: '#c586c0',   // @keyframes
  animName: '#9cdcfe',    // the animation identifier after @keyframes
  stop: '#4ec9b0',        // 0%, 100%, from, to
  property: '#9cdcfe',    // CSS property name
  value: '#ce9178',       // CSS value (after colon)
  brace: '#808080',       // { }
  semi: '#808080',        // ;
  colon: '#808080',       // :
  comment: '#6a9955',     // /* … */
  string: '#ce9178',      // "…" / '…'
  number: '#b5cea8',      // standalone numbers inside values
  plain: '#d4d4d4',       // everything else
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sp(color: string, text: string): string {
  return `<span style="color:${color}">${escHtml(text)}</span>`;
}

// ---------------------------------------------------------------------------
// Tokenizer state machine
// ---------------------------------------------------------------------------
type State =
  | 'top'          // before / outside @keyframes
  | 'atword'       // consuming the at-keyword identifier (@keyframes…)
  | 'atname'       // consuming the animation name after @keyframes
  | 'kfbody'       // inside the outer { … } of the @keyframes block
  | 'stop'         // consuming a keyframe stop selector (0%, from, to, …)
  | 'decl-prop'    // inside a keyframe stop block, consuming a property name
  | 'decl-value'   // inside a keyframe stop block, consuming a value
  | 'comment'      // inside /* … */
  | 'str-sq'       // inside a single-quoted string
  | 'str-dq';      // inside a double-quoted string

/**
 * Tokenizes and highlights CSS intended for @keyframes blocks.
 * Handles nested states, comments, and strings.
 */
export function highlightKeyframesCSS(code: string): string {
  let out = '';
  let buf = '';
  let i = 0;
  let state: State = 'top';
  // Stack to return to after comment/string ends
  let returnState: State = 'top';
  // Depth of nested {…} inside the outer @keyframes block
  let braceDepth = 0;

  const flush = (color: string) => {
    if (buf) out += sp(color, buf);
    buf = '';
  };
  const raw = (text: string) => { out += escHtml(text); };
  const col = (color: string, text: string) => { out += sp(color, text); };

  while (i < code.length) {
    const ch = code[i];
    const next = i + 1 < code.length ? code[i + 1] : '';

    // ── Comments (enter from any state except string / comment itself) ──────
    if (state !== 'comment' && state !== 'str-sq' && state !== 'str-dq' && ch === '/' && next === '*') {
      // Flush current buffer with current state's color
      switch (state) {
        case 'atword': flush(C.atKeyword); break;
        case 'atname': flush(C.animName); break;
        case 'stop':   flush(C.stop);     break;
        case 'decl-prop': flush(C.property); break;
        case 'decl-value': flush(C.value);  break;
        default: flush(C.plain); break;
      }
      returnState = state;
      state = 'comment';
      buf = '/*';
      i += 2;
      continue;
    }

    if (state === 'comment') {
      buf += ch;
      if (ch === '*' && next === '/') {
        buf += next;
        i += 2;
        flush(C.comment);
        state = returnState;
        continue;
      }
      i++;
      continue;
    }

    // ── String handling ──────────────────────────────────────────────────────
    if (state === 'str-sq') {
      buf += ch;
      if (ch === "'") { flush(C.string); state = returnState; }
      i++;
      continue;
    }
    if (state === 'str-dq') {
      buf += ch;
      if (ch === '"') { flush(C.string); state = returnState; }
      i++;
      continue;
    }

    // ── State machine ────────────────────────────────────────────────────────
    switch (state) {
      // ── TOP LEVEL ──────────────────────────────────────────────────────────
      case 'top':
        if (ch === '@') {
          flush(C.plain);
          buf = '@';
          state = 'atword';
        } else {
          buf += ch;
        }
        break;

      // ── @-keyword (e.g. "@keyframes") ─────────────────────────────────────
      case 'atword':
        if (/[a-zA-Z-]/.test(ch)) {
          buf += ch;
        } else {
          // Emit the @keyword, then start consuming the animation name
          flush(C.atKeyword);
          if (/\s/.test(ch)) {
            raw(ch); // whitespace between "@keyframes" and the name
          } else {
            buf += ch; // non-whitespace immediately after keyword
          }
          state = 'atname';
        }
        break;

      // ── Animation name ─────────────────────────────────────────────────────
      case 'atname':
        if (ch === '{') {
          flush(C.animName);
          col(C.brace, '{');
          braceDepth = 1;
          state = 'kfbody';
        } else {
          buf += ch;
        }
        break;

      // ── Keyframes body (between the outer { … }) ───────────────────────────
      case 'kfbody':
        if (ch === '}') {
          flush(C.plain);
          col(C.brace, '}');
          braceDepth--;
          if (braceDepth <= 0) state = 'top';
        } else if (/[a-zA-Z0-9.%\-]/.test(ch)) {
          flush(C.plain);
          buf = ch;
          state = 'stop';
        } else {
          buf += ch; // whitespace / newlines
        }
        break;

      // ── Keyframe stop selector (0%, 100%, from, to, …) ────────────────────
      case 'stop':
        if (ch === '{') {
          flush(C.stop);
          col(C.brace, '{');
          state = 'decl-prop';
        } else if (ch === ',') {
          flush(C.stop);
          col(C.brace, ',');
        } else {
          buf += ch;
        }
        break;

      // ── Declaration property name ──────────────────────────────────────────
      case 'decl-prop':
        if (ch === '}') {
          flush(C.plain);
          col(C.brace, '}');
          state = 'kfbody';
        } else if (ch === ':') {
          flush(C.property);
          col(C.colon, ':');
          state = 'decl-value';
        } else {
          buf += ch;
        }
        break;

      // ── Declaration value ──────────────────────────────────────────────────
      case 'decl-value':
        if (ch === ';') {
          flush(C.value);
          col(C.semi, ';');
          state = 'decl-prop';
        } else if (ch === '}') {
          flush(C.value);
          col(C.brace, '}');
          state = 'kfbody';
        } else if (ch === "'") {
          flush(C.value);
          buf = "'";
          returnState = 'decl-value';
          state = 'str-sq';
        } else if (ch === '"') {
          flush(C.value);
          buf = '"';
          returnState = 'decl-value';
          state = 'str-dq';
        } else {
          buf += ch;
        }
        break;
    }

    i++;
  }

  // Flush any remaining buffer
  flush(C.plain);
  return out;
}

// ---------------------------------------------------------------------------
// Animation shorthand highlighter (single-line / short form)
// ---------------------------------------------------------------------------
/** Highlights an animation shorthand value like "Slide 3s ease-in-out infinite". */
export function highlightAnimationValue(raw: string): string {
  // Tokenize by whitespace, parentheses groups, and commas
  const tokens = raw.match(/cubic-bezier\([^)]*\)|steps\([^)]*\)|[^\s,]+|[\s,]+/g) ?? [];
  let first = true;

  return tokens
    .map((tok) => {
      const trimmed = tok.trim();
      if (!trimmed) return escHtml(tok); // whitespace / comma

      // First non-whitespace token = animation name
      if (first && /^[a-zA-Z_-]/.test(trimmed)) {
        first = false;
        return sp(C.animName, tok);
      }
      first = false;

      // Time values: 3s, 300ms, 0
      if (/^-?\d+(\.\d+)?(s|ms)$/.test(trimmed) || trimmed === '0') {
        return sp(C.number, tok);
      }

      // Iteration count: number or infinite
      if (/^\d+$/.test(trimmed) || trimmed === 'infinite') {
        return sp(C.stop, tok);
      }

      // Timing functions
      if (
        /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)$/.test(trimmed) ||
        /^(cubic-bezier|steps)\(/.test(trimmed)
      ) {
        return sp(C.atKeyword, tok);
      }

      // Direction / fill-mode keywords
      if (/^(normal|reverse|alternate|alternate-reverse|none|forwards|backwards|both|paused|running)$/.test(trimmed)) {
        return sp(C.value, tok);
      }

      return sp(C.plain, tok);
    })
    .join('');
}
