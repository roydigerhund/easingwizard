import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import Toast from './Toast';

export default function EasterEggNotification() {
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
    <Toast
      show={show}
      emoji="🎉"
      title="You found the easter egg!"
      message="I don't have a prize for you, but you can tell your friends you found it first!"
    />
  );
}
