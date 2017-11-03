'use strict'

const _ = require('lodash')
const crawl = require('../lib/crawler')
const parse = require('../lib/parser')
const promiseLimit = require('promise-limit')
const defaultConfig = require('../config/default')

module.exports = config => {
  config = _.merge(defaultConfig, config)

  return crawl(config)
    .then(parse)
    .then(config.process)
    .then(res => {
      const { next } = config
      if (!next.url) return res

      if (next.parallel) next.sequential = false
      if (next.parallel) return processNextParallel(next, res)
      if (next.sequential) return processNextSequential(next, res)
    })
    .then(res => {
      const { exclude } = config
      return processExclude(exclude, res)
    })
    .then(res => res)
    .catch(e => { throw Error(e) })
}

function processNextSequential(next, res) {
  return Array.from(res)
    .reduce((promise, item) => {
      return promise.then(res => {
        return crawl({ url: item[next.url], prevRes: item })
          .then(parse)
          .then(next.process)
          .then(Array.prototype.concat.bind(res))
      })
    }, Promise.resolve([]))
}

function processNextParallel(next, res) {
  const limit = promiseLimit(next.promiseLimit)
  return Promise.all(
    Array.from(res).map(item =>
      limit(() =>
        crawl(_.merge(next, { url: item[next.url], prevRes: item }))
          .then(parse).then(next.process)))
  )
}

function processExclude(exclude, res) {
  return Array.from(res)
    .filter(item => !exclude(item))
}
