'use strict'

module.exports = function(Sequelize, DataTypes){
	var questionText = Sequelize.define('questionText', {
		questionText: DataTypes.TEXT
	}, 
	{
		classMethods: {
			associate: function(models){
				questionText.hasOne(models.questionId, {
					through:{
						foreignKey: 'questionId'
					}
				})
			}
		},
		timestamps: false,
		freezeTableName : true
	}
	);
	return questionText;
}

