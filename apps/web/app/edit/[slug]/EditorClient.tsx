'use client';

import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { useMemo, useState } from 'react';
import {
  buildFieldsFromObject,
  getDefaultsFromObject,
  listSectionArms,
  THEME_PRESETS,
  getThemeById,
  type PuckData,
} from '@buffalo/harness/puck';
import {
  BenefitsStrip,
  BentoGrid,
  ComparisonTable,
  CtaBanner,
  FAQAccordion,
  FeatureGrid,
  FinalCta,
  HeroSection,
  IndustryPickerSection,
  LandingFooter,
  LogoCloud,
  MediaCopy,
  MetricsSplit,
  PricingPlans,
  ProcessSteps,
  PromoBanner,
  ScenarioWalkthroughSection,
  SocialProof,
  StatStrip,
  TabbedFeatureSection,
  TestimonialQuote,
  TimelineRoadmap,
} from '@buffalo/ui/landing';

interface Props {
  slug: string;
  initialData: PuckData;
}

type AnyProps = Record<string, unknown>;

function renderAs<P>(
  Component: React.ComponentType<P>,
  props: AnyProps,
): React.ReactElement {
  const Cmp = Component as unknown as React.ComponentType<AnyProps>;
  return <Cmp {...props} />;
}

const COMPONENT_MAP: Record<string, (props: AnyProps) => React.ReactElement> = {
  HeroSection: (p) => renderAs(HeroSection, p),
  FeatureGrid: (p) => renderAs(FeatureGrid, p),
  PricingPlans: (p) => renderAs(PricingPlans, p),
  FAQAccordion: (p) => renderAs(FAQAccordion, p),
  FinalCta: (p) => renderAs(FinalCta, p),
  LandingFooter: (p) => renderAs(LandingFooter, p),
  SocialProof: (p) => renderAs(SocialProof, p),
  ProcessSteps: (p) => renderAs(ProcessSteps, p),
  CtaBanner: (p) => renderAs(CtaBanner, p),
  MediaCopy: (p) => renderAs(MediaCopy, p),
  StatStrip: (p) => renderAs(StatStrip, p),
  PromoBanner: (p) => renderAs(PromoBanner, p),
  BenefitsStrip: (p) => renderAs(BenefitsStrip, p),
  MetricsSplit: (p) => renderAs(MetricsSplit, p),
  TabbedFeatureSection: (p) => renderAs(TabbedFeatureSection, p),
  ScenarioWalkthroughSection: (p) => renderAs(ScenarioWalkthroughSection, p),
  IndustryPickerSection: (p) => renderAs(IndustryPickerSection, p),
  ComparisonTable: (p) => renderAs(ComparisonTable, p),
  TimelineRoadmap: (p) => renderAs(TimelineRoadmap, p),
  BentoGrid: (p) => renderAs(BentoGrid, p),
  LogoCloud: (p) => renderAs(LogoCloud, p),
  TestimonialQuote: (p) => renderAs(TestimonialQuote, p),
};

function buildPuckConfig(): Config {
  const components: Record<string, Config['components'][string]> = {};
  for (const { component, propsSchema } of listSectionArms()) {
    const renderComponent = COMPONENT_MAP[component];
    if (!renderComponent) continue;
    components[component] = {
      label: component,
      fields: buildFieldsFromObject(propsSchema),
      defaultProps: getDefaultsFromObject(propsSchema) as Record<string, never>,
      render: (puckProps) => {
        const { id: _id, puck: _puck, editMode: _em, ...rest } = puckProps as AnyProps & {
          id?: string;
          puck?: unknown;
          editMode?: boolean;
        };
        return renderComponent(rest);
      },
    };
  }
  return {
    components,
    root: {
      fields: {
        title: { type: 'text', label: 'SEO title' },
        description: { type: 'textarea', label: 'SEO description' },
      },
    },
  };
}

export function EditorClient({ slug, initialData }: Props) {
  const config = useMemo(buildPuckConfig, []);
  const [themeId, setThemeId] = useState<string>('kaiten');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const themeStyle = useMemo(() => {
    const theme = getThemeById(themeId);
    return theme.vars as React.CSSProperties;
  }, [themeId]);

  async function onPublish(data: Data) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/spec/${slug}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(`Сохранение упало (${res.status}): ${text.slice(0, 400)}`);
        return;
      }
      setSavedAt(new Date().toISOString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col" style={themeStyle}>
      <div className="flex items-center gap-3 border-b border-(--color-border-default) bg-(--color-surface-page) px-4 py-2 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-(--color-text-secondary)">Тема:</span>
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) px-2 py-1"
          >
            {THEME_PRESETS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-(--color-text-secondary)">
          Сохранение по «Publish» в правом верхнем углу Puck'а
        </span>
        <div className="ml-auto flex items-center gap-3 text-xs">
          {saving && <span className="text-amber-700">сохраняю…</span>}
          {savedAt && !saving && (
            <span className="text-emerald-700">сохранено {new Date(savedAt).toLocaleTimeString()}</span>
          )}
          {error && <span className="text-rose-700">{error}</span>}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Puck
          config={config}
          data={initialData as Data}
          onPublish={onPublish}
          headerTitle={slug}
          headerPath={`/edit/${slug}`}
        />
      </div>
    </div>
  );
}
