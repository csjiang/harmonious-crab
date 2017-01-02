const Horseman = require('node-horseman');
const _ = require('lodash');
const Communique = require('../server/db/models').Communique;

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
		return retry();
	});

	// handles resource timeouts
	horseman.on('timeout', function(msg) {
		console.log('Timeout ... oops...')
		return retry();
	});

	// handles failed GET requests
	horseman.on('resourceReceived', function(response) {
		console.log('Resource received with status code ' + response.status, response.statusText);
		if (response.status !== 200) {
			console.log(response);
			return retry();
		}
	});

	// handles URL load failures
	horseman.on('loadFinished', function(status) {
		console.log('Page load finished with status ' + status);
		if (status !== 'success') return retry();
	});

	// prevents loading of parser-blocking scripts 
	// doesn't work: https://github.com/baudehlo/node-phantom-simple/issues/98
	// horseman.onResourceRequested = function(requestData, networkRequest) {
	// 	console.log('resource requested ' + requestData.url);
		// console.log(requestData.headers);
		// if (requestData.url.includes('jiathis') || requestData.url.includes('recv1.conac')) {
		// 	networkRequest.abort();
	// };

	function getLinksEnglish() {
	  return horseman.evaluate(function() {
		var toUpdate = {};
		if ($('#News_Body_Time').text().length > 0) toUpdate.date = $('#News_Body_Time').text();
		toUpdate.content = $('body > div.container.clearfix > div > div.content_mod > div.content').text();
		return toUpdate;
	  });
	};

	function getLinksChinese() {
		return horseman.evaluate(function() {
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
		console.log('Currently scraping: ' + current.title);
	};

	function retry() {
		return horseman
		    .open(current.url)
		    .waitForSelector('#News_Body_Title')
		    .then(scrape)
		    .catch(retry);
	};

	function scrape() {
		// Recursively scrapes and updates entries as long as there are items in the queue

	    return new Promise(function(resolve, reject) {

		  	getLinks()
			.then(function(toUpdate) {
				Communique.findById(current.id)
				.then(foundCommunique => {
					return foundCommunique.update(toUpdate);
				})
				.then(updatedCommunique => {
					console.log('Successfully updated entry from ' + updatedCommunique.date);
				});

			  	if (queue.length > 0) {
					newCurrent();
					return retry();
			  	}
			})
			.then(resolve);
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
	})
	.catch(retry);
})
.then(results => console.log(results)); 