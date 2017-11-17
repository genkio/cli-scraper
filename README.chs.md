# cli-scraper
![build](https://img.shields.io/circleci/project/github/j1wu/cli-scraper.svg)
[![node6.10.1](https://img.shields.io/badge/node-6.10.1-green.svg)](https://nodejs.org/en/blog/release/v0.6.10/) [![npm](https://img.shields.io/npm/v/cli-scraper.svg)](https://www.npmjs.com/package/cli-scraper)

![](https://forthebadge.com/images/badges/built-with-love.svg)
![](https://forthebadge.com/images/badges/uses-js.svg)
![](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)
> cli-scraper 的外表下其实是一个基于 Node 的网页爬虫库，开发初衷是希望能帮助大家更方便的开发自己的爬虫，以便在命令行中浏览静态网页内容。如果你和我一样，生活在命令行世界中，那它给了你又一个留下的理由。:joy: p.s. 库名比较怪，因为它并非可以爬 命令行中的内容，或许 scraper-for-cli 会更好一些？命名不易啊！

## Getting started

### Installation

> *Note: cli-scraper 是用 Node v6.10.1 在 macOS 上开发的, Windows 用户们如果使用出现问题，还望告知。* :bow:

*这份文档不同语言版本： [English](README.md), [中文](README.chs.md).*

在命令行中运行如下命名，即可将 cli-scraper 全局安装：
```
$ yarn global add cli-scraper
# or "npm i -g cli-scraper"
```

### Usage

一旦安装完成，你便可在命令行中使用 `clis` 命令了，要让 cli-scraper 开始工作，仅需如下三步：

1. 运行 `$ clis init hello.js` 这条命令，新建一个新的配置文件。
2. 通过编写 CSS 选择条件，告诉 cli-scraper 如何定位到你希望从网页中提取的内容。
3. 最后，运行 `$ clis process hello.js`。

**范例** - 访问 https://bing.com 并提取 logo 文本：

运行 init 命令生成配置文件 `$ clis init bing.js`
```js
// 如下是完成后的配置文件，复制粘贴到你本地的 bing.js，试试吧。
module.exports = {
  url: 'https://www.bing.com/',     // 目标地址
  process: function ({ $ }) {
    return $('.hp_sw_logo').text()  // 选中目标元素，并提取其中文本
  },
  finally: function (res) {
    console.log(res + 'go :)')      // 结果任你处置
  }
}
```
运行 process 命令开工 `$ clis process bing.js`

上面就是让 cli-scraper 工作的最小配置，你本地生成的默认配置文件中的属性更多，我会在随后的篇幅中对其逐一说明，在此之前，让我们再举一个 🌰。

先假想一个场景，你想在命令行中查看最常去新闻网站的更新，不仅是新闻列表，还想知道每篇文章中的一些内容（譬如发布时间），你最终希望在命令行中看到的输出是 **新闻标题 [at] 发表时间**

**Example** - 快速查看新闻网站更新：

运行 init 命令生成配置文件 `$ clis init news.js`
```js
// // 如下是完成后的配置文件，复制粘贴到你本地的 news.js，试试吧。
module.exports = {
  url: 'http://www.news.cn/world/index.htm',
  requestOptions: {
    timeout: 10000                     // 如果10秒还未成功则放弃
  },
  randomUserAgent: true,               // 在访问时随机伪装 user-agent
  printRequestUrl: true,
  randomWait: 5,                       // 每次请求随机间隔1到5秒
  process: function ({ $ }) {
    return $('.firstPart ul.newList01 > li > a').map((i, el) => {
      return {
        articleUrl: $(el).prop('href'),
        title: $(el).text()
      }
    })
  },
  next: {
    key: 'articleUrl',                 // 新闻列表结果中的新闻文档链接健
    process: function ({ $, prevRes }) {
      return Object.assign(prevRes, {  // 合并列表和对应的文章结果
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
    console.log(err)                   // 如果遇到异常，打印出来
  }
}
```
运行 process 命令开工 `$ clis process news.js`

## Default configuration

如下便是 `$ clis init yetAnotherConfig.js` 命令生成的默认配置文件。
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
必填项
- `url`: **String** 目标网址。
- `process`: **Function** 内容提取函数，该函数会接收到一个对象参数，该对象中有如下属性可供你差遣：
  - `$`: **Function** 载入了目标 HTML 文档的 [cheerio](https://github.com/cheeriojs/cheerio) 函数，通过这个函数你便能进行任意的提取操作，请参考 cheerio 的[文档](https://cheerio.js.org/)以获取更多信息。
  - `url`: **String** 目标网址。
  - `error`: **String** 错误信息（如果爬取遇到了问题）。
  - `createdAt`: **String** ISO-8601 标准的爬取时间。
- `finally`: **Function** 爬取结果处理函数，提取函数的结果会传给它。
- `catch`: **Function** 异常处理函数。

然后...
- `next`: **Object** 这算是本库最有趣的功能，这个对象中有两个属性：
  - `key`: **String** 外层内容提取函数中，提取到需要接下来继续爬取的网址的健。
  - `process`: **Function** 和外层一样的内容提取函数，不过它接收的对象参数中，还多带了个属性 `prevRes`，通过这个属性，可以访问到外层提取到的内容，如此一来便可通过 `Object.assign(prevRes, { /* 新内容 */ })` 的操作将内外层的提取到的内容加以合并（第二个例子中便对新闻列表的标题，和新闻页面发表日期进行了合并）

做个好爬虫 ***尊重 [Robots.txt](http://www.robotstxt.org/)***
- `promiseLimit`: **Number (默认: 3)** 试想你在第一个提取函数中提取到了10个下一层链接，由 `next` 中的提取函数接手处理，第二层的提取函数将对这10个链接进行并行处理，而这个设置对并发数进行了限制。
- `randomWait`: **Number (默认: 5)** 每次请求随机间隔1到5秒。

辅助项
- `debugRequest`: **Boolean (默认: false)** 打印出请求详细信息。
- `printRequestUrl`: **Boolean (默认: true)** 在爬取前打印出目标网址。
- `randomUserAgent`: **Boolean (默认: false)** 从5个最常见的 user-agent 中随机选一个设置到请求头中。

其他项
- `urls`: **Array|Function** 当然，cli-scraper 也能处理多个目标网址，网址数组或返回数组的方法均可。但请注意，这部分请求是串行处理的。
- `requestOptions`: **Object** cli-scraper 底层是基于 [request](https://github.com/request/request) 这个库的，因此 request 支持的配置项也同样可用于这里，更多信息请参考 request [文档](https://github.com/request/request#requestoptions-callback)。
- `beforeRequest`: **Function** 请求前钩子函数，它会在每次请求前被触发，可供你譬如为每次请求头添加一个不同的代理。请注意你需要在该函数中返回一个对象。
- `afterProcessed`: **Function** 完成处理后钩子函数，它会收到处理后的结果作为参数。

### Debugging tips

如果需要 debug （譬如遇到你期望的内容未被提取到的情况），首先，通过运行 `$ which clis` 命令可以查看到 `clis` 命令的安装路径（`/usr/local/bin/clis`），接下来可以借助 [devtool](https://github.com/Jam3/devtool) 这个库，用这个命令来 设个断点 debug 一探究竟 `$ devtool /usr/local/bin/clis process bing.js`

Happy coding :)
