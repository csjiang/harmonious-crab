var osmosis = require('osmosis');

osmosis
.get('http://www.fmprc.gov.cn/web/ziliao_674904/1179_674909/default.shtml')
.click('.header')
.then(function(window) {
	console.log(window.document.querySelector('#News_Body_Time'));
	window.find('body > div.container.clearfix > div.main.fl > div.newsLst_mod > ul > li > a')
	.follow('@href')
	// .follow('@href')
	// .paginate('.totallink + a.button.next:first')
	// .find('p > a')
	// .follow('@href')
	.set({
	    'title':        'body > div.container.clearfix > div > div.content_mod > h2.title',
	    'date':  '#News_Body_Time',
	    'text':  'body > div.container.clearfix > div > div.content_mod > div.content',
	    // 'date':         'time@datetime',
	    // 'latitude':     '#map@data-latitude',
	    // 'longitude':    '#map@data-longitude',
	    // 'images':       ['img@src']
	})
	.data(function(data) {
	    console.log(data);
	})
	.log(console.log)
	.error(console.log)
	.debug(console.log)
})
