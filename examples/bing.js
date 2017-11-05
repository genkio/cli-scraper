'use strict'

const crawl = require('../')
const config = {
  url: 'https://www.bing.com/',
  debugRequest: true,
  process({ $ }) {
    return $('.hp_sw_logo').text()
  },
  afterProcessed(res) {
    return res + 'go :)'
  }
}

crawl(config)
  .then(console.log)
  .catch(console.log)
