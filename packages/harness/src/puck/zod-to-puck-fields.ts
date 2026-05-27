import { z, type ZodTypeAny } from 'zod';
import type { ArrayField, Field, ObjectField } from '@measured/puck';

/**
 * Конвертер Zod schemas → Puck Field configs.
 *
 * Покрывает: ZodString (→ text/textarea), ZodNumber, ZodBoolean (→ radio),
 * ZodEnum / ZodUnion of literals (→ select), ZodLiteral (скрывается как
 * discriminator), ZodArray<ZodObject> (→ array с arrayFields),
 * ZodArray<ZodString> (→ array со стринговым value),
 * ZodObject (→ object с objectFields). Optional / Default / Nullable —
 * прозрачно разворачиваются.
 */

interface UnwrapMeta {
  optional: boolean;
  defaultValue?: unknown;
}

function unwrap(schema: ZodTypeAny): { inner: ZodTypeAny; meta: UnwrapMeta } {
  let current = schema;
  let optional = false;
  let defaultValue: unknown = undefined;

  while (true) {
    if (current instanceof z.ZodOptional) {
      optional = true;
      current = (current as z.ZodOptional<ZodTypeAny>).unwrap();
      continue;
    }
    if (current instanceof z.ZodNullable) {
      optional = true;
      current = (current as z.ZodNullable<ZodTypeAny>).unwrap();
      continue;
    }
    if (current instanceof z.ZodDefault) {
      const def = current as unknown as { _def: { defaultValue: unknown | (() => unknown) } };
      const rawDefault = def._def.defaultValue;
      defaultValue = typeof rawDefault === 'function' ? (rawDefault as () => unknown)() : rawDefault;
      current = (current as z.ZodDefault<ZodTypeAny>).removeDefault();
      continue;
    }
    break;
  }
  return { inner: current, meta: { optional, defaultValue } };
}

function getStringBounds(schema: z.ZodString): { min?: number; max?: number } {
  const result: { min?: number; max?: number } = {};
  const def = schema._def as unknown as { checks?: Array<Record<string, unknown>> };
  for (const check of def.checks ?? []) {
    const kind = (check.kind ?? check.code) as string | undefined;
    const value = check.value as number | undefined;
    if (kind === 'min' && typeof value === 'number') result.min = value;
    if (kind === 'max' && typeof value === 'number') result.max = value;
  }
  return result;
}

function getNumberBounds(schema: z.ZodNumber): { min?: number; max?: number } {
  const result: { min?: number; max?: number } = {};
  const def = schema._def as unknown as { checks?: Array<Record<string, unknown>> };
  for (const check of def.checks ?? []) {
    const kind = (check.kind ?? check.code) as string | undefined;
    const value = check.value as number | undefined;
    if (kind === 'min' && typeof value === 'number') result.min = value;
    if (kind === 'max' && typeof value === 'number') result.max = value;
  }
  return result;
}

function humanLabel(key: string): string {
  return key
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}

const SUMMARY_KEYS = ['title', 'label', 'name', 'brand', 'question', 'text', 'value', 'id'];

function makeItemSummary(item: unknown, index: number): string {
  if (item && typeof item === 'object') {
    for (const key of SUMMARY_KEYS) {
      const val = (item as Record<string, unknown>)[key];
      if (typeof val === 'string' && val.length > 0) {
        return val.length > 60 ? val.slice(0, 60) + '…' : val;
      }
    }
  }
  return `Элемент ${index + 1}`;
}

function getLiteralValue(schema: ZodTypeAny): unknown {
  return (schema as unknown as { value: unknown }).value;
}

function getUnionOptions(schema: ZodTypeAny): readonly ZodTypeAny[] {
  return (schema as unknown as { options: readonly ZodTypeAny[] }).options;
}

function getArrayElement(schema: ZodTypeAny): ZodTypeAny {
  return (schema as unknown as { element: ZodTypeAny }).element;
}

function getEnumValues(schema: ZodTypeAny): string[] {
  const opts = (schema as unknown as { options?: unknown[] }).options;
  if (Array.isArray(opts)) return opts.filter((v): v is string => typeof v === 'string');
  const enumDef = (schema as unknown as { enum?: Record<string, unknown> }).enum;
  if (enumDef) {
    return Object.values(enumDef).filter((v): v is string => typeof v === 'string');
  }
  return [];
}

export function zodToField(schema: ZodTypeAny, label?: string): Field | null {
  const { inner } = unwrap(schema);

  if (inner instanceof z.ZodLiteral) return null;

  if (inner instanceof z.ZodString) {
    const { min, max } = getStringBounds(inner);
    const isLong = (max ?? 0) > 200 || (min ?? 0) > 80;
    if (isLong) return { type: 'textarea', label };
    return { type: 'text', label };
  }

  if (inner instanceof z.ZodNumber) {
    const { min, max } = getNumberBounds(inner);
    return { type: 'number', label, min, max };
  }

  if (inner instanceof z.ZodBoolean) {
    return {
      type: 'radio',
      label,
      options: [
        { label: 'Да', value: true },
        { label: 'Нет', value: false },
      ],
    };
  }

  if (inner instanceof z.ZodEnum) {
    const values = getEnumValues(inner);
    return {
      type: 'select',
      label,
      options: values.map((v) => ({ label: v, value: v })),
    };
  }

  if (inner instanceof z.ZodUnion) {
    const opts = getUnionOptions(inner);
    const literalValues: Array<string | number | boolean> = [];
    let allLiteral = true;
    for (const opt of opts) {
      if (opt instanceof z.ZodLiteral) {
        const v = getLiteralValue(opt);
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          literalValues.push(v);
          continue;
        }
      }
      allLiteral = false;
      break;
    }
    if (allLiteral && literalValues.length) {
      return {
        type: 'select',
        label,
        options: literalValues.map((v) => ({ label: String(v), value: v })),
      };
    }
    return { type: 'text', label };
  }

  if (inner instanceof z.ZodArray) {
    const element = getArrayElement(inner);
    const { inner: elementInner } = unwrap(element);

    if (elementInner instanceof z.ZodString) {
      const field: ArrayField<Array<{ value: string }>> = {
        type: 'array',
        label,
        arrayFields: {
          value: { type: 'text', label: 'Значение' },
        },
        defaultItemProps: { value: '' },
        getItemSummary: (item) => item?.value ?? 'Пустое значение',
      };
      return field as unknown as Field;
    }

    if (elementInner instanceof z.ZodObject) {
      const arrayFields: Record<string, Field> = {};
      const defaultItemProps: Record<string, unknown> = {};
      const shape = (elementInner as z.ZodObject<z.ZodRawShape>).shape;
      for (const [key, sub] of Object.entries(shape)) {
        const f = zodToField(sub as ZodTypeAny, humanLabel(key));
        if (f) arrayFields[key] = f;
        const { meta, inner: subInner } = unwrap(sub as ZodTypeAny);
        if (meta.defaultValue !== undefined) {
          defaultItemProps[key] = meta.defaultValue;
        } else if (!meta.optional) {
          if (subInner instanceof z.ZodString) defaultItemProps[key] = '';
          else if (subInner instanceof z.ZodNumber) defaultItemProps[key] = 0;
          else if (subInner instanceof z.ZodBoolean) defaultItemProps[key] = false;
          else if (subInner instanceof z.ZodArray) defaultItemProps[key] = [];
          else if (subInner instanceof z.ZodObject) defaultItemProps[key] = {};
          else defaultItemProps[key] = '';
        }
      }
      const field: ArrayField<Array<Record<string, unknown>>> = {
        type: 'array',
        label,
        arrayFields: arrayFields as unknown as ArrayField<
          Array<Record<string, unknown>>
        >['arrayFields'],
        defaultItemProps: defaultItemProps as unknown as ArrayField<
          Array<Record<string, unknown>>
        >['defaultItemProps'],
        getItemSummary: (item, index) => makeItemSummary(item, index ?? 0),
      };
      return field as unknown as Field;
    }

    return { type: 'textarea', label };
  }

  if (inner instanceof z.ZodObject) {
    const objectFields: Record<string, Field> = {};
    const shape = (inner as z.ZodObject<z.ZodRawShape>).shape;
    for (const [key, sub] of Object.entries(shape)) {
      const f = zodToField(sub as ZodTypeAny, humanLabel(key));
      if (f) objectFields[key] = f;
    }
    const field: ObjectField<Record<string, unknown>> = {
      type: 'object',
      label,
      objectFields: objectFields as unknown as ObjectField<
        Record<string, unknown>
      >['objectFields'],
    };
    return field as unknown as Field;
  }

  return null;
}

export function buildFieldsFromObject(
  propsSchema: z.ZodObject<z.ZodRawShape>,
): Record<string, Field> {
  const fields: Record<string, Field> = {};
  for (const [key, sub] of Object.entries(propsSchema.shape)) {
    const f = zodToField(sub as ZodTypeAny, humanLabel(key));
    if (f) fields[key] = f;
  }
  return fields;
}

export function getDefaultsFromObject(
  propsSchema: z.ZodObject<z.ZodRawShape>,
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const [key, sub] of Object.entries(propsSchema.shape)) {
    const { meta, inner } = unwrap(sub as ZodTypeAny);
    if (meta.defaultValue !== undefined) {
      defaults[key] = meta.defaultValue;
      continue;
    }
    if (meta.optional) continue;
    if (inner instanceof z.ZodLiteral) {
      defaults[key] = getLiteralValue(inner);
    } else if (inner instanceof z.ZodString) {
      defaults[key] = '';
    } else if (inner instanceof z.ZodNumber) {
      defaults[key] = 0;
    } else if (inner instanceof z.ZodBoolean) {
      defaults[key] = false;
    } else if (inner instanceof z.ZodArray) {
      defaults[key] = [];
    } else if (inner instanceof z.ZodObject) {
      defaults[key] = {};
    }
  }
  return defaults;
}
