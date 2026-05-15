import { parse } from '@babel/parser';
import _traverse, { type NodePath } from '@babel/traverse';
import * as t from '@babel/types';

/**
 * AST-валидатор для TSX SVG-иллюстрации (этап 3).
 *
 * Проверяет жёсткий чек-лист (см. svg-illustration-skill.md):
 *   1. root-svg          — внутри Inner ровно один корневой <svg>
 *   2. dark-prop-colors  — fill/stroke/stopColor/floodColor через {dark ? ... : ...} или "none"/"currentColor"
 *   3. id-suffix         — все id оканчиваются на -d/-l (или собраны через `${dark ? 'd' : 'l'}`)
 *   4. tabular-nums      — у <text> с цифрами есть className="tabular-nums"
 *   5. no-transparent    — нет stopColor="transparent"
 *   6. dual-render       — default export = <><Inner dark={false} className="dark:hidden" /><Inner dark={true} className="hidden dark:block" /></>
 *
 * Возвращает структурированные ошибки — repair-loop этапа 4 закинет их в LLM,
 * чтобы тот починил конкретные нарушения.
 */

// ESM/CJS interop: @babel/traverse экспортит default в CJS, корень в ESM
const traverse = (_traverse as unknown as { default?: typeof _traverse }).default ?? _traverse;

export interface IllustrationValidationError {
  rule:
    | 'parse'
    | 'root-svg'
    | 'dark-prop-colors'
    | 'id-suffix'
    | 'tabular-nums'
    | 'no-transparent'
    | 'dual-render';
  message: string;
  loc?: { line: number; column: number };
}

export interface IllustrationValidationResult {
  ok: boolean;
  errors: IllustrationValidationError[];
}

const COLOR_ATTRS = new Set(['fill', 'stroke', 'stopColor', 'floodColor']);
const COLOR_AGNOSTIC = new Set(['none', 'currentColor', 'inherit']);

function locOf(node: t.Node): { line: number; column: number } | undefined {
  if (!node.loc) return undefined;
  return { line: node.loc.start.line, column: node.loc.start.column };
}

function jsxAttrName(attr: t.JSXAttribute): string {
  if (t.isJSXIdentifier(attr.name)) return attr.name.name;
  return `${attr.name.namespace.name}:${attr.name.name.name}`;
}

function isDarkTernary(expr: t.Expression): boolean {
  if (t.isConditionalExpression(expr) && t.isIdentifier(expr.test, { name: 'dark' })) {
    return true;
  }
  if (t.isTemplateLiteral(expr)) {
    return expr.expressions.some((e) => t.isExpression(e) && isDarkTernary(e));
  }
  return false;
}

function isUrlRef(expr: t.Expression): boolean {
  if (t.isStringLiteral(expr)) return /^url\(#.+\)$/.test(expr.value);
  if (t.isTemplateLiteral(expr)) {
    const raw = expr.quasis.map((q) => q.value.cooked ?? '').join('');
    return /^url\(#/.test(raw);
  }
  return false;
}

function endsWithDarkSuffix(expr: t.Expression): boolean {
  if (t.isStringLiteral(expr)) {
    return /-(d|l)$/.test(expr.value);
  }
  if (t.isTemplateLiteral(expr)) {
    // Ожидаем шаблон вида: `prefix-${dark ? 'd' : 'l'}` — последний quasi пустой,
    // последний expression — dark-ternary с consequent='d' и alternate='l'.
    const last = expr.expressions[expr.expressions.length - 1];
    if (!last || !t.isExpression(last)) return false;
    if (
      t.isConditionalExpression(last) &&
      t.isIdentifier(last.test, { name: 'dark' }) &&
      isShortDLString(last.consequent) &&
      isShortDLString(last.alternate)
    ) {
      return true;
    }
  }
  return false;
}

function isShortDLString(node: t.Node): boolean {
  if (!t.isStringLiteral(node)) return false;
  return node.value === 'd' || node.value === 'l';
}

function getStringAttrValue(attr: t.JSXAttribute): string | null {
  if (!attr.value) return null;
  if (t.isStringLiteral(attr.value)) return attr.value.value;
  if (t.isJSXExpressionContainer(attr.value) && t.isStringLiteral(attr.value.expression)) {
    return attr.value.expression.value;
  }
  return null;
}

function jsxElementName(node: t.JSXElement): string {
  const open = node.openingElement.name;
  if (t.isJSXIdentifier(open)) return open.name;
  if (t.isJSXMemberExpression(open)) return 'member';
  return 'namespaced';
}

function findAttr(el: t.JSXElement, name: string): t.JSXAttribute | undefined {
  for (const attr of el.openingElement.attributes) {
    if (t.isJSXAttribute(attr) && jsxAttrName(attr) === name) return attr;
  }
  return undefined;
}

function classNameContains(attr: t.JSXAttribute | undefined, token: string): boolean {
  if (!attr) return false;
  const raw = getStringAttrValue(attr);
  if (raw === null) {
    // Допустим выражение со строковым литералом внутри — попытка
    if (
      attr.value &&
      t.isJSXExpressionContainer(attr.value) &&
      t.isStringLiteral(attr.value.expression)
    ) {
      return attr.value.expression.value.split(/\s+/).includes(token);
    }
    return false;
  }
  return raw.split(/\s+/).includes(token);
}

function containsDigits(node: t.JSXText | t.JSXExpressionContainer | t.JSXElement | t.JSXFragment | t.JSXSpreadChild): boolean {
  if (t.isJSXText(node)) return /\d/.test(node.value);
  if (t.isJSXExpressionContainer(node)) {
    const e = node.expression;
    if (t.isStringLiteral(e)) return /\d/.test(e.value);
    if (t.isNumericLiteral(e)) return true;
    if (t.isTemplateLiteral(e)) {
      const raw = e.quasis.map((q) => q.value.cooked ?? '').join('');
      return /\d/.test(raw);
    }
  }
  return false;
}

function getReturnedJSX(fn: t.Function): t.JSXElement | t.JSXFragment | null {
  // Поддерживаем `return (<>...</>)` и `=> <>...</>`.
  if (t.isBlockStatement(fn.body)) {
    for (const stmt of fn.body.body) {
      if (t.isReturnStatement(stmt) && stmt.argument) {
        if (t.isJSXElement(stmt.argument) || t.isJSXFragment(stmt.argument)) return stmt.argument;
      }
    }
    return null;
  }
  // ArrowFunctionExpression со выражением
  if (t.isJSXElement(fn.body) || t.isJSXFragment(fn.body)) return fn.body;
  return null;
}

export function validateIllustrationTSX(source: string): IllustrationValidationResult {
  const errors: IllustrationValidationError[] = [];

  let ast: t.File;
  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
      errorRecovery: false,
    });
  } catch (err) {
    return {
      ok: false,
      errors: [
        {
          rule: 'parse',
          message: `TSX parse failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }

  let innerFn: t.Function | undefined;
  let defaultExportFn: t.Function | undefined;

  traverse(ast, {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.id?.name === 'Inner') innerFn = path.node;
    },
    VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
      if (
        t.isIdentifier(path.node.id, { name: 'Inner' }) &&
        path.node.init &&
        (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init))
      ) {
        innerFn = path.node.init;
      }
    },
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      const decl = path.node.declaration;
      if (t.isFunctionDeclaration(decl) || t.isArrowFunctionExpression(decl) || t.isFunctionExpression(decl)) {
        defaultExportFn = decl;
      }
    },
  });

  /* ─── 1. root-svg ─────────────────────────────────────────────────── */
  if (!innerFn) {
    errors.push({
      rule: 'root-svg',
      message: 'Не найдена функция `Inner` — она обязательна по контракту скилла.',
    });
  } else {
    const returned = getReturnedJSX(innerFn);
    if (!returned) {
      errors.push({ rule: 'root-svg', message: 'Inner ничего не возвращает (нет JSX).', loc: locOf(innerFn) });
    } else if (t.isJSXFragment(returned)) {
      errors.push({
        rule: 'root-svg',
        message: 'Inner возвращает фрагмент, ожидался единственный root <svg>.',
        loc: locOf(returned),
      });
    } else if (jsxElementName(returned) !== 'svg') {
      errors.push({
        rule: 'root-svg',
        message: `Корневой элемент Inner — <${jsxElementName(returned)}>, ожидался <svg>.`,
        loc: locOf(returned),
      });
    }
  }

  /* ─── 2/3/4/5. атрибутные правила — обход всех JSX в Inner ────────── */
  if (innerFn) {
    traverse(
      ast,
      {
        JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
          const tagName = t.isJSXIdentifier(path.node.name) ? path.node.name.name : null;
          for (const attr of path.node.attributes) {
            if (!t.isJSXAttribute(attr)) continue;
            const name = jsxAttrName(attr);

            // rule 5: no stopColor="transparent"
            if (name === 'stopColor') {
              const raw = getStringAttrValue(attr);
              if (raw && raw.toLowerCase() === 'transparent') {
                errors.push({
                  rule: 'no-transparent',
                  message: 'stopColor="transparent" запрещён — используй stopOpacity={0} на цветном стопе.',
                  loc: locOf(attr),
                });
              }
            }

            // rule 2: colors via dark
            if (COLOR_ATTRS.has(name) && attr.value) {
              if (t.isStringLiteral(attr.value)) {
                if (!COLOR_AGNOSTIC.has(attr.value.value)) {
                  errors.push({
                    rule: 'dark-prop-colors',
                    message: `Атрибут ${name}="${attr.value.value}" — литерал. Используй {dark ? '#xxx' : '#yyy'} или "currentColor"/"none".`,
                    loc: locOf(attr),
                  });
                }
              } else if (t.isJSXExpressionContainer(attr.value)) {
                const expr = attr.value.expression;
                if (t.isExpression(expr)) {
                  if (!isDarkTernary(expr) && !isUrlRef(expr)) {
                    errors.push({
                      rule: 'dark-prop-colors',
                      message: `Атрибут ${name} не проходит через dark-тернарник. Заверни в {dark ? ... : ...}.`,
                      loc: locOf(attr),
                    });
                  }
                }
              }
            }

            // rule 3: id suffix -d/-l
            if (name === 'id' && attr.value) {
              if (t.isStringLiteral(attr.value)) {
                if (!/-(d|l)$/.test(attr.value.value)) {
                  errors.push({
                    rule: 'id-suffix',
                    message: `id="${attr.value.value}" должен оканчиваться на -d или -l (DOM-уникальность для dual-render).`,
                    loc: locOf(attr),
                  });
                }
              } else if (t.isJSXExpressionContainer(attr.value) && t.isExpression(attr.value.expression)) {
                if (!endsWithDarkSuffix(attr.value.expression)) {
                  errors.push({
                    rule: 'id-suffix',
                    message: `id=… не оканчивается на \`-\${dark ? 'd' : 'l'}\`.`,
                    loc: locOf(attr),
                  });
                }
              }
            }
          }

          // rule 4: <text> с цифрами требует className="tabular-nums"
          if (tagName === 'text') {
            // Поднимемся до JSXElement, чтобы посмотреть children
            const parentEl = path.parent as t.JSXElement;
            if (parentEl && Array.isArray(parentEl.children)) {
              const hasDigit = parentEl.children.some((c) => containsDigits(c));
              if (hasDigit) {
                const classAttr = findAttr(parentEl, 'className');
                if (!classNameContains(classAttr, 'tabular-nums')) {
                  // Запасной вариант: style={{ fontVariantNumeric: 'tabular-nums' }}
                  const styleAttr = findAttr(parentEl, 'style');
                  let viaStyle = false;
                  if (
                    styleAttr &&
                    styleAttr.value &&
                    t.isJSXExpressionContainer(styleAttr.value) &&
                    t.isObjectExpression(styleAttr.value.expression)
                  ) {
                    viaStyle = styleAttr.value.expression.properties.some((p) => {
                      if (!t.isObjectProperty(p)) return false;
                      const keyOk =
                        (t.isIdentifier(p.key) && p.key.name === 'fontVariantNumeric') ||
                        (t.isStringLiteral(p.key) && p.key.value === 'fontVariantNumeric');
                      const valOk = t.isStringLiteral(p.value) && p.value.value === 'tabular-nums';
                      return keyOk && valOk;
                    });
                  }
                  if (!viaStyle) {
                    errors.push({
                      rule: 'tabular-nums',
                      message: '<text> с цифрами без className="tabular-nums" (или style.fontVariantNumeric).',
                      loc: locOf(parentEl),
                    });
                  }
                }
              }
            }
          }
        },
      },
      undefined,
    );
  }

  /* ─── 6. dual-render ──────────────────────────────────────────────── */
  if (!defaultExportFn) {
    errors.push({
      rule: 'dual-render',
      message: 'Нет default export — ожидается функция, возвращающая dual-render фрагмент.',
    });
  } else {
    const returned = getReturnedJSX(defaultExportFn);
    if (!returned || !t.isJSXFragment(returned)) {
      errors.push({
        rule: 'dual-render',
        message: 'Default export должен возвращать фрагмент <>…</> с двумя <Inner /> детьми.',
        loc: returned ? locOf(returned) : locOf(defaultExportFn),
      });
    } else {
      const children = returned.children.filter((c) => t.isJSXElement(c)) as t.JSXElement[];
      if (children.length !== 2) {
        errors.push({
          rule: 'dual-render',
          message: `Фрагмент содержит ${children.length} JSX-детей, ожидалось ровно 2 <Inner />.`,
          loc: locOf(returned),
        });
      } else {
        const innerPair = children.every((c) => jsxElementName(c) === 'Inner');
        if (!innerPair) {
          errors.push({
            rule: 'dual-render',
            message: 'Оба ребёнка фрагмента должны быть <Inner />.',
            loc: locOf(returned),
          });
        } else {
          const a = children[0]!;
          const b = children[1]!;
          const aClass = classNameContains(findAttr(a, 'className'), 'dark:hidden');
          const bClass =
            classNameContains(findAttr(b, 'className'), 'hidden') &&
            classNameContains(findAttr(b, 'className'), 'dark:block');
          const aDarkAttr = findAttr(a, 'dark');
          const bDarkAttr = findAttr(b, 'dark');
          const aDarkFalse =
            !!aDarkAttr &&
            !!aDarkAttr.value &&
            t.isJSXExpressionContainer(aDarkAttr.value) &&
            t.isBooleanLiteral(aDarkAttr.value.expression, { value: false });
          const bDarkTrue =
            !!bDarkAttr &&
            !!bDarkAttr.value &&
            t.isJSXExpressionContainer(bDarkAttr.value) &&
            t.isBooleanLiteral(bDarkAttr.value.expression, { value: true });
          if (!aClass || !aDarkFalse) {
            errors.push({
              rule: 'dual-render',
              message: 'Первый <Inner /> должен иметь dark={false} и className содержащий "dark:hidden".',
              loc: locOf(a),
            });
          }
          if (!bClass || !bDarkTrue) {
            errors.push({
              rule: 'dual-render',
              message: 'Второй <Inner /> должен иметь dark={true} и className содержащий "hidden dark:block".',
              loc: locOf(b),
            });
          }
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function formatErrors(result: IllustrationValidationResult): string {
  if (result.ok) return 'OK';
  return result.errors
    .map((e) => `  [${e.rule}] ${e.message}${e.loc ? ` (line ${e.loc.line})` : ''}`)
    .join('\n');
}
