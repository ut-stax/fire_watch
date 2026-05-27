/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-bright': 'var(--color-primary-bright)',
        'primary-deep': 'var(--color-primary-deep)',
        'primary-soft': 'var(--color-primary-soft)',
        ink: 'var(--color-ink)',
        'ink-deep': 'var(--color-ink-deep)',
        canvas: 'var(--color-canvas)',
        paper: 'var(--color-paper)',
        cloud: 'var(--color-cloud)',
        fog: 'var(--color-fog)',
        steel: 'var(--color-steel)',
        graphite: 'var(--color-graphite)',
        charcoal: 'var(--color-charcoal)',
        'hairline': 'var(--color-hairline)',
        'bloom-coral': 'var(--color-bloom-coral)',
        'bloom-rose': 'var(--color-bloom-rose)',
        'bloom-deep': 'var(--color-bloom-deep)',
        'storm-mist': 'var(--color-storm-mist)',
        'storm-sea': 'var(--color-storm-sea)',
        'storm-deep': 'var(--color-storm-deep)',
        error: 'var(--color-error)',
      },
    },
  },
  plugins: [],
}
