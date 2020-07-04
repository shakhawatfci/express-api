const express = require('express');
const path = require('path');


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
 path.resolve(__dirname,'../database.sqlite3'));

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