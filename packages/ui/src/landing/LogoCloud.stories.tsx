import type { Meta, StoryObj } from '@storybook/react';
import { LogoCloud } from './LogoCloud';

const meta: Meta<typeof LogoCloud> = {
  title: 'Landing/LogoCloud',
  component: LogoCloud,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof LogoCloud>;

export const SixBrands: Story = {
  args: {
    eyebrow: 'Кто работает в Кайтене',
    title: 'Команды российских компаний доверяют платформе',
    items: [
      { brand: 'Газпромбанк', brandInitial: 'Г' },
      { brand: 'X5 Retail Group', brandInitial: 'X5' },
      { brand: 'Норникель', brandInitial: 'Н' },
      { brand: 'S7 Airlines', brandInitial: 'S7' },
      { brand: 'ВкусВилл', brandInitial: 'В' },
      { brand: 'СберМаркет', brandInitial: 'СМ' },
    ],
  },
};

export const NoHeader: Story = {
  args: {
    items: [
      { brand: 'Газпромбанк', brandInitial: 'Г' },
      { brand: 'Норникель', brandInitial: 'Н' },
      { brand: 'ВкусВилл', brandInitial: 'В' },
      { brand: 'S7 Airlines', brandInitial: 'S7' },
    ],
  },
};
