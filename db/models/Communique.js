const Sequelize = require('sequelize');
const db = require('../_db');
const fillInCommDetails = require('../../scrape_article');

module.exports = db.define('communique', {
	title: {
	  	type: Sequelize.STRING,
	  	allowNull: false,
	},
	date: {
		type: Sequelize.DATEONLY,
		defaultValue: '',
	},
	content: {
		type: Sequelize.TEXT,
		defaultValue: '',
	},
	url: {
		type: Sequelize.URL,
		allowNull: false,
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
		beforeCreate: function(instance) {
	      var date = instance.date.replace("/", "-");
	      instance.date = date;
	      console.log('date updated!');
	      fillInCommDetails(instance.url);
	    }
	},
});