const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('communique', {
	title: {
	  	type: Sequelize.TEXT, //Some titles are pretty long
	  	allowNull: false,
	},
	language: {
		type: Sequelize.ENUM('English', '中文'),
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
	}
}, {
	// getterMethods: {},
	// instanceMethods: {},
	classMethods:{
		//in-progress
		findByDate: function (date) {
			return this.findAll({
				where: {
					date: {
						
					}
				}
			})
			.then(function (foundByDate) {
				return foundByDate;
			})
		},

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
		},

		findByLanguage: function(language) {
			return this.findAll({
				where: { language }
			})
			.then(function (foundByLanguage) {
				return foundByLanguage;
			})
		}
	},
	hooks: {
		beforeBulkCreate: function (instances, options) {
			instances.forEach(function(instance) {
				let fullUrl;
				instance.language === 'English' 
				? fullUrl = 'http://www.fmprc.gov.cn/mfa_eng/wjdt_665385/2649_665393' + instance.url.slice(1)
				: fullUrl = 'http://www.fmprc.gov.cn/web/ziliao_674904/1179_674909' + instance.url.slice(1);
		      	instance.url = fullUrl;
			});
	    },
	    afterUpdate: function(instance) {
	    	if (instance.date && instance.date.includes('/')) {
		    	const date = instance.date.replace(/\//g, '-');
			    instance.date = date;
	    	}
	    },
	},
});