// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
const validate = require('mongoose-validator');
const MoviesSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is required.']
	},
	year: {
		type: String,
		required: [true, 'Year is required.']
	},
	description: {
		type: String,
		required: [true, 'Description is required.']
	},		
	posterurl: {
		type: String
	}
});
const Movies = module.exports = mongoose.model('Movies', MoviesSchema);