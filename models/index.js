'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

/*if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
}*/
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'mysql',
    protocol: 'mysql',
    host:     '172.17.0.2',
    user:     'root',
    password: 'abcd123', 
    database: 'survey_app'
  })
}else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    console.log("\n\n gjhsajgjsda------", path.join(__dirname, file), __dirname, file )
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    console.log("\nn---------", model.name)
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.customers = require('../model/customer.model.js')(sequelize, Sequelize);
// db.customers = require('../model/customer.model.js')(sequelize, Sequelize);
// db.customers = require('../model/customer.model.js')(sequelize, Sequelize);
//table associations....
/*db.questionId.hasOne(db.questionText);
db.questionId.belongsTo(db.survey);
db.admins.hasMany(db.survey);
db.survey.belongsTo(db.admins);
db.survey.hasMany(db.questionId);
db.questionText.belongsTo(db.questionId);
*/
// db.survey.belongsTo(db.admins, {foreignkey: 'adminId'});
// db.questionId.belongsTo(db.survey, {foreignkey: 'surveyId'});
// db.questionText.belongsTo(db.questionId, {foreignkey: 'questionId'});
// db.admin.belongsTo(db.survey, {foreignKey: 'adminId'});
// db.survey.belongsTo(db.questionId, {foreignKey: 'surveyId'});
// db.questionText.hasOne(db.questionId, {foreignKey: 'questionId'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
