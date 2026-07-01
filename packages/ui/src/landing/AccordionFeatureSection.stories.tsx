import type { Meta, StoryObj } from '@storybook/react';
import { AccordionFeatureSection } from './AccordionFeatureSection';
import { MockVisual } from './mocks';
import { ButtonLink } from '../primitives/ButtonLink';

const meta: Meta<typeof AccordionFeatureSection> = {
  title: 'Landing/AccordionFeatureSection',
  component: AccordionFeatureSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof AccordionFeatureSection>;

export const Manufacturing: Story = {
  args: {
    heading: 'Производство под контролем без планёрок и ручного контроля',
    description:
      'От заявки до отгрузки — каждый этап, отдел и срок в одной системе. Руководитель не собирает картину по звонкам и чатам.',
    defaultOpen: 0,
    items: [
      {
        title: 'Статус каждого заказа виден с доски',
        body:
          'Каждый заказ движется по маршруту: заявка → закупка → производство → ОТК → отгрузка. Руководитель видит весь поток и сразу замечает, где образовалась очередь или задержка — до того, как это стало проблемой.',
        media: <MockVisual variant="order-flow" />,
      },
      {
        title: 'Загрузка людей и участков понятна на недели вперёд',
        body:
          'Загрузка цеха, участков и инженеров — на одной шкале времени. Пересечения этапов подсвечены: видно эффект задержки одной поставки. Ресурсное планирование на недели вперёд, а не на день.',
        media: <MockVisual variant="production-gantt" />,
      },
      {
        title: 'Снабжение, цех и технологи работают с одними данными',
        body:
          'Чертежи, спецификации и статусы закупок живут внутри карточки заказа. Снабжение, цех и технологи видят одну версию данных — без пересылки файлов по почте.',
        media: <MockVisual variant="production-departments" />,
      },
      {
        title: 'Отчёт по загрузке и выполнению заказов — без ручной сборки',
        body:
          'Выполнение в срок, загрузка участков и просрочки собираются автоматически. Открыли отчёт перед планёркой — вся картина уже на экране, без выгрузок в таблицы.',
        media: <MockVisual variant="analytics-kpi" />,
      },
    ],
    cta: (
      <>
        <ButtonLink size="lg" href="/signup">
          Попробовать Кайтен бесплатно
        </ButtonLink>
        <ButtonLink variant="outline" size="lg" href="/demo">
          Запросить демонстрацию
        </ButtonLink>
      </>
    ),
  },
};
