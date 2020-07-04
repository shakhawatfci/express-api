const express = require('express');
const path = require('path');

const db = require('./db');

const issuesRouter = express.Router({mergeParams: true});


issuesRouter.get('/',(req,res,next) => {
  
  db.all('SELECT * FROM Issue WHERE series_id = $series_id',
  	{
  		$series_id : req.params.seriesId
  	},
  	(err,issues) =>  {
  	  
  	 	if(err)
  	 	{ 
           next(err);
  	 	}
  	 	else
  	 	{
  	 		res.status(200).json({ issues: issues });
  	 	}
  	 
  	} 
  	)

})

module.exports = issuesRouter;