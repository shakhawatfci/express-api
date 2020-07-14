const express = require('express');
const path = require('path');

const db = require('./db');

const issuesRouter = express.Router({mergeParams: true});



// checking issueId Parameter exist in databse for all of this route 

issuesRouter.param('issueId',(req, res, next,issueId) => {
  db.get('SELECT * FROM issue WHERE id = $issueId',
    {$issueId: issueId},
    (err, issue) => {
      if (err)
      {
        next(err);
      }
      else if (issue)
      {
       req.issue = issue;
       next();
      }
      else
      {
        res.sendStatus(404);
      }
    });
});

// getting issue with series_id 

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

});

// posting a new issue on specefic id 

issuesRouter.post('/',(req, res, next) => {
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;
    const seriesId = req.params.seriesId;

 

    if(!name || !issueNumber || !publicationDate || !artistId)
    {
        res.sendStatus(400);
    }

    db.run(`INSERT INTO Issue(name,issue_number,publication_date,artist_id,series_id)
        VALUES($name,$issueNumber,$publicationDate,$artistId,$seriesId)`,{
          $name: name,
          $issueNumber: issueNumber,
          $publicationDate: publicationDate,
          $artistId: artistId,
          $seriesId: seriesId
        },
        function(error){
           
           if(error)
           {
            next(error);
           }
           else{
             
             db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`,
              (err,issue) => 
              {
                 if (err) 
                 {
                  next(err);
                 }
                 else
                 {
                  res.status(201).json({ issue: issue });
                 }
              })

           }


          
        })
});

// updating an issue 

issuesRouter.put('/:issueId',(req, res, next) => {
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;
    const seriesId = req.params.seriesId;
    const id = req.params.issueId;

 

    if(!name || !issueNumber || !publicationDate || !artistId)
    {
        res.sendStatus(400);
    }

    db.run(`UPDATE  Issue SET name=$name,issue_number=$issueNumber,
      publication_date=$publicationDate,artist_id=$artistId,series_id=$seriesId
      WHERE id = $id`,{
          $name: name,
          $issueNumber: issueNumber,
          $publicationDate: publicationDate,
          $artistId: artistId,
          $seriesId: seriesId,
          $id: id,
        },
        function(error){
           
           if(error)
           {
            next(error);
           }
           else{
             
             db.get(`SELECT * FROM Issue WHERE id = ${id}`,
              (err,issue) => 
              {
                 if (err) 
                 {
                  next(err);
                 }
                 else
                 {
                  res.status(200).json({ issue: issue });
                 }
              })

           }


          
        })
});

issuesRouter.delete('/:issueId',(req, res, next) => {
  
   db.run('DELETE  FROM Issue WHERE id = $id',{
    $id : req.params.issueId
   },(error) => {
       
       if(error)
       {
        next(error);
       }
       else
       {
          res.sendStatus(204);
       }

   })

}); 

module.exports = issuesRouter;