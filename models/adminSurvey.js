module.exports= function(Sequelize, DataTypes){
	var adminSurvey = Sequelize.define('adminSurvey', {

	},{
		freezeTableName:true,
		timestamps: false
	})
	return adminSurvey;
}