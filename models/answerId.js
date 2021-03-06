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
		// classMethods: {
		// 	associate: function(models) {
		// 		answerId.hasMany(models.questionId, {
		// 			through: models.questionId
		// 		},{
		// 				foreignKey: 'questionId'
		// 			});
		// 	}
		// }	
	}, {
		freezeTableName: true,
		timestamps: false
	});
	return answerId;
}

