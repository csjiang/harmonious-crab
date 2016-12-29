const Horseman = require('node-horseman');
const _ = require('lodash');

const Communique = require('../db/models').Communique;

const horseman = new Horseman({
	loadImages: false,
	timeout: 10000, 
});

let queue = [];

Communique.findAll()
.then(results => queue = results)
.then(() => {

	let scrapedCommunique = {};

	function addContent(url){
		console.log('Scraping Communique!');	
		return new Promise( function( resolve, reject ){
			return Communique.findById(current.id)
			.then(foundCommunique => {
				return foundCommunique.update(scrapedCommunique);
			})
			.then(updatedCommunique => {
				console.log(updatedCommunique);
			})
			.then( resolve );
		});
	};

	function getLinks(){
	  return horseman.evaluate( function(){
	  	var toUpdate = {};
	  	toUpdate.date = $('#News_Body_Time').text();
	  	toUpdate.content = $('body > div.container.clearfix > div > div.content_mod > div.content').text();
	  	return toUpdate;
	  });
	}
	function scrape(){

	  return new Promise( function( resolve, reject ){
	    return getLinks()
	    .then(function(toUpdate){
	    	console.log(toUpdate);
	      	return Communique.findById(current.id)
			.then(foundCommunique => {
				return foundCommunique.update(toUpdate);
			})
			.then(updatedCommunique => {
				console.log('successfully updated: ' + updatedCommunique.date);
			})

	      if (queue.length > 0) {
	      	current = queue.pop();
	        while (current.language !== 'English') {
				current = queue.pop();
			}
			console.log('New current!');

	        return horseman
	          .open(current.url)
	          .then(scrape);
	      }
	    })
	    .then( resolve );
	  });
	}

	let current = queue.pop();
	while (current.language !== 'English') {
		current = queue.pop();
	}
	console.log(current);

	horseman
	.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	.open(current.url)
	.waitForSelector('body > div.container.clearfix > div > div.content_mod > div.content')
	.then(scrape)
	.finally(function() {
		console.log('All updates completed!');
		horseman.close();
	})
	.catch(console.error);
})
.catch(console.error);
