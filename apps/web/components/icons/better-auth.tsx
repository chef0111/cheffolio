import type { IconProps } from './type';

export function BetterAuthIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill={'currentColor'}
      viewBox={'0 0 24 24'}
      {...props}
    >
      <path d="M12.1 10.36H15.149999999999999V13.68H12.1z" />
      <path d="m3,3v18h18V3H3Zm15.48,10.68v3h-6.38v-3h-3.48v3h-3.13V7.36h3.13v3h3.48v-3h6.38v6.32Z" />
    </svg>
  );
}
