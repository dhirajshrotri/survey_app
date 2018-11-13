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
    //console.log("\n\n gjhsajgjsda------", path.join(__dirname, file), __dirname, file )
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    //console.log("\nn---------", model.name)
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.questionId.belongsToMany(db.answerId, 
//   {
//     through: 'questionAnswers'
//   },
//   {
//     foreignKey: 'questionId'
//   });
// db.answerId.belongsTo(db.questionId);
// db.answerId.hasMany(db.questionId,  {
//   through: 'db.questionAnswers'
// },{
//   foreignKey: 'questionId'
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
