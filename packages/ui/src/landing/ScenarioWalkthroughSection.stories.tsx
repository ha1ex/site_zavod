import type { Meta, StoryObj } from '@storybook/react';
import { ScenarioWalkthroughSection } from './ScenarioWalkthroughSection';

const meta: Meta<typeof ScenarioWalkthroughSection> = {
  title: 'Landing/ScenarioWalkthroughSection',
  component: ScenarioWalkthroughSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof ScenarioWalkthroughSection>;

export const CrmDayWalkthrough: Story = {
  args: {
    eyebrow: 'Один день в CRM',
    title: 'Как менеджер продаж работает в CRM от утренней проверки до закрытия сделки',
    description:
      'Сценарий ведёт через ключевые экраны: входящие обращения, звонок, обновление карточки, отправка документа и итоги дня.',
    protagonist: 'Анна, менеджер отдела продаж, 22 активные сделки',
    steps: [
      {
        time: '09:30 · утро',
        title: 'Открывает inbox и видит обращения, накопившиеся за ночь',
        description:
          'CRM распределила заявки из чата, Telegram и почты по приоритету и подсветила повторного клиента.',
        icon: 'Inbox',
        mockVariant: 'omnichannel-inbox',
      },
      {
        time: '10:24 · звонок',
        title: 'Принимает звонок — карточка клиента открывается сама',
        description:
          'Скрипт разговора подсказывает следующий шаг, разговор записывается, после звонка остаётся заметка.',
        icon: 'PhoneIncoming',
        mockVariant: 'call-overlay',
      },
      {
        time: '11:48 · карточка',
        title: 'Обновляет карточку клиента и переводит сделку на следующую стадию',
        description: 'В карточке вся история переписки и звонков. Руководитель сразу видит обновление.',
        icon: 'UserCheck',
        mockVariant: 'crm-client-card',
      },
      {
        time: '14:12 · документ',
        title: 'Формирует счёт по шаблону за минуту',
        description: 'CRM подставляет данные клиента автоматически. Статус «Просмотрен» приходит в карточку.',
        icon: 'FileText',
        mockVariant: 'doc-template',
      },
    ],
  },
};
