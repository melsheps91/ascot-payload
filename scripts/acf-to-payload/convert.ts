import { call, comment, Comment, raw, serialize } from './serialize'

export type AcfField = {
  key: string
  label: string
  name: string
  type: string
  [prop: string]: any
}

export type AcfGroup = {
  key: string
  title: string
  fields: AcfField[]
  location?: { param: string; operator: string; value: string }[][]
}

export type Kind = 'block' | 'global'

export type ConvertOptions = {
  as?: Kind
  stripPrefix?: boolean
  // Collection slugs that exist in Payload; relationship fields to anything else become TODOs.
  collections?: string[]
}

export type Converted = {
  kind: Kind
  title: string
  groupKey: string
  exportName: string
  slug: string
  interfaceName?: string
  kebab: string
  source: string
  warnings: string[]
}

type Rule = { field: string; operator: string; value?: string }

// What a conditional-logic rule needs to know about the field it references.
type Ref = {
  name: string
  level: string
  kind: 'checkbox' | 'toggle' | 'choice' | 'multi' | 'value'
  on?: string
  off?: string
}

type Ctx = {
  level: string
  // Level of the nearest enclosing block (readable as `blockData`), or null.
  blockLevel: string | null
  // Level readable as `data`: the document root, only outside nested blocks.
  dataLevel: string | null
  path: string
}

const RESERVED = new Set(['id', 'blockName', 'blockType'])

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
}

const POST_TYPE_COLLECTIONS: Record<string, string> = { page: 'pages', post: 'posts' }

const words = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())

export const toCamel = (value: string) => {
  const camel = words(value)
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join('')
  return /^\d/.test(camel) ? `_${camel}` : camel
}

export const toPascal = (value: string) => {
  const camel = toCamel(value).replace(/^_/, '')
  return camel[0].toUpperCase() + camel.slice(1)
}

export const toKebab = (value: string) => words(value).join('-')

const truthy = (value: unknown) => value === 1 || value === '1' || value === true

const isLayoutOnly = (field: AcfField) => ['tab', 'message', 'accordion'].includes(field.type)

// Longest shared `word_` prefix across the top-level field names, e.g. `banner_`.
export function commonPrefix(fields: AcfField[]): string {
  const names = fields.filter((f) => !isLayoutOnly(f) && f.name).map((f) => f.name)
  if (names.length < 2) return ''
  let prefix = names[0].slice(0, names[0].lastIndexOf('_') + 1)
  while (prefix && !names.every((n) => n.startsWith(prefix) && n.length > prefix.length)) {
    prefix = prefix.slice(0, prefix.slice(0, -1).lastIndexOf('_') + 1)
  }
  return prefix
}

export function detectKind(group: AcfGroup): Kind {
  const params = (group.location ?? []).flat().map((rule) => rule.param)
  return params.length > 0 && params.every((p) => p === 'options_page') ? 'global' : 'block'
}

export function convertGroup(group: AcfGroup, options: ConvertOptions = {}): Converted {
  const kind = options.as ?? detectKind(group)
  const collections = new Set(options.collections ?? [])
  const warnings: string[] = []

  const nonTemplateTargets = (group.location ?? [])
    .flat()
    .filter((rule) => !['page_template', 'post_template', 'options_page'].includes(rule.param))
    .filter((rule) => !(rule.param === 'post_type' && rule.value === 'page'))
    .map((rule) => `${rule.param} ${rule.value}`)
  if (kind === 'block' && nonTemplateTargets.length) {
    warnings.push(
      `ACF attaches this group to ${[...new Set(nonTemplateTargets)].join(', ')}; it may belong on a collection rather than as a page block`,
    )
  }
  const refs = new Map<string, Ref>()
  const prefix = options.stripPrefix === false ? '' : commonPrefix(group.fields)
  let usesLink = false

  const exportName = toPascal(group.title)
  const slug = toCamel(group.title)

  const fieldName = (field: AcfField, level: string) => {
    let name = toCamel(level === 'root' && prefix ? field.name.slice(prefix.length) : field.name)
    if (RESERVED.has(name)) {
      warnings.push(`${field.name}: "${name}" is reserved by Payload, renamed to "${name}Field"`)
      name = `${name}Field`
    }
    return name
  }

  const toggleValues = (field: AcfField) => {
    if (!field.ui_on_text || !field.ui_off_text) return null
    const on = toCamel(field.ui_on_text)
    const off = toCamel(field.ui_off_text)
    return on && off && on !== off ? { on, off } : null
  }

  // Pass 1: record the Payload name and level of every field so conditions can find them.
  const register = (fields: AcfField[], level: string) => {
    for (const field of fields) {
      if (isLayoutOnly(field)) continue
      const toggle = field.type === 'true_false' ? toggleValues(field) : null
      const kindOf = (): Ref['kind'] => {
        if (toggle) return 'toggle'
        if (field.type === 'true_false') return 'checkbox'
        if (field.type === 'checkbox' || (field.type === 'select' && truthy(field.multiple)))
          return 'multi'
        if (['select', 'radio', 'button_group'].includes(field.type)) return 'choice'
        return 'value'
      }
      refs.set(field.key, { name: fieldName(field, level), level, kind: kindOf(), ...toggle })
      if (field.type === 'repeater' || field.type === 'group') {
        register(field.sub_fields ?? [], field.key)
      }
      if (field.type === 'flexible_content') {
        for (const layout of layoutsOf(field)) register(layout.sub_fields ?? [], layout.key)
      }
    }
  }
  register(group.fields, 'root')

  const conditionFor = (field: AcfField, ctx: Ctx) => {
    const logic = field.conditional_logic
    if (!Array.isArray(logic) || logic.length === 0) return undefined

    const used = { data: false, siblingData: false, blockData: false }
    const ruleExpr = (rule: Rule): string | null => {
      const ref = refs.get(rule.field)
      if (!ref) {
        warnings.push(`${ctx.path}${field.name}: condition references unknown field ${rule.field}`)
        return null
      }
      let source: keyof typeof used
      if (ref.level === ctx.level) source = 'siblingData'
      else if (ref.level === ctx.blockLevel) source = 'blockData'
      else if (ref.level === ctx.dataLevel) source = 'data'
      else {
        warnings.push(
          `${ctx.path}${field.name}: condition on "${ref.name}" crosses nesting levels, left out`,
        )
        return null
      }
      used[source] = true
      const value = `${source}?.${ref.name}`
      const expected = rule.value ?? ''
      const compare = (negate: boolean) => {
        const eq = negate ? '!==' : '==='
        switch (ref.kind) {
          case 'checkbox':
            return truthy(expected) !== negate ? `Boolean(${value})` : `!${value}`
          case 'toggle':
            return `${value} ${eq} ${serialize(truthy(expected) ? ref.on : ref.off)}`
          case 'multi':
            return `${negate ? '!' : ''}(${value} ?? []).includes(${serialize(expected)})`
          case 'choice':
            return `${value} ${eq} ${serialize(expected)}`
          default:
            return `String(${value} ?? '') ${eq} ${serialize(expected)}`
        }
      }
      const empty = `(Array.isArray(${value}) ? ${value}.length === 0 : !${value})`
      switch (rule.operator) {
        case '==':
          return compare(false)
        case '!=':
          return compare(true)
        case '==empty':
          return empty
        case '!=empty':
          return `!${empty}`
        case '==contains':
          return `String(${value} ?? '').includes(${serialize(expected)})`
        case '==pattern':
          return `new RegExp(${serialize(expected)}).test(String(${value} ?? ''))`
        default:
          warnings.push(`${ctx.path}${field.name}: condition operator ${rule.operator} not supported`)
          return null
      }
    }

    const groups = (logic as Rule[][])
      .map((rules) => rules.map(ruleExpr))
      .filter((exprs) => exprs.every((e) => e !== null)) as string[][]
    if (groups.length === 0) return undefined

    const body = groups
      .map((exprs) => {
        const joined = exprs.join(' && ')
        return groups.length > 1 && exprs.length > 1 ? `(${joined})` : joined
      })
      .join(' || ')
    const params = [used.data ? 'data' : '_data', used.siblingData ? 'siblingData' : '_siblingData']
    if (used.blockData) params.push('{ blockData }')
    return raw(`(${params.join(', ')}) => ${body}`)
  }

  const relationTargets = (field: AcfField, fallback: string) => {
    const postTypes: string[] = [].concat(field.post_type || [])
    const targets = (postTypes.length ? postTypes : [fallback]).map(
      (type) => POST_TYPE_COLLECTIONS[type] ?? type,
    )
    const missing = targets.filter((t) => !collections.has(t))
    return { targets, missing }
  }

  const convertField = (field: AcfField, ctx: Ctx): object | Comment | null => {
    const name = refs.get(field.key)!.name
    const condition = conditionFor(field, ctx)
    const admin = condition ? { condition } : undefined
    const required = truthy(field.required) || undefined
    const base = { name, label: field.label || undefined, required }
    const todo = (reason: string) => {
      warnings.push(`${ctx.path}${field.name}: ${reason}`)
      return comment(`TODO ${field.name} (${field.type}): ${reason}`)
    }
    const childCtx = (level: string, segment: string): Ctx => ({
      ...ctx,
      level,
      path: `${ctx.path}${segment}.`,
    })

    switch (field.type) {
      case 'text':
      case 'password':
      case 'url':
      case 'oembed':
      case 'color_picker':
        return { ...base, type: 'text', maxLength: Number(field.maxlength) || undefined, admin }
      case 'textarea':
        return { ...base, type: 'textarea', admin }
      case 'wysiwyg':
        return { ...base, type: 'richText', admin }
      case 'email':
        return { ...base, type: 'email', admin }
      case 'number':
      case 'range': {
        const num = (v: unknown) => (v === '' || v === undefined ? undefined : Number(v))
        return { ...base, type: 'number', min: num(field.min), max: num(field.max), admin }
      }
      case 'link':
        usesLink = true
        return call('link', { name, label: field.label || undefined, required, admin })
      case 'image':
        return { ...base, type: 'upload', relationTo: 'media', admin }
      case 'gallery':
        return {
          ...base,
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          minRows: Number(field.min) || undefined,
          maxRows: Number(field.max) || undefined,
          admin,
        }
      case 'file': {
        const mimeTypes = String(field.mime_types ?? '')
          .split(',')
          .map((ext) => MIME_TYPES[ext.trim().replace(/^\./, '').toLowerCase()])
          .filter(Boolean)
        return {
          ...base,
          type: 'upload',
          relationTo: 'media',
          filterOptions: mimeTypes.length ? { mimeType: { in: mimeTypes } } : undefined,
          admin,
        }
      }
      case 'true_false': {
        const ref = refs.get(field.key)!
        if (ref.kind === 'toggle') {
          return {
            ...base,
            type: 'radio',
            options: [
              { label: field.ui_on_text, value: ref.on },
              { label: field.ui_off_text, value: ref.off },
            ],
            defaultValue: truthy(field.default_value) ? ref.on : ref.off,
            admin: { ...admin, layout: 'horizontal' },
          }
        }
        return { ...base, type: 'checkbox', defaultValue: truthy(field.default_value), admin }
      }
      case 'select':
      case 'checkbox':
      case 'radio':
      case 'button_group': {
        const choices = field.choices ?? {}
        const opts = Array.isArray(choices)
          ? choices.map((c) => ({ label: String(c), value: String(c) }))
          : Object.entries(choices).map(([value, label]) => ({ label: String(label), value }))
        const hasMany = field.type === 'checkbox' || truthy(field.multiple)
        const defaults = [].concat(field.default_value ?? []).filter((v) => v !== '' && v !== false)
        return {
          ...base,
          type: hasMany || field.type === 'select' ? 'select' : 'radio',
          hasMany: hasMany || undefined,
          options: opts,
          defaultValue: hasMany ? (defaults.length ? defaults : undefined) : defaults[0],
          admin,
        }
      }
      case 'date_picker':
      case 'date_time_picker':
      case 'time_picker': {
        const pickerAppearance = {
          date_picker: 'dayOnly',
          date_time_picker: 'dayAndTime',
          time_picker: 'timeOnly',
        }[field.type as 'date_picker']
        return { ...base, type: 'date', admin: { ...admin, date: { pickerAppearance } } }
      }
      case 'post_object':
      case 'relationship':
      case 'page_link': {
        const { targets, missing } = relationTargets(field, 'page')
        if (missing.length) {
          return todo(`needs Payload collection(s) ${missing.join(', ')}; create them and re-run`)
        }
        return {
          ...base,
          type: 'relationship',
          relationTo: targets.length === 1 ? targets[0] : targets,
          hasMany: field.type === 'relationship' || truthy(field.multiple) || undefined,
          admin,
        }
      }
      case 'user':
        return {
          ...base,
          type: 'relationship',
          relationTo: 'users',
          hasMany: truthy(field.multiple) || undefined,
          admin,
        }
      case 'repeater':
        return {
          ...base,
          type: 'array',
          minRows: Number(field.min) || undefined,
          maxRows: Number(field.max) || undefined,
          admin,
          fields: convertFields(field.sub_fields ?? [], childCtx(field.key, name)),
        }
      case 'group':
        return {
          ...base,
          type: 'group',
          admin,
          fields: convertFields(field.sub_fields ?? [], childCtx(field.key, name)),
        }
      case 'flexible_content':
        return {
          ...base,
          type: 'blocks',
          minRows: Number(field.min) || undefined,
          maxRows: Number(field.max) || undefined,
          admin,
          blocks: layoutsOf(field).map((layout) => ({
            slug: toCamel(layout.name),
            labels: { singular: layout.label, plural: layout.label },
            fields: convertFields(layout.sub_fields ?? [], {
              level: layout.key,
              blockLevel: layout.key,
              dataLevel: null,
              path: `${ctx.path}${name}.${layout.name}.`,
            }),
          })),
        }
      default:
        return todo(`no Payload equivalent is mapped for this field type`)
    }
  }

  // ACF tabs are flat markers; Payload nests the fields under a `tabs` field.
  function convertFields(fields: AcfField[], ctx: Ctx): (object | Comment)[] {
    const out: (object | Comment)[] = []
    let tabs: { label: string; fields: (object | Comment)[] }[] | null = null

    for (const field of fields) {
      if (field.type === 'tab') {
        if (!tabs) {
          tabs = []
          out.push({ type: 'tabs', tabs })
        }
        tabs.push({ label: field.label || `Tab ${tabs.length + 1}`, fields: [] })
        continue
      }
      if (field.type === 'message' || field.type === 'accordion') {
        warnings.push(`${ctx.path}${field.label}: ${field.type} fields are layout-only, skipped`)
        continue
      }
      const converted = convertField(field, ctx)
      if (converted) (tabs ? tabs[tabs.length - 1].fields : out).push(converted)
    }
    return out
  }

  const fields = convertFields(group.fields, {
    level: 'root',
    blockLevel: kind === 'block' ? 'root' : null,
    dataLevel: kind === 'global' ? 'root' : null,
    path: '',
  })

  const origin = `Generated from ACF group "${group.title}" (${group.key}) by scripts/acf-to-payload.`
  const imports = [
    `import type { ${kind === 'block' ? 'Block' : 'GlobalConfig'} } from 'payload'`,
    ...(usesLink ? ['', "import { link } from '../fields/link'"] : []),
  ]
  const plural = /s$/i.test(group.title) ? group.title : `${group.title}s`
  const interfaceName = kind === 'block' ? `${exportName}Block` : undefined

  const config =
    kind === 'block'
      ? {
          slug,
          interfaceName,
          labels: { singular: group.title, plural },
          fields,
        }
      : {
          slug,
          label: group.title,
          access: { read: raw('() => true') },
          fields,
        }

  const type = kind === 'block' ? 'Block' : 'GlobalConfig'
  const source = `${imports.join('\n')}

// ${origin}
export const ${exportName}: ${type} = ${serialize(config)}
`

  return {
    kind,
    title: group.title,
    groupKey: group.key,
    exportName,
    slug,
    interfaceName,
    kebab: toKebab(group.title),
    source,
    warnings,
  }
}

function layoutsOf(field: AcfField): { key: string; name: string; label: string; sub_fields?: AcfField[] }[] {
  const layouts = field.layouts ?? []
  return Array.isArray(layouts) ? layouts : Object.values(layouts)
}
