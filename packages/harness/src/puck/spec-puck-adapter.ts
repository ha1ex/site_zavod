import { z } from 'zod';
import { SectionSchema, type LandingSpec } from '../schemas/landing-spec';

export interface PuckContentItem {
  type: string;
  props: Record<string, unknown> & { id: string };
}

export interface PuckData {
  root: { props: { title: string; description: string } };
  content: PuckContentItem[];
  zones?: Record<string, PuckContentItem[]>;
}

export interface PuckRootProps {
  title?: string;
  description?: string;
}

interface SectionArm {
  shape: {
    id: { value: string };
    component: { value: string };
    props: z.ZodObject<z.ZodRawShape>;
  };
}

function getArms(): SectionArm[] {
  return ((SectionSchema as unknown) as { _def: { options: SectionArm[] } })._def.options;
}

/**
 * Поднимает из SectionSchema (discriminated union) карту component → id literal.
 * В zod v4 значение ZodLiteral доступно через публичное свойство `.value`.
 */
export function buildComponentIdMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const arm of getArms()) {
    map[arm.shape.component.value] = arm.shape.id.value;
  }
  return map;
}

/**
 * Извлекает props-schema для каждого component'а — для генерации Puck Field config.
 * Возвращает массив пар (component, propsSchema), сохраняя порядок discriminated union.
 */
export function listSectionArms(): Array<{
  component: string;
  sectionId: string;
  propsSchema: z.ZodObject<z.ZodRawShape>;
}> {
  return getArms().map((arm) => ({
    component: arm.shape.component.value,
    sectionId: arm.shape.id.value,
    propsSchema: arm.shape.props,
  }));
}

/**
 * Конвертация LandingSpec → Puck Data для рендера в редакторе.
 * Каждая секция получает уникальный id в формате `<ComponentName>-<index>` —
 * нужен Puck'у для DnD-операций.
 */
export function specToPuckData(spec: LandingSpec): PuckData {
  return {
    root: {
      props: {
        title: spec.seo?.title ?? '',
        description: spec.seo?.description ?? '',
      },
    },
    content: spec.sections.map((section, index) => {
      const props = section.props as Record<string, unknown>;
      return {
        type: section.component,
        props: {
          ...props,
          id: `${section.component}-${index}`,
        },
      };
    }),
  };
}

/**
 * Конвертация Puck Data → spec.sections[] (только секции — meta/seo нужно сохранить отдельно).
 * Удаляет внутренний puck-id из props и восстанавливает id-литерал из карты component → id.
 */
export function puckDataToSections(
  content: PuckContentItem[],
): Array<{ id: string; component: string; props: Record<string, unknown> }> {
  const map = buildComponentIdMap();
  return content.map((item) => {
    const { id: _puckId, ...rest } = item.props ?? { id: '' };
    const sectionId = map[item.type] ?? item.type.toLowerCase();
    return {
      id: sectionId,
      component: item.type,
      props: rest,
    };
  });
}

/**
 * Извлекает SEO root-props из Puck Data.
 */
export function puckRootToSeo(root: PuckData['root']): { title?: string; description?: string } {
  return {
    title: root?.props?.title || undefined,
    description: root?.props?.description || undefined,
  };
}
