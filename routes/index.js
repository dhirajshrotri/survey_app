var express = require('express');
app = express();
var router = express.Router();
var models = require('../models');
const uuidV1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const url = require('url');
var salt = bcrypt.genSaltSync(10);
var crypto = require('crypto');
let hashPass;

	router
	.post('/admin/:adminId/Surveys/', function(req, res){
		var adminId = encodeURIComponent(req.params.adminId);
		var surveyId = uuidV1(); 
		models.survey.create({
			
				adminId : req.params.adminId, 
				surveyName: req.body.surveyName,
				surveyId: surveyId 	
	 
		});
		var path = '/admin/'+adminId+'/Surveys/'+surveyId;
		res.redirect(path); 
		
	})

	.get('/admin/:adminId/Surveys/:surveyId', function(req, res){
		console.log('Welcome to the survey preview router');
		res.send('welcome to previews');
		var adminId = req.params.adminId;
		var surveyId = req.params.surveyId;
		models.sequelize.query('select * from survey where surveyId = ?', {replacements: [surveyId]},  {type: models.sequelize.QueryTypes.SELECT})
		.then((results) =>{
			console.log(results);
		} )
	})

//show all surveys
	// .get('/Surveys/:adminId', function(req, res){
	// 	console.log('Showing all surveys...!!!');
	// 	res.send('Showing all surveys...!!!');
		
	// 	//fetch survey data from surveys, questionIds, questionText
	// 	models.sequelize.query('select a.surveyName, b.questionIds, c.questionText from surveys a, questionIds b, questionTexts c where a.adminId = ? && a.surveyId = b.surveyId && b.questionIds = c.questionId;', {replacements: [adminId]})
	// 	.spread((results, metadata) => {
	// 		console.log(results);
	// 	});
	// });

//update a survey
	.put('/admin/:adminId/Surveys/:surveyId', function(req, res){
		models.survey.update({	
			surveyName: req.body.surveyName	
			},{	
				where: { 
					surveyId : req.params.surveyId 
		}}).then(function(result){
					res.send(result);
				});
		res.send('Ok....');
		console.log(req.params.surveyId)
	})

	.delete('/admin/:adminId/Surveys/:surveyId', function(req, res){
		models.sequelize.query('delete survey, questionId, questionText from survey inner join questionText inner join questionId where survey.surveyId = questionId.surveyId and questionId.questionId = questionText.questionId and survey.surveyId = ?', 
		{
			replacements: [req.params.surveyId]
		})
		var path = '/admin/'+req.params.adminId+'/surveys?';
		res.redirect(path);
	})

	router
		.post('/admin/:adminId/Surveys/:surveyId/questions/:questionId', function(req, res){
			models.questionText.create({
				questionText: req.body.questionText,
				questionId : req.params.questionId,
			})
			var path = '/admin/'+req.params.adminId+'/Surveys/'+req.params.surveyId+'/'+req.params.questionId;
			res.redirect(path);
		})

		.get('/admin/:adminId/Surveys/:surveyId/questions/:questionId', function(req, res){
			models.sequelize.query('select questionText from questionText where questionId = ? ', 
				{
					replacements: [req.params.questionId]
				}).spread((results, metadata) => {
				console.log(results[0].questionText);
			})
			
		})
		
		.put('/admin/:adminId/Surveys/:surveyId/:questionId', function(req, res){
			models.sequelize.query('update questionText set questionText = ? where questionId = ? ', 
				{
					replacements: [req.body.questionText, req.params.questionId]
				});
		})
		
		.delete('/user=?admin/:adminId/Surveys/:surveyId/:questionId', function(req, res){
			models.sequelize.query('delete from questionText where questionId = ?', 
				{
					replacements: [req.params.questionId]
				});
		})
		
		.delete('/user=?admin/:adminId/Surveys/:surveyId', function(req, res){
			console.log('delete route hit..')
			models.sequelize.query('delete a.*, b.* from survey a inner join questionId b on a.surveyId = b.surveyId where a.surveyId = ?', 
			{
				replacements : [req.params.questionId] 
			})
		})	
		
		.post('/admin/register', function(req, res){
			var pass = req.body.pass;
			var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
			var adminId = uuidV1();
			if(re.test(pass)){
				hash = bcrypt.hashSync(req.body.pass, salt);
				models.admin.create({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					adminEmail: req.body.email,
					adminId: adminId,
					adminPass: hash
				}).then(function(){
					console.log('Hi '+req.body.firstName+' '+req.body.lastName+'!');
					var path = '/admin/'+adminId+'/surveys?';
					res.redirect(path);
				});
			}
			else{
				console.log('Password is invalid!');
			}
		})
		
		.post('/admin/login', function(req, res){
			models.sequelize.query('select adminPass, adminId from admin where adminEmail = ?', {
				replacements: [req.body.adminEmail],  
				type: models.sequelize.QueryTypes.SELECT})
	  			.then(results => {
	  				var tempResult = results;
	    			bcrypt.compare(req.body.adminPass, results[0].adminPass).then(function(passResults) {
					    if(passResults){
					    	//console.log(tempResult);
					    	var adminId = tempResult[0].adminId;
					    	console.log('Successfully logged in!!!');
					    	var path = '/admin/'+adminId+'/surveys?';
					    	//console.log(path);
					    	res.redirect(path);
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
		})
		.post('/forgot', function(req, res, next){
			
		})
		.delete('/admin/:adminId', function(req, res){
			models.sequelize.query('delete admin, survey, questionId, questionText from admin inner join survey inner join questionId inner join questionText where admin.adminId = survey.adminId and survey.surveyId = questionId.surveyId and questionId.questionId= questionText.questionId and admin.adminId = ?', 
			{
				replacements : [req.params.adminId]
			})
		})

	router.get('/user/Survey/:surveyId', function(req, res){
		models.sequelize.query('select * from (select * from survey as T1 join questionId as T2 on T1.surveyId = T2.surveyId where surveyId = ?) as T12 join  questionText as T3 on T12.questionId = T3.questionId', 
			{
				replacements: [req.params.surveyId], 
				type: models.sequelize.QueryTypes.select
		}).then(results => {
			console.log(results);
		})
		console.log('user preview for survey')
	});

	//admin Dashboard route
	router.get('/admin/:adminId/surveys?', function(req, res){
		models.sequelize.query('select * from admin where adminId = ?', 
			{ 
				replacements: [req.params.adminId], 
				type: models.sequelize.QueryTypes.select
		}).then(results => {
			console.log('Hi '+results[0].firstName+' '+results[0].lastName+'!');
			console.log('Welcome to admin dashboard page....!');
			models.sequelize.query('select * from survey where adminId = ?', 
			{
				replacements: [req.params.adminId], 
				type: models.sequelize.QueryTypes.select
			}).then(surveyResults => {
				console.log(surveyResults);
			})
		})
		
	});

	router.put('/=admin/:adminId', function(req, res){
		models.admin.update({	
				firstName: req.body.firstName, 
				lastName: req.body.lastName, 
				adminEmail: req.body.adminEmail, 
				},
			{	
				where: { 
					adminId : req.params.adminId 
				} 
		}).then(function(result){
					res.send(result);
				})
			res.redirect('/user?=admin/'+req.params.adminId);
		})
	
	router
		//user side route to post answers	
		.post('/user/Surveys/:surveyId/question/:questionId/answer?', function(req, res){
		
			models.sequelize.query('insert into answerIds (answerText, answerId) select ?, questionId from questionId where questionId = ?', 
				{
					replacements: [req.body.answerText, req.params.questionId]
				}).spread((results, metadata)=>{
					if(results === 0){
						console.log('Insert failed. No such question exists!!');
					}
					else{
						var path = '/user/Surveys/'+req.params.surveyId+'/question/'+req.params.questionId+'/answer?';
						console.log(path)
						res.redirect(path)
						console.log('redirecting')
					}
				})
		})
		//display answers to the selected questions
		.get('/user/Surveys/:surveyId/question/:questionId/answer?', function(req, res){
			models.sequelize.query('select a.answerId, b.questionText, a.answerText from answerIds a, questionText b where a.answerId = b.questionId and a.answerId = ?', {
				replacements: [req.params.questionId], 
				type: models.sequelize.QueryTypes.select})
				.then(results => {
					console.log(results);
				})
			//console.log('redirected to question preview');
		})

		.delete('/user/Surveys/:surveyId/question/:questionId/answer?', function(req, res){
			models.sequelize.query('delete from answerIds where answerId = ?', { replacements: [req.params.questionId]});
			console.log('deleting record ' + req.params.questionId);
		})

module.exports = router;