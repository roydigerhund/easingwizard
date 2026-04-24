/**
 * AnimationCreator – lets designers author custom CSS @keyframes and animation
 * properties, with an instant live preview in the existing Preview card.
 *
 * When the toggle is enabled:
 *  • The user edits two textareas: the animation shorthand and the @keyframes block.
 *  • Changes are applied immediately via the Zustand store.
 *  • EasingPreviewElement reads from the store and injects the @keyframes CSS via a
 *    <style> tag, then overrides the preview element's animation shorthand.
 *
 * The custom state is included in the share link and persisted to localStorage.
 */
import { DEFAULT_ANIMATION_PROPERTY_VALUE, DEFAULT_KEYFRAMES_CSS } from 'easingwizard-core';
import { useRef } from 'react';
import { classNames } from '~/css/class-names';
import { paragraph } from '~/css/common-classes';
import { useEasingStore } from '~/state/easing-store';
import CardHeadline from './CardHeadline';
import Toggle from './Toggle';
import IconTextButton from './IconTextButton';
import ResetIcon from './icons/ResetIcon';

export default function AnimationCreator() {
  const setState = useEasingStore((state) => state.setState);
  const keyframesEnabled = useEasingStore((state) => state.keyframesEnabled);
  const keyframesCSS = useEasingStore((state) => state.keyframesCSS);
  const animationPropertyValue = useEasingStore((state) => state.animationPropertyValue);

  // Textarea refs to avoid controlled-component overhead on every keystroke
  const animationRef = useRef<HTMLTextAreaElement>(null);
  const keyframesRef = useRef<HTMLTextAreaElement>(null);

  const handleReset = () => {
    setState({
      keyframesCSS: DEFAULT_KEYFRAMES_CSS,
      animationPropertyValue: DEFAULT_ANIMATION_PROPERTY_VALUE,
    });
    // Sync refs so the textareas display the reset values immediately
    if (animationRef.current) animationRef.current.value = DEFAULT_ANIMATION_PROPERTY_VALUE;
    if (keyframesRef.current) keyframesRef.current.value = DEFAULT_KEYFRAMES_CSS;
  };

  return (
    <div className="@container">
      <CardHeadline>Animation Creator</CardHeadline>

      <p className={classNames(paragraph, 'mb-6')}>
        Write custom CSS keyframes and see them animate instantly in the Preview. Enable the toggle, then edit the two
        fields below — no coding experience required.
      </p>

      <Toggle
        label="Enable custom keyframes"
        value={keyframesEnabled}
        onChange={(value) => setState({ keyframesEnabled: value })}
        className="mb-6"
      />

      {keyframesEnabled && (
        <div className="flex flex-col gap-6">
          {/* Animation shorthand */}
          <div>
            <label className="mb-2 block text-xs font-normal uppercase tracking-widest text-zinc-500">
              Animation property
            </label>
            <p className={classNames(paragraph, 'mb-2 text-xs')}>
              Controls the animation name, duration, easing, and repeat. The name must match the one in the Keyframes
              block.
            </p>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-3 font-mono text-sm text-zinc-600 select-none">
                animation:{' '}
              </span>
              <textarea
                ref={animationRef}
                rows={2}
                defaultValue={animationPropertyValue}
                spellCheck={false}
                aria-label="Animation property value"
                onChange={(e) => setState({ animationPropertyValue: e.target.value })}
                className={classNames(
                  'w-full resize-none rounded-xl py-3 pr-4 font-mono text-sm text-zinc-300',
                  'bg-linear-to-r from-zinc-900 to-zinc-950',
                  'shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-zinc-950',
                  'hover:shadow-zinc-700 focus:shadow-zinc-700',
                  'transition-all duration-300 ease-out-sine',
                  'outline-hidden focus:outline-hidden',
                  'pl-[7.5rem]', // leaves space for the "animation: " prefix label
                )}
              />
            </div>
          </div>

          {/* @keyframes block */}
          <div>
            <label className="mb-2 block text-xs font-normal uppercase tracking-widest text-zinc-500">Keyframes</label>
            <p className={classNames(paragraph, 'mb-2 text-xs')}>
              Define the animation steps. The name after <code>@keyframes</code> must match the animation property
              above.
            </p>
            <textarea
              ref={keyframesRef}
              rows={10}
              defaultValue={keyframesCSS}
              spellCheck={false}
              aria-label="CSS @keyframes block"
              onChange={(e) => setState({ keyframesCSS: e.target.value })}
              className={classNames(
                'w-full resize-y rounded-xl p-4 font-mono text-sm text-zinc-300',
                'bg-linear-to-r from-zinc-900 to-zinc-950',
                'shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-zinc-950',
                'hover:shadow-zinc-700 focus:shadow-zinc-700',
                'transition-all duration-300 ease-out-sine',
                'outline-hidden focus:outline-hidden',
              )}
            />
          </div>

          {/* Reset button */}
          <IconTextButton
            text="Reset to default"
            icon={<ResetIcon className="size-6" />}
            onClick={handleReset}
            isStaticButton
          />
        </div>
      )}
    </div>
  );
}
