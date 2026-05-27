import type { Meta, StoryObj } from '@storybook/react';
import { SocialProof } from './SocialProof';

const meta: Meta<typeof SocialProof> = {
  title: 'Landing/SocialProof',
  component: SocialProof,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof SocialProof>;

export const EnterpriseClients: Story = {
  args: {
    eyebrow: 'Кому доверяют',
    title: 'Российские компании уже работают в Кайтене',
    description: 'От финтеха и ритейла до промышленности и государственных структур.',
    cases: [
      {
        brand: 'Газпромбанк',
        brandInitial: 'Г',
        quote:
          'Перевели проектные команды на Кайтен после ухода зарубежных сервисов. Внедрение прошло без длительной миграции.',
        metric: 'Финансовый сектор',
      },
      {
        brand: 'X5 Retail Group',
        brandInitial: 'X5',
        quote:
          'Сотни команд ведут операционные проекты и согласования в Кайтене. Единый стандарт работы.',
        metric: 'Ритейл',
      },
      {
        brand: 'Норникель',
        brandInitial: 'Н',
        quote:
          'Управляем проектами модернизации и операционными процессами на одной платформе с on-premise.',
        metric: 'Промышленность',
      },
    ],
  },
};
