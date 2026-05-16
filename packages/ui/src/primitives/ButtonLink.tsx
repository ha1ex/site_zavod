import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';
import type { ButtonSize, ButtonVariant } from './Button';

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-sm gap-1.5 [&_svg]:size-5',
  md: 'h-11 px-4 text-base gap-1 [&_svg]:size-6',
  lg: 'h-12 px-5 text-base gap-1 [&_svg]:size-6',
};

const variantClasses: Record<ButtonVariant, string> = {
  fill: [
    'bg-(--button-fill-bg) text-(--button-fill-text)',
    'hover:bg-(--button-fill-bg-hover)',
  ].join(' '),
  outline: [
    'bg-(--button-outline-bg) text-(--button-outline-text)',
    'border border-(--button-outline-border)',
    'hover:bg-(--button-outline-bg-hover) hover:text-(--button-outline-text-hover) hover:border-(--button-outline-border-hover)',
  ].join(' '),
  invert: ['bg-white text-(--color-action-primary)', 'hover:bg-white/90'].join(' '),
  'ghost-on-violet': [
    'bg-transparent text-white border border-white/40',
    'hover:bg-white/10 hover:border-white/60',
  ].join(' '),
};

export function ButtonLink({
  variant = 'fill',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--button-radius)] font-medium no-underline',
        'transition-colors duration-(--duration-base) ease-(--ease-ui)',
        'focus-visible:outline-none focus-visible:shadow-(--button-focus-default)',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </a>
  );
}
