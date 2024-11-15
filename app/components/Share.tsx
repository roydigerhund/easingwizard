import {
  bezierStateKeys,
  bounceStateKeys,
  EasingState,
  overshootStateKeys,
  restStateKeys,
  springStateKeys,
  useEasingStore,
  wiggleStateKeys,
} from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import Card from './Card';
import CardHeadline from './CardHeadline';
import ClipboardIcon from './icons/ClipboardIcon';
import IconTextButton from './IconTextButton';

export default function Share() {
  const getCurrentState = useEasingStore((state) => state.getCurrentState);

  const getEasingConfiguration = () => {
    const currentState = getCurrentState();
    switch (currentState.easingType) {
      case EasingType.BEZIER:
        return Object.fromEntries(
          [...restStateKeys, ...bezierStateKeys].map((key) => [key, currentState[key]]),
        ) as Partial<EasingState>;
      case EasingType.OVERSHOOT:
        return Object.fromEntries(
          [...restStateKeys, ...overshootStateKeys].map((key) => [key, currentState[key]]),
        ) as Partial<EasingState>;
      case EasingType.SPRING:
        return Object.fromEntries(
          [...restStateKeys, ...springStateKeys].map((key) => [key, currentState[key]]),
        ) as Partial<EasingState>;
      case EasingType.BOUNCE:
        return Object.fromEntries(
          [...restStateKeys, ...bounceStateKeys].map((key) => [key, currentState[key]]),
        ) as Partial<EasingState>;
      case EasingType.WIGGLE:
        return Object.fromEntries(
          [...restStateKeys, ...wiggleStateKeys].map((key) => [key, currentState[key]]),
        ) as Partial<EasingState>;
    }
  };

  const handleCopyLink = () => {
    const configuration = getEasingConfiguration();
    const configurationLinkParams = new URLSearchParams({
      state: JSON.stringify(configuration),
    });
    const configurationLink = `${window.location.origin}/?${configurationLinkParams}`;
    navigator.clipboard.writeText(configurationLink);
  };

  return (
    <Card className="px-6 py-5">
      <CardHeadline>Share</CardHeadline>
      <div className="flex flex-col items-start gap-3">
        <p className="font-light text-zinc-400">Click the button below to copy the link to your current easing configuration.</p>
        <IconTextButton
          text="Copy Link"
          icon={<ClipboardIcon className="size-6" />}
          onClick={handleCopyLink}
          isStaticButton
          toast="Copied!"
        />
        <p className="mt-8 font-light text-zinc-400">Do you like Easing Wizard? Share it with your friends!</p>
        <a
          href="https://x.com/intent/tweet?text=Create%20and%20customize%20CSS%20easing%20functions%20with%20magical%20precision%20using%20Easing%20Wizard%20🧙‍♂️%20&url=https://easing-wizard.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(
            'flex items-center gap-2 rounded-xl px-4 py-2.5',
            'text-zinc-100 hover:text-zinc-400',
            'ease-out-sine transition-all duration-300 will-change-transform',
            'rounded-xl outline-none',
            'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
            'cursor-pointer',
          )}
        >
          <svg
            viewBox="0 0 100 100"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 overflow-visible stroke-current"
          >
            <path d="M50 20 L50 80 M20 50 L50 80 M80 50 L50 80" />
          </svg>
          <span>Share on Twitter</span>
        </a>
      </div>
    </Card>
  );
}
