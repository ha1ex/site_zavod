import type { Meta, StoryObj } from '@storybook/react';
import { MetricsSplit } from './MetricsSplit';

const meta: Meta<typeof MetricsSplit> = {
  title: 'Landing/MetricsSplit',
  component: MetricsSplit,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof MetricsSplit>;

export const SupportAnalytics: Story = {
  args: {
    eyebrow: 'Аналитика',
    title: 'Получайте готовые отчёты о работе сервиса',
    description:
      'Контролируйте работу команды с опорой на данные. Аналитика обновляется автоматически — не нужно собирать таблицы руками.',
    metrics: [
      { value: '124', label: 'заявки в работе', trend: 'up' },
      { value: '87%', label: 'закрыто в SLA', trend: 'up' },
      { value: '18', label: 'зависли на этапе', trend: 'down' },
      { value: '6', label: 'перегружены', trend: 'flat' },
    ],
    bullets: [
      {
        title: 'Где сейчас все заявки',
        description:
          'Сколько обращений на каждом этапе, что в работе, что зависло — общая картина на одном дашборде.',
      },
      {
        title: 'Растёт ли нагрузка',
        description: 'Динамика обращений по неделям и месяцам — когда нужно усиление команды.',
      },
      {
        title: 'Кто перегружен',
        description: 'Нагрузка по специалистам — видно, где перекос и кому нужна помощь.',
      },
      {
        title: 'Укладываемся ли в SLA',
        description: 'Доля заявок, закрытых в срок, и точки, где команда теряет время.',
      },
    ],
  },
};
