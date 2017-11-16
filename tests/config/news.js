'use strict'

module.exports = {
  url: 'http://www.news.cn/world/index.htm',
  requestOptions: {
    timeout: 10000
  },
  randomUserAgent: true,
  printRequestUrl: false,
  randomWait: 5,
  process: function ({ $ }) {
    return $('.firstPart ul.newList01 > li > a').map((i, el) => {
      return {
        articleUrl: $(el).prop('href'),
        title: $(el).text()
      }
    })
  },
  next: {
    key: 'articleUrl',
    process: function ({ $, prevRes }) {
      return Object.assign(prevRes, {
        date: $('.h-news > .h-info > .h-time').text()
      })
    }
  },
  finally: function (res) {
    for (let item of res) {
      console.log(`${item.title} [at] ${item.date}`)
    }
    return res
  }
}
