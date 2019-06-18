const brikcssStylelint = require('./stylelint.config.js')

module.exports = {
  extends: [brikcssStylelint, 'stylelint-config-prettier']
}
