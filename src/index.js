'use strict'

const crawl = require('./lib/crawler')
const parse = require('./lib/parser')
const descriptor = require('../tests/bing')

crawl({ url: descriptor.url })
  .then(parse)
  .then(descriptor.handler)
  .then(res => {
    const { next } = descriptor
    if (!next) return res
    return handleNext(next, res)
  })
  .then(res => {
    console.log(res)
  })
  .catch(e => console.log(e))

function handleNext(next, res) {
  return Array.from(res)
    .reduce((promise, item) => {
      return promise.then(result => {
        return crawl({ url: item[next.url], prevPage: item })
          .then(parse)
          .then(next.handler)
          .then(Array.prototype.concat.bind(result))
      })
    }, Promise.resolve([]))
}
