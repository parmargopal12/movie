// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var cors = require('cors')
var config = require('./config'); 
var movieroutes = require('./routes/movies');
// =================================================================
// configuration ===================================================
// =================================================================
var port = config.port; 
mongoose.connect(config.database,{
	useMongoClient:true
}); 
mongoose.connection.on('error',function (err) {  
	console.log('Mongoose default connection error: ' + err);
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var apiRoutes = express.Router(); 
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});
apiRoutes.post('/create_update_movie',movieroutes.createupdatemovie);
apiRoutes.get('/getmovies',movieroutes.getmovies);
apiRoutes.post('/delete',movieroutes.deletemovie);
app.use('/', apiRoutes);


// =================================================================
// start the server ================================================
// =================================================================
const server = app.listen(port, '0.0.0.0',() => {
	console.log(`App listening on PORT: ${port}`)
})