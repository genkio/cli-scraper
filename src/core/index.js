'use strict'

const crawl = require('../lib/crawler')
const parse = require('../lib/parser')
const promiseLimit = require('promise-limit')
const { defaultConfig } = require('../config/default')

module.exports = config => {
  if (!config.urls) return processSinglePage(config)

  return config.urls.map(function(url) {
    return Object.assign({ url }, this)
  }.bind(config)).reduce((promise, config) => {
    return promise.then(res => {
      return processSinglePage(config)
        .then(Array.prototype.concat.bind(res))
    })
  }, Promise.resolve([]))
}

function processSinglePage(config) {
  config = Object.assign(defaultConfig, config)

  return crawl(config)
    .then(parse)
    .then(config.process)
    .then(config.afterProcessed)
    .then(res => {
      const { next } = config
      if (!next.url) return res
      return processNext(config, res)
    })
    .catch(e => { throw e })
}

function processNext(config, res) {
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
