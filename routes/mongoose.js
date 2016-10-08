var mongoose = require('mongoose')

var data = require("./DBData.json")

var db = 'mongodb://'+data.user+':'+data.pass+'@'+data.instance+'.mongolab.com:'+data.port+'/estatuto_tributario_colombia'
mongoose.Promise = global.Promise;
var db = module.exports = mongoose.connect(db)


mongoose.connection.on('error', function(err) {
	console.log(err);
})

mongoose.connection.on('connected', function(e) {
	console.log('->DB Lista!!!')
})
