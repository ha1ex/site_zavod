import type { Meta, StoryObj } from '@storybook/react';
import { TimelineRoadmap } from './TimelineRoadmap';

const meta: Meta<typeof TimelineRoadmap> = {
  title: 'Landing/TimelineRoadmap',
  component: TimelineRoadmap,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TimelineRoadmap>;

export const VerticalMigration: Story = {
  args: {
    eyebrow: 'План перехода',
    title: 'Миграция с Jira на Кайтен — за 4 недели',
    description: 'Сценарий перехода без остановки команды и потери данных.',
    orientation: 'vertical',
    milestones: [
      {
        period: 'Неделя 1',
        title: 'Аудит и подготовка',
        description: 'Снимаем структуру проектов в Jira, согласуем mapping полей и доступов.',
        status: 'done',
        bullets: ['Карта проектов и команд', 'Соответствие полей и статусов', 'План коммуникаций'],
      },
      {
        period: 'Неделя 2',
        title: 'Параллельное использование',
        description: 'Команды работают в обеих системах, миграция через CSV-импорт партиями.',
        status: 'in-progress',
        bullets: ['Импорт первых 5 проектов', 'Настройка автоматизаций', 'Обучение тимлидов'],
      },
      {
        period: 'Неделя 3',
        title: 'Перевод оставшихся проектов',
        status: 'planned',
        bullets: ['Импорт активных задач', 'Перевод тикетов и комментариев'],
      },
      {
        period: 'Неделя 4',
        title: 'Финальное переключение',
        description: 'Jira переводится в read-only, новые задачи только в Кайтене.',
        status: 'planned',
        bullets: ['Архивация Jira', 'Финальная аналитика миграции'],
      },
    ],
  },
};

export const HorizontalOverview: Story = {
  args: {
    eyebrow: 'Roadmap',
    title: 'Развитие платформы в 2026',
    orientation: 'horizontal',
    milestones: [
      { period: 'Q1', title: 'AI-помощник в карточках', status: 'done' },
      { period: 'Q2', title: 'Модуль BPM', status: 'in-progress' },
      { period: 'Q3', title: 'Mobile-приложение 2.0', status: 'planned' },
      { period: 'Q4', title: 'Marketplace интеграций', status: 'planned' },
    ],
  },
};
