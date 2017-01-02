const Horseman = require('node-horseman');
const db = require('../server/db');
const Communique = require('../server/db/models').Communique;

let allLinks = [];

const horseman = new Horseman({
	loadImages: false,
	timeout: 20000, 
	//I've had to set really long timeouts because I'm testing while on vacation in China... 
});

module.exports = function(url, selectorToAwait, linkSelector, language, nextSelector, selectorToClick) {

	function getLinks(){
		console.log('Getting links!');
		return horseman.evaluate(function(){
			var someNewLinks = [];
			$( linkSelector ).each(function( item ){
				const link = {
					title : $(this).text(),
					url : $(this).attr('href'),
					language: language,
				};
				someNewLinks.push(link);
			});
			return someNewLinks;
		});
	};

	function hasNextPage(){
		return new Promise( function( resolve, reject ){
			return horseman.evaluate(function() {
				return jQuery( nextSelector ).length;
			})
			.then(function(hasNext) {
				resolve(hasNext);
			});
		});
	};

	function scrape(){
		console.log('Scraping!');
		
		return new Promise( function( resolve, reject ){
			return getLinks()
			.then(function(newLinks){			
				allLinks = allLinks.concat(newLinks);

				return hasNextPage()
				.then(function(hasNext){
					if (hasNext){
						return horseman
							.click( selectorToClick ) 
							.waitForNextPage()
							.then(scrape);
					} 
				});
			})
			.then( resolve );
		});
	};

	
	horseman
	  	.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	  	.open(url) 
	  	.waitForSelector(selectorToAwait) 
	  	.then(scrape)
	  	.finally(function(){
			console.log(allLinks);
			console.log(allLinks.length);
		
			Communique.bulkCreate(allLinks, { returning: true })
			.then(function(createdComms) {
				console.log('Comms successfully created!');
				console.log(createdComms);
			})
			.catch(console.error);

			horseman.close();
	  	})
	  	.catch(console.error);
}