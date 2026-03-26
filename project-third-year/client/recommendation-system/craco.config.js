module.exports = {
  webpack: {
    plugins: []
  },
  style: {
    postcss: {
      mode: 'extends',
      plugins: [
        require('@fullhuman/postcss-purgecss')({
          content: [
            './src/**/*.{js,jsx,ts,tsx}',
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
              /^d-/,
              /^p-/,
              /^m-/,
              /^g-/,
              /^col/,
              /^row/,
              /^flex/,
              /^justify/,
              /^align/,
              /^text-/,
              /^bg-/,
              /^border/,
              /^rounded/,
              /^w-/,
              /^h-/,
              /^container/,
            ]
          }
        })
      ]
    }
  }
}