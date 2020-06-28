const express = require('express');

const apiRouter = express.Router();

const artistRouter = require('./artist.js');

// artistRouter.get('/',(req, res, next) => {

//   res.send('kemon acho?');

// });

apiRouter.use('/artists', artistRouter);

module.exports =  apiRouter;