const express = require('express');
const path = require('path')
const seriesRoute = express.Router();

const db = require('./db');


// use middleware to catch route parameter 


seriesRoute.param('seriesId',(req, res, next, seriesId) => {

    db.get(`SELECT * FROM Series WHERE id = ${seriesId}`,
    	(error,series) => 
    	{
         if (error) 
         {
         	next(error);
         }
         else
         {
            if (series) 
            {
               req.series = series;
               next();
            }
            else
            {
            	res.sendStatus(404);

            }
         }
    	});

});

// getting all series out of db 

seriesRoute.get('/',(req, res, next) => {
  
  db.all(`SELECT * FROM Series`,
  	(err,series) => 
  	{
        if(err)
        {
            next(err);
        }
        else
        {
        	res.status(200).json({ series: series });
        }
  	})

});

// getting a series with id 

seriesRoute.get('/:seriesId',(req,res,next) => {

	res.status(200).json({ series: req.series });
})

// posting a series 

seriesRoute.post('/',(req,res,next) => {

    const name = req.body.series.name;
    const description = req.body.series.description;

    if(!name || !description)
    { 
    	res.sendStatus(400);
    }

    db.run('INSERT INTO Series(name,description) VALUES($name,$description)',
    {
    	$name : name,
    	$description : description
    }
    ,
    function(error)
    {
       if (error)
       {
       	next(error);
       }

       else
       {
         db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`,
         	(err,series) => 
         	{ 
               if(err)
               { 
                  next(err);
               }
               else
               {
               	res.status(200).json({ series : series });
               }
         	})
          }
      }
    )

})

// update   series 

seriesRoute.put('/:seriesId',(req,res,next) => {

    const name = req.body.series.name;
    const description = req.body.series.description;

    if(!name || !description)
    { 
    	res.sendStatus(400).json({ eror : 'validation errors' });
    }

    db.run('UPDATE  Series SET name = $name, description = $description WHERE id = $seriesId',
    {
    	$name : name,
    	$description : description,
    	$seriesId : req.params.seriesId,
    }
    ,
    function(error)
    {
       if (error)
       {
       	next(error);
       }

       else
       {
         db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`,
         	(err,series) => 
         	{ 
               if(err)
               { 
                  next(err);
               }
               else
               {
               	res.status(200).json({ series : series });
               }
         	})
          }
      }
    )

});

// delete series 

seriesRoute.delete('/:seriesId',(req, res, next) => {
     
     // cehck database has issue related to this id 

     db.all('SELECT * FROM Issue WHRE series_id = $seriesId',{
      $seriesId: req.params.seriesId
     },(error,issues) => {
     
       if(issues) 
       {
         res.sendStatus(400);
       }
       else
       {
         db.run('DELETE FROM Series WHERE id = $seriesId',{
          $seriesId: req.params.seriesId
        },
        (err) => {
           
           if(err)
           {
            next(err);
           }
           else
           {
            res.sendStatus(204);
           }

        })
       }

     })

})

// import issue router 

const issueRouter = require('./issues.js');

seriesRoute.use('/:seriesId/issues',issueRouter);


module.exports =  seriesRoute;