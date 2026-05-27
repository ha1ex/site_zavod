import type { Meta, StoryObj } from '@storybook/react';
import { IndustryPickerSection } from './IndustryPickerSection';

const meta: Meta<typeof IndustryPickerSection> = {
  title: 'Landing/IndustryPickerSection',
  component: IndustryPickerSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof IndustryPickerSection>;

export const FourIndustries: Story = {
  args: {
    eyebrow: 'Для каких бизнесов',
    title: 'Подходит для разных сфер',
    description: 'Универсальные воронки и гибкие поля карточки под отраслевые сценарии.',
    industries: [
      {
        id: 'b2b',
        icon: 'Building2',
        name: 'B2B-продажи',
        summary: 'Длинные сделки и сложные согласования с корпоративными клиентами',
        scenario:
          'В B2B сделка идёт месяцами и проходит через несколько ЛПР. CRM хранит карточки контактов, документы и историю встреч.',
        keyFeatures: [
          { icon: 'Building2', text: 'Карточки компаний и контактов с иерархией ЛПР' },
          { icon: 'FileText', text: 'Документы и история согласований в карточке сделки' },
          { icon: 'BarChart3', text: 'Прогноз продаж и forecast по сделкам в работе' },
        ],
        metric: { value: '−25%', label: 'длительность сделки' },
      },
      {
        id: 'services',
        icon: 'Briefcase',
        name: 'Услуги и сервис',
        summary: 'Запись клиентов и работа с постоянной базой',
        scenario:
          'Сервисные компании ведут клиентов через множество разовых заказов. CRM хранит историю обращений и возвращает клиента через рассылки.',
        keyFeatures: [
          { icon: 'Calendar', text: 'Онлайн-запись с календарём специалистов' },
          { icon: 'MessageSquare', text: 'Напоминания в Telegram и SMS' },
          { icon: 'Repeat', text: 'Сценарии возврата клиентов' },
        ],
        metric: { value: '+38%', label: 'повторных визитов' },
      },
      {
        id: 'education',
        icon: 'GraduationCap',
        name: 'Образование',
        summary: 'Заявки на курсы, оплаты, напоминания о вебинарах',
        scenario:
          'Онлайн-школы ведут учеников через цикл оплата → обучение → следующий курс. CRM автоматизирует напоминания и контролирует оплаты.',
        keyFeatures: [
          { icon: 'Inbox', text: 'Заявки на курсы из сайта, форм и соцсетей' },
          { icon: 'CreditCard', text: 'Контроль оплат и рассрочек' },
          { icon: 'Mail', text: 'Рассылки выпускникам со следующим курсом' },
        ],
        metric: { value: '92%', label: 'доходимость до конца курса' },
      },
      {
        id: 'retail',
        icon: 'ShoppingCart',
        name: 'Розница и e-commerce',
        summary: 'Заказы из сайта и маркетплейсов, остатки и повторные покупки',
        scenario:
          'Интернет-магазины ведут клиентов через цикл заказ → доставка → следующая покупка. CRM объединяет заказы из всех каналов.',
        keyFeatures: [
          { icon: 'ShoppingCart', text: 'Заказы из сайта, маркетплейсов и офлайн-точек' },
          { icon: 'Package', text: 'Каталог товаров и остатки на складах' },
          { icon: 'Repeat', text: 'Сценарии возврата клиентов' },
        ],
        metric: { value: '+22%', label: 'повторных заказов' },
      },
    ],
  },
};
