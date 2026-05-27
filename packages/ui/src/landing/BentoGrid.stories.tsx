import type { Meta, StoryObj } from '@storybook/react';
import { BentoGrid } from './BentoGrid';

const meta: Meta<typeof BentoGrid> = {
  title: 'Landing/BentoGrid',
  component: BentoGrid,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof BentoGrid>;

export const PlatformOverview: Story = {
  args: {
    eyebrow: 'Платформа',
    title: 'Что входит в Кайтен',
    description: 'Шесть модулей в одной системе — подключаются под задачи команды.',
    cells: [
      {
        icon: 'ListTodo',
        title: 'Задачи и проекты',
        description: 'Kanban, Scrum, Gantt и иерархия карточек на одной платформе.',
        size: 'large',
        accent: true,
      },
      {
        icon: 'BookOpen',
        title: 'База знаний',
        description: 'Документы и регламенты в редакторе рядом с задачами.',
        size: 'small',
      },
      {
        icon: 'Headphones',
        title: 'Служба поддержки',
        description: 'Заявки из почты, Telegram и портала на одной доске.',
        size: 'small',
      },
      {
        icon: 'Workflow',
        title: 'Бизнес-процессы',
        description: 'Согласования, рекрутинг, заявки на закупку — по шагам.',
        size: 'wide',
      },
      {
        icon: 'BarChart3',
        title: 'Аналитика',
        description: 'Дашборды по командам, проектам и SLA.',
        size: 'small',
      },
      {
        icon: 'Sparkles',
        title: 'AI-помощник',
        description: 'Подсказки и резюме обсуждений внутри карточек.',
        size: 'small',
      },
    ],
  },
};
