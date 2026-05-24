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
        description:
          'Install the Harbor SDK, configure credentials, and send your first API request.',
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
        description: 'How events and webhook deliveries work on Harbor.',
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
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Guides',
        description:
          'Task-oriented walkthroughs for events, webhooks, credentials, and pagination.',
        slug: '/guides',
      },
      items: [
        'guides/creating-events',
        'guides/webhooks',
        'guides/managing-api-keys',
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
        description: 'Client configuration and resource methods for Harbor SDK v2.',
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
        description: 'HTTP request patterns for the Harbor API.',
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
        description: 'Common errors, rate limits, and integration mistakes.',
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
