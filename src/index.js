'use strict'

require('./lib/crawler')(process.argv[2]).then(response => {
  console.log(response)
})
