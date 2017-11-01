'use strict'

const crawl = require('./lib/crawler')
const parse = require('./lib/parser')
const descriptor = require('../tests/bing')

crawl({ url: descriptor.url })
  .then(parse)
  .then(descriptor.process)
  .then(res => {
    const { next } = descriptor
    if (!next) return res
    return processNext(next, res)
  })
  .then(res => {
    console.log(res)
  })
  .catch(e => console.log(e))

function processNext(next, res) {
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
