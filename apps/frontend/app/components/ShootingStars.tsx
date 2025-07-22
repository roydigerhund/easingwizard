import { shootingStars } from '~/data/shooting-stars';
import { classNames } from '~/css/class-names';

export default function ShootingStars() {
  return (
    <div className={classNames('fixed inset-x-0 top-0 -z-10 h-svh hidden lg:block')}>
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
  );
}
