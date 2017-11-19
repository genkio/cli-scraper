'use strict'

const cheerio = require('cheerio')

module.exports = function main(res) {
  const { html = '', url, error, prevRes, createdAt } = res
  return {
    $: cheerio.load(html),
    url,
    error,
    prevRes,
    createdAt
  }
}
