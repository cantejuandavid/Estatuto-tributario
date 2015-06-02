var mongoose = require('mongoose')
var db = 'mongodb://user_2015_estatuto:juandavid123@ds031952.mongolab.com:31952/estatuto_tributario_colombia'
var db = module.exports = mongoose.connect(db)


mongoose.connection.on('error', function(err) {
	console.log(err)
})

mongoose.connection.on('connected', function(e) {
	console.log('->DB Lista!!')	
})