'use strict'

const cheerio = require('cheerio')

module.exports = res => {
  const { html, url } = res
  return { $: cheerio.load(html), url }
}
