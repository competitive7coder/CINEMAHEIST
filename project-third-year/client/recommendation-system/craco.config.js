const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  style: {
    postcss: {
      plugins: [
        purgecss({
          content: [
            './src/**/*.js',
            './src/**/*.jsx',
            './public/index.html'
          ],
          defaultExtractor: content =>
            content.match(/[\w-/:]+(?<!:)/g) || [],
          safelist: {
            standard: [
              /^modal/,
              /^show/,
              /^fade/,
              /^collapse/,
              /^collapsing/,
              /^navbar/,
              /^dropdown/,
              /^tooltip/,
              /^toast/,
              /^btn/,
              /^active/,
              /^disabled/,
              /^offcanvas/,
              /^carousel/,
              /^tab/,
              /^nav/,
              /^form/,
              /^is-/,
              /^was-/,
            ]
          }
        })
      ]
    }
  }
}