import type { Meta, StoryObj } from '@storybook/react';
import { BenefitsStrip } from './BenefitsStrip';

const meta: Meta<typeof BenefitsStrip> = {
  title: 'Landing/BenefitsStrip',
  component: BenefitsStrip,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof BenefitsStrip>;

export const Default: Story = {
  args: {
    items: [
      'Реестр отечественного ПО',
      'Облако и on-premise',
      'Модульная цена',
      'Интеграция с 1С и AmoCRM',
    ],
  },
};

export const ThreeItems: Story = {
  args: {
    items: ['Единая база клиентов', 'Воронка автоматизации продаж', 'Запуск без разработчиков'],
  },
};
