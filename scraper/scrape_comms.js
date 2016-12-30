const Horseman = require('node-horseman');
const _ = require('lodash');
const Communique = require('../db/models').Communique;

Communique.findAll({
	where: {
		content: '',
		url: {
			$notLike: '%.pdf' 
		},
	}
})
.then(results => {
	let queue = results;
	let current;

	const horseman = new Horseman({
		loadImages: false,
		timeout: 10000, 
	});

	// The following event listeners enable the process to restart when the scraper crashes. Hooray for automation!

	// handles SequelizeBaseErrors, evaluation errors, etc 
	horseman.on('error', function(message, trace) {
		console.log('A wild error appeared! ' + message);
		console.log(trace);
		return horseman
		  .open(current.url)
		  .waitForSelector('#News_Body_Title')
		  .then(scrape);
	});

	// handles resource timeouts
	horseman.on('timeout', function(msg) {
		console.log('Timeout ... oops...')
		return horseman
		  .open(current.url)
		  .waitForSelector('#News_Body_Title')
		  .then(scrape);
	});

	// handles failed GET requests
	horseman.on('resourceReceived', function(response) {
		// console.log(response);
		// console.log(response.status);
		console.log('Resource received!');
		if (response.status !== 200) {
			return horseman
			  .open(current.url)
			  .waitForSelector('#News_Body_Title')
			  .then(scrape);
		}
	});

	// handles URL load failures (?)
	horseman.on('loadFinished', function(status) {
		console.log('loadFinished');
		console.log(status);
		if (status !== 'success') {
			return horseman
			  .open(current.url)
			  .waitForSelector('#News_Body_Title')
			  .then(scrape);
		}
	});

	function getLinksEnglish(){
	  return horseman.evaluate( function(){
		var toUpdate = {};
		if ($('#News_Body_Time').text().length > 0) toUpdate.date = $('#News_Body_Time').text();
		toUpdate.content = $('body > div.container.clearfix > div > div.content_mod > div.content').text();
		return toUpdate;
	  });
	};

	function getLinksChinese(){
		return horseman.evaluate( function(){
			var toUpdate = {};
			if ($('#News_Body_Time').text().length > 0) toUpdate.date = $('#News_Body_Time').text();
			toUpdate.content = $('#News_Body_Txt_A').text();
			return toUpdate;
		});
	};

	function getLinks() {
	  	return current.language === 'English'
	  	? getLinksEnglish() 
	  	: getLinksChinese(); 
	};

	function newCurrent() {
		current = queue.pop();
		console.log('New current! ' + current.title);
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
				newCurrent();
				return horseman
				  .open(current.url)
				  .waitForSelector('#News_Body_Title')
				  .then(scrape);
		  	}
		})
		.then( resolve );
	  });
	};

	newCurrent();

	return horseman
	.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
	.open(current.url)
	.waitForSelector('#News_Body_Title')
	.then(scrape)
	.then(function() {
		console.log('All updates completed!');
		horseman.close();
		return toUpdateResults;
	}); 
})
.then(results => console.log(results)); //I haven't attached error catchers to my promise chains here because I want the process to restart itself on error instead of exiting. 