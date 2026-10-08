import type { ReactNode, SVGProps } from 'react';

type Props = Omit<SVGProps<SVGSVGElement>, 'children'> & { children: ReactNode; strokeWidth?: number };

/** 24×24 line icon: stroke = currentColor, round caps. Children are the icon's paths. */
export function LineIcon({ children, strokeWidth = 2, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}
