'use strict'

module.exports = {
  urls: function () {
    return [1, 2].map(page => `http://www.news.cn/world/${page}`)
  },
  requestOptions: {
    timeout: 10000
  },
  randomUserAgent: true,
  printRequestUrl: true,
  randomWait: 5,
  process: function ({ $, error }) {
    if (error) { throw Error(error) }
    return $('.firstPart ul.newList01 > li > a').map((i, el) => {
      return {
        articleUrl: $(el).prop('href'),
        title: $(el).text()
      }
    })
  },
  next: {
    key: 'articleUrl',
    process: function ({ $, prevRes, error }) {
      if (error) { throw Error(error) }
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
  },
  catch: function (err) {
    console.log(err)
  }
}
