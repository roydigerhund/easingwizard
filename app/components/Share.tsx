import { description, productionOrigin } from '~/data/globals';
import {
  bezierStateKeys,
  bounceStateKeys,
  overshootStateKeys,
  restStateKeys,
  springStateKeys,
  useEasingStore,
  wiggleStateKeys,
} from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { paragraph } from '~/utils/common-classes';
import CardHeadline from './CardHeadline';
import BlueskyIcon from './icons/BlueskyIcon';
import ShareIcon from './icons/ShareIcon';
import XIcon from './icons/XIcon';
import IconTextButton from './IconTextButton';

export default function Share() {
  const getCurrentState = useEasingStore((state) => state.getCurrentState);

  const getEasingConfiguration = () => {
    const currentState = getCurrentState();
    switch (currentState.easingType) {
      case EasingType.BEZIER:
        return Object.fromEntries(
          [...restStateKeys, ...bezierStateKeys].map((key) => [key, JSON.stringify(currentState[key])]),
        );
      case EasingType.OVERSHOOT:
        return Object.fromEntries(
          [...restStateKeys, ...overshootStateKeys]
            .filter((k) => k !== 'overshootValue')
            .map((key) => [key, JSON.stringify(currentState[key])]),
        );
      case EasingType.SPRING:
        return Object.fromEntries(
          [...restStateKeys, ...springStateKeys]
            .filter((k) => k !== 'springValue')
            .map((key) => [key, JSON.stringify(currentState[key])]),
        );
      case EasingType.BOUNCE:
        return Object.fromEntries(
          [...restStateKeys, ...bounceStateKeys]
            .filter((k) => k !== 'bounceValue')
            .map((key) => [key, JSON.stringify(currentState[key])]),
        );
      case EasingType.WIGGLE:
        return Object.fromEntries(
          [...restStateKeys, ...wiggleStateKeys]
            .filter((k) => k !== 'wiggleValue')
            .map((key) => [key, JSON.stringify(currentState[key])]),
        );
    }
  };

  const handleCopyLink = () => {
    const configuration = getEasingConfiguration();
    console.log('🚀 ~ handleCopyLink ~ configuration:', configuration);
    const configurationLinkParams = new URLSearchParams({
      ...configuration,
    });
    const configurationLink = `${window.location.origin}/?${configurationLinkParams}`;
    navigator.clipboard.writeText(configurationLink);
  };

  return (
    <div className="@container">
      <CardHeadline>Share</CardHeadline>
      <div className="items-stretch @2xl:flex">
        <div className="flex-1 space-y-3">
          <p className={paragraph}>Click the button below to copy the link to your current easing configuration for easy sharing.</p>
          <IconTextButton
            text="Copy Share Link"
            icon={<ShareIcon className="size-6" />}
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
          className="mx-8 hidden w-px border-l border-zinc-700 @2xl:block"
          style={{
            maskImage: 'linear-gradient(to bottom,rgba(0,0,0,1),rgba(0,0,0,0.1))',
          }}
        />
        <div className="flex-1 space-y-3">
          <p className={paragraph}>
            Do you like Easing Wizard?
            <br />
            Share it with your friends and followers!
          </p>
          <IconTextButton
            text="Share on X"
            icon={<XIcon className="size-6" />}
            onClick={() => {
              window.open(
                `https://x.com/intent/tweet?text=${encodeURI(description)}&url=${productionOrigin}`,
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
                `https://bsky.app/intent/compose?text=${encodeURI(description)}%0A${productionOrigin}`,
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
