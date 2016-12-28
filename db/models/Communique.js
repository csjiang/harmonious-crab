const Sequelize = require('sequelize');
const db = require('../_db');
// const fillInCommDetails = require('../../scrape_article');

module.exports = db.define('communique', {
	title: {
	  	type: Sequelize.TEXT, //Some titles are pretty long
	  	allowNull: false,
	},
	date: {
		type: Sequelize.DATEONLY,
	},
	content: {
		type: Sequelize.TEXT,
		defaultValue: '',
	},
	url: {
		type: Sequelize.TEXT, 
		allowNull: false,
		validate: {
			isUrl: true, 
		},
	}
}, {
	// getterMethods: {},
	// instanceMethods: {},
	classMethods:{
		//in-progress
		// findByDate: function (date) {
		// 	return this.findAll({
		// 		where: {
		// 			date: {
						
		// 			}
		// 		}
		// 	})
		// 	.then(function (foundByDate) {
		// 		return foundByDate;
		// 	})
		// },

		findByTitle: function(keyword) {
			return this.findAll({
				where: { 
					title: {
						$like: `%${keyword}%`
					} 
				}
			})
			.then(function (foundByTitle) {
				return foundByTitle;
			})
		},

		findByContent: function(keyword) {
			return this.findAll({
				where: { 
					content: {
						$like: `%${keyword}%`
					} 
				}
			})
			.then(function (foundByContent) {
				return foundByContent;
			})
		}
	},
	hooks: {
		beforeBulkCreate: function (instances, options) {
			instances.forEach(function(instance) {
		      const fullUrl = 'http://www.fmprc.gov.cn/mfa_eng/wjdt_665385/2649_665393' + instance.url.slice(1);
		      instance.url = fullUrl;
		      // fillInCommDetails(instance.url);
			});
	    },
	    afterUpdate: function(instance) {
	    	const date = instance.date.replace("/", "-");
		    instance.date = date;
	    },
	},
});