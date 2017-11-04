'use strict'

const crawl = require('../lib/crawler')
const parse = require('../lib/parser')
const promiseLimit = require('promise-limit')
const { defaultConfig } = require('../config/default')

module.exports = config => {
  config = Object.assign(defaultConfig, config)

  return crawl(config)
    .then(parse)
    .then(config.process)
    .then(config.afterProcessed)
    .then(res => {
      const { next } = config
      if (!next.url) return res

      return processNextParallel(config, res)
      // if (next.parallel) return processNextParallel(next, res)
      // if (next.sequential) return processNextSequential(next, res)
    })
    .catch(e => { throw e })
}

// function processNextSequential(next, res) {
//   return Array.from(res)
//     .reduce((promise, item) => {
//       return promise.then(res => {
//         return crawl(Object.assign(next, { url: item[next.url], prevRes: item }))
//           .then(parse)
//           .then(next.process)
//           .then(Array.prototype.concat.bind(res))
//       })
//     }, Promise.resolve([]))
// }

function processNextParallel(config, res) {
  const limit = promiseLimit(config.promiseLimit)
  return Promise.all(
    Array.from(res).map(item =>
      limit(() => {
        return crawl(Object.assign(config, { url: item[config.next.url] }))
          .then(parse)
          .then(config.next.process)
          .then(config.afterProcessed)
      })
    )
  )
}
