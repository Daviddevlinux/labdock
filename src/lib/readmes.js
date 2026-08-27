export const readmes = import.meta.glob('/labs/**/README.md', { query: '?raw', import: 'default', eager: true })
