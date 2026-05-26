import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Mermaid from '@theme/Mermaid';

import styles from './index.module.css';

const platformFlow = `flowchart TB
    subgraph Your stack
        S[Backend service]
        H[Webhook handler]
    end
    subgraph Harbor
        W[Workspace]
        E[Event store]
        D[Delivery engine]
    end
    S -->|SDK or REST| E
    E --> D
    D -->|signed POST| H
    W --- E`;

const features = [
  {
    title: 'Typed Node.js SDK',
    description:
      'Cursor pagination, typed errors, and retry helpers for server-side integrations.',
    link: '/sdk-reference/client',
  },
  {
    title: 'Event delivery + retries',
    description:
      'Persist events in a workspace and deliver matching payloads to HTTPS endpoints.',
    link: '/concepts/webhook-delivery',
  },
  {
    title: 'Webhook verification',
    description:
      'Sign outbound deliveries and validate inbound requests with the SDK helper.',
    link: '/sdk-reference/webhooks',
  },
  {
    title: 'Versioned docs',
    description:
      'Compare the current SDK with released snapshots and migration notes.',
    link: '/getting-started/migrating-from-1-0',
  },
];

const pathways = [
  {
    title: 'First integration',
    description: 'Install the SDK and emit your first event.',
    link: '/getting-started/quickstart',
  },
  {
    title: 'Webhook setup',
    description: 'Register endpoints and verify signed deliveries.',
    link: '/guides/webhooks',
  },
  {
    title: 'SDK reference',
    description: 'Browse typed client methods and error codes.',
    link: '/sdk-reference',
  },
  {
    title: 'REST API',
    description: 'Use cURL or any HTTP client against Harbor endpoints.',
    link: '/rest-api/overview',
  },
];

export default function Home() {
  return (
    <Layout
      title="Harbor Docs"
      description="Developer documentation for Harbor — workspaces, events, webhooks, and the Node.js SDK.">
      <header className={clsx('hero', styles.heroBanner)}>
        <div className={clsx('container', styles.heroInner)}>
          <Heading as="h1" className="hero__title">
            Harbor Docs
          </Heading>
          <p className="hero__subtitle">
            Documentation for Harbor, an event routing platform with workspaces,
            outbound webhooks, and a typed Node.js SDK.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.btnPrimary} to="/get-started">
              Get started
            </Link>
            <Link className={styles.btnSecondary} to="/guides">
              View guides
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className={clsx('container', styles.homeContainer)}>
            <Heading as="h2" className={styles.sectionHeading}>
              Platform capabilities
            </Heading>
            <div className={clsx('row', styles.cardGrid)}>
              {features.map(({title, description, link}) => (
                <div key={title} className="col col--12 col--6">
                  <div className={clsx('card', styles.featureCard)}>
                    <div className="card__header">
                      <Heading as="h3">{title}</Heading>
                    </div>
                    <div className="card__body">
                      <p>{description}</p>
                    </div>
                    <div className="card__footer">
                      <Link to={link}>Learn more</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className={clsx('container', styles.homeContainer)}>
            <Heading as="h2" className={styles.sectionHeading}>
              Start here
            </Heading>
            <div className={clsx('row', styles.cardGrid)}>
              {pathways.map(({title, description, link}) => (
                <div key={title} className="col col--12 col--6">
                  <Link to={link} className={styles.pathwayCard}>
                    <Heading as="h3">{title}</Heading>
                    <p>{description}</p>
                    <span className={styles.pathwayArrow} aria-hidden="true">
                      Read guide →
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={clsx('container', styles.homeContainer)}>
            <Heading as="h2" className={styles.sectionHeading}>
              How Harbor fits together
            </Heading>
            <p className={styles.sectionIntro}>
              Your backend emits events through the SDK or REST API. Harbor stores
              them in a workspace and delivers signed payloads to subscribed webhook
              endpoints.
            </p>
            <div className={styles.diagramWrapper}>
              <Mermaid value={platformFlow} />
            </div>
            <p className={styles.sectionFooter}>
              Read the{' '}
              <Link to="/intro">platform overview</Link> or{' '}
              <Link to="/concepts/event-lifecycle">event lifecycle</Link> for
              more detail.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
