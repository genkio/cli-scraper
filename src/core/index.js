'use strict'

const scrape = require('../lib/scraper')
const parse = require('../lib/parser')
const promiseLimit = require('promise-limit')
const _ = require('lodash')
const { defaultConfig } = require('../config/default')

module.exports = function handle(config) {
  if (_.isEmpty(config.urls)) return handleSinglePage(config)

  return config.urls.map(function(url) {
    return Object.assign(this, { url })
  }.bind(config)).reduce((promise, config) => {
    return promise.then(res => {
      return handleSinglePage(config)
        .then(Array.prototype.concat.bind(res))
    })
  }, Promise.resolve([]))
}

function handleSinglePage(config) {
  config = Object.assign(defaultConfig, config)

  return scrape(config)
    .then(parse)
    .then(config.process)
    .then(config.afterProcessed)
    .then(res => {
      const { next } = config
      if (!next.key || next.key === "''" /* stringified default value */) return res
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
        return scrape(Object.assign(config, { url: item[config.next.key] }))
          .then(parse)
          .then(config.next.process)
          .then(config.afterProcessed)
          .catch(e => { throw e })
      })
    )
  )
}
