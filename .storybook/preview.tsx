import type { Preview } from '@storybook/react-vite'

import '../src/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'ФинПульс canvas',
      values: [
        { name: 'ФинПульс canvas', value: '#f7fbff' },
        { name: 'White', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="box-border flex min-h-screen w-full justify-center bg-[var(--fr-surface-canvas)] p-4 font-sans text-[var(--fr-text-primary)]">
        <Story />
      </div>
    ),
  ],
}

export default preview
