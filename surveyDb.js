var Sequelize = require('sequelize');
var connection = new Sequelize('mysql://root:abcd123@172.17.0.2:3306/survey_app');
var Surveys;

exports.createSurveyDb = function(){
	Surveys = connection.define('survey', {
		survey_id : {
			type: Sequelize.INTEGER(7),
			unique: true,
			primaryKey: true
		},
		survey_name : {
			type: Sequelize.STRING,
			allowNull: false
		},
		admin_id : {
			type: Sequelize.INTEGER(7),
			unique: true
		}
	});
	connection.sync();

}

exports.addSurvey = function(req, res){
	connection
		.sync({
			logging: console.log()
		})
		.then(function() {
			Surveys.create({
				survey_id:req.body.survey_id,
				admin_id: req.params.admin_id,
				survey_name: req.body.survey_name
			});
		})
		.catch(function(error){
			console.log(error);
		});
}

exports.showSurvey = function(req, res){
	connection
		.sync({
			logging : console.log()
		})
		.then(function()	{
			Surveys.findAll({
				where:{
					admin_id: req.params.admin_id 
				}
			})
			.then(function(result){
				res.send(result);
			})
		})
		.catch(function(error){
			console.log(error);
		})
}

exports.deleteSurvey = function(req, res){
	connection
		.sync({
			logging:console.log()
		})
		.then(function()	{
			Surveys.destroy({
				where:{
					admin_id: req.params.admin_id,
					survey_id: req.params.survey_id
				}
			})
		})
		.catch(function(error)	{
			console.log(error);
		})
}

exports.updateSurvey = function(req, res){
	connection
		.sync({
			logging: console.log()
		})
		.then(function()	{
			Surveys.update(
				{
					survey_name: req.body.survey_name
				},
				{
					where:{
						admin_id: req.params.admin_id,
						survey_id: req.params.survey_id
					}
				}	
			)
		})
		.catch(function(error){
			console.log(error);
		})
}