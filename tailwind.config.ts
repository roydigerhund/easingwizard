import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'grdt-from': '#5e18f5',
        'grdt-via': '#50aaf8',
        'grdt-to': '#6ae5b5',
      },
      boxShadow: {
        element_inactive:
          '0 0 0 var(--shadow-retract, -0.25rem) transparent,inset 0 0 0 0 transparent,0 0 0 1px var(--border-inactive)',
        element_focused:
          '0 0 2rem var(--shadow-retract, -0.25rem) var(--grdt-to),inset 0 0 0 2px var(--grdt-to),0 0 0 1px transparent',
        element_pressed:
          '0 0 1rem var(--shadow-retract, -0.25rem) var(--grdt-to),inset 0 0 0 2px var(--grdt-to),0 0 0 1px transparent',
        element_border_inactive: '0 0 0 1px transparent',
        element_border_active: '0 0 0 1px var(--border-active)',
      },
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        monospace: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        'in-sine': 'cubic-bezier(0.13, 0, 0.39, 0)',
        'out-sine': 'cubic-bezier(0.61, 1, 0.87, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        spring:
          'linear(0, 0.013 0.6%, 0.051 1.2%, 0.202 2.5%, 1.228 8.4%, 1.375 9.9%, 1.42 10.7%, 1.44 11.5%, 1.441 12.1%, 1.428 12.8%, 1.362 14.2%, 0.891 20.4%, 0.829 21.9%, 0.805 23.4%, 0.81 24.6%, 0.839 26%, 1.047 32.2%, 1.074 33.6%, 1.086 35.1%, 1.075 37.5%, 0.985 43.5%, 0.962 46.9%, 0.967 49.3%, 1.006 55.3%, 1.017 58.7%, 0.993 70.3%, 1.003 82%, 1)',
        overshoot:
          'linear(0, 0.466 7.2%, 0.816 14.8%, 1.06 23%, 1.142 27.3%, 1.201 31.9%, 1.229 35.4%, 1.245 39.1%, 1.25 43.1%, 1.242 47.4%, 1.205 55.3%, 1.085 72.9%, 1.038 81.2%, 1.008 90.2%, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
} satisfies Config;
