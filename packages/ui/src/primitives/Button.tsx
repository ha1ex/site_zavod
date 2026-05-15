'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn.js';

export type ButtonVariant = 'fill' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
    'disabled:bg-(--button-fill-bg-disabled) disabled:text-(--button-fill-text-disabled) disabled:hover:bg-(--button-fill-bg-disabled)',
  ].join(' '),
  outline: [
    'bg-(--button-outline-bg) text-(--button-outline-text)',
    'border border-(--button-outline-border)',
    'hover:bg-(--button-outline-bg-hover) hover:text-(--button-outline-text-hover) hover:border-(--button-outline-border-hover)',
    'disabled:text-(--button-outline-text-disabled) disabled:hover:bg-(--button-outline-bg) disabled:hover:border-(--button-outline-border)',
  ].join(' '),
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'fill',
      size = 'md',
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--button-radius)] font-medium',
          'transition-colors duration-(--duration-base) ease-(--ease-ui)',
          'focus-visible:outline-none focus-visible:shadow-(--button-focus-default)',
          'disabled:cursor-not-allowed',
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
      </button>
    );
  },
);

Button.displayName = 'Button';
