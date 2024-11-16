import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import BezierEditor from '~/components/BezierEditor';
import BounceEditor from '~/components/BounceEditor';
import Card from '~/components/Card';
import CardHeadline from '~/components/CardHeadline';
import EasingCode from '~/components/EasingCode';
import EasingPreview from '~/components/EasingPreview';
import EasingSelection from '~/components/EasingSelection';
import EasingTypeSelection from '~/components/EasingTypeSelection';
import HeartIcon from '~/components/icons/HeartIcon';
import OvershootEditor from '~/components/OvershootEditor';
import Share from '~/components/Share';
import SpringEditor from '~/components/SpringEditor';
import WiggleEditor from '~/components/WiggleEditor';
import { shootingStars } from '~/data/shooting-stars';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { shortTransition } from '~/utils/common-classes';

export const meta: MetaFunction = () => {
  return [
    { title: 'Easing Wizard - CSS Easing Editor' },
    {
      name: 'description',
      content: 'Create and customize CSS easing functions with magical precision.',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // get state search param
    const url = new URL(request.url);
    const stateJson = url.searchParams.get('state');
    if (stateJson) {
      const state = JSON.parse(stateJson) as Partial<EasingState>;
      return { state };
    }
  } catch (error) {
    console.error(error);
  }
  return { state: null };
}

export default function Index() {
  const { state } = useLoaderData<typeof loader>();
  const easingType = useEasingStore((state) => state.easingType);
  const setState = useEasingStore((state) => state.setState);
  const [showUI, setShowUI] = useState(false);

  // we only want to set the state on client side to avoid excessive renders on the server
  useEffect(() => {
    if (state) {
      setState(state);
      // remove state search param
      window.history.replaceState({}, '', window.location.pathname);
    }
    setShowUI(true);
  }, [state, setState]);

  return (
    <div
      className={classNames(
        'relative z-0 mx-auto flex max-w-7xl flex-col items-stretch gap-12 px-4 py-12',
        'linear transition-opacity duration-300',
        showUI ? 'opacity-100' : 'opacity-0 no-transition',
      )}
    >
      <div className="fixed inset-x-0 top-0 -z-10 h-svh">
        {shootingStars.map(({ key, xPosition, animationDelay, animationDuration }, index) => (
          <div
            key={key}
            className={classNames('animate-shooting-star absolute top-full', index % 2 === 0 && 'hidden sm:block')}
            style={{
              left: `${xPosition}%`,
              animationDelay: `${animationDelay}s`,
              animationDuration: `${animationDuration}s`,
            }}
          >
            <div className={classNames('h-1 w-1 rounded-full', 'bg-zinc-800')} />
          </div>
        ))}
      </div>
      <header className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-extrabold text-zinc-100">Easing Wizard</h1>
        <p className="text-sm leading-6 text-zinc-400">
          Create and customize CSS easing functions with magical precision.
        </p>
      </header>
      <div className="flex justify-center">
        <EasingTypeSelection />
      </div>
      <div className="grid grid-cols-3 justify-center gap-8">
        <Card className="px-6 py-5">
          <CardHeadline>Presets</CardHeadline>
          <EasingSelection />
        </Card>
        <Card className="z-10 py-5">
          <div className="px-6">
            <CardHeadline>Customize</CardHeadline>
          </div>
          {easingType === EasingType.BEZIER && <BezierEditor />}
          {easingType === EasingType.OVERSHOOT && <OvershootEditor />}
          {easingType === EasingType.SPRING && <SpringEditor />}
          {easingType === EasingType.BOUNCE && <BounceEditor />}
          {easingType === EasingType.WIGGLE && <WiggleEditor />}
        </Card>
        <EasingPreview />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Card className="col-span-2 px-6 py-5">
          <CardHeadline>Code</CardHeadline>
          <EasingCode />
        </Card>
        <Share />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 text-center text-sm text-zinc-400">
          <span>Made with </span>
          <span className="sr-only">love</span>
          <HeartIcon className="size-6 text-grdt-to" />
          <span>
            by{' '}
            <a
              href="https://x.com/RoyDigerhund"
              target="_blank"
              rel="noopener noreferrer"
              className={classNames('text-zinc-100 hover:text-grdt-to', shortTransition)}
            >
              Matthias Martin
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
