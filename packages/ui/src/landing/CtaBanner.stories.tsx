import type { Meta, StoryObj } from '@storybook/react';
import { CtaBanner } from './CtaBanner';

const meta: Meta<typeof CtaBanner> = {
  title: 'Landing/CtaBanner',
  component: CtaBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof CtaBanner>;

export const TwoCtas: Story = {
  args: {
    title: 'Подключите CRM под свою команду за один день',
    description:
      'Воронка, базовые автоматизации и каналы коммуникации настраиваются без участия разработчиков.',
    primaryCta: { label: 'Попробовать бесплатно', href: '/signup' },
    secondaryCta: { label: 'Получить демо', href: '/demo' },
  },
};

export const SingleCta: Story = {
  args: {
    title: 'Готовы запустить пилот?',
    description: 'Команда внедрения настроит платформу под ваш процесс.',
    primaryCta: { label: 'Связаться с продажами', href: '/contact' },
  },
};
