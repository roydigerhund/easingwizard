import { useRef, useState } from 'react';
import { classNames } from '~/utils/class-names';
import { shortTransition } from '~/utils/common-classes';
import { checkCommaRegex, floatSafeModulo, trailingZeroRegex } from '~/utils/numbers';
import { isNil } from '~/utils/string';

type Props = {
  className?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

export default function Slider({ className, label, value, onChange, min, max, step }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [valuePrefix, setValuePrefix] = useState<string | undefined>();
  const [hasTrailingComma, setHasTrailingComma] = useState(false);
  const [trailingZeros, setTrailingZeros] = useState<string | undefined>();
  const [isEmpty, setIsEmpty] = useState(false);

  const toFixedPrecision = step.toString().split('.')[1]?.length || 0;

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

    if (valuesPrecision > toFixedPrecision) return;

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

    if (step && floatSafeModulo(parsed, step) !== 0) {
      parsed = parseFloat((Math.round(parsed / step) * step).toFixed(toFixedPrecision));
    }
    if (checkCommaRegex(value) && toFixedPrecision) setHasTrailingComma(true);
    if (value.match(trailingZeroRegex) && toFixedPrecision) {
      const match = trailingZeroRegex.exec(value);
      const valuesPrecision = value.split('.')[1]?.length || 0;
      const additionalZeros = toFixedPrecision - valuesPrecision + 1;
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
          onClick={() => buttonRef.current?.focus()}
        >
          {label}
        </button>
        <div
          className={classNames(
            'relative h-10 grow rounded-xl',
            'shadow-element_inactive hover:shadow-element_focused focus-within:shadow-element_focused',
            'ease-out-sine transition-all duration-300 will-change-transform',
          )}
        >
          <input
            tabIndex={-1}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              onChange(parseFloat(e.target.value));
              buttonRef.current?.focus();
            }}
            onClick={() => buttonRef.current?.focus()}
            className={classNames('styled-slider', 'absolute inset-0 cursor-ew-resize rounded-xl px-2', 'opacity-0')}
          />
          <div className="pointer-events-none absolute inset-x-3 inset-y-0">
            <div
              className="absolute -inset-x-1.5 inset-y-1.5 w-full rounded-l-lg bg-zinc-900"
              style={{
                clipPath: `inset(0 ${100 - ((value - min) / (max - min)) * 100}% 0 0)`,
              }}
            />
            <button
              ref={buttonRef}
              className={classNames(
                'absolute bottom-1.5 top-1.5 w-1 rounded-full bg-zinc-100 outline-none',
                '-translate-x-1/2',
              )}
              value={value}
              onKeyDown={handleKeyDown}
              onClick={() => buttonRef.current?.focus()}
              style={{
                left: `${((value - min) / (max - min)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      <input
        className={classNames(
          'ml-3 w-16 rounded-xl bg-transparent text-center text-zinc-100',
          'ease-out-sine transition-all duration-300 will-change-transform',
          'outline-none',
          'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused',
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
      />
    </div>
  );
}
