'use strict'

const _ = require('lodash')
const test = require('ava')
const nock = require('nock')
const core = require('../src/core')
const bingConfig = require('./config/bing')
const newsConfig = require('./config/news')
const responseMocks = require('./mocks/html')
let clonedBingConfig = null
let clonedNewsConfig = null

test.before(t => {
  nock('https://www.bing.com')
    .get('/')
    .reply(200, responseMocks.bing)

  nock('http://www.news.cn/world')
    .get('/1')
    .reply(200, responseMocks.newsList(1))
    .get('/1/articles/1.htm')
    .reply(200, responseMocks.newsArticle(1))
    .get('/1/articles/2.htm')
    .reply(200, responseMocks.newsArticle(2))
    .get('/2')
    .reply(200, responseMocks.newsList(2))
    .get('/2/articles/1.htm')
    .reply(200, responseMocks.newsArticle(3))
    .get('/2/articles/2.htm')
    .reply(200, responseMocks.newsArticle(4))
})

test.beforeEach(t => {
  clonedBingConfig = _.cloneDeep(bingConfig)
  clonedNewsConfig = _.cloneDeep(newsConfig)
})

test.serial('it should scrape logo text from bing.com', async t => {
  const result = await core(clonedBingConfig)
  t.is(result, 'Bing')
})

test.serial('it should scrape multiple pages if array of urls were given, along with their nested pages', async t => {
  const result = await core(clonedNewsConfig)
  t.is(result.length, 4)
  t.is(result[0].title, 'Hello')
  t.is(result[0].date, '1970-1-1')
  t.is(result[1].title, 'World')
  t.is(result[1].date, '1970-1-2')
  t.is(result[2].title, 'Hello')
  t.is(result[2].date, '1970-1-3')
  t.is(result[3].title, 'World')
  t.is(result[3].date, '1970-1-4')
})

test.serial('it should scrape single page with custom scraper provided by lib consumer', async t => {
  const result = await core(Object.assign(clonedBingConfig, {
    scraper: (config, callback) => {
      callback(null, { statusCode: 200 }, responseMocks.bing)
    }
  }))
  t.is(result, 'Bing')
})
