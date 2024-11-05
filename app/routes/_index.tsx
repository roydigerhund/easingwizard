import type { MetaFunction } from '@remix-run/node';
import BezierEditor from '~/components/BezierEditor';
import BounceEditor from '~/components/BounceEditor';
import Card from '~/components/Card';
import CardHeadline from '~/components/CardHeadline';
import EasingCode from '~/components/EasingCode';
import EasingPreview from '~/components/EasingPreview';
import EasingSelection from '~/components/EasingSelection';
import EasingTypeSelectionCopy from '~/components/EasingTypeSelection copy';
import OvershootEditor from '~/components/OvershootEditor';
import SpringEditor from '~/components/SpringEditor';
import WiggleEditor from '~/components/WiggleEditor';
import { shootingStars } from '~/data/shooting-stars';
import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';

export const meta: MetaFunction = () => {
  return [
    { title: 'Easing Wizard - CSS Easing Editor' },
    {
      name: 'description',
      content: 'Create and customize CSS easing functions with magical precision.',
    },
  ];
};

export default function Index() {
  const easingType = useEasingStore((state) => state.easingType);

  return (
    <div className="relative z-0 mx-auto flex max-w-7xl flex-col items-stretch gap-12 px-4 py-12">
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
        <EasingTypeSelectionCopy />
      </div>
      <div className="grid grid-cols-3 justify-center gap-8">
        <Card className="px-6 py-5">
          <CardHeadline>Presets</CardHeadline>
          {/* <EasingTypeSelection /> */}
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
      <Card className="px-6 py-5">
        <CardHeadline>Code</CardHeadline>
        <EasingCode />
      </Card>
    </div>
  );
}
