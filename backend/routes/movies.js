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
	var activePage = req.query.activePage || 1;
	activePage = (Math.abs(activePage) || 1) - 1;
	var sortBy = '_id';
	var sortByCriteria = 'desc';
	var searchStr = (typeof req.query.searchStr != 'undefined' && req.query.searchStr != '') ? req.query.searchStr : '';  	
	var searchByYear = (typeof req.query.searchByYear != 'undefined' && req.query.searchByYear != '') ? req.query.searchByYear : ''; 
	var perPage = (typeof req.query.limit != 'undefined' && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
	let total = 0;
	var query = '';
	if(searchStr != '' && searchByYear != '')
	{
		query = Movie.find({"title": {"$regex": searchStr, "$options": "i"},"year":searchByYear}); 
	}	
	else if(searchStr != '')
	{
		query = Movie.find({"title": {"$regex": searchStr, "$options": "i"}}); 
	}
	else if(searchByYear != '')
	{
		query = Movie.find({"year":searchByYear}); 
	}
	else
	{
		query = Movie.find();
	}
	query
	.exec().then(function(docs){
		total  = docs.length;
		query.sort({ '_id' : -1})
		.skip(perPage * activePage)
		.limit(perPage)
		.exec(function(err, movies) { 
			if(err){
				res.json({
					success: false,
					message: err,
					movies:movies,
					total:total
				});
			}
			else{
				res.json({
					success: true,
					message: 'Movies found.',
					movies:movies,
					total:total
				}); 
			} 
		});
	});
}

exports.deletemovie = function(req,res)
{
	var _id = req.body.delete_id;
	if(typeof _id != 'undefined' && _id != '')
	{
		Movie.findByIdAndRemove(_id, (err, movie) => 
		{  
			res.json({ success: true, message: 'Movie deleted successfully.','id':movie._id });
		});
	}
}