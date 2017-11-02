'use strict'

const crawler = require('../')
const descriptor = {
  url: 'https://www.bing.com/',
  process: res => {
    const { $ } = res
    return $('.hp_sw_logo').text() + 'go :)'
  }
}

crawler(descriptor)
  .then(res => console.log(res))
