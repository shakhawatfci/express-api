const express = require('express');
const path = require('path');
const artistRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
 path.resolve(__dirname,'../database.sqlite3'));

// checking artistId Parameter for all of this route 

artistRouter.param('artistId',(req, res, next,artistId) => {
  db.get('SELECT * FROM Artist WHERE id = $artistId',
  	{$artistId: artistId},
  	(err, artist) => {
      if (err)
      {
        next(err);
      }
      else if (artist)
      {
       req.artist = artist;
       next();
      }
      else
      {
      	res.sendStatus(404);
      }
  	});
});

// selecting all artist 

artistRouter.get('/',(req, res, next) => {
	// res.send('hey buddy');
   db.all('SELECT * FROM Artist  WHERE is_currently_employed = 1',
   	(err, artists) => {

      if(err){
        next(err);
      }
      else
      {
      	res.status(200).json({ artists: artists });
      }

   	});
});

// find a specefic artist 

artistRouter.get('/:artistId',(req, res, next) => {
   
   res.status(200).json({ artist : req.artist });

});

// insert new artist 

artistRouter.post('/',(req, res, next) => {
const name = req.body.artist.name;
const dateOfBirth = req.body.artist.dateOfBirth;
const biography = req.body.artist.biography;
const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
   if (!name || !dateOfBirth || !biography)
   {
     res.sendStatus(400);
   }
  db.run(`INSERT INTO Artist(name, data_of_birth, biography, is_currently_employed)
   VALUES($name,$dateOfBirth,$biography,$isCurrentlyEmployed)`,
   {
    $name: name,
    $dateOfBirth: dateOfBirth,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
   },
   function(error) 
   {
   	if(error)
   	{
      next(error);
      return ; 
   	}



   	 // res.status(201).json({ message: this.lastID });

   	db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
   		(err, artist) => {

   			if(err)
   			{
   				next(err);
   				return ;
   			}

   			res.status(201).json({ artist: artist  });
   		})
    
   }); 

});

artistRouter.put('/:artistId',(req, res, next) => {
 
const name = req.body.artist.name;
const dateOfBirth = req.body.artist.dateOfBirth;
const biography = req.body.artist.biography;
const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
   if (!name || !dateOfBirth || !biography)
   {
     res.sendStatus(400);
   }

 const query = `UPDATE Artist SET name = $name,
 data_of_birth = $dateOfBirth, biography = $biography ,
  is_currently_employed = $isCurrentlyEmployed WHERE id = $id`  

  const  value = {
    $name: name,
    $dateOfBirth: dateOfBirth,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
    $id: req.params.artistId
  }

  db.run(query,value,
  	function(error) {
       
       if (error) {
       	next(error);
       	return ;
       }


        db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
   		(err, artist) => {

   			if(err)
   			{
   				next(err);
   				return ;
   			}

   			res.status(200).json({ artist: artist  });
   		});

  	})

});

// delete an item 

artistRouter.delete('/:artistId',(req, res, next) => {
const query = `UPDATE Artist SET is_currently_employed = $isCurrentlyEmployed 
 WHERE id = $id`  

  const  value = {
    $isCurrentlyEmployed: 0,
    $id: req.params.artistId
  }

  db.run(query,value,function(error) {

  	if (error) {
  		next(error);
  		return ;
  	}

  	res.status(200).json({ message: 'success' });
  })
});





module.exports = artistRouter;