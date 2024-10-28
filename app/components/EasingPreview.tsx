import { useState } from 'react';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { AnimationType, PreviewPlayMode } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { humanize } from '~/utils/string';
import Card from './Card';
import CardHeadline from './CardHeadline';
import EasingPreviewElement from './EasingPreviewElement';
import IconButton from './IconButton';

export default function EasingPreview() {
  const setState = useEasingStore((state) => state.setState);
  const previewDuration = useEasingStore((state) => state.previewDuration);
  const previewPlayMode = useEasingStore((state) => state.previewPlayMode);
  const previewShowLinear = useEasingStore((state) => state.previewShowLinear);
  const previewAnimationType = useEasingStore((state) => state.previewAnimationType);
  const [randomId, setRandomId] = useState(Math.random());

  const handleChange = (state: Partial<EasingState>) => {
    setState(state);
    setRandomId(Math.random());
  };

  return (
    <Card className="py-5">
      <div className="px-6">
        <CardHeadline>Preview</CardHeadline>
      </div>

      <EasingPreviewElement key={randomId} />
      {/* Preview Elements */}
      <div className={classNames('mt-8 flex justify-between')}>
        {/* Controls */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            Duration (ms):
            <input
              type="number"
              value={previewDuration}
              onChange={(e) => handleChange({ previewDuration: Number(e.target.value) })}
              style={{ marginLeft: '10px' }}
            />
          </label>

          <label style={{ marginLeft: '20px' }}>
            Play Mode:
            <select
              value={previewPlayMode}
              onChange={(e) => handleChange({ previewPlayMode: e.target.value as PreviewPlayMode })}
            >
              <option value="once">Play Once</option>
              <option value="infinite">Play Infinite</option>
            </select>
          </label>

          <label style={{ marginLeft: '20px' }}>
            Show Linear:
            <input
              type="checkbox"
              checked={previewShowLinear}
              onChange={() => handleChange({ previewShowLinear: !previewShowLinear })}
              style={{ marginLeft: '10px' }}
            />
          </label>

          {previewPlayMode === PreviewPlayMode.ONCE && (
            <button style={{ marginLeft: '20px' }} onClick={() => setRandomId(Math.random())}>
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
            onClick={() => handleChange({ previewAnimationType: type })}
            icon={
              <path
                d="M7.05562 15.4492C6.74711 19.9295 6.41988 24.6816 5.99236 28.1233C5.92427 28.6713 5.42478 29.0605 4.87671 28.9924C4.32864 28.9243 3.93953 28.4248 4.00761 27.8767C4.42763 24.4954 4.74937 19.8245 5.0574 15.3528C5.14424 14.0921 5.22999 12.8472 5.31655 11.6515C5.51217 8.94908 5.71245 6.49295 5.93967 4.70763C6.05248 3.82123 6.1766 3.06105 6.31993 2.50797C6.38952 2.23947 6.47831 1.96013 6.60161 1.72757C6.66274 1.61227 6.75931 1.45608 6.90834 1.3175C7.06372 1.173 7.3315 1 7.69766 1C8.24639 1 8.55864 1.3789 8.65659 1.5105C8.78515 1.68322 8.87536 1.87929 8.93972 2.0402C9.07306 2.37354 9.19204 2.80702 9.3012 3.26475C9.47111 3.9773 9.64547 4.87404 9.82285 5.78632C9.87532 6.05623 9.92807 6.32749 9.98104 6.59575C10.2185 7.79807 10.4615 8.94676 10.7203 9.7883C10.7512 9.88866 10.7813 9.98134 10.8106 10.0665C10.8841 9.93338 10.9625 9.78461 11.0498 9.6189C11.0822 9.55727 11.1159 9.4933 11.151 9.42692C11.3696 9.01396 11.647 8.50367 11.986 8.09677C12.3159 7.70082 12.8634 7.21053 13.6511 7.21053C14.5255 7.21053 15.1462 7.67594 15.5101 7.94875C15.5394 7.97075 15.5671 7.99149 15.5931 8.01064C15.9816 8.29684 16.1972 8.42105 16.5349 8.42105C16.9785 8.42105 17.413 8.32947 17.8791 8.2137C17.9304 8.20094 17.985 8.18701 18.042 8.17242C18.4249 8.07459 18.9227 7.94737 19.3566 7.94737C19.826 7.94737 20.2186 8.03883 20.4971 8.11046C20.5512 8.12436 20.5962 8.13622 20.6357 8.14664C20.7098 8.16616 20.7646 8.1806 20.8235 8.19386C20.8831 8.2073 20.9086 8.21003 20.9122 8.21051C21.0182 8.20966 21.2273 8.18343 21.5659 8.13979L21.5707 8.13916C21.857 8.10226 22.242 8.05263 22.5504 8.05263H24.969C25.5213 8.05263 25.969 8.50035 25.969 9.05263C25.969 9.60492 25.5213 10.0526 24.969 10.0526H22.5504C22.3954 10.0526 22.1473 10.0814 21.8216 10.1234C21.7983 10.1264 21.7742 10.1295 21.7493 10.1328C21.4884 10.1667 21.1515 10.2105 20.907 10.2105C20.7045 10.2105 20.5198 10.1756 20.3839 10.145C20.2886 10.1235 20.1785 10.0945 20.087 10.0704C20.0549 10.062 20.0251 10.0541 19.999 10.0474C19.7659 9.98749 19.5693 9.94737 19.3566 9.94737C19.1924 9.94737 18.9718 10.0024 18.5284 10.1131C18.4759 10.1262 18.4202 10.1401 18.3612 10.1547C17.8738 10.2758 17.2385 10.4211 16.5349 10.4211C15.5082 10.4211 14.8401 9.94 14.4069 9.62094C13.9702 9.29927 13.8419 9.2218 13.69 9.21174C13.6634 9.22968 13.608 9.27451 13.5227 9.37692C13.3355 9.60159 13.1458 9.9334 12.9187 10.3626C12.8901 10.4165 12.8606 10.4728 12.8303 10.5306C12.6449 10.8839 12.4277 11.2979 12.1993 11.625C12.0628 11.8207 11.8854 12.041 11.6597 12.2192C11.4272 12.4026 11.0939 12.5789 10.6744 12.5789C10.2715 12.5789 9.96432 12.3941 9.76806 12.2205C9.57666 12.0513 9.43593 11.8473 9.33208 11.6675C9.12372 11.3068 8.95339 10.8467 8.80869 10.3762C8.51516 9.42166 8.25438 8.17562 8.01893 6.98319C7.96231 6.69647 7.90716 6.41292 7.85322 6.13558C7.83911 6.06302 7.82508 5.99089 7.81113 5.91924C7.63572 7.53013 7.47313 9.5607 7.31133 11.7959C7.22637 12.9696 7.14172 14.1988 7.05562 15.4492Z"
              />
            }
          />
        ))}
      </div>
    </Card>
  );
}
