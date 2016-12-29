const Horseman = require('node-horseman');
const horseman = new Horseman({
	loadImages: false,
	timeout: 20000, 
	//I've had to set really long timeouts because I'm testing while on vacation in China... 
});

// const db = require('../db');
const Communique = require('../db/models').Communique;

let allLinks = [];

function getLinks(){
	console.log('getting links!');
	return horseman.evaluate(function(){
		//don't use ES6 here! 'let' breaks evaluate! 
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

function hasNextPage(){
	return new Promise( function( resolve, reject ){
		return horseman.evaluate(function() {
			return jQuery('a:contains("下一页")').length;
		})
		.then(function(hasNext) {
			resolve(hasNext);
		});
	});
};

function scrape(){
	console.log('scraping!');
	
	return new Promise( function( resolve, reject ){
		return getLinks()
		.then(function(newLinks){
			
			allLinks = allLinks.concat(newLinks);

			return hasNextPage()
			.then(function(hasNext){
				if (hasNext){
					return horseman
						.click("#pages > a:nth-last-of-type(2)")
						.waitForNextPage()
						.then( scrape );
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
  .then( scrape )
  .finally(function(){
  	console.log(allLinks);
	console.log(allLinks.length);
	
	Communique.bulkCreate(allLinks, {returning: true})
	.then(function(createdComms) {
		console.log('comms successfully created!');
		console.log(createdComms);
	})
	.catch(console.error);

	horseman.close();
	});