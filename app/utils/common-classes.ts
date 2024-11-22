import { classNames } from './class-names';

export const shortTransition = 'transition-all duration-200 ease-in-out';
export const paragraph = classNames(
  'font-light leading-relaxed text-zinc-400',
  '[&>a:hover]:duration-100 [&>a:hover]:ease-out-sine [&>a]:transition-all [&>a]:duration-200 [&>a]:ease-linear',
  '[&>a:hover]:text-grdt-to [&>a:hover]:underline [&>a:hover]:underline-offset-4 [&>a]:whitespace-nowrap [&>a]:font-medium [&>a]:text-zinc-100 [&>a]:underline-offset-0',
  '[&>code]:font-regular [&>code]:rounded-sm [&>code]:bg-zinc-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:font-mono [&>code]:text-zinc-300',
);
