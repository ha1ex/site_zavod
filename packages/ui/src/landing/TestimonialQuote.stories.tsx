import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialQuote } from './TestimonialQuote';

const meta: Meta<typeof TestimonialQuote> = {
  title: 'Landing/TestimonialQuote',
  component: TestimonialQuote,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TestimonialQuote>;

export const CaseStudy: Story = {
  args: {
    eyebrow: 'Кейс клиента',
    quote:
      'Подключили модуль службы поддержки к существующему пространству Кайтен — заявки клиентов оказались рядом с задачами команды. Ни одно обращение не теряется.',
    authorName: 'Александр Морозов',
    authorRole: 'Руководитель техподдержки',
    brandName: 'Proctoredu',
    brandInitial: 'P',
    metric: '500 заявок в неделю обрабатывает команда из 5 специалистов',
  },
};

export const Compact: Story = {
  args: {
    quote: 'Внедрили за две недели — раньше думали, что это полгода и команда внедрения.',
    authorName: 'Ирина К.',
    authorRole: 'Директор по операциям',
    brandName: 'CORE12',
    brandInitial: 'C',
  },
};
