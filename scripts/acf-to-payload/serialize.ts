// Emits JS object literals as TypeScript source. Raw values print verbatim, Call values
// as `fn({...})`, and Comment array entries as `// text` lines.

export class Raw {
  constructor(public code: string) {}
}

export class Comment {
  constructor(public text: string) {}
}

export class Call {
  constructor(
    public fn: string,
    public arg: unknown,
  ) {}
}

export const raw = (code: string) => new Raw(code)
export const comment = (text: string) => new Comment(text)
export const call = (fn: string, arg: unknown) => new Call(fn, arg)

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

const quote = (value: string) =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`

export function serialize(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent + 1)
  const end = '  '.repeat(indent)

  if (value instanceof Raw) return value.code
  if (value instanceof Call) return `${value.fn}(${serialize(value.arg, indent)})`
  if (typeof value === 'string') return quote(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) =>
      item instanceof Comment ? `${pad}// ${item.text}` : `${pad}${serialize(item, indent + 1)},`,
    )
    return `[\n${items.join('\n')}\n${end}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined,
    )
    if (entries.length === 0) return '{}'
    const lines = entries.map(([key, v]) => {
      const printedKey = IDENTIFIER.test(key) ? key : quote(key)
      return `${pad}${printedKey}: ${serialize(v, indent + 1)},`
    })
    return `{\n${lines.join('\n')}\n${end}}`
  }

  throw new Error(`Cannot serialize value of type ${typeof value}`)
}
