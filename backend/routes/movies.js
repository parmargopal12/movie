var express   = require('express');
var app         = express();
var Movie   = require('../models/movies'); 

exports.createupdatemovie = function(req,res)
{
	var id =  req.body.id;
	var title = req.body.title;
	var	year = req.body.year;
	var	description = req.body.description;
	var	posterurl = req.body.posterurl;
	if(title != '' && year != '')
	{
		if(typeof id != 'undefined' && id != '')
		{
			var newvalues = { 
				title: title,				
				year: year,				
				description: description,				
				posterurl: posterurl				
			};
			var myquery = { _id : id};
			Movie.updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
			});
			res.json({
				success: true,
				message: 'Movie updated successfully.'          
			});
		}
		else
		{
			var new_movie = new Movie({ 
				title : req.body.title,
				year : req.body.year,
				description : req.body.description,
				posterurl:req.body.posterurl
			});

			new_movie.save(function(err) {
				if (err) 
				{
					res.json({ success: false,"message":err});
				}
				else
				{
					res.json({ success: true,"message":'Movie added successfully.'});
				}
			});
		}
	}	
}

exports.getmovies = function(req,res){
	Movie.find({}, function(err, movies) {
		if (!movies) {
			res.json({ success: false, message: 'Movies not found.' });
		} else if (movies) {
			res.json({
				success: true,
				message: 'Movies found.',
				movies:movies
			});  
		}
	});
}