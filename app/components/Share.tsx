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
import Card from './Card';
import CardHeadline from './CardHeadline';
import ClipboardIcon from './icons/ClipboardIcon';
import XIcon from './icons/XIcon';
import IconTextButton from './IconTextButton';

const productionOrigin = 'https://easingwizard.com';

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
        <p className="font-light text-zinc-400">
          Click the button below to copy the link to your current easing configuration.
        </p>
        <IconTextButton
          text="Copy Link"
          icon={<ClipboardIcon className="size-6" />}
          onClick={handleCopyLink}
          isStaticButton
          toast="Copied!"
        />
        <p className="mt-8 font-light text-zinc-400">Do you like Easing Wizard? Share it with your friends!</p>
        <IconTextButton
          text="Share on X"
          icon={<XIcon className="size-6" />}
          onClick={() => {
            window.open(
              `https://x.com/intent/tweet?text=Create%20and%20customize%20CSS%20easing%20functions%20with%20magical%20precision%20using%20Easing%20Wizard%20🧙‍♂️%20&url=${productionOrigin}`,
              '_blank',
              'noopener noreferrer',
            );
          }}
          isStaticButton
        />
      </div>
    </Card>
  );
}
