import type { Meta, StoryObj } from '@storybook/react';
import { PromoBanner } from './PromoBanner';

const meta: Meta<typeof PromoBanner> = {
  title: 'Landing/PromoBanner',
  component: PromoBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof PromoBanner>;

export const SoftTone: Story = {
  args: {
    eyebrow: 'Импортозамещение',
    title: 'Российский сервис в реестре отечественного ПО',
    description:
      'Реестр Минцифры №14347, аккредитованная ИТ-компания, on-premise в собственный контур. Соответствие 152-ФЗ.',
    primaryCta: { label: 'Скачать справку', href: '/security' },
    secondaryCta: { label: 'Про on-premise', href: '/on-premise' },
    tone: 'soft',
  },
};

export const VioletTone: Story = {
  args: {
    title: 'Ни одна заявка больше не потеряется',
    description:
      'Попробуйте Кайтен бесплатно — количество заявок и клиентов не ограничено. Платите только за тех, кто работает в системе.',
    primaryCta: { label: 'Попробовать бесплатно', href: '/signup' },
    secondaryCta: { label: 'Записаться на демо', href: '/demo' },
    tone: 'violet',
  },
};
