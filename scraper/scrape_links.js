const Horseman = require('node-horseman');
const db = require('../db');
const Communique = require('../db/models').Communique;

let allLinks = [];

const horseman = new Horseman({
	loadImages: false,
	timeout: 20000, 
	//I've had to set really long timeouts because I'm testing while on vacation in China... 
});

function getLinks( linkSelector, language ){
	console.log('Getting links!');
	return horseman.evaluate(function( linkSelector, language ){
		//don't use ES6 here! 'let' breaks 'evaluate'! 
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

function hasNextPage( nextSelector ){
	return new Promise( function( resolve, reject ){
		return horseman.evaluate(function( nextSelector ) {
			return $( nextSelector ).length;
		})
		.then(function(hasNext) {
			resolve(hasNext);
		});
	});
};

function scrape( linkSelector, language, nextSelector, selectorToClick ){
	console.log('Scraping!');
	
	return new Promise( function( resolve, reject ){
		return getLinks( linkSelector, language )
		.then(function(newLinks){			
			allLinks = allLinks.concat(newLinks);

			return hasNextPage( nextSelector )
			.then(function(hasNext){
				if (hasNext){
					return horseman
						.click( selectorToClick ) 
						.wait(5000)
						.then( scrape ( linkSelector, 
							language,
							nextSelector, 
							selectorToClick 
						));
				} 
			});
		})
		.then( resolve );
	});
};

module.exports = function(url, selectorToAwait, linkSelector, language, nextSelector, selectorToClick) {
	
	horseman
	  	.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	  	.open(url) 
	  	.waitForSelector(selectorToAwait) 
	  	.then( scrape ( linkSelector, language, nextSelector, selectorToClick ))
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
	  	});
}