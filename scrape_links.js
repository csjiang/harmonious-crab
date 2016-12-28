const Horseman = require('node-horseman');
const horseman = new Horseman({
	loadImages: false,
});

const allLinks = [];

function getLinks(){
	console.log('getting links!');

	return horseman.evaluate(function(){
		var someNewLinks = [];
		$("body > div.container.clearfix > div.main.fl > div.newsLst_mod > ul > li > a").each(function( item ){
			const link = {
				title : $(this).text(),
				url : $(this).attr("href")
			};
			someNewLinks.push(link);
		});
		return someNewLinks;
	});
};

function hasNextPage(){
	console.log('checking for next page!', $('a:contains("Next")').length)
	return $('a:contains("Next")').length;
};

function scrape(){
	console.log('scraping!');
	
	return new Promise( function( resolve, reject ){
		return getLinks()
		.then(function(newLinks){
			
			allLinks = allLinks.concat(newLinks);

			if ( allLinks.length < 30 ){
				return hasNextPage()
				.then(function(hasNext){
					if (hasNext){
						return horseman
							.click("#pages > a:nth-last-of-type(2)")
							.wait(1000)
							.then( scrape );
					} 
				});
			}
		})
		.then( resolve );
	});
};

horseman
  .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
  .open('http://www.fmprc.gov.cn/web/ziliao_674904/1179_674909/default.shtml')
  .waitForSelector("div.newsLst_mod")
  .then( scrape )
  .finally(function(){
  	console.log(allLinks);
	console.log(allLinks.length);
	horseman.close();
	});
