import type { MetaFunction } from '@remix-run/node';
import { useContext } from 'react';
import BezierEditor from '~/components/BezierEditor';
import BounceEditor from '~/components/BounceEditor';
import EasingCode from '~/components/EasingCode';
import EasingPreview from '~/components/EasingPreview';
import EasingSelection from '~/components/EasingSelection';
import SpringEditor from '~/components/SpringEditor';
import { EasingContext } from '~/contexts/easing-context';
import { EasingType } from '~/types-and-enums';

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
  const {
    state: { easingType },
  } = useContext(EasingContext);

  return (
    <div className="flex flex-col items-center gap-16">
      <header className="flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Easing Wizard</h1>
        <p className="leading-6 text-gray-600 dark:text-gray-400">
          Create and customize CSS easing functions with magical precision.
        </p>
      </header>
      <main className="grid w-full max-w-5xl grid-cols-6 gap-8">
        {easingType === EasingType.BEZIER && <BezierEditor />}
        {easingType === EasingType.SPRING && <SpringEditor />}
        {easingType === EasingType.BOUNCE && <BounceEditor />}
        <EasingSelection />
        <div className="col-span-6">
          <EasingPreview />
          <EasingCode />
        </div>
      </main>
    </div>
  );
}
