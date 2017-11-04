'use strict'

const crawl = require('../')
const config = {
  url: 'http://3g.163.com/touch/news/',
  randomUserAgent: true,
  process({ $ }) {
    return $('ul.s_news_list > li > h2 > a').map((i, el) => {
      return {
        id: i + 1,
        title: $(el).text(),
        url: $(el).prop('href')
      }
    })
  },
  next: {
    url: 'url',
    process({ $, url }) {
      return {
        url,
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