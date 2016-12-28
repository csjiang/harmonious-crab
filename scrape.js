const scrape = require('./scrape_article');

const Communique = require('./db/models').Communique;

Communique.findAll()
.then(found => {
	found.forEach(comm => scrape(comm.url))
})
.catch(console.error);