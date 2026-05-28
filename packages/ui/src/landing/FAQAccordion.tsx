'use client';

import { useState } from 'react';
import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';

export interface FAQItemProps {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: FAQItemProps[];
}

/**
 * Kaiten FAQ states:
 * - Closed: white row, neutral text, plus icon
 * - Open: violet border, violet title, minus icon, body text
 */
export function FAQAccordion({ eyebrow, title, description, items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-16 md:px-6 lg:py-24',
      )}
    >
      <div className="mb-12 max-w-2xl">
        {eyebrow && (
          <p
            data-comp="faq.eyebrow"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
          >
            {eyebrow}
          </p>
        )}
        <h2 data-comp="faq.title" className="text-3xl font-semibold leading-tight md:text-4xl">
          {title}
        </h2>
        {description && (
          <p data-comp="faq.description" className="mt-4 text-lg text-(--color-text-secondary)">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Inspect
              as="div"
              key={i}
              name={`faq.items[${i}]`}
              className={cn(
                'overflow-hidden rounded-(--radius-xl) border transition-colors duration-(--duration-base) ease-(--ease-ui)',
                isOpen
                  ? 'border-(--color-action-primary) bg-(--color-action-primary-soft)'
                  : 'border-(--color-border-default) bg-(--color-surface-card)',
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={cn(
                  'flex w-full items-center justify-between px-5 py-4 text-left font-medium',
                  isOpen ? 'text-(--color-text-accent)' : 'text-(--color-text-primary)',
                )}
              >
                <span data-comp={`faq.items[${i}].question`}>{item.question}</span>
                <span aria-hidden className="ml-3 text-lg leading-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div
                  data-comp={`faq.items[${i}].answer`}
                  className="px-5 pb-5 text-base text-(--color-text-secondary)"
                >
                  {item.answer}
                </div>
              )}
            </Inspect>
          );
        })}
      </div>
    </section>
  );
}
