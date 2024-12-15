module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  semi: false,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  bracketSpacing: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  printWidth: 120,
  endOfLine: 'lf',
  importOrder: ['^@pages/(.*)$', '^@fixtures/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
