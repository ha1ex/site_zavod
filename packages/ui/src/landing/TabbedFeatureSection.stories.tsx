import type { Meta, StoryObj } from '@storybook/react';
import { TabbedFeatureSection } from './TabbedFeatureSection';

const meta: Meta<typeof TabbedFeatureSection> = {
  title: 'Landing/TabbedFeatureSection',
  component: TabbedFeatureSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TabbedFeatureSection>;

export const CrmByRole: Story = {
  args: {
    eyebrow: 'По ролям',
    title: 'Один интерфейс — под продажи, сервис и маркетинг',
    description:
      'Каждая команда работает в одной системе со своим набором сценариев. Руководитель видит общую картину.',
    tabs: [
      {
        id: 'sales',
        label: 'Отдел продаж',
        icon: 'TrendingUp',
        eyebrow: 'Менеджер по продажам',
        title: 'Карточка клиента с историей и следующим шагом',
        description:
          'Контакты, сделки, переписка, звонки и документы по клиенту — в одной карточке с табами.',
        checklist: [
          { icon: 'Contact2', text: 'Карточка клиента с табами: контакты, сделки, история' },
          { icon: 'GitBranch', text: 'Воронка сделок с компанией, суммой и датой следующего шага' },
          { icon: 'Bell', text: 'Напоминания о звонках, встречах и просроченных задачах' },
        ],
        primaryCta: { label: 'Попробовать в продажах', href: '/signup?role=sales' },
        mockVariant: 'crm-client-card',
      },
      {
        id: 'service',
        label: 'Клиентский сервис',
        icon: 'Headphones',
        eyebrow: 'Руководитель сервиса',
        title: 'Обращения клиентов из любых каналов в одной ленте',
        description:
          'Звонки, чат на сайте, мессенджеры, почта и социальные сети попадают в единый inbox.',
        checklist: [
          { icon: 'Inbox', text: 'Единая лента обращений из 8+ каналов' },
          { icon: 'Phone', text: 'Телефония с записью разговоров и pop-up карточки' },
          { icon: 'Users', text: 'Распределение обращений между менеджерами по правилам' },
        ],
        primaryCta: { label: 'Подключить каналы', href: '/signup?role=service' },
        mockVariant: 'omnichannel-inbox',
      },
      {
        id: 'marketing',
        label: 'Маркетинг',
        icon: 'BarChart3',
        eyebrow: 'Маркетолог',
        title: 'Сквозная аналитика от рекламы до выручки',
        description:
          'Воронка по стадиям, источники лидов, стоимость лида и сделки — на одном дашборде.',
        checklist: [
          { icon: 'Target', text: 'Источники лидов и стоимость лида по каждому каналу' },
          { icon: 'TrendingUp', text: 'Окупаемость рекламы — от клика до оплаты' },
          { icon: 'Mail', text: 'Сегментация базы и персональные рассылки' },
        ],
        primaryCta: { label: 'Открыть аналитику', href: '/signup?role=marketing' },
        mockVariant: 'crm-analytics',
      },
    ],
  },
};
