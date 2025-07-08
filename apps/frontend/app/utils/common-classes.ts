import { classNames } from './class-names';

export const shortTransition = 'transition-all duration-200 ease-in-out';
export const paragraph = classNames(
  'font-light leading-relaxed text-zinc-400',
  '[&>a:hover]:duration-200 [&>a:hover]:ease-out-sine [&>a]:transition-all [&>a]:duration-200 [&>a]:ease-in-sine',
  '[&>a]:underline [&>a]:decoration-transparent [&>a:hover]:decoration-grdt-to [&>a:hover]:underline-offset-4 [&>a]:underline-offset-0',
  '[&>a:hover]:text-grdt-to [&>a]:whitespace-nowrap [&>a]:font-medium [&>a]:text-zinc-100',
  '[&>code]:font-regular [&>code]:rounded-xs [&>code]:bg-zinc-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:font-mono [&>code]:text-zinc-300',
);
