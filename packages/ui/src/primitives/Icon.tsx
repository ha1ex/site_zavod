import { type LucideIcon, Sparkles, icons } from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

/**
 * Renders a lucide-react icon by name from spec.
 * Names like "Inbox", "MessageSquare", "Network" are looked up in lucide's
 * exported icon map; falls back to Sparkles if the name is unknown so we never
 * crash a generated landing on a typo.
 */
export function Icon({ name, className, strokeWidth = 1.75 }: IconProps) {
  const LucideComponent = (icons as Record<string, LucideIcon | undefined>)[name] ?? Sparkles;
  return <LucideComponent className={className} strokeWidth={strokeWidth} aria-hidden />;
}
