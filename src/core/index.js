'use strict'

const crawl = require('../lib/crawler')
const parse = require('../lib/parser')

module.exports = descriptor => crawl({ url: descriptor.url })
  .then(parse)
  .then(descriptor.process)
  .then(res => {
    const { next } = descriptor
    if (!next) return res
    if (next.sequential && next.parallel) {
      throw new Error(`Can't have both 'sequential' and 'parallel' at same time.`)
    }
    if (next.sequential) return processNextSequential(next, res)
    if (next.parallel) return processNextParallel(next, res)
  })
  .then(res => {
    const { exclude } = descriptor
    if (!exclude) return res
    return processExclude(exclude, res)
  })
  .catch(e => console.log(e))
  .then(res => res)

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
  return Promise.all(
    Array.from(res).map(item =>
      crawl({ url: item[next.url], prevRes: item })
        .then(parse).then(next.process))
  )
}

function processExclude(exclude, res) {
  return Array.from(res)
    .filter(item => !exclude(item))
}
