import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Get started',
        slug: '/get-started',
      },
      items: [
        'getting-started/installation',
        'getting-started/quickstart',
        'getting-started/migrating-from-1-0',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Concepts',
        slug: '/concepts',
      },
      items: [
        'concepts/event-lifecycle',
        'concepts/webhook-delivery',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Guides',
        slug: '/guides',
      },
      items: [
        'guides/managing-api-keys',
        'guides/creating-events',
        'guides/webhooks',
        'guides/pagination',
      ],
    },
    {
      type: 'category',
      label: 'SDK reference',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'SDK reference',
        slug: '/sdk-reference',
      },
      items: [
        'sdk-reference/client',
        'sdk-reference/events',
        'sdk-reference/workspaces',
        'sdk-reference/webhooks',
      ],
    },
    {
      type: 'category',
      label: 'REST API',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'REST API',
        slug: '/rest-api',
      },
      items: ['rest-api/overview'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Troubleshooting',
        slug: '/troubleshooting',
      },
      items: [
        'troubleshooting/common-errors',
        'troubleshooting/rate-limits',
      ],
    },
  ],
};

export default sidebars;
