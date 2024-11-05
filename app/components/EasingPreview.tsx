import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { AnimationType, PreviewPlayMode } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { humanize } from '~/utils/string';
import Card from './Card';
import CardHeadline from './CardHeadline';
import EasingPreviewElement from './EasingPreviewElement';
import IconButton from './IconButton';
import InputGroup from './InputGroup';
import MeshBase from './MeshBase';
import SelectGroup from './SelectGroup';
import Slider from './Slider';
import Toggle from './Toggle';

export default function EasingPreview() {
  const setState = useEasingStore((state) => state.setState);
  const previewDuration = useEasingStore((state) => state.previewDuration);
  const previewPlayMode = useEasingStore((state) => state.previewPlayMode);
  const previewShowLinear = useEasingStore((state) => state.previewShowLinear);
  const previewAnimationType = useEasingStore((state) => state.previewAnimationType);
  const [counter, setCounter] = useState(0);
  const [hidePreviewElement, setHidePreviewElement] = useState(false);

  useEffect(() => {
    // hide preview during duration change
    const timeout = setTimeout(() => {
      setHidePreviewElement(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [previewDuration]);

  return (
    <Card className="z-10 py-5">
      <div className="px-6">
        <CardHeadline>Preview</CardHeadline>
      </div>

      <MeshBase>{!hidePreviewElement && <EasingPreviewElement counter={counter} />}</MeshBase>

      <InputGroup>
        <Slider
          label="Duration"
          value={previewDuration}
          onChange={(value) => {
            setHidePreviewElement(true);
            setCounter(0);
            setState({ previewDuration: value });
          }}
          min={100}
          max={2000}
          step={50}
        />
        <SelectGroup
          label="Play Mode"
          value={previewPlayMode}
          options={Object.values(PreviewPlayMode).map((value) => ({ label: humanize(value), value }))}
          onChange={(value) => setState({ previewPlayMode: value })}
        />
        <Toggle
          label="Show Linear"
          value={previewShowLinear}
          onChange={(value) => setState({ previewShowLinear: value })}
        />
      </InputGroup>
      {/* Preview Elements */}
      <div className={classNames('mt-8 flex justify-between')}>
        {/* Controls */}
        <div style={{ marginBottom: '20px' }}>
          {previewPlayMode === PreviewPlayMode.ONCE && (
            <button style={{ marginLeft: '20px' }} onClick={() => setCounter((prev) => prev + 1)}>
              Restart
            </button>
          )}
        </div>
      </div>
      <div className="relative mt-8 flex flex-wrap gap-4">
        {Object.values(AnimationType).map((type) => (
          <IconButton
            key={type}
            text={humanize(type)}
            isActive={previewAnimationType === type}
            onClick={() => {
              if (previewAnimationType !== type) {
                setCounter(0);
              }
              setState({ previewAnimationType: type });
            }}
            icon={<path d="M0,100 C25,75 75,25 100,0" />}
          />
        ))}
      </div>
    </Card>
  );
}
