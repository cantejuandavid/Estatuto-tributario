var mongoose = require('mongoose')
var db = 'mongodb://user_2015_estatuto:jqueryyy123@ds031952.mongolab.com:31952/estatuto_tributario_colombia'
mongoose.Promise = global.Promise;
var db = module.exports = mongoose.connect(db)


mongoose.connection.on('error', function(err) {
	console.log(err)
})

mongoose.connection.on('connected', function(e) {
	console.log('->DB Lista!!!')
})
