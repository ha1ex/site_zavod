import type { Meta, StoryObj } from '@storybook/react';
import { StatStrip } from './StatStrip';

const meta: Meta<typeof StatStrip> = {
  title: 'Landing/StatStrip',
  component: StatStrip,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof StatStrip>;

export const FourStats: Story = {
  args: {
    eyebrow: 'Кайтен в цифрах',
    title: 'Платформа, которой пользуются больше десяти лет',
    stats: [
      {
        value: '12 лет',
        label: 'на российском рынке',
        description: 'Платформа основана в 2014 году, развивается без перерывов.',
      },
      {
        value: 'от 430₽',
        label: 'на сотрудника в месяц',
        description: 'Модульная цена — платите только за нужные модули.',
      },
      {
        value: '99,9%',
        label: 'SLA в облаке',
        description: 'Гарантированная доступность для корпоративных клиентов.',
      },
      {
        value: '30%',
        label: 'экономия против зарубежных',
        description: 'Российский сервис с оплатой в рублях.',
      },
    ],
  },
};
