'use strict'

const html = element => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    ${element}
  </body>
</html>
`

exports.bing = `
  ${html(
    '<div class="hp_sw_logo hpcLogoWhite" data-fixedpriority="0" data-bm="17">Bing</div>'
  )}
`

exports.newsList = (page = 1) => `
<div class="firstPart">
  <ul class="newList01">
    <li>
      <a href="http://www.news.cn/world/${page}/articles/1.htm">Hello</a>
      <a href="http://www.news.cn/world/${page}/articles/2.htm">World</a>
    </li>
  </ul>
</div>
`

exports.newsArticle = (day = 1) => `
<div class="h-news">
  <div class="h-info">
    <div class="h-time">1970-1-${day}</div>
  </div>
</div>
`
