/*! .lintstagedrc.js | @author Brikcss (https://github.com/brikcss) | @reference (https://github.com/okonet/lint-staged) */

module.exports = {
  linters: {
    'content/styles/css/app.css': [
      'npx postcss content/styles/css/app.css --replace',
      'git add content/styles/css/app.css content/styles/css/app.css.map'
    ],
    'scripts/app.js': [
      'npx node-minify --compressor uglify-es --input scripts/app.js --output scripts/app.min.js',
      'git add scripts/app.min.js'
    ],
    '*.js': ['standard --fix', 'git add'],
    '*.json': ['prettier --parser json --write', 'git add'],
    '*.{yml,yaml}': ['prettier --parser yaml --write', 'git add'],
    '*.md': ['prettier --parser markdown --write', 'git add'],
    '*.html': ['prettier --parser html --write', 'git add']
  },
  concurrent: true,
  globOptions: {
    matchBase: true,
    dot: true
  },
  ignore: ['*.min.{js,css}']
}
