'use strict'

const crawl = require('../')
const config = {
  url: 'http://www.bing.com/',
  debugRequest: true,
  beforeRequest() {
    return {
      timeout: 3000
    }
  },
  process: function({ $ }) {
    return $('.hp_sw_logo').text()
  },
  afterProcessed(res) {
    return res + 'go :)'
  }
}

crawl(config)
  .then(console.log)
  .catch(console.log)
