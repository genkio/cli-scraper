'use strict'

const cheerio = require('cheerio')
const _ = require('lodash')
const request = require('request')

module.exports = function main(res) {
  const { html = '', url, error, prevRes, createdAt } = res
  return {
    $: cheerio.load(html),
    url,
    error,
    prevRes,
    createdAt,
    request,
    _
  }
}
