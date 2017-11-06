'use strict'

const cheerio = require('cheerio')

module.exports = res => {
  const { html, url, error, prevRes } = res
  return { $: cheerio.load(html), url, error, prevRes }
}
