import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import React from 'react';
import './tailwind.css';

export const meta: MetaFunction = () => {
  return [
    { title: 'Easing Wizard - CSS Easing Editor' },
    {
      name: 'description',
      content: 'Create and customize CSS easing functions with ease and magical precision using Easing Wizard 🧙‍♂️🧙',
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#09090b' },
    { name: 'apple-mobile-web-app-title', content: 'Easing Wizard' },
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
        <style>{`body { background: #09090b } .no-transition * { transition: none !important; animation none !important }`}</style>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js" />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
