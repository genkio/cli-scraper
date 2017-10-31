'use strict'

const cheerio = require('cheerio')

module.exports = res => {
  return Object.assign(res, { $: cheerio.load(res.html) })
}
