'use strict'

const crawl = require('../')
const config = {
  url: 'https://www.bing.com/',
  requestDebug: true,
  process(res) {
    const { $ } = res
    return $('.hp_sw_logo').text() + 'go :)'
  }
}

crawl(config)
  .then(res => console.log(res.join('')))
