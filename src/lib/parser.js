'use strict'

const cheerio = require('cheerio')

module.exports = res => {
  const { html, url, error } = res
  return { $: cheerio.load(html), url, error }
}
