import { decodeState, EasingType, rehydrateShareState, rehydrateShareStateLegacy } from 'easingwizard-core';
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
import EasterEggNotification from '~/components/EasterEggNotification';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Integrations from '~/components/Integrations';
import OvershootEditor from '~/components/OvershootEditor';
import Share from '~/components/Share';
import SpringEditor from '~/components/SpringEditor';
import Toast from '~/components/Toast';
import WiggleEditor from '~/components/WiggleEditor';
import { classNames } from '~/css/class-names';
import { LOCALSTORAGE_KEY, useEasingStore } from '~/state/easing-store';
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
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  // we only want to set the state on client side to avoid excessive renders on the server
  useEffect(() => {
    let didRestoreFromShareLink = false;
    try {
      if (searchParams.get('easingType')) {
        // Legacy sharing mode
        const newState = rehydrateShareStateLegacy(searchParams);

        setState(newState);
        setSearchParams(new URLSearchParams());
        didRestoreFromShareLink = true;
      } else if (hash && hash.length > 1) {
        // V0
        // in new sharing mode, we use fragment with a minified code, like #a1b2c3d4e5
        const decodedState = decodeState(hash.slice(1));
        const rehydratedState = rehydrateShareState(decodedState);
        setState(rehydratedState);
        didRestoreFromShareLink = true;
      }
    } catch (error) {
      console.error('Error parsing value:', error);
    }

    // Restore from localStorage if no share link was used
    if (!didRestoreFromShareLink) {
      try {
        const saved = localStorage.getItem(LOCALSTORAGE_KEY);
        if (saved) {
          const decoded = decodeState(saved);
          const rehydrated = rehydrateShareState(decoded);
          setState(rehydrated);
          setRestoredFromStorage(true);
        }
      } catch {
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }
    }

    window.history.replaceState(null, '', window.location.pathname);
    setShowUI(true);
  }, [searchParams, setSearchParams, setState, hash]);

  // Auto-dismiss the restored toast
  useEffect(() => {
    if (restoredFromStorage) {
      const timeout = setTimeout(() => setRestoredFromStorage(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [restoredFromStorage]);

  return (
    <div
      className={classNames(
        'relative z-0 mx-auto flex max-w-7xl flex-col items-stretch gap-8 px-4 py-8 sm:py-12 md:gap-12 md:px-6',
        showUI ? 'opacity-100' : 'no-transition opacity-0',
      )}
    >
      {/* Had to disable shooting stars for performance reasons */}
      {/* <ShootingStars /> */}
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
        <Card className="col-span-6 px-6 py-5 [--animation-delay:0.5s]">
          <Integrations />
        </Card>
      </div>
      <Footer />
      <EasterEggNotification />
      <Toast
        show={restoredFromStorage}
        emoji="👋"
        title="Welcome back!"
        message="Your last configuration was restored."
      />
    </div>
  );
}
