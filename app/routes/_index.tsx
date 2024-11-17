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
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import OvershootEditor from '~/components/OvershootEditor';
import Share from '~/components/Share';
import ShootingStars from '~/components/ShootingStars';
import SpringEditor from '~/components/SpringEditor';
import WiggleEditor from '~/components/WiggleEditor';
import { EasingState, useEasingStore } from '~/state/easing-store';
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
        'relative z-0 mx-auto flex max-w-7xl flex-col items-stretch gap-12 px-4 py-12 md:px-6',
        'linear transition-opacity duration-500',
        showUI ? 'opacity-100' : 'no-transition opacity-0',
      )}
    >
      <ShootingStars />
      <Header />
      <div className="flex justify-center">
        <EasingTypeSelection />
      </div>
      <div className={classNames('relative grid grid-cols-6', 'mx-auto max-w-[30rem] sm:max-w-none', 'gap-4 xl:gap-8')}>
        <Card className="col-span-6 px-6 py-5 lg:col-span-2">
          <EasingSelection />
        </Card>
        <Card className="z-20 col-span-6 py-5 sm:col-span-3 lg:col-span-2">
          <CardHeadline className="mx-6">Customize</CardHeadline>
          {easingType === EasingType.BEZIER && <BezierEditor />}
          {easingType === EasingType.OVERSHOOT && <OvershootEditor />}
          {easingType === EasingType.SPRING && <SpringEditor />}
          {easingType === EasingType.BOUNCE && <BounceEditor />}
          {easingType === EasingType.WIGGLE && <WiggleEditor />}
        </Card>
        <Card className="z-10 col-span-6 py-5 sm:col-span-3 lg:col-span-2">
          <EasingPreview />
        </Card>
        <Card className="col-span-6 px-6 py-5 lg:col-span-4">
          <CardHeadline>Code</CardHeadline>
          <EasingCode />
        </Card>
        <Card className="col-span-6 px-6 py-5 lg:col-span-2">
          <Share />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
