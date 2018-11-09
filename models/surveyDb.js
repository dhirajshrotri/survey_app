'use strict';

module.exports = function(Sequelize, DataTypes) { 
	var survey = Sequelize.define('survey', {
		surveyId: {
			type: DataTypes.UUID,
			unique: true,
			primaryKey: true
		},
		surveyName: DataTypes.STRING
	},
	 {
		classMethods: {
			associate: function(models) {
				survey.belongsToMany(models.questionText, {
					through: models.questionId
				},{
						foreignKey: 'surveyId'
					});
			}
		},
		timestamps: false,
		freezeTableName : true
	});

	return survey;
};

