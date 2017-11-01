'use strict'

module.exports = {
  url: 'https://www.bing.com/',
  process: res => {
    const { $ } = res
    return $('.hp_sw_logo').text() + 'go :)'
  }
}
