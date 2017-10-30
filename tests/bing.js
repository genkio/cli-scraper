'use strict'

module.exports = {
  url: 'https://www.bing.com/',
  handler: $ => {
    return $('.hp_sw_logo').text() + 'go :)'
  }
}
