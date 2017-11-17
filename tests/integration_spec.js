'use strict'

const test = require('ava')
const nock = require('nock')
const core = require('../src/core')
const bingConfig = require('./config/bing')
const newsConfig = require('./config/news')
const responseMocks = require('./mocks/html')

test.before(t => {
  nock('https://www.bing.com')
    .get('/')
    .reply(200, responseMocks.bing)

  nock('http://www.news.cn/world')
    .get('/index.htm')
    .reply(200, responseMocks.newsList)
    .get('/articles/1.htm')
    .reply(200, responseMocks.newsArticle(1))
    .get('/articles/2.htm')
    .reply(200, responseMocks.newsArticle(2))
})

test('it should pass', t => {
  t.pass()
})

test('it should scrape logo text from bing.com', async t => {
  const result = await core(bingConfig)
  t.is(result, 'Bing')
})

test('it should scrape news list along with each news article publish date from news.cn', async t => {
  const result = await core(newsConfig)
  t.is(result.length, 2)
  t.is(result[0].title, 'Hello')
  t.is(result[0].date, '1970-1-1')
  t.is(result[1].title, 'World')
  t.is(result[1].date, '1970-1-2')
})
