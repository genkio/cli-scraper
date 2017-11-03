'use strict'

const crawl = require('../')
const config = {
  url: 'http://3g.163.com/touch/news/',
  process(res) {
    const { $ } = res
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
    randomUserAgent: true,
    parallel: true,
    process(res) {
      const { $, prevRes } = res
      console.log(`now processing next item ${prevRes.id}`)
      return Object.assign(prevRes, {
        date: $('.js-time').text()
      })
    }
  },
  exclude(item) {
    return item.title.indexOf('轻松一刻') >= 0
  }
}

const start = new Date().getTime()
let end = null
crawl(config)
  .then(res => {
    end = new Date().getTime()
    console.log(res)
    console.log(`Time spent: ${(end - start) / 1000} seconds`)
  })
