import { encodeState, reduceStateForShare } from 'easing-wizard-core';
import { paragraph } from '~/css/common-classes';
import { description, frontendUrl } from '~/data/globals';
import { useEasingStore } from '~/state/easing-store';
import CardHeadline from './CardHeadline';
import BlueskyIcon from './icons/BlueskyIcon';
import ShareIcon from './icons/ShareIcon';
import XIcon from './icons/XIcon';
import IconTextButton from './IconTextButton';

export default function Share() {
  const getCurrentState = useEasingStore((state) => state.getCurrentState);

  const handleCopyLink = () => {
    const currentState = getCurrentState();
    const configuration = reduceStateForShare(currentState);
    const encodedConfiguration = encodeState(configuration);

    const configurationLink = encodedConfiguration
      ? `${window.location.origin}/#${encodedConfiguration}`
      : window.location.origin;
    navigator.clipboard.writeText(configurationLink);
  };

  return (
    <div className="@container">
      <CardHeadline>Share</CardHeadline>
      <div className="items-stretch @2xl:flex">
        <div className="flex-1 space-y-3">
          <p className={paragraph}>
            Click the button below to copy the link to your current easing configuration for sharing.
          </p>
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
                `https://x.com/intent/tweet?text=${encodeURI(description)}&url=${frontendUrl}`,
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
                `https://bsky.app/intent/compose?text=${encodeURI(description)}%0A${frontendUrl}`,
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
