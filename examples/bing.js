'use strict'

const crawl = require('../')
const config = {
  url: 'https://www.bing.com/',
  requestDebug: true,
  process({ $ }) {
    return $('.hp_sw_logo').text() + 'go :)'
  }
}

crawl(config)
  .then(console.log)
  .catch(console.log)
