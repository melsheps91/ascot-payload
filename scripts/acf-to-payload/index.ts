import fs from 'fs'
import path from 'path'

import type { Kind } from './convert'
import {
  generateTypes,
  importGroup,
  jsonFilesIn,
  planImport,
  projectPaths,
  readGroups,
} from './importer'

const USAGE = `Convert ACF field group JSON into Payload blocks (or globals).

Usage: npm run acf:import -- [files or folders...] [options]

With no paths, every .json file in acf-import/ is converted.
The same importer runs in the browser at /admin/acf-import while \`npm run dev\` is up.

Options:
  --as block|global   Force the output type (default: options pages become globals, everything else blocks)
  --force             Overwrite generated files that already exist
  --no-strip          Keep the shared field-name prefix (e.g. banner_heading -> bannerHeading)
  --no-frontend       Don't create component stubs or add cases to the page renderer
  --no-types          Don't run payload generate:types afterwards
  --dry-run           Print the generated source without writing anything
`

const root = process.cwd()
const paths = projectPaths(root)

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function parseArgs(argv: string[]) {
  const args = {
    inputs: [] as string[],
    as: undefined as Kind | undefined,
    force: false,
    strip: true,
    frontend: true,
    types: true,
    dryRun: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      console.log(USAGE)
      process.exit(0)
    } else if (arg === '--as') {
      const value = argv[++i]
      if (value !== 'block' && value !== 'global') fail(`--as must be "block" or "global"`)
      args.as = value
    } else if (arg === '--force') args.force = true
    else if (arg === '--no-strip') args.strip = false
    else if (arg === '--no-frontend') args.frontend = false
    else if (arg === '--no-types') args.types = false
    else if (arg === '--dry-run') args.dryRun = true
    else if (arg.startsWith('--')) fail(`Unknown option ${arg}\n\n${USAGE}`)
    else args.inputs.push(arg)
  }
  return args
}

function jsonFiles(inputs: string[]) {
  return (inputs.length ? inputs : [paths.inbox]).flatMap((target) => {
    const resolved = path.resolve(target)
    if (!fs.existsSync(resolved)) fail(`Not found: ${target}`)
    return fs.statSync(resolved).isDirectory() ? jsonFilesIn(resolved) : [resolved]
  })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const files = jsonFiles(args.inputs)
  if (files.length === 0) {
    fail(`No .json files found. Put ACF exports in ${path.relative(root, paths.inbox)}/ or pass paths.`)
  }

  const options = { as: args.as, force: args.force, strip: args.strip, frontend: args.frontend }
  let written = 0
  let problems = 0

  for (const file of files) {
    const groups = readGroups(file)
    if (groups.length === 0) console.warn(`\nSkipping ${path.basename(file)}: not an ACF field group`)

    for (const group of groups) {
      if (args.dryRun) {
        const plan = await planImport(group, root, options)
        console.log(`\n${group.title}  (${path.basename(file)}) -> ${plan.result.kind} "${plan.result.slug}"`)
        console.log(`\n--- ${path.relative(root, plan.target)}\n${plan.source}`)
        for (const warning of plan.result.warnings) console.log(`  warning: ${warning}`)
        continue
      }

      const report = await importGroup(group, root, options)
      console.log(`\n${group.title}  (${path.basename(file)}) -> ${report.kind} "${report.slug}"`)
      if (report.outcome === 'skipped') {
        console.log(`  skipped: ${report.target} already exists (use --force to overwrite)`)
      } else {
        written++
        for (const note of report.notes) console.log(`  ${note}`)
      }
      for (const problem of report.problems) console.log(`  ! ${problem}`)
      for (const warning of report.warnings) console.log(`  warning: ${warning}`)
      problems += report.problems.length
    }
  }

  if (written > 0 && args.types) {
    console.log('\nRegenerating src/payload-types.ts...')
    const types = await generateTypes(root)
    console.log(types.output.trim())
    if (!types.ok) problems++
  }

  if (written > 0) {
    console.log(
      '\nNext `npm run dev` will add the new tables to ascot-payload.db. Back it up first if you used --force.',
    )
  }
  if (problems > 0) process.exit(1)
}

main().catch((error) => fail(error instanceof Error ? (error.stack ?? error.message) : String(error)))
