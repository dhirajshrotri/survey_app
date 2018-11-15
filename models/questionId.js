'use strict'

module.exports = function(Sequelize, DataTypes){
	var questionId = Sequelize.define('questionId', {
		questionId: {
			type: DataTypes.INTEGER,
			primaryKey: true, 
			//autoIncrement: true
		}, 
		surveyId: {
			type: DataTypes.UUID,
			//unique: true 
		}
	 },{
	 	timestamps: false,
		freezeTableName : true
	 }
	);
	return questionId;
}

