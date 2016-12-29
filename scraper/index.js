const scrapeLinks = require('./scrape_links');
// const scrapeArticle = require('./scrape_article');

const Communique = require('../db/models').Communique;

// Communique.findAll()
// .then(found => {
// 	found.forEach(comm => scrape(comm.url))
// })
// .catch(console.error);

const englishSiteArgs = {
	url: 'http://www.fmprc.gov.cn/mfa_eng/wjdt_665385/2649_665393/',
	selectorToAwait: 'body > div.container.clearfix > div.main.fl > div.newsLst_mod',
	linkSelector: 'body > div.container.clearfix > div.main.fl > div.newsLst_mod > ul > li > a',
	language: 'English',
	nextSelector: 'a:contains("Next")',
	selectorToClick: '#pages > a:nth-last-of-type(2)',
};

const { 
  url: a, 
  selectorToAwait: b, 
  linkSelector: c,
  language: d,
  nextSelector: e,
  selectorToClick: f,
} = englishSiteArgs;


const chineseSiteArgs = {
	url: 'http://www.fmprc.gov.cn/web/ziliao_674904/1179_674909/default.shtml',
	selectorToAwait: 'body > div.cbody > div.rebox.wjbox > div.rebox_r.fl > div.rebox_news',
	linkSelector: 'body > div.cbody > div.rebox.wjbox > div.rebox_r.fl > div.rebox_news > ul > li > a',
	language: '中文',
	nextSelector: 'a:contains("下一页")',
	selectorToClick: '#pages > a:nth-last-of-type(2)',
};

const { 
  url: g, 
  selectorToAwait: h, 
  linkSelector: i,
  language: j,
  nextSelector: k,
  selectorToClick: l,
} = chineseSiteArgs;


// Get English MOFA site links
scrapeLinks(a, b, c, d, e, f);

// Get Chinese MOFA site links 
// scrapeLinks(g, h, i , j, k, l);

