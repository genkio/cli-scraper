'use strict'

const nodeCrawler = require('../')
const config = {
  url: 'http://www.bing.com/',
  debugRequest: true,
  beforeRequest() {
    return {
      headers: {
        'User-Agent': nodeCrawler.UA.BOT.BING
      },
      timeout: 3000
    }
  },
  randomWait: 10,
  process: function({ $ }) {
    return $('.hp_sw_logo').text()
  },
  afterProcessed(res) {
    return res + 'go :)'
  }
}

nodeCrawler.handle(config)
  .then(console.log)
  .catch(console.log)
