/**
 * CssEditor – a syntax-highlighted CSS textarea using the "overlay" technique:
 *
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  <pre>  (absolute, pointer-events: none)  ← highlighted │
 *  │  <textarea>  (absolute, bg: transparent, text: transparent, caret: white)  │
 *  └─────────────────────────────────────────────────────────┘
 *
 * Both elements share identical font / padding / line-height so the caret sits
 * exactly on top of the corresponding highlighted character.
 *
 * A lint error panel is rendered below the editor.
 */
import { useCallback, useMemo, useRef, type KeyboardEvent } from 'react';
import { classNames } from '~/css/class-names';
import { highlightAnimationValue, highlightKeyframesCSS } from '~/utils/css-highlight';
import { lintAnimationValue, lintKeyframesCSS, type LintDiagnostic } from '~/utils/css-linter';

// ---------------------------------------------------------------------------
// Shared editor styles (must be identical on <pre> and <textarea>)
// ---------------------------------------------------------------------------
const EDITOR_FONT =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
const EDITOR_FONT_SIZE = '0.8125rem'; // ~13px, a touch smaller than text-sm for density
const EDITOR_LINE_HEIGHT = '1.6';
const EDITOR_PADDING = '0.75rem';

const sharedStyle: React.CSSProperties = {
  fontFamily: EDITOR_FONT,
  fontSize: EDITOR_FONT_SIZE,
  lineHeight: EDITOR_LINE_HEIGHT,
  padding: EDITOR_PADDING,
  margin: 0,
  tabSize: 2,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface CssEditorProps {
  /** Controlled value */
  value: string;
  onChange: (value: string) => void;
  /** Which highlighter / linter to use */
  mode: 'keyframes' | 'animation-value';
  /** Visible rows (used to compute min-height) */
  rows?: number;
  /** Accessible label */
  ariaLabel?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CssEditor({ value, onChange, mode, rows = 10, ariaLabel, className }: CssEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scroll: when the textarea scrolls, mirror it on the pre overlay
  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle Tab key: insert 2 spaces instead of moving focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newValue = value.slice(0, start) + '  ' + value.slice(end);
      onChange(newValue);
      // Restore cursor position after React re-renders
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      });
    },
    [value, onChange],
  );

  // Highlighted HTML (memoised — only re-computes when value changes)
  const highlighted = useMemo(() => {
    // Append a trailing newline so the last line of the pre has the same
    // height as the textarea (which always renders an extra empty line)
    const src = value.endsWith('\n') ? value + ' ' : value + '\n ';
    return mode === 'keyframes' ? highlightKeyframesCSS(src) : highlightAnimationValue(src);
  }, [value, mode]);

  // Lint diagnostics
  const diagnostics = useMemo<LintDiagnostic[]>(() => {
    if (!value.trim()) return [];
    return mode === 'keyframes' ? lintKeyframesCSS(value) : lintAnimationValue(value);
  }, [value, mode]);

  const hasErrors = diagnostics.some((d) => d.severity === 'error');

  // Height based on rows
  const minHeight = `calc(${rows} * ${EDITOR_LINE_HEIGHT} * ${EDITOR_FONT_SIZE} + 2 * ${EDITOR_PADDING})`;

  return (
    <div className={classNames('flex flex-col gap-1.5', className)}>
      {/* ── Editor container ─────────────────────────────────────────────── */}
      <div
        className={classNames(
          'relative rounded-xl overflow-hidden',
          'bg-linear-to-r from-zinc-900 to-zinc-950',
          'shadow-[0_0_0_1px_var(--tw-shadow-color)]',
          hasErrors ? 'shadow-red-900 hover:shadow-red-700 focus-within:shadow-red-700' : 'shadow-zinc-800 hover:shadow-zinc-600 focus-within:shadow-zinc-600',
          'transition-shadow duration-300 ease-out-sine',
        )}
        style={{ minHeight }}
      >
        {/* Syntax-highlight overlay — rendered behind the textarea */}
        <pre
          ref={preRef}
          aria-hidden="true"
          style={{
            ...sharedStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: 'inherit',
            // Ensure the pre doesn't cause its own scrollbar
            overflowX: 'hidden',
            overflowY: 'hidden',
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>

        {/* Editable textarea — text is transparent; only the caret is visible */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label={ariaLabel}
          style={{
            ...sharedStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            color: 'transparent',
            caretColor: '#e5e7eb', // zinc-200-ish
            resize: 'none',
            border: 'none',
            outline: 'none',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRadius: 'inherit',
          }}
        />
      </div>

      {/* ── Lint diagnostics ─────────────────────────────────────────────── */}
      {diagnostics.length > 0 && (
        <ul className="flex flex-col gap-1" role="list" aria-label="CSS errors">
          {diagnostics.map((d, idx) => (
            <li
              key={idx}
              className={classNames(
                'flex items-start gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono',
                d.severity === 'error'
                  ? 'bg-red-950/60 text-red-300'
                  : 'bg-yellow-950/60 text-yellow-300',
              )}
            >
              {/* Icon */}
              <span className="mt-px shrink-0 select-none" aria-hidden="true">
                {d.severity === 'error' ? '✕' : '⚠'}
              </span>
              {/* Message */}
              <span>
                {d.line !== undefined && (
                  <span className="mr-1 opacity-60">Line {d.line}:</span>
                )}
                {d.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
