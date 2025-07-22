import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { classNames } from '~/css/class-names';

export default function Notification() {
  const foundEasterEgg = useEasingStore((state) => state.foundEasterEgg);
  const setState = useEasingStore((state) => state.setState);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (foundEasterEgg) {
      setShow(true)
      const timeout = setTimeout(() => {
        setShow(false);
        setState({ foundEasterEgg: false });
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [foundEasterEgg, setState]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed bottom-0 right-0 z-20 px-4 py-6 max-sm:left-0 sm:p-6"
    >
      {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
      <Transition show={show}>
        <div
          className={classNames(
            'pointer-events-auto mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-zinc-950 transition',
            'shadow-element_inactive',
            'data-closed:translate-y-8 data-closed:opacity-0',
            'data-enter:duration-500 data-enter:ease-[linear(0,0.49_7.4%,0.864_15.3%,1.005_19.4%,1.12_23.7%,1.206_28.1%,1.267_32.8%,1.296_36.4%,1.311_40.2%,1.313_44.2%,1.301_48.6%,1.252_56.9%,1.105_74.4%,1.048_82.5%,1.011_91.1%,1)]',
            'data-leave:duration-300 data-leave:ease-in-sine',
          )}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="shrink-0">🎉</div>
              <div className="ml-3 flex-1 pt-0.5">
                <p className="text-[15px] font-medium text-zinc-300">You found the easter egg!</p>
                {/* Funny Message */}
                <p className="mt-1.5 text-sm text-zinc-400">
                  I don&apos;t have a prize for you, but you can tell your friends you found it first!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
