'use strict'

const crawl = require('../lib/crawler')
const parse = require('../lib/parser')
const promiseLimit = require('promise-limit')
const { defaultConfig } = require('../config/default')

module.exports = function handle(config) {
  if (!config.urls) return handleSinglePage(config)

  return config.urls.map(function(url) {
    return Object.assign({ url }, this)
  }.bind(config)).reduce((promise, config) => {
    return promise.then(res => {
      return handleSinglePage(config)
        .then(Array.prototype.concat.bind(res))
    })
  }, Promise.resolve([]))
}

function handleSinglePage(config) {
  config = Object.assign(defaultConfig, config)

  return crawl(config)
    .then(parse)
    .then(config.process)
    .then(config.afterProcessed)
    .then(res => {
      const { next } = config
      if (!next.url || next.url === "''" /* stringified default value */) return res
      return handleNext(config, res)
    })
    .then(config.finally)
    .catch(e => { throw e })
}

function handleNext(config, res) {
  const limit = promiseLimit(config.promiseLimit)
  return Promise.all(
    Array.from(res).map(item =>
      limit(() => {
        config.prevRes = item
        return crawl(Object.assign(config, { url: item[config.next.url] }))
          .then(parse)
          .then(config.next.process)
          .then(config.afterProcessed)
      })
    )
  )
}
