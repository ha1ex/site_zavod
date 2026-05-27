import type { Meta, StoryObj } from '@storybook/react';
import { MediaCopy } from './MediaCopy';

const meta: Meta<typeof MediaCopy> = {
  title: 'Landing/MediaCopy',
  component: MediaCopy,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof MediaCopy>;

export const MediaRight: Story = {
  args: {
    eyebrow: 'Ядро платформы',
    title: 'Глубокий project management — Kanban, Scrum, Gantt в одном месте',
    description:
      'Команды разработки, маркетинга, поддержки и операций ведут работу на одной платформе. Гибкие доски под любой процесс — без жёстких шаблонов.',
    checklist: [
      { icon: 'Layout', text: 'Несколько досок, колонки и swimlanes под ваш процесс' },
      { icon: 'GitBranch', text: 'Иерархия карточек: эпики, истории, задачи, подзадачи' },
      { icon: 'Calendar', text: 'Gantt-диаграммы и спринты Scrum рядом с Kanban' },
      { icon: 'Zap', text: 'Автоматизации без программистов' },
    ],
    mediaPosition: 'right',
    mediaVariant: 'pm-board',
    primaryCta: { label: 'Попробовать бесплатно', href: '/signup' },
  },
};

export const MediaLeft: Story = {
  args: {
    eyebrow: 'База знаний',
    title: 'Документы и регламенты — рядом с задачами',
    description:
      'База знаний и совместный редактор документов встроены в платформу. Статьи связаны со своими задачами и проектами.',
    checklist: [
      { icon: 'FileText', text: 'Совместный редактор с историей правок' },
      { icon: 'Link', text: 'Связь документов с задачами и проектами' },
      { icon: 'Search', text: 'Поиск по содержимому статей и комментариев' },
    ],
    mediaPosition: 'left',
    mediaVariant: 'kb-internal',
  },
};
