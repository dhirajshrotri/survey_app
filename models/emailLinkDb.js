'use strict'

module.exports = function(Sequelize, DataTypes) {
	var emailLink = Sequelize.define('emailLink', {
		email: {
			type: DataTypes.STRING, 
			unique: true
		}, 
		adminId: {
			type: DataTypes.UUID, 
		}
	}, {
		freezeTableName: true, 
		timestamps: false
	});
	return emailLink;
}