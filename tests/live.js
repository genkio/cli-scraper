'use strict'

const test = require('ava')
const core = require('../src/core')
const bingConfig = require('./config/bing')
const newsConfig = require('./config/news')

test('it should pass', t => {
  t.pass()
})

test('it should scrape logo text from bing.com', async t => {
  const result = await core(bingConfig)
  t.is(result, 'Bing')
})

test('it should scrape news list along with each news article publish date from news.cn', async t => {
  const result = await core(newsConfig)
  t.is(result.length, 8)
})
