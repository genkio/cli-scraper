'use strict'

const _ = require('lodash')
const crawl = require('../')
const proxyList = require('./proxy.json')

const config = {
  url: 'http://3g.163.com/touch/news/',
  randomUserAgent: true,
  debugRequest: true,
  beforeRequest() {
    return {
      proxy: _.sample(proxyList).proxy
    }
  },
  process({ $ }) {
    return $('ul.s_news_list > li > h2 > a').map((i, el) => {
      return {
        id: i + 1,
        articleUrl: $(el).prop('href'),
        title: $(el).text()
      }
    })
  },
  next: {
    url: 'articleUrl',
    process({ $, url, error }) {
      return {
        url,
        error,
        date: $('.js-time').text(),
        title: $('h1').text()
      }
    }
  }
}

const start = new Date().getTime()
let end = null
crawl(config)
  .then(res => {
    end = new Date().getTime()
    console.log(`Time spent: ${(end - start) / 1000} seconds`)
    for (let item of res) {
      console.log(item)
    }
  })
  .catch(console.log)
