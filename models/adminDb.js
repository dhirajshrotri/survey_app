'use strict'

module.exports = function(Sequelize, DataTypes) {
	var admin = Sequelize.define('admin', {
		adminId : {
			type: DataTypes.UUID,
			unique: true,
			primaryKey: true
		},
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		adminEmail: {
			type: DataTypes.STRING,
			unique: true
		},
		adminPass: DataTypes.STRING
	},{
		//classMethods: {
		//	associate: function(models){
				// admin.belongsTo(models.survey, {
				// 	through: {
				// 		foreignKey: 'adminId'
				// 	}

				//})
				// admin.belongsToMany(models.survey, {
				// 	through: models.adminSurvey
				// })
		//	}
	//	},
		timestamps: false,
		freezeTableName : true
	});
	
	return admin;
}