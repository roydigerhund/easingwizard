import { decodeState, EasingType, rehydrateShareState, rehydrateShareStateLegacy } from 'easing-wizard-core';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';
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
import Notification from '~/components/Notification';
import OvershootEditor from '~/components/OvershootEditor';
import Share from '~/components/Share';
import ShootingStars from '~/components/ShootingStars';
import SpringEditor from '~/components/SpringEditor';
import WiggleEditor from '~/components/WiggleEditor';
import { classNames } from '~/css/class-names';
import { useEasingStore } from '~/state/easing-store';
import type { Route } from './+types/home';

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 's-maxage=600, stale-while-revalidate=3600, public',
  };
}

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hash } = useLocation();
  const easingType = useEasingStore((state) => state.easingType);
  const setState = useEasingStore((state) => state.setState);
  const [showUI, setShowUI] = useState(false);

  // we only want to set the state on client side to avoid excessive renders on the server
  useEffect(() => {
    try {
      if (searchParams.get('easingType')) {
        // Legacy sharing mode
        const newState = rehydrateShareStateLegacy(searchParams);

        setState(newState);
        setSearchParams(new URLSearchParams());
      } else if (hash && hash.length > 1) {
        // V0
        // in new sharing mode, we use fragment with a minified code, like #a1b2c3d4e5
        const decodedState = decodeState(hash.slice(1));
        const rehydratedState = rehydrateShareState(decodedState);
        setState(rehydratedState);
      }
    } catch (error) {
      console.error('Error parsing value:', error);
    } finally {
      window.history.replaceState(null, '', window.location.pathname);
      setShowUI(true);
    }
  }, [searchParams, setSearchParams, setState, hash]);

  return (
    <div
      className={classNames(
        'relative z-0 mx-auto flex max-w-7xl flex-col items-stretch gap-8 px-4 py-8 sm:py-12 md:gap-12 md:px-6',
        showUI ? 'opacity-100' : 'no-transition opacity-0',
      )}
    >
      <ShootingStars />
      <Header />
      <EasingTypeSelection />
      <div
        className={classNames(
          'relative z-10 grid grid-cols-6',
          'mx-auto max-w-[30rem] sm:max-w-none',
          'gap-4 xl:gap-8',
        )}
      >
        <Card className="col-span-6 px-6 py-5 [--animation-delay:0.5s] lg:col-span-2">
          <EasingSelection />
        </Card>
        <Card className="col-span-6 py-5 [--animation-delay:0.5s] sm:col-span-3 lg:col-span-2">
          <CardHeadline className="mx-6">Customize</CardHeadline>
          {easingType === EasingType.BEZIER && <BezierEditor />}
          {easingType === EasingType.OVERSHOOT && <OvershootEditor />}
          {easingType === EasingType.SPRING && <SpringEditor />}
          {easingType === EasingType.BOUNCE && <BounceEditor />}
          {easingType === EasingType.WIGGLE && <WiggleEditor />}
        </Card>
        <Card className="col-span-6 py-5 [--animation-delay:0.5s] sm:col-span-3 lg:col-span-2">
          <EasingPreview />
        </Card>
        <Card className="col-span-6 px-6 py-5 [--animation-delay:0.5s] lg:col-span-4">
          <CardHeadline>Code</CardHeadline>
          <EasingCode />
        </Card>
        <Card className="col-span-6 px-6 py-5 [--animation-delay:0.5s] lg:col-span-2">
          <Share />
        </Card>
      </div>
      <Footer />
      <Notification />
    </div>
  );
}
