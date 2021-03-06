const Horseman = require('node-horseman');
const horseman = new Horseman({
	loadImages: false,
	timeout: 10000,
});

const Communique = require('../server/db/models').Communique;

let allLinks = [];

function getLinks(){
	console.log('getting links!');
	return horseman.evaluate(function(){
		//don't use ES6 here! 'let' breaks evaluate! 
		var someNewLinks = [];
		$("body > div.container.clearfix > div.main.fl > div.newsLst_mod > ul > li > a").each(function( item ){
			const link = {
				title : $(this).text(),
				url : $(this).attr("href"),
				language: 'English',
			};
			someNewLinks.push(link);
		});
		return someNewLinks;
	});
};

function hasNextPage(){
	return new Promise( function( resolve, reject ){
		return horseman.evaluate(function() {
			return jQuery('a:contains("Next")').length;
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
    .open('http://www.fmprc.gov.cn/mfa_eng/wjdt_665385/2649_665393/')
    .waitForSelector('body > div.container.clearfix > div.main.fl > div.newsLst_mod')
    .then( scrape )
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