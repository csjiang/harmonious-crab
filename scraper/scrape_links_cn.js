const Horseman = require('node-horseman');
const horseman = new Horseman({
	loadImages: false,
	timeout: 20000
});

const Communique = require('../server/db/models').Communique;

let allLinks = [];

function getLinksChinese(){
	console.log('getting links from Chinese page!');
	return horseman.evaluate(function(){
		var someNewLinks = [];
		$('body > div.cbody > div.rebox.wjbox > div.rebox_r.fl > div.rebox_news > ul > li > a').each(function( item ){
			const link = {
				title : $(this).text(),
				url : $(this).attr("href"),
				language: '中文',
			};
			someNewLinks.push(link);
		});
		return someNewLinks;
	});
};

function hasNextPageChinese(){
	return new Promise( function( resolve, reject ){
		return horseman.evaluate(function() {
			return jQuery('a:contains("下一页")').length;
		})
		.then(function(hasNext) {
			resolve(hasNext);
		});
	});
};

function scrapeChinese(){
	console.log('scraping Chinese page!');
	
	return new Promise( function( resolve, reject ){
		return getLinksChinese()
		.then(function(newLinks){
			
			allLinks = allLinks.concat(newLinks);

			return hasNextPageChinese()
			.then(function(hasNext){
				if (hasNext){
					return horseman
						.click("#pages > a:nth-last-of-type(2)")
						.waitForNextPage()
						.then( scrapeChinese );
				} 
			});
		})
		.then( resolve );
	});
};

horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://www.fmprc.gov.cn/web/ziliao_674904/1179_674909/default.shtml')
    .waitForSelector('body > div.cbody > div.rebox.wjbox > div.rebox_r.fl > div.rebox_news')
    .then( scrapeChinese )
    .finally(function(){
	  	console.log('links scraped: ' + allLinks.length + allLinks);

		Communique.bulkCreate(allLinks, {returning: true})
		.then(function(createdComms) {
			console.log('comms successfully created!');
			console.log(createdComms);
		})
		.catch(console.error);

		horseman.close();
	});