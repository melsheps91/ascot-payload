import { describe, expect, it } from 'vitest'

import {
  type AcfGroup,
  commonPrefix,
  convertGroup,
  toCamel,
  toKebab,
  toPascal,
} from '../../scripts/acf-to-payload/convert'

const field = (key: string, name: string, type: string, extra: Record<string, unknown> = {}) => ({
  key,
  label: name,
  name,
  type,
  ...extra,
})

const pageTemplate = [[{ param: 'page_template', operator: '==', value: 'page-general.php' }]]

describe('naming', () => {
  it('converts ACF names and titles', () => {
    expect(toCamel('banner_pre_heading')).toBe('bannerPreHeading')
    expect(toPascal('Product Cards - Manual')).toBe('ProductCardsManual')
    expect(toKebab('Product Cards - Manual')).toBe('product-cards-manual')
    expect(toCamel('FAQs')).toBe('faqs')
  })

  it('finds the shared field prefix only when every field has it', () => {
    const fields = [field('a', 'icon_intro_heading', 'text'), field('b', 'icon_grid', 'repeater')]
    expect(commonPrefix(fields)).toBe('icon_')
    expect(commonPrefix([...fields, field('c', 'use_global', 'true_false')])).toBe('')
  })
})

describe('convertGroup', () => {
  it('builds a block with stripped names, repeaters and links', () => {
    const group: AcfGroup = {
      key: 'group_1',
      title: 'Icon Grid',
      location: pageTemplate,
      fields: [
        field('f1', 'icon_intro_heading', 'text'),
        field('f2', 'icon_intro_button', 'link'),
        field('f3', 'icon_grid', 'repeater', {
          max: 6,
          sub_fields: [field('f4', 'heading', 'text', { required: 1 })],
        }),
      ],
    }
    const result = convertGroup(group)

    expect(result.kind).toBe('block')
    expect(result.exportName).toBe('IconGrid')
    expect(result.slug).toBe('iconGrid')
    expect(result.warnings).toEqual([])
    expect(result.source).toContain("import { link } from '../fields/link'")
    expect(result.source).toContain("name: 'introHeading'")
    expect(result.source).toContain("name: 'grid'")
    expect(result.source).toContain('maxRows: 6')
    expect(result.source).toContain('required: true')
  })

  it('turns labelled true_false fields into radios and wires conditions to them', () => {
    const group: AcfGroup = {
      key: 'group_2',
      title: 'Banner',
      location: pageTemplate,
      fields: [
        field('t', 'banner_type', 'true_false', {
          default_value: 1,
          ui_on_text: 'Image',
          ui_off_text: 'Video',
        }),
        field('i', 'banner_images', 'gallery', {
          conditional_logic: [[{ field: 't', operator: '==', value: '1' }]],
        }),
        field('v', 'banner_video', 'file', {
          mime_types: 'mp4',
          conditional_logic: [[{ field: 't', operator: '!=', value: '1' }]],
        }),
      ],
    }
    const { source } = convertGroup(group)

    expect(source).toContain("type: 'radio'")
    expect(source).toContain("defaultValue: 'image'")
    expect(source).toContain("(_data, siblingData) => siblingData?.type === 'image'")
    expect(source).toContain("(_data, siblingData) => siblingData?.type !== 'image'")
    expect(source).toContain("'video/mp4'")
  })

  it('reads block-level fields from inside a repeater through blockData', () => {
    const group: AcfGroup = {
      key: 'group_3',
      title: 'FAQs',
      location: pageTemplate,
      fields: [
        field('g', 'use_global_faqs', 'true_false'),
        field('r', 'faqs', 'repeater', {
          sub_fields: [
            field('q', 'question', 'text', {
              conditional_logic: [[{ field: 'g', operator: '!=', value: '1' }]],
            }),
          ],
        }),
      ],
    }
    expect(convertGroup(group).source).toContain(
      '(_data, _siblingData, { blockData }) => !blockData?.useGlobalFaqs',
    )
  })

  it('nests fields that follow ACF tabs under a Payload tabs field', () => {
    const group: AcfGroup = {
      key: 'group_4',
      title: 'Global Sections',
      location: [[{ param: 'options_page', operator: '==', value: 'acf-options-global-sections' }]],
      fields: [
        field('t1', '', 'tab', { label: 'Header' }),
        field('h', 'header_text', 'text'),
        field('t2', '', 'tab', { label: 'FAQs' }),
        field('f', 'faqs_heading', 'text'),
      ],
    }
    const result = convertGroup(group)

    expect(result.kind).toBe('global')
    expect(result.source).toContain('GlobalConfig')
    expect(result.source).toMatch(/type: 'tabs'[\s\S]*label: 'Header'[\s\S]*label: 'FAQs'/)
  })

  it('leaves a TODO for relationships to collections that do not exist yet', () => {
    const group: AcfGroup = {
      key: 'group_5',
      title: 'Related',
      location: pageTemplate,
      fields: [field('p', 'related_offer', 'post_object', { post_type: ['offers'] })],
    }
    const result = convertGroup(group, { collections: ['pages'] })

    expect(result.source).toContain('// TODO related_offer (post_object)')
    expect(result.warnings[0]).toContain('offers')
  })
})
