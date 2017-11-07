'use strict'

exports.MESSAGES = {
  ERROR: {
    MISSING_IMPL: 'Missing implementation.',
    FAILED_TO_CRAWL: 'Oops, we\'re having some problem crawling the target resource'
  }
}

exports.UA = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0'
]

exports.BOT_UA = {
  GBOT: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  GBOT_PLUS: 'Google (+https://developers.google.com/+/web/snippet/)',
  GBOT_NEWS: 'Googlebot-News',
  GBOT_IMAGE: 'Googlebot-Image/1.0',
  GBOT_VIDEO: 'Googlebot-Video/1.0',
  GBOT_FEATURE_PHONE: 'SAMSUNG-SGH-E250/1.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Browser/6.2.3.3.c.1.101 (GUI) MMP/2.0 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)',
  GBOT_SMART_PHONE: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  BING_BOT: 'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  YAHOO_BOT: 'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
  DUCKDUCK_BOT: 'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)',
  BAIDU_BOT: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
  ALEXA_BOT: 'ia_archiver (+http://www.alexa.com/site/help/webmasters; crawler@alexa.com)'
}
