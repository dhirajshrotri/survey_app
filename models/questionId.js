'use strict'

module.exports = function(Sequelize, DataTypes){
	var questionId = Sequelize.define('questionId', {
		questionId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		}
	 },{
	 	timestamps: false,
		freezeTableName : true
	 }
	);
	return questionId;
}

