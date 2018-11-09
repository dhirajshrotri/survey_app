'use strict'

module.exports = function(Sequelize, DataTypes){
	var answerId = Sequelize.define('answerId', {
		answerId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		answerText:{
			type:DataTypes.TEXT
		}
	}, {
		freezeTableName: true,
		timestamps: false
	});
	return answerId;
}