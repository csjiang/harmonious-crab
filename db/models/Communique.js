const Sequelize = require('sequelize');
const db = require('../_db');

module.exports = db.define('communique', {
	title: {
	  	type: Sequelize.STRING,
	  	allowNull: false,
	},
	date: {
		type: Sequelize.DATEONLY,
		allowNull: false,
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
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
		beforeCreate: function(article, options) {
	      var date = article.date.replace("/", "-");
	      article.date = date;
	    }
	},
});