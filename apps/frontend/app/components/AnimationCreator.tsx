/**
 * AnimationCreator – lets designers author custom CSS @keyframes and an
 * animation shorthand, with instant live preview in the Preview card.
 *
 * When the toggle is enabled:
 *  • Two CssEditor panels (with syntax-highlighting + lint feedback) replace
 *    the plain textareas.
 *  • EasingPreviewElement reads from the Zustand store, injects the @keyframes
 *    CSS via a <style> tag, and overrides the preview element's animation.
 *
 * Custom state is included in the share link and persisted to localStorage.
 */
import { DEFAULT_ANIMATION_PROPERTY_VALUE, DEFAULT_KEYFRAMES_CSS } from 'easingwizard-core';
import { classNames } from '~/css/class-names';
import { paragraph } from '~/css/common-classes';
import { useEasingStore } from '~/state/easing-store';
import CssEditor from './CssEditor';
import IconTextButton from './IconTextButton';
import Toggle from './Toggle';
import ResetIcon from './icons/ResetIcon';

export default function AnimationCreator() {
  const setState = useEasingStore((state) => state.setState);
  const keyframesEnabled = useEasingStore((state) => state.keyframesEnabled);
  const keyframesCSS = useEasingStore((state) => state.keyframesCSS);
  const animationPropertyValue = useEasingStore((state) => state.animationPropertyValue);

  const handleReset = () => {
    setState({
      keyframesCSS: DEFAULT_KEYFRAMES_CSS,
      animationPropertyValue: DEFAULT_ANIMATION_PROPERTY_VALUE,
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-normal uppercase tracking-widest text-zinc-500">Animation Creator</h2>
        {keyframesEnabled && (
          <IconTextButton
            text="Reset"
            icon={<ResetIcon className="size-4" />}
            onClick={handleReset}
            isStaticButton
            className="py-1.5 text-xs"
          />
        )}
      </div>

      <Toggle
        label="Enable custom keyframes"
        value={keyframesEnabled}
        onChange={(value) => setState({ keyframesEnabled: value })}
        className="mb-5"
      />

      {keyframesEnabled && (
        <div className="flex flex-col gap-5">
          {/* Animation property shorthand */}
          <div>
            <label className="mb-1.5 block text-xs font-normal uppercase tracking-widest text-zinc-500">
              Animation
            </label>
            <p className={classNames(paragraph, 'mb-2 text-xs')}>
              Name, duration, easing, and repeat. The name must match the @keyframes block.
            </p>
            {/* Prefix label + editor on the same line */}
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3 top-3 z-10 select-none font-mono text-zinc-600"
                style={{ fontSize: '0.8125rem', lineHeight: '1.6' }}
              >
                animation:&nbsp;
              </span>
              <CssEditor
                mode="animation-value"
                value={animationPropertyValue}
                onChange={(v) => setState({ animationPropertyValue: v })}
                rows={2}
                ariaLabel="Animation property value"
                className="[&>div]:pl-[7.25rem]"
              />
            </div>
          </div>

          {/* @keyframes block */}
          <div>
            <label className="mb-1.5 block text-xs font-normal uppercase tracking-widest text-zinc-500">
              Keyframes
            </label>
            <p className={classNames(paragraph, 'mb-2 text-xs')}>
              Define the animation steps. The name after <code>@keyframes</code> must match above.
            </p>
            <CssEditor
              mode="keyframes"
              value={keyframesCSS}
              onChange={(v) => setState({ keyframesCSS: v })}
              rows={12}
              ariaLabel="CSS @keyframes block"
            />
          </div>
        </div>
      )}
    </div>
  );
}
