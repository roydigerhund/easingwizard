import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import type { LinksFunction, MetaFunction } from '@vercel/remix';

import React from 'react';
import { description, productionOrigin, title } from './data/globals';
import './tailwind.css';
import { Analytics } from '@vercel/analytics/remix';

export const meta: MetaFunction = () => {
  return [
    { title },
    { name: 'description', content: description },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#09090b' },
    { name: 'apple-mobile-web-app-title', content: 'Easing Wizard' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:url', content: productionOrigin },
    { property: 'og:image', content: `${productionOrigin}/share-image.png` },
    { property: 'og:description', content: description },
  ];
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-96x96.png',
    sizes: '96x96',
  },
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'shortcut icon', href: '/favicon.ico' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <style>{`body { background: #09090b; color: #f4f4f5; } .no-transition * { transition: none !important; animation none !important; filter: none !important; }`}</style>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js" />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div
          style={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <h1>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown Error'}
          </h1>
          <a href="/" style={{
            color: '#f4f4f5',
            textDecoration: 'underline',
          }}>Go back home</a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
