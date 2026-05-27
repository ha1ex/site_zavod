import type { Meta, StoryObj } from '@storybook/react';
import { ProcessSteps } from './ProcessSteps';

const meta: Meta<typeof ProcessSteps> = {
  title: 'Landing/ProcessSteps',
  component: ProcessSteps,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof ProcessSteps>;

export const SixSteps: Story = {
  args: {
    eyebrow: 'Внедрение',
    title: 'Внедрите CRM поэтапно',
    description:
      'Не нужно перестраивать процессы за один день — подключайте функции по мере роста команды.',
    steps: [
      {
        icon: 'Compass',
        title: 'Определение целей и процессов',
        description: 'Фиксация воронок, ролей, источников заявок и ключевых показателей продаж.',
      },
      {
        icon: 'Upload',
        title: 'Перенос клиентской базы',
        description: 'Импорт контактов, компаний, сделок и истории общения из таблиц.',
      },
      {
        icon: 'SlidersHorizontal',
        title: 'Настройка воронок',
        description: 'Создание этапов продаж, задач, уведомлений и автоматизаций.',
      },
      {
        icon: 'Plug',
        title: 'Подключение каналов',
        description: 'Интеграция сайта, почты, телефонии и форм.',
      },
      {
        icon: 'GraduationCap',
        title: 'Обучение команды',
        description: 'Инструкции для менеджеров и руководителей.',
      },
      {
        icon: 'LineChart',
        title: 'Аналитика и оптимизация',
        description: 'Настройка отчётов и улучшение процессов по данным.',
      },
    ],
  },
};
