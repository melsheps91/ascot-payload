import { CollectionConfig } from "payload";

import { Banner } from "../blocks/Banner";
import { IntroContent } from '../blocks/IntroContent'

export const Pages: CollectionConfig = {
    slug: "pages",
    fields: [
        {
            name: "title",
            type: "text",
            required: true
        },
        {
          name: 'slug',
          type: 'text',
          required: true
        },
        {
          name: 'layout',
          type: 'blocks',
          blocks: [Banner, IntroContent],
        },
    ],
}
