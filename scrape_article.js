const Horseman = require('node-horseman');
const horseman = new Horseman({
	loadImages: false,
	timeout: 20000, 
	//I've had to set really long timeouts because I'm testing while on vacation in China... 
});

const Communique = require('./db').Communique;

const scrapeCommuniqueInstance(){
	console.log('scraping Communique instance!');
	return horseman.evaluate(function(){
		let theCommunique = {};
		theCommunique.date = $("#News_Body_Time").text();
		theCommunique.content = $("body > div.container.clearfix > div > div.content_mod > div.content").text();
		console.log(theCommunique);
		return theCommunique;
	});
};

const scrapeAndSave(){
	console.log('scraping and saving Communique!');
	
	return new Promise( function( resolve, reject ){
		return scrapeCommuniqueInstance()
		.then(function(scrapedCommunique){
			return Communique.find({
				where: { url }
			})
			.then(foundCommunique => foundCommunique.update(scrapedCommunique))
			.then(updatedCommunique => {
				console.log('Communique record updated!', updatedCommunique);
			})
			.catch(console.error);
		})
		.then( resolve );
	});

module.exports = function scrapeCommunique(url) {
	horseman
	  .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	  .open(url)
	  .waitForSelector('body > div.container.clearfix > div > div.content_mod')
	  .then( scrapeAndSave )
	  .finally(function(){
	  	console.log('successfully updated!');
		horseman.close();
	});
};
