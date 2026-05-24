import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const organizationName = process.env.ORGANIZATION_NAME ?? 'your-org';
const projectName = process.env.PROJECT_NAME ?? 'harbor-sdk-docs';
const docsUrl = process.env.DOCS_URL ?? 'https://harbor-docs.vercel.app';

const config: Config = {
  title: 'Harbor',
  tagline: 'Server-side SDK for the Harbor platform API',

  url: docsUrl,
  baseUrl: '/',

  organizationName,
  projectName,

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Next (Unreleased)',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Harbor Docs',
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: `https://github.com/${organizationName}/${projectName}`,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Harbor. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
