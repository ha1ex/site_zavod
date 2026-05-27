import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonTable } from './ComparisonTable';

const meta: Meta<typeof ComparisonTable> = {
  title: 'Landing/ComparisonTable',
  component: ComparisonTable,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof ComparisonTable>;

export const VsCompetitor: Story = {
  args: {
    eyebrow: 'Сравнение',
    title: 'Чем Кайтен отличается от зарубежных аналогов',
    description: 'Российская юрисдикция, оплата в рублях, on-premise по запросу.',
    columns: [
      { name: 'Jira', badge: 'Зарубежный' },
      { name: 'Trello', badge: 'Зарубежный' },
      { name: 'Кайтен', highlighted: true, badge: 'Российский' },
    ],
    rows: [
      { label: 'Реестр отечественного ПО', values: [false, false, true] },
      { label: 'On-premise', values: [true, false, true] },
      { label: 'Оплата в рублях', values: [false, false, true] },
      { label: 'Kanban + Scrum + Gantt', values: [true, false, true] },
      { label: 'База знаний', values: ['Confluence ($)', false, 'Встроена'] },
      { label: 'Цена', values: ['$8/чел/мес', '$5/чел/мес', '430 ₽/чел/мес'] },
    ],
  },
};
