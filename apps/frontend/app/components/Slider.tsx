import * as RSlider from '@radix-ui/react-slider';
import { checkCommaRegex, floatSafeModulo, isNil, trailingZeroRegex } from 'easingwizard-core';
import { useRef, useState } from 'react';
import { classNames } from '~/css/class-names';
import { shortTransition } from '~/css/common-classes';

type Props = {
  className?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  inputStep?: number;
};

export default function Slider({ className, label, value, onChange, min, max, step, inputStep }: Props) {
  const sliderRef = useRef<HTMLSpanElement>(null);
  const [valuePrefix, setValuePrefix] = useState<string | undefined>();
  const [hasTrailingComma, setHasTrailingComma] = useState(false);
  const [trailingZeros, setTrailingZeros] = useState<string | undefined>();
  const [isEmpty, setIsEmpty] = useState(false);

  const toFixedPrecision = step.toString().split('.')[1]?.length || 0;
  const toFixedInputPrecision = (inputStep || step).toString().split('.')[1]?.length || 0;

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
    setHasTrailingComma(false);
    setTrailingZeros(undefined);
    setValuePrefix(undefined);
    setIsEmpty(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valuesPrecision = value.split('.')[1]?.length || value.split(',')[1]?.length || 0;

    if (valuesPrecision > toFixedInputPrecision) return;

    resetConditions();

    if (value === '') {
      // allows deletion of last remainig number
      setIsEmpty(true);
      return;
    }
    if (value === '-') {
      // allows negative numbers without existing value
      setValuePrefix('-');
      return;
    }
    let parsed = parseFloat(value) || 0;

    parsed = Math.min(Math.max(parsed, min), max);

    const usedStep = inputStep || step;

    if (usedStep && floatSafeModulo(parsed, usedStep) !== 0) {
      parsed = parseFloat((Math.round(parsed / usedStep) * usedStep).toFixed(toFixedInputPrecision));
    }
    if (checkCommaRegex(value) && toFixedInputPrecision) setHasTrailingComma(true);
    if (value.match(trailingZeroRegex) && toFixedInputPrecision) {
      const match = trailingZeroRegex.exec(value);
      const valuesPrecision = value.split('.')[1]?.length || 0;
      const additionalZeros = toFixedInputPrecision - valuesPrecision + 1;
      if (match && match[1]) setTrailingZeros(match[1].substring(0, additionalZeros));
    }
    onChange(parsed);
  };

  return (
    <div className="group/all flex">
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
            onValueChange={([value]) => onChange(value)}
          >
            <RSlider.Track className="relative h-7 grow overflow-hidden rounded-lg">
              <RSlider.Range className="absolute h-7 bg-zinc-900" />
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
        value={
          isEmpty
            ? ''
            : valuePrefix
              ? valuePrefix
              : Number.isNaN(value) || isNil(value)
                ? `${valuePrefix || ''}`
                : `${valuePrefix || ''}${value}${hasTrailingComma ? '.' : ''}${trailingZeros || ''}`
        }
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, true)}
        inputMode="numeric"
        aria-label={label}
      />
    </div>
  );
}
