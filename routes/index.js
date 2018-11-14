var express = require('express');
var app = express();
var router = express.Router();
var models = require('../models');
const uuidV1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const url = require('url');
var salt = bcrypt.genSaltSync(10);
var crypto = require('crypto');
const nodemailer = require('nodemailer');
let hashPass;
const transporter = nodemailer.createTransport({
		   	host: 'smtp.ethereal.email',
		    port: 587,
		    auth: {
		        user: 'vofytp65as3sp4dd@ethereal.email',
		        pass: 'dxtheqMmZ7qetF7V8j'
		    }
		});
	
	router.post('/admin/:adminId/Surveys/', function(req, res){
		var adminId = encodeURIComponent(req.params.adminId);
		var surveyId = uuidV1(); 
		models.survey.create({
				adminId : req.params.adminId, 
				surveyName: req.body.surveyName,
				surveyId: surveyId 	
	 		});
		if(req.body.isPrivate){
			var token = crypto.randomBytes(20).toString('hex');
			var tokenExpires = Date.now()+86400000;
			models.isPrivate.create({
				surveyId: surveyId, 
				token: token,
				tokenExpires: tokenExpires
			});
			console.log(token);
		}
		var path = '/admin/'+adminId+'/Surveys/'+surveyId;
		//res.redirect(path); 
	})

	router.post('/admin/:adminId/Surveys/:surveyId/sendMail', function(req, res){
		var adminId = req.params.adminId;
		var surveyId = req.params.surveyId;
		var email = req.body.email;
		var senderEmail = 'vofytp65as3sp4dd@ethereal.email';
		
		models.sequelize.query('select * from isPrivate where surveyId = ?', {
			replacements: [surveyId]
		}).spread((results, metadata) => {
			//console.log(metadata[0]);
				if(metadata[0]){
						let mailOptions = {
	        			from: senderEmail, // sender address
	        			to: email, // list of receiverss
	        			subject: 'Survey Link', // Subject line
	        			text: 'You have been invited to fill out a survey. The link to the survey is:'+'\n'+'http://'+req.headers.host+'/user/privateSurvey/'+results[0].token+'\n\n' // plain text body
    				};
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
            				return console.log(error);
        				}
						res.send('A mail has been send to '+email+' with the link for the survey!');
						console.log('Message sent: %s', info.messageId);
        				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					})
				//console.log('This is a private survey!');
				}else{
					res.send('This is not a private Survey');
				}
			})
		})

	router.get('/user/privateSurvey/:token', function(req, res){
		models.sequelize.query('select * from isPrivate where token = ?', {
			replacements: [req.params.token]
		}).spread((results, metadata) => {
			var tokenExpires = results[0].tokenExpires;
			var token = results[0].token;
			var now = Date.now();
			var surveyId = results[0].surveyId;
			if(now >= tokenExpires){
				res.send('Your token has expired!');
			}else{
				models.sequelize.query('select questionId from questionId where surveyId = ?', {
					replacements: [surveyId]
				}).spread((surveyRes, metaData) => {
					//console.log(surveyRes[0].questionId);
					var path = '/user/privateSurvey/'+token+'/questions/'+surveyRes[0].questionId;
					res.redirect(path);
				})
			}
		})
	})

	.get('/user/privateSurvey/:token/questions/:questionId', function(req, res){
		//TODO: preview the questions with questionText here...!
		//models.sequelize.query('select * from questionText where ')
		//res.send('question no 1 path reached');
	})
	
	router.get('/admin/:adminId', function(req, res){
		models.sequelize.query('select firstName, lastName from admin where adminId = ?', {
			replacements: [req.params.adminId]
		}).spread((results, metadata) => {
			res.send('Hi '+results[0].firstName+', '+results[0].lastName+'!');
			//console.log(results[0].firstName);
		})	
	})
	
	router.get('/admin/:adminId/Surveys/:surveyId', function(req, res){
		console.log('Welcome to the survey preview router');
		var adminId = req.params.adminId;
		var surveyId = req.params.surveyId;
		models.sequelize.query('select * from survey where surveyId = ?', {replacements: [surveyId]},  {type: models.sequelize.QueryTypes.SELECT})
		.then((results) =>{
			res.send('Welcome to survey preview'+'\n'+results);
		})
	})

//update a survey
	router.put('/admin/:adminId/Surveys/:surveyId', function(req, res){
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

	router.delete('/admin/:adminId/Surveys/:surveyId', function(req, res){
		models.sequelize.query('delete survey, questionId, questionText from survey inner join questionText inner join questionId where survey.surveyId = questionId.surveyId and questionId.questionId = questionText.questionId and survey.surveyId = ?', 
		{
			replacements: [req.params.surveyId]
		})
		var path = '/admin/'+req.params.adminId+'/surveys?';
		res.redirect(path);
	})

	
	router.post('/admin/:adminId/Surveys/:surveyId/questions/:questionId', function(req, res){
			models.questionText.create({
				questionText: req.body.questionText,
				questionId : req.params.questionId,
			})
			var path = '/admin/'+req.params.adminId+'/Surveys/'+req.params.surveyId+'/'+req.params.questionId;
			res.redirect(path);
		})

	router.get('/admin/:adminId/Surveys/:surveyId/questions/:questionId', function(req, res){
			models.sequelize.query('select questionText from questionText where questionId = ? ', 
				{
					replacements: [req.params.questionId]
				}).spread((results, metadata) => {
				console.log(results[0].questionText);
			})
			
		})
		
	router.put('/admin/:adminId/Surveys/:surveyId/:questionId', function(req, res){
			models.sequelize.query('update questionText set questionText = ? where questionId = ? ', 
				{
					replacements: [req.body.questionText, req.params.questionId]
				});
		})
		
	router.delete('/user=?admin/:adminId/Surveys/:surveyId/:questionId', function(req, res){
			models.sequelize.query('delete from questionText where questionId = ?', 
				{
					replacements: [req.params.questionId]
				});
		})
		
	router.delete('/user=?admin/:adminId/Surveys/:surveyId', function(req, res){
			console.log('delete route hit..')
			models.sequelize.query('delete a.*, b.* from survey a inner join questionId b on a.surveyId = b.surveyId where a.surveyId = ?', 
			{
				replacements : [req.params.questionId] 
			})
		})	
		
	router.post('/admin/register', function(req, res){
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
					var path = '/admin/'+adminId;
					res.redirect(path);
				});
			}
			else{
				console.log('Password is invalid!');
			}
		})
		
	router.post('/admin/login', function(req, res){
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
					    	var path = '/admin/'+adminId;
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

	router.post('/admin/logout', function(req, res){
			res.send('this is the logout route!!');
		})
	router.post('/admin/forgot', function(req, res, next){
			var email = req.body.email;
			var token = crypto.randomBytes(20).toString('hex');
			var tokenExpires = Date.now()+360000;//set the token to expire 1 hr after email sent
			models.sequelize.query('select adminId from admin where adminEmail = ?', {
				replacements: [email]
			}).spread((results, metadata)=>{
				if(metadata[0]){
					models.PassReset.create({
						adminId: results[0].adminId,
						token: token,
						tokenExpires: tokenExpires
					});
					let mailOptions = {
	        			from: '"survey app" <vofytp65as3sp4dd@ethereal.email>', // sender address
	        			to: email, // list of receivers
	        			subject: 'Password Reset', // Subject line
	        			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    					};
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
            				return console.log(error);
        				}
						res.send('A mail has been send to '+email+' with the link for the survey!');
						console.log('Message sent: %s', info.messageId);
        				// Preview only available when sending through an Ethereal account
        				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					})
				}else{
					res.send('No account with that email found!');
				}
			})
			
		})

	router.post('/reset/:token', function(req, res){
		models.sequelize.query('select * from PassReset where token = ?', {
			replacements: [req.params.token]
		}).spread((results, metadata) => {
			var tokenExpires = results[0].tokenExpires;
			var adminId = results[0].adminId;
			var now = Date.now();
			if(now >= tokenExpires){
				res.send('The password reset link has expired!');
			}else{
				var newPass = req.body.newPass;
				var confirmPass = req.body.confirmPass;
				var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
				if(newPass.localeCompare(confirmPass) < 0){
					res.send('The passwords do not match. Please try again!');
				}else if(re.test(newPass)){
					res.send('Invalid new Password. The password must contain a capital letter and a number');
				}else{
					//TODO: create a new hash and update old field in dataBase;
					hash = bcrypt.hashSync(newPass, salt);
					models.admin.update({
						adminPass: hash
					}, {
						where: {
							adminId: adminId
						}
					})
					res.send('Password updated Successfully! Please login again!');
				}
			}
		})
	})

	router.delete('/admin/:adminId', function(req, res){
			models.sequelize.query('delete admin, survey, questionId, questionText from admin inner join survey inner join questionId inner join questionText where admin.adminId = survey.adminId and survey.surveyId = questionId.surveyId and questionId.questionId= questionText.questionId and admin.adminId = ?', 
			{
				replacements : [req.params.adminId]
			})
		})

	router.get('/user/Survey/:surveyId', function(req, res){
		models.sequelize.query('select * from isPrivate where surveyId = ?', {
			replacements: [surveyId]
		}).spread((results, metadata) => {
			//console.log(metadata[0]);
			if(metadata[0]){
				models.sequelize.query('select * from (select * from survey as T1 join questionId as T2 on T1.surveyId = T2.surveyId where surveyId = ?) as T12 join  questionText as T3 on T12.questionId = T3.questionId', 
					{
						replacements: [req.params.surveyId], 
						type: models.sequelize.QueryTypes.select
				}).then(results => {
					console.log(results);
				})
				console.log('user preview for survey')
			}else{
				res.send('This is a private survey. You dont have permission to access the survey!');
			}
		});	
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
	router.get('/user/Surveys/:surveyId/question/:questionId/answer?', function(req, res){
			models.sequelize.query('select a.answerId, b.questionText, a.answerText from answerIds a, questionText b where a.answerId = b.questionId and a.answerId = ?', {
				replacements: [req.params.questionId], 
				type: models.sequelize.QueryTypes.select})
				.then(results => {
					console.log(results);
				})
			//console.log('redirected to question preview');
		})

	router.delete('/user/Surveys/:surveyId/question/:questionId/answer?', function(req, res){
			models.sequelize.query('delete from answerIds where answerId = ?', { 
				replacements: [req.params.questionId]
			});
			console.log('deleting record ' + req.params.questionId);
		})

module.exports = router; 