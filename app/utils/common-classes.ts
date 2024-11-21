import { classNames } from './class-names';

export const shortTransition = 'transition-all duration-200 ease-in-out';
export const paragraph = classNames(
  'font-light leading-relaxed text-zinc-400',
  '[&>a:hover]:underline [&>a]:text-zinc-100 [&>a]:font-medium [&>a]:underline-offset-4 [&>a]:whitespace-nowrap',
  '[&>code]:font-mono [&>code]:font-regular [&>code]:text-zinc-300 [&>code]:bg-zinc-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded-sm'
);
