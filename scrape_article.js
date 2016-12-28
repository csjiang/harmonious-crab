const Horseman = require('node-horseman');
// for testing 
// const url = 'http://www.fmprc.gov.cn/mfa_eng/wjdt_665385/2649_665393/t1418254.shtml';

const Communique = require('./db/models').Communique;

let scrapedCommunique = {};

function addContent(url){
	console.log('Scraping Communique!');	
	return new Promise( function( resolve, reject ){
		return Communique.find({
			where: { url }
		})
		.then(foundCommunique => {
			return foundCommunique.update(scrapedCommunique);
		})
		.then(updatedCommunique => {
			console.log(updatedCommunique);
		})
		.then( resolve );
	});
};

module.exports = function(url) {
	const horseman = new Horseman({
		loadImages: false,
		// timeout: 10000, 
	});
	
	horseman
	  .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	  .open(url)
	  .waitForSelector('body > div.container.clearfix > div > div.content_mod > div.content')
	  .text('#News_Body_Time')
	  .then(function(text) {
	  	scrapedCommunique.date = text;
	  })
	  .text('body > div.container.clearfix > div > div.content_mod > div.content')
	  .then(function(text) {
	  	scrapedCommunique.content = text;
	  })
	  .finally(function(){
	  	addContent(url)
	  	.then(function() {
		  	console.log('Successfully updated!');
			horseman.close();
	  	})
	});
};