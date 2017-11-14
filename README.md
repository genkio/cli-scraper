# cli-scraper
[![node6.10.1](https://img.shields.io/badge/node-6.10.1-green.svg)](https://nodejs.org/en/blog/release/v0.6.10/)
[![npm](https://img.shields.io/npm/v/cli-scraper.svg)](https://www.npmjs.com/package/cli-scraper)

> cli-scraper is a Node web scraper library at its core, it tries to make it easy for you to scrape and consume static web pages in your terminal, if you're like me, living in the terminal world, it gives you another reason to stay. :joy: p.s. I know the name sounds bit strange, it does not scrape anything from cli, scraper-for-cli maybe better? Naming is hard!

## Getting started

### Installation

> *Note: cli-scraper was created with Node v6.10.1 on macOS, for Windows users out there, please let me know if it does not work well for you.* :bow:

*This README is also available in: [English](README.md), [中文](README.chs.md).*

To install cli-scraper globally on your machine, run:
```
$ yarn global add cli-scraper
# or "npm i -g cli-scraper"
```

### Usage

Once cli-scraper is installed, you'll be able to interact with `clis` command in your terminal,
to get cli-scraper to work, all you need to do is to:

1. generate a new configuration file with command `$ clis init hello.js`.
2. let cli-scraper know how to locate the content you'd like to extract by providing it with the css selectors.
3. lastly, run `$ clis process hello.js`.

**Example** - navigating to https://bing.com and scraping logo text:

Generate configuration file with `init` command by running `$ clis init bing.js`
```js
// here's the completed configuration, copy paste into your bing.js, try it out.
module.exports = {
  url: 'https://www.bing.com/',     // target url
  process: function ({ $ }) {
    return $('.hp_sw_logo').text()  // grab target element via css selector, then get the text out of it
  },
  finally: function (res) {
    console.log(res + 'go :)')      // what you want to do with the result
  }
}
```
Process the configuration with `process` command by running `$ clis process bing.js`

This is the bare minimum configuration you will need for scraping, you may notice there are more properties
in the default configuration than the example above, I'll explain them in detail later, before we do that, I'd like to show you another example.

Let's set the stage first, you want to get a sneak peek at your favorite news site, not only the most recent news list, but also
some content (maybe the publish date) within each news article, the final output would be something like **news title [at] publish date**

**Example** - get a sneak peek at your favorite news site:

Generate configuration file with `init` command by running `$ clis init news.js`
```js
// here's the completed configuration, copy paste into your news.js, try it out.
module.exports = {
  url: 'http://www.news.cn/world/index.htm',
  requestOptions: {
    timeout: 10000                     // give up if request takes more than 10 seconds
  },
  randomUserAgent: true,               // set random user-agent header when requesting
  printRequestUrl: true,
  randomWait: 5,                       // wait randomly between 1 to 5 seconds before another request
  process: function ({ $ }) {
    return $('.firstPart ul.newList01 > li > a').map((i, el) => {
      return {
        articleUrl: $(el).prop('href'),
        title: $(el).text()
      }
    })
  },
  next: {
    key: 'articleUrl',                 // where the next to-be-processed article url is stored
    process: function ({ $, prevRes }) {
      return Object.assign(prevRes, {  // merge previous (list) result with new result (article page content)
        date: $('.h-news > .h-info > .h-time').text()
      })
    }
  },
  finally: function (res) {
    for (let item of res) {
      if (item.date) {
        console.log(`${item.title} [at] ${item.date}`)
      }
    }
  },
  catch: function (err) {
    console.log(err)                   // if there's an error, console log it out
  }
}
```
Process it with `process` command by running `$ clis process news.js`

## Default configuration

This is the default configuration you'll get after running `$ clis init yetAnotherConfig.js`, I'll explain them one by one next.
```js
module.exports = {
  url: '',
  urls: [],
  requestOptions: {
    timeout: 10000,
    gzip: true
  },
  beforeRequest: function () { return {} },
  afterProcessed: function (res) { return res },
  debugRequest: false,
  randomUserAgent: false,
  printRequestUrl: true,
  promiseLimit: 3,
  randomWait: 5,
  process: function ({ $, url, error, createdAt }) {
    if (error) throw Error(error)
    throw Error('Missing implementation')
  },
  next: {
    key: '',
    process: function ({ $, url, error, createdAt, prevRes }) {
      if (error) throw Error(error)
      throw Error('Missing implementation')
    }
  },
  finally: function (res) {
    throw Error('Missing implementation')
  },
  catch: function (err) {
    console.error(err)
  }
}
```
Required
- `url`: **String** target url you'd like to scrape.
- `process`: **Function** process function, it receives an object as argument, within that object, you have access to:
  - `$`: **Function** the scraped html data wrapped by [cheerio](https://github.com/cheeriojs/cheerio), which allows you to do all kinds of extractions,
  please refer to cheerio's [documentation](https://cheerio.js.org/) for more information.
  - `url`: **String** target url.
  - `error`: **String** error message (if we encountered an error while scraping).
  - `createdAt`: **String** scraped datetime (ISO-8601).
- `finally`: **Function** result handler function, it receives the processed result.
- `catch`: **Function** exception handler function, it's not required, however you should have it taken care of.

Next
- `next`: **Object** this is the most interesting feature cli-scraper offers, it has two properties:
  - `key`: **String** whatever key you defined in your outer process function's return object, which points to the next target url.
  - `process`: **Function** same as the outer process function, it receives one more property inside of the object called
 `prevRes`, which keeps hold of the previous processed result object, as what we did in the second example (merged news title with its publish date), you can do
`Object.assign(prevRes, { /* new result */ })` to merge the results.

Be a good bot ***respect [Robots.txt](http://www.robotstxt.org/)***
- `promiseLimit`: **Number (default: 3)** imaging you scraped a list with 10 items in the first process function, then move on to `next` cycle, which will handle those 10 urls in parallel, and this setting limits the parallel requests.
- `randomWait`: **Number (default: 5)** it waits randomly between 1 to 5 seconds before starting off another request.

Utilities
- `debugRequest`: **Boolean (default: false)** console log out request detail.
- `printRequestUrl`: **Boolean (default: true)** console log out target url before starting each scrape.
- `randomUserAgent`: **Boolean (default: false)** randomly (out of 5 most commonly used user-agent) set a user-agent in request header.

Go infinity and beyond
- `urls`: **Array** yes, cli-scraper can work with more than one target urls. Note, urls will be scraped sequentially.
- `requestOptions`: **Object** cli-scraper uses [request](https://github.com/request/request) library under the hood,
hence it accepts pretty much all options that request offers, please take a look at request
[documentation](https://github.com/request/request#requestoptions-callback) for more information
- `beforeRequest`: **Function** before request hook function, it will be triggered before every request, you can use it
to for example set different proxy for sending out the request. Remember cli-scraper expects you to return an object out of it.
- `afterProcessed`: **Function** after request process hook function, it receives the processed result as the argument.

### Debugging tips

In order to debug your configuration (maybe the content you're expecting was not extracted), first, run `$ which clis` to determine where `clis` command is installed, you may get this as return `/usr/local/bin/clis`

Next you can start clis with [devtool](https://github.com/Jam3/devtool) by running `$ devtool /usr/local/bin/clis process bing.js`, set a break point, then dive in.

Happy coding :)
