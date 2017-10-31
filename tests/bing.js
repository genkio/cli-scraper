'use strict'

module.exports = {
  url: 'https://www.bing.com/',
  handler: res => {
    const { $ } = res
    return $('.hp_sw_logo').text() + 'go :)'
  }
}
