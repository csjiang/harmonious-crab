const Horseman = require('node-horseman');
const _ = require('lodash');
const Communique = require('../db/models').Communique;

Communique.findAll({
	where: {
		content: ''
	}
})
.then(results => {
	let queue = results;

	const horseman = new Horseman({
		loadImages: false,
		timeout: 10000, 
	});

	function getLinksEnglish(){
	  return horseman.evaluate( function(){
		var toUpdate = {};
		toUpdate.date = $('#News_Body_Time').text();
		toUpdate.content = $('body > div.container.clearfix > div > div.content_mod > div.content').text();
		return toUpdate;
	  });
	};

	function getLinksChinese(){
		return horseman.evaluate( function(){
			var toUpdate = {};
			toUpdate.date = $('#News_Body_Time').text();
			toUpdate.content = $('#News_Body_Txt_A').text();
			return toUpdate;
		});
	};

	function getLinks() {
	  	return current.language === 'English'
	  	? getLinksEnglish() 
	  	: getLinksChinese(); 
	};

	function scrape(){

	  return new Promise( function( resolve, reject ) {

	  	getLinks()
		.then(function(toUpdate){
			Communique.findById(current.id)
			.then(foundCommunique => {
				return foundCommunique.update(toUpdate);
			})
			.then(updatedCommunique => {
				console.log('Successfully updated: ' + updatedCommunique.date);
			})

		  	if (queue.length > 0) {
				current = queue.pop();
				console.log('New current! ' + current.title);

				return horseman
				  .open(current.url)
				  .waitForSelector('#News_Body_Time')
				  .then(scrape);
		  	}
		})
		.then( resolve );
	  });
	};

	let current = queue.pop();
	console.log('New current! ' + current.title);

	return horseman
	.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	.open(current.url)
	.waitForSelector('#News_Body_Time')
	.then(scrape)
	.then(function() {
		console.log('All updates completed!');
		horseman.close();
		return toUpdateResults;
	})
	.catch(console.error);
})
.then(results => console.log(results))
.catch(console.error);
