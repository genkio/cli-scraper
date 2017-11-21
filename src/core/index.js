'use strict'

const scrape = require('../lib/scraper')
const parse = require('../lib/parser')
const promiseLimit = require('promise-limit')
const _ = require('lodash')
const { defaultConfig } = require('../config/default')

module.exports = function handle(config) {
  const isSingleUrl = _.isEmpty(config.urls) && !_.isFunction(config.urls)
  if (isSingleUrl) return handleSinglePage(config)
  if (_.isFunction(config.urls)) config.urls = config.urls()

  return config.urls.map(function(url) {
    return _.cloneDeep(_.merge(this, { url }))
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
      // NOTE: "''" is the stringified config default value for empty string
      if (!next.key || next.key === "''") {
        return res
      }
      return handleNext(config, res)
    })
    .then(res => config.finally(res, _))
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
