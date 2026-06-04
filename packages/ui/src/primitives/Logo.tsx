import type { AnchorHTMLAttributes, HTMLAttributes, SVGProps } from 'react';
import { cn } from './cn';

export type LogoSize = 'sm' | 'md' | 'lg' | 'figma';
export type LogoLanguage = 'rus' | 'eng';
export type LogoTone = 'dark' | 'white';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  href?: string;
  markOnly?: boolean;
  size?: LogoSize;
  language?: LogoLanguage;
  tone?: LogoTone;
  label?: string;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href' | 'children'>;
}

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-12',
  figma: 'h-[104px]',
};

const toneColors: Record<LogoTone, string> = {
  dark: '#212121',
  white: '#ffffff',
};

export function Logo({
  brandName,
  href,
  markOnly = false,
  size = 'md',
  language = 'rus',
  tone = 'dark',
  label,
  className,
  linkProps,
  ...rest
}: LogoProps) {
  const resolvedName = brandName ?? (language === 'eng' ? 'Kaiten' : 'Кайтен');
  const accessibleLabel = label ?? resolvedName;
  const content = markOnly ? (
    <LogoMark aria-hidden="true" className={cn(sizeClasses[size], 'w-auto')} />
  ) : (
    <LogoArtwork
      aria-hidden="true"
      brandName={resolvedName}
      tone={tone}
      className={cn(sizeClasses[size], 'w-auto')}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={accessibleLabel}
        className={cn(
          'inline-flex w-fit items-center rounded-(--radius-lg) no-underline',
          'transition-opacity duration-(--duration-base) ease-(--ease-ui) hover:opacity-90',
          'focus-visible:outline-none focus-visible:shadow-(--button-focus-default)',
          className,
        )}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  return (
    <div aria-label={accessibleLabel} className={cn('inline-flex w-fit items-center', className)} {...rest}>
      {content}
    </div>
  );
}

export interface LogoArtworkProps extends SVGProps<SVGSVGElement> {
  brandName?: string;
  tone?: LogoTone;
}

export function LogoArtwork({ brandName = 'Кайтен', tone = 'dark', className, ...rest }: LogoArtworkProps) {
  const wordColor = toneColors[tone];

  return (
    <svg
      viewBox="0 0 349 104"
      fill="none"
      role="img"
      aria-label={brandName}
      className={cn('block shrink-0', className)}
      {...rest}
    >
      <LogoMark x={0} y={0} width={104} height={104} aria-hidden="true" />
      <text
        x="128"
        y="66"
        fill={wordColor}
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, sans-serif"
        fontSize="48"
        fontWeight="700"
        letterSpacing="0"
      >
        {brandName}
      </text>
    </svg>
  );
}

export function LogoMark({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 104 104"
      fill="none"
      role="img"
      aria-label="Kaiten"
      className={cn('block shrink-0', className)}
      {...rest}
    >
      <rect width="104" height="104" rx="28" fill="#ff335f" />
      <rect x="16" y="16" width="72" height="72" rx="15" fill="#66efbd" transform="rotate(45 52 52)" />
      <circle cx="52" cy="52" r="25.5" fill="#7d4ccf" />
    </svg>
  );
}
