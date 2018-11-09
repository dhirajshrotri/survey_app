var express = require('express');
app = express();
var router = express.Router();
var models = require('../models');
const uuidV1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const url = require('url');
var salt = bcrypt.genSaltSync(10);
let hashPass;

router.post('/:adminId/Surveys/', function(req, res){
	var adminId = encodeURIComponent(req.params.adminId);
	var surveyId = uuidV1(); 
	models.survey.create({
		
			adminId : req.params.adminId, 
			surveyName: req.body.surveyName,
			surveyId: surveyId 	
 
	});
	//models.admin.addSurvey(models.survey);
	var path = '/'+adminId+'/Surveys/'+surveyId;
	res.redirect(path); 
	
});
router.get('/:adminId/Surveys/:surveyId', function(req, res){
		console.log('Welcome to the survey preview router');
		res.send('welcome to previews');
		var adminId = req.params.adminId;
		var surveyId = req.params.surveyId;
		models.sequelize.query('select * from survey where surveyId = ?', {replacements: [surveyId]},  {type: models.sequelize.QueryTypes.SELECT})
		.then((results) =>{
			console.log(results);
		} )
	})
//router.post('/:adminId/Surveys/:questionId', postQuestions)
//show all surveys
router.get('/Surveys/:adminId', function(req, res){
	console.log('Showing all surveys...!!!');
	res.send('Showing all surveys...!!!');
	
	//fetch survey data from surveys, questionIds, questionText
	models.sequelize.query('select a.surveyName, b.questionIds, c.questionText from surveys a, questionIds b, questionTexts c where a.adminId = ? && a.surveyId = b.surveyId && b.questionIds = c.questionId;', {replacements: [adminId]})
	.spread((results, metadata) => {
		console.log(results);
	});
});
//update a survey
router.put('/:adminId/Surveys/:surveyId', function(req, res){
	models.survey.update(
		{	surveyName: req.body.surveyName	},
		{	where: { surveyId : req.params.surveyId } }
	).then(function(result){
				res.send(result);
			})
	res.send('Ok....');
	console.log(req.params.surveyId)
});

router
	.post('/:adminId/Surveys/:surveyId/questions/:questionId', function(req, res){
		models.questionText.create({
			questionText: req.body.questionText,
			questionId : req.params.questionId,
		})
		res.send('Ok....');
		console.log(req.params.surveyId);
		console.log(req.body.questionText);
		console.log("Welcome to the route to create new questions!")
	})
	.get('/:adminId/Surveys/:surveyId/:questionId', function(req, res){
		models.sequelize.query('select questionText from questionText where questionId = ? ', {replacements: [req.params.questionId]})
		.spread((results, metadata)=>{
			console.log(results);
			//res.send(metadata);
		})
		res.send('Ok....');
		console.log(req.params.adminId);
		console.log(req.params.surveyId);
		console.log(req.params.questionId);
	})
	.put('/:adminId/Surveys/:surveyId/:questionId', function(req, res){
		models.sequelize.query('update questionText set questionText = ? where questionId = ? ', {replacements: [req.body.questionText, req.params.questionId]});
	})
	.delete('/:adminId/Surveys/:surveyId/:questionId', function(req, res){
		models.sequelize.query('delete from questionText where questionId = ?', {replacements: [req.params.questionId]});
	})
	.delete('/:adminId/Surveys/:surveyId', function(req, res){
		console.log('delete route hit..')
		// models.sequelize.query('delete * from surveys full join questionIds on surveys.surveyId = questionIds.surveyId where survey.surveyId = ?', {replacements: [req.params.surveyId]})
	})
	.post('/admin/register', function(req, res){
				
		hash = bcrypt.hashSync(req.body.pass, salt);
		models.admins.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			adminEmail: req.body.email,
			adminId: uuidV1(),
			adminPass: hash
		});
		

	})
	.post('/admin/login', function(req, res){
		models.sequelize.query('select adminPass, adminId from admins where adminEmail = ?', {replacements: [req.body.adminEmail]
		,  type: models.sequelize.QueryTypes.SELECT})
  			.then(results => {
    			console.log(results[0].adminPass);
    			bcrypt.compare(req.body.adminPass, results[0].adminPass).then(function(result) {
    				console.log('Comparing passw');
				    if(result){
				    	var adminId = encodeURIComponent(results[0].adminId);
				    	console.log('Successfully logged in!!!');
				    	res.redirect(200, "/"+ adminId+"/Surveys/");
				    }else{
				    	res.send({
				    		"status":"500",
				    		"message": "error"
				    	})
				    	console.log('Failed to login!!');
				    }
				});

  			})
	})
	.post('/admin/logout', function(req, res){
		res.send('this is the logout route!!');
	});
	router.get('/user/Survey/:surveyId', function(req, res){
		models.sequelize.query('select * from (select * from survey as T1 join questionId as T2 on T1.surveyId = T2.surveyId where surveyId = ?) as T12 join  questionText as T3 on T12.questionId = T3.questionId', {replacements: [req.params.surveyId], 
			type: models.sequelize.QueryTypes.select})
		.then(results => {
			console.log(results);
		})
		console.log('user preview for survey')
	})
	router.get('/user?=admin/:adminId', function(req, res){
		models.sequelize.query('select * from admin where adminId = ?', { replacements: [req.params.adminId], type: models.sequelize.QueryTypes.select})
		.then(results => {
			console.log(results);
		})
		res.send('Welcome to admin dashboard page....!');
	});
	router.put('/user?=admin/:adminId', function(req, res){
		models.sequelize.query('update ')
	})

//router.get()
module.exports = router;