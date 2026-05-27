import type { Meta, StoryObj } from '@storybook/react';
import { MockVisual, type MockVariant } from './MockVisual';

const DOMAIN_GROUPS: Array<{ domain: string; variants: MockVariant[] }> = [
  {
    domain: 'PM · Project Management',
    variants: ['pm-board', 'analytics-kpi', 'integrations-console', 'modules-matrix'],
  },
  {
    domain: 'Support · Service Desk',
    variants: ['support-board', 'request-card', 'kb-public', 'kb-internal'],
  },
  {
    domain: 'CRM · Sales',
    variants: [
      'sales-funnel',
      'crm-client-card',
      'omnichannel-inbox',
      'call-overlay',
      'booking-calendar',
      'crm-analytics',
      'doc-template',
      'mobile-crm',
    ],
  },
  {
    domain: 'HR · Recruiting',
    variants: [
      'hiring-pipeline',
      'candidate-card',
      'onboarding-checklist',
      'org-chart',
      'performance-review',
    ],
  },
  {
    domain: 'Marketing automation',
    variants: ['campaign-dashboard', 'email-sequence', 'ab-test-results', 'audience-segments'],
  },
  {
    domain: 'BPM · Workflow',
    variants: ['process-flowchart', 'approval-chain', 'sla-tracker'],
  },
  {
    domain: 'Finance · Accounting',
    variants: ['ledger-view', 'invoice-status', 'reconciliation-matrix'],
  },
  {
    domain: 'E-commerce · Retail',
    variants: ['order-queue', 'inventory-grid', 'marketplace-connector'],
  },
  {
    domain: 'Docs · Knowledge base',
    variants: [
      'docs-tree',
      'permissions-panel',
      'share-link-card',
      'doc-editor-rich',
      'template-gallery',
      'mobile-doc-reader',
    ],
  },
];

function MocksCatalog() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Каталог mock-вариантов</h1>
        <p className="text-base text-(--color-text-secondary)">
          Все 39 mock'ов сгруппированы по доменам. Используются в полях <code>visual.variant</code>{' '}
          (Hero), <code>mediaVariant</code> (MediaCopy), <code>tabs[].mockVariant</code> /{' '}
          <code>steps[].mockVariant</code> (Tabbed / Scenario). Cross-domain reuse запрещён —
          валидатор <code>mock-semantic-fit</code> блокирует.
        </p>
      </header>

      {DOMAIN_GROUPS.map(({ domain, variants }) => (
        <section key={domain} className="space-y-4">
          <h2 className="text-xl font-semibold text-(--color-text-primary)">
            {domain}{' '}
            <span className="text-sm font-normal text-(--color-text-secondary)">
              ({variants.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {variants.map((variant) => (
              <figure
                key={variant}
                className="overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-surface-card)"
              >
                <div className="border-b border-(--color-border-default) bg-(--color-surface-section) px-4 py-2">
                  <code className="text-sm font-medium text-(--color-text-accent)">{variant}</code>
                </div>
                <div className="p-4">
                  <MockVisual variant={variant} />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta: Meta<typeof MocksCatalog> = {
  title: 'Mocks/_Catalog',
  component: MocksCatalog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof MocksCatalog>;

export const AllVariants: Story = {};
