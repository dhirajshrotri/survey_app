'use strict'

module.exports = function(Sequelize, DataTypes) {
	var passReset = Sequelize.define('PassReset', {
		adminId: {
			type: DataTypes.UUID
		}, 
		token: {
			type: DataTypes.STRING
		}, 
		tokenExpires: {
			type: DataTypes.BIGINT
		}
		
		}, {
			freezeTableName: true,
			timestamps: false
		});
	return passReset;
}