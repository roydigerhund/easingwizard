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
import CardHeadline from './CardHeadline';
import BlueskyIcon from './icons/BlueskyIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import XIcon from './icons/XIcon';
import IconTextButton from './IconTextButton';

const productionOrigin = 'https://easingwizard.com';
const shareText = encodeURI('Create and customize CSS easing functions with magical precision using Easing Wizard 🧙‍♂️');

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
    <div className="@container">
      <CardHeadline>Share</CardHeadline>
      <div className="@2xl:flex items-stretch">
        <div className="space-y-3 flex-1">
          <p className="font-light leading-relaxed text-zinc-400">
            Click the button below to copy the link to your current easing configuration.
          </p>
          <IconTextButton
            text="Copy Link"
            icon={<ClipboardIcon className="size-6" />}
            onClick={handleCopyLink}
            isStaticButton
            toast="Copied!"
          />
        </div>
        <hr
          className="my-8 border-t border-zinc-700 @2xl:hidden"
          style={{
            maskImage: 'linear-gradient(to right,rgba(0,0,0,1),rgba(0,0,0,0.1))',
          }}
        />
        <div
          className="mx-8 border-l border-zinc-700 hidden @2xl:block w-px"
          style={{
            maskImage: 'linear-gradient(to bottom,rgba(0,0,0,1),rgba(0,0,0,0.1))',
          }}
        />
        <div className="space-y-3 flex-1">
          <p className="font-light leading-relaxed text-zinc-400">
            Do you like Easing Wizard?
            <br />
            Share it with your friends and followers!
          </p>
          <IconTextButton
            text="Share on X"
            icon={<XIcon className="size-6" />}
            onClick={() => {
              window.open(
                `https://x.com/intent/tweet?text=${shareText}&url=${productionOrigin}`,
                '_blank',
                'noopener noreferrer',
              );
            }}
            isStaticButton
          />
          <IconTextButton
            text="Share on Bluesky"
            icon={<BlueskyIcon className="size-6" />}
            onClick={() => {
              window.open(
                `https://bsky.app/intent/compose?text=${shareText}%0A${productionOrigin}`,
                '_blank',
                'noopener noreferrer',
              );
            }}
            isStaticButton
          />
        </div>
      </div>
    </div>
  );
}
