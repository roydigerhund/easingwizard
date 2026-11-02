import * as RSlider from '@radix-ui/react-slider';
import { useEffect, useRef, useState } from 'react';
import { classNames } from '~/css/class-names';
import { shortTransition } from '~/css/common-classes';
import { parseSliderInput, stepPrecision } from '~/utils/slider-input';
import Tooltip from './Tooltip';

type Props = {
  className?: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  inputStep?: number;
  suggestedRange?: { min: number; max: number };
};

export default function Slider({
  className,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  inputStep,
  suggestedRange,
}: Props) {
  const sliderRef = useRef<HTMLSpanElement>(null);
  const [inputDraft, setInputDraft] = useState<{ text: string; value: number } | null>(null);

  const toFixedPrecision = stepPrecision(step);
  const usedInputStep = inputStep ?? step;
  const toFixedInputPrecision = stepPrecision(usedInputStep);

  useEffect(() => {
    // A preset, restored share URL, or other control can replace the value.
    if (inputDraft && inputDraft.value !== value) setInputDraft(null);
  }, [inputDraft, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>, isTextInput?: boolean) => {
    const isShiftPressed = e.shiftKey;
    if ((e.key === 'ArrowLeft' && !isTextInput) || e.key === 'ArrowDown') {
      onChange(parseFloat(Math.max(value - step * (isShiftPressed ? 10 : 1), min).toFixed(toFixedPrecision)));
      resetConditions();
      e.preventDefault();
    } else if ((e.key === 'ArrowRight' && !isTextInput) || e.key === 'ArrowUp') {
      onChange(parseFloat(Math.min(value + step * (isShiftPressed ? 10 : 1), max).toFixed(toFixedPrecision)));
      resetConditions();
      e.preventDefault();
    }
  };

  const resetConditions = () => {
    setInputDraft(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseSliderInput(e.target.value, { min, max, step: usedInputStep });
    if (!parsed) return;
    setInputDraft({ text: parsed.text, value: parsed.value ?? value });
    if (parsed.value !== undefined) onChange(parsed.value);
  };

  return (
    <div className="group/all relative flex">
      <div className={classNames(className, 'group flex grow')}>
        <button
          tabIndex={-1}
          className={classNames(
            'mr-6 flex w-16 cursor-default items-center font-light tracking-wide text-zinc-500 group-focus-within/all:text-zinc-100 group-hover/all:text-zinc-100',
            shortTransition,
          )}
          onClick={() => sliderRef.current?.focus()}
        >
          {label}
        </button>
        <div
          className={classNames(
            'relative flex grow touch-none rounded-xl px-1.5 select-none',
            'shadow-element_inactive focus-within:shadow-element_focused hover:shadow-element_focused active:shadow-element_pressed',
            'transition-all duration-300 ease-out-sine will-change-transform',
            '[--shadow-retract:-0.6rem]',
          )}
        >
          <RSlider.Root
            className={classNames('relative flex h-10 grow cursor-ew-resize items-center')}
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={([value]) => {
              resetConditions();
              onChange(value);
            }}
          >
            <RSlider.Track className="relative h-7 grow overflow-hidden rounded-lg">
              <RSlider.Range className="absolute h-7 bg-zinc-900" />
              {suggestedRange &&
                (() => {
                  const thumbWidth = 0.75; // w-3 in rem
                  const leftFrac = (Math.max(suggestedRange.min, min) - min) / (max - min);
                  const rightFrac = 1 - (Math.min(suggestedRange.max, max) - min) / (max - min);
                  return (
                    <span
                      className="absolute h-7 rounded-sm bg-zinc-700/40"
                      style={{
                        left: `calc(${leftFrac * 100}% - ${leftFrac * thumbWidth}rem)`,
                        right: `calc(${rightFrac * 100}% - ${rightFrac * thumbWidth}rem)`,
                      }}
                    />
                  );
                })()}
            </RSlider.Track>
            <RSlider.Thumb
              ref={sliderRef}
              className="block h-9 w-3 rounded-full border-4 border-zinc-950 bg-zinc-100 outline-hidden focus:outline-hidden"
              aria-label={label}
            />
          </RSlider.Root>
        </div>
      </div>
      <input
        className={classNames(
          'ml-3 w-16 rounded-xl bg-transparent text-center text-zinc-100',
          'transition-all duration-300 ease-out-sine will-change-transform',
          'outline-hidden focus:outline-hidden',
          'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
          '[--shadow-retract:-0.4rem]',
        )}
        value={inputDraft && inputDraft.value === value ? inputDraft.text : Number.isFinite(value) ? String(value) : ''}
        onChange={handleChange}
        onBlur={resetConditions}
        onKeyDown={(e) => handleKeyDown(e, true)}
        inputMode={toFixedInputPrecision > 0 ? 'decimal' : 'numeric'}
        aria-label={label}
      />
      {hint && <Tooltip groupHoverClass="group-hover/all">{hint}</Tooltip>}
    </div>
  );
}
