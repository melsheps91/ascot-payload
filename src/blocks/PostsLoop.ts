import type { Block } from 'payload'

// Port of inc/content/posts-loop.php: the news listing, with category filters, the
// latest article featured and paging.
export const PostsLoop: Block = {
  slug: 'postsLoop',
  imageURL: '/admin/blocks/postsLoop.jpg',
  admin: { group: 'News & jobs' },
  interfaceName: 'PostsLoopBlock',
  labels: {
    singular: 'News listing',
    plural: 'News listings',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'perPage',
          label: 'Articles per page',
          type: 'number',
          defaultValue: 13,
          min: 1,
          max: 48,
        },
        {
          name: 'showFilters',
          label: 'Show category filters',
          type: 'checkbox',
          defaultValue: true,
          admin: { style: { alignSelf: 'center' } },
        },
      ],
    },
  ],
}
