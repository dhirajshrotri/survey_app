'use strict'

module.exports=function(Sequelize, DataType){
	var isPrivate = Sequelize.define('isPrivate', {
		surveyId : {
			type: DataType.UUID,
			unique: true,
			primaryKey: true
		}, 
		token: {
			type: DataType.STRING,
			unique: true
		},
		tokenExpires: {
			type:DataType.BIGINT
		}
	}, {
		freezeTableName: true,
		timestamps: false
	});
	return isPrivate;
}