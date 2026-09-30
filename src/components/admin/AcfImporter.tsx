'use client'

import { Button, CheckboxInput, useConfig } from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { AcfGroup } from '../../../scripts/acf-to-payload/convert'
import type { ImportReport } from '../../../scripts/acf-to-payload/importer'
import type { SourceItem, SourceSummary } from '../../endpoints/acfImport'

import './AcfImporter.scss'

type Status = SourceSummary['status']

type Row = {
  id: string
  origin: 'upload' | 'theme' | 'inbox'
  file: string
  title: string
  kind?: 'block' | 'global'
  slug?: string
  status?: Status
  warnings: string[]
  group?: AcfGroup
}

type Preview = {
  title: string
  kind: 'block' | 'global'
  slug: string
  target: string
  status: Status
  source: string
  warnings: string[]
}

type RunResult = { reports: ImportReport[]; types: { ok: boolean; output: string } | null }

const baseClass = 'acf-importer'

const STATUS_LABELS: Record<Status, string> = {
  new: 'New',
  imported: 'Imported',
  'name-taken': 'Name taken',
}

const STATUS_HINTS: Record<Status, string> = {
  new: 'Not in Payload yet',
  imported: 'Already generated from this ACF group',
  'name-taken': 'A hand-built file with this name exists',
}

const ORIGIN_HEADINGS: Record<Row['origin'], string> = {
  upload: 'Uploaded files',
  theme: 'CleanBuildPro theme',
  inbox: 'acf-import/ folder',
}

const toItem = (row: Row): SourceItem => (row.group ? { group: row.group } : { id: row.id })

export function AcfImporter({ enabled }: { enabled: boolean }) {
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const endpoint = `${api}/acf-import`

  const [rows, setRows] = useState<Row[]>([])
  const [dirs, setDirs] = useState<{ themeDir: string; inboxDir: string } | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState('')
  const [force, setForce] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState<'load' | 'preview' | 'run' | null>('load')
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<Preview[] | null>(null)
  const [result, setResult] = useState<RunResult | null>(null)
  const [dragging, setDragging] = useState(false)

  const request = useCallback(
    async <T,>(path: string, body?: unknown): Promise<T> => {
      const response = await fetch(`${endpoint}${path}`, {
        method: body ? 'POST' : 'GET',
        credentials: 'include',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`)
      return data as T
    },
    [endpoint],
  )

  const loadSources = useCallback(async () => {
    setBusy('load')
    try {
      const data = await request<{ sources: SourceSummary[]; themeDir: string; inboxDir: string }>('')
      setDirs({ themeDir: data.themeDir, inboxDir: data.inboxDir })
      setRows((current) => [
        ...current.filter((row) => row.origin === 'upload'),
        ...data.sources.map((s) => ({ ...s })),
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }, [request])

  useEffect(() => {
    if (enabled) void loadSources()
  }, [enabled, loadSources])

  // Parse uploads in the browser, then ask the server what each group would become.
  const addFiles = async (files: FileList | File[]) => {
    setError(null)
    const uploaded: Row[] = []
    const failed: string[] = []
    for (const file of Array.from(files)) {
      try {
        const parsed = JSON.parse(await file.text())
        const groups = (Array.isArray(parsed) ? parsed : [parsed]).filter(
          (g): g is AcfGroup => g && typeof g.title === 'string' && Array.isArray(g.fields),
        )
        if (groups.length === 0) throw new Error('not an ACF field group')
        groups.forEach((group, index) =>
          uploaded.push({
            id: `upload:${file.name}#${index}:${Date.now()}`,
            origin: 'upload',
            file: file.name,
            title: group.title,
            warnings: [],
            group,
          }),
        )
      } catch (e) {
        failed.push(`${file.name}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    if (failed.length) setError(`Couldn't read ${failed.join('; ')}`)
    if (uploaded.length === 0) return

    try {
      const { previews: summaries } = await request<{ previews: Preview[] }>('/preview', {
        items: uploaded.map(toItem),
      })
      uploaded.forEach((row, i) => {
        row.kind = summaries[i].kind
        row.slug = summaries[i].slug
        row.status = summaries[i].status
        row.warnings = summaries[i].warnings
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
    setRows((current) => [...uploaded, ...current])
    setSelected((current) => new Set([...current, ...uploaded.map((r) => r.id)]))
  }

  const visibleRows = useMemo(() => {
    const term = filter.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) =>
      [r.title, r.file, r.slug ?? ''].some((v) => v.toLowerCase().includes(term)),
    )
  }, [rows, filter])

  const selectedRows = rows.filter((r) => selected.has(r.id))
  const overwriting = selectedRows.filter((r) => r.status && r.status !== 'new')

  const toggle = (id: string) => {
    setConfirming(false)
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const preview = async () => {
    setBusy('preview')
    setError(null)
    setResult(null)
    try {
      const data = await request<{ previews: Preview[] }>('/preview', {
        items: selectedRows.map(toItem),
      })
      setPreviews(data.previews)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  const runImport = async () => {
    if (force && overwriting.length > 0 && !confirming) {
      setConfirming(true)
      return
    }
    setConfirming(false)
    setBusy('run')
    setError(null)
    setPreviews(null)
    try {
      const data = await request<RunResult>('/run', {
        items: selectedRows.map(toItem),
        options: { force },
      })
      setResult(data)
      setSelected(new Set())
      setRows((current) => current.filter((r) => r.origin !== 'upload'))
      await loadSources()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  if (!enabled) {
    return (
      <div className={baseClass}>
        <h1>ACF importer</h1>
        <p className={`${baseClass}__notice`}>
          The importer writes source files, so it only runs with <code>npm run dev</code>.
        </p>
      </div>
    )
  }

  const groupsByOrigin = (['upload', 'theme', 'inbox'] as const)
    .map((origin) => ({ origin, rows: visibleRows.filter((r) => r.origin === origin) }))
    .filter((g) => g.rows.length > 0)

  return (
    <div className={baseClass}>
      <header className={`${baseClass}__header`}>
        <h1>ACF importer</h1>
        <p>
          Turns ACF field groups into Payload blocks (or globals, for options pages), registers them
          on Pages and regenerates the types. Each block gets a placeholder component. Run{' '}
          <code>/acf-to-payload &lt;name&gt;</code> in Claude Code to port the PHP markup and styles.
        </p>
      </header>

      <label
        className={`${baseClass}__drop${dragging ? ` ${baseClass}__drop--active` : ''}`}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void addFiles(e.dataTransfer.files)
        }}
      >
        <input
          accept=".json,application/json"
          multiple
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files)
            e.target.value = ''
          }}
          type="file"
        />
        <strong>Drop ACF JSON files here</strong>
        <span>or click to choose. Sync files and Tools → Export files both work.</span>
      </label>

      {error && <p className={`${baseClass}__error`}>{error}</p>}

      <div className={`${baseClass}__toolbar`}>
        <input
          className={`${baseClass}__search`}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter groups"
          type="search"
          value={filter}
        />
        <Button
          buttonStyle="secondary"
          margin={false}
          onClick={() =>
            setSelected(new Set(visibleRows.filter((r) => r.status === 'new').map((r) => r.id)))
          }
          size="small"
        >
          Select new
        </Button>
        <Button
          buttonStyle="secondary"
          disabled={selected.size === 0}
          margin={false}
          onClick={() => {
            setSelected(new Set())
            setConfirming(false)
          }}
          size="small"
        >
          Clear
        </Button>
        <span className={`${baseClass}__count`}>{selected.size} selected</span>
      </div>

      {busy === 'load' && rows.length === 0 ? (
        <p className={`${baseClass}__notice`}>Reading ACF groups…</p>
      ) : groupsByOrigin.length === 0 ? (
        <p className={`${baseClass}__notice`}>
          No ACF groups found. Upload JSON above, or add files to{' '}
          <code>{dirs?.inboxDir ?? 'acf-import'}/</code>.
        </p>
      ) : (
        groupsByOrigin.map(({ origin, rows: groupRows }) => (
          <section className={`${baseClass}__group`} key={origin}>
            <h2>
              {ORIGIN_HEADINGS[origin]}
              {origin === 'theme' && dirs && <code>{dirs.themeDir}</code>}
            </h2>
            <table className={`${baseClass}__table`}>
              <thead>
                <tr>
                  <th aria-label="Select" />
                  <th>ACF group</th>
                  <th>Becomes</th>
                  <th>Status</th>
                  <th>Warnings</th>
                </tr>
              </thead>
              <tbody>
                {groupRows.map((row) => (
                  <tr
                    className={selected.has(row.id) ? `${baseClass}__row--selected` : undefined}
                    key={row.id}
                    onClick={() => toggle(row.id)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <CheckboxInput
                        checked={selected.has(row.id)}
                        id={`acf-${row.id}`}
                        onToggle={() => toggle(row.id)}
                      />
                    </td>
                    <td>
                      <span className={`${baseClass}__title`}>{row.title}</span>
                      <span className={`${baseClass}__file`}>{row.file}</span>
                    </td>
                    <td>
                      {row.kind && (
                        <>
                          {row.kind === 'block' ? 'Block' : 'Global'} <code>{row.slug}</code>
                        </>
                      )}
                    </td>
                    <td>
                      {row.status && (
                        <span
                          className={`${baseClass}__status ${baseClass}__status--${row.status}`}
                          title={STATUS_HINTS[row.status]}
                        >
                          {STATUS_LABELS[row.status]}
                        </span>
                      )}
                    </td>
                    <td>
                      {row.warnings.length > 0 && (
                        <details onClick={(e) => e.stopPropagation()}>
                          <summary>{row.warnings.length}</summary>
                          <ul>
                            {row.warnings.map((w) => (
                              <li key={w}>{w}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}

      <div className={`${baseClass}__actions`}>
        <CheckboxInput
          checked={force}
          id="acf-force"
          label="Overwrite existing files"
          onToggle={() => {
            setForce(!force)
            setConfirming(false)
          }}
        />
        {force && (
          <p className={`${baseClass}__warning`}>
            Overwriting changes an existing schema. When the dev server reloads, columns for removed
            or renamed fields are dropped along with their content, and the terminal may ask
            &ldquo;create or rename column?&rdquo;. Back up <code>ascot-payload.db</code> first.
          </p>
        )}
        {!force && overwriting.length > 0 && (
          <p className={`${baseClass}__hint`}>
            {overwriting.length} selected group{overwriting.length === 1 ? ' exists' : 's exist'}{' '}
            already and will be skipped.
          </p>
        )}
        <div className={`${baseClass}__buttons`}>
          <Button
            buttonStyle="secondary"
            disabled={selected.size === 0 || busy !== null}
            margin={false}
            onClick={preview}
          >
            {busy === 'preview' ? 'Generating…' : 'Preview code'}
          </Button>
          <Button
            buttonStyle={confirming ? 'error' : 'primary'}
            disabled={selected.size === 0 || busy !== null}
            margin={false}
            onClick={runImport}
          >
            {busy === 'run'
              ? 'Importing…'
              : confirming
                ? `Confirm: overwrite ${overwriting.length}`
                : `Import ${selected.size || ''}`.trim()}
          </Button>
        </div>
      </div>

      {previews && (
        <section className={`${baseClass}__results`}>
          <h2>Preview</h2>
          {previews.map((p) => (
            <details className={`${baseClass}__preview`} key={p.target + p.title} open={previews.length === 1}>
              <summary>
                <span className={`${baseClass}__title`}>{p.title}</span>
                <code>{p.target}</code>
                <span className={`${baseClass}__status ${baseClass}__status--${p.status}`}>
                  {STATUS_LABELS[p.status]}
                </span>
              </summary>
              {p.warnings.length > 0 && (
                <ul className={`${baseClass}__warnings`}>
                  {p.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              )}
              <pre>{p.source}</pre>
            </details>
          ))}
        </section>
      )}

      {result && (
        <section className={`${baseClass}__results`}>
          <h2>Import results</h2>
          <ul className={`${baseClass}__reports`}>
            {result.reports.map((r) => (
              <li key={r.target + r.title}>
                <span className={`${baseClass}__outcome ${baseClass}__outcome--${r.outcome}`}>
                  {r.outcome}
                </span>
                <span className={`${baseClass}__title`}>{r.title}</span>
                <code>{r.target}</code>
                <ul>
                  {r.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                  {r.problems.map((p) => (
                    <li className={`${baseClass}__problem`} key={p}>
                      {p}
                    </li>
                  ))}
                  {r.warnings.map((w) => (
                    <li className={`${baseClass}__warning-item`} key={w}>
                      {w}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {result.types && (
            <p className={result.types.ok ? `${baseClass}__hint` : `${baseClass}__error`}>
              {result.types.ok
                ? 'Regenerated src/payload-types.ts.'
                : `Type generation failed: ${result.types.output}`}
            </p>
          )}
          {result.reports.some((r) => r.outcome !== 'skipped') && (
            <p className={`${baseClass}__hint`}>
              The dev server is reloading with the new config. New blocks appear under Pages →
              Layout once it has finished. Then run{' '}
              <code>
                /acf-to-payload{' '}
                {result.reports
                  .filter((r) => r.outcome !== 'skipped' && r.kind === 'block')
                  .map((r) => r.title)
                  .join(', ')}
              </code>{' '}
              in Claude Code to port the markup and styles.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
