'use strict'

const _ = require('lodash')
const handle = require('../').handle
const proxyList = require('./proxy.json')

const config = {
  url: 'http://3g.163.com/touch/news/',
  randomUserAgent: true,
  randomWait: 10,
  debugRequest: false,
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
    process({ $, url, error, createdAt }) {
      return {
        url,
        error,
        createdAt,
        date: $('.js-time').text(),
        title: $('h1').text()
      }
    }
  }
}

const start = new Date().getTime()
let end = null
handle(config)
  .then(res => {
    end = new Date().getTime()
    console.log(`Time spent: ${(end - start) / 1000} seconds`)
    for (let item of res) {
      console.log(item)
    }
  })
  .catch(console.log)
