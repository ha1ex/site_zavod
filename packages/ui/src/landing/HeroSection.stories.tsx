import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection.js';

const meta: Meta<typeof HeroSection> = {
  title: 'Landing/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    eyebrow: 'AI harness for product teams',
    title: 'Превратите бриф в готовый лендинг за минуту',
    subtitle:
      'Buffalo собирает страницу из ваших компонентов, проверяет тон и отдаёт TSX-файл, который разработчик может коммитить как есть.',
    primaryCta: { label: 'Получить демо', href: '/demo' },
    secondaryCta: { label: 'Как это работает', href: '#how-it-works' },
    visual: { type: 'product_screenshot' },
  },
};

export const NoSecondaryCta: Story = {
  args: {
    title: 'Один CTA — ясная цель',
    subtitle: 'Используйте, когда лендинг ведёт пользователя к одному действию.',
    primaryCta: { label: 'Записаться в waitlist', href: '/waitlist' },
    visual: { type: 'illustration' },
  },
};
