'use strict'

module.exports = {
  url: 'https://www.bing.com/',
  printRequestUrl: false,
  randomUserAgent: true,
  process: function ({ $ }) {
    return $('.hp_sw_logo').text()
  },
  finally: function (res) {
    console.log(res)
    return String(res).replace(/,/g, '')
  }
}
