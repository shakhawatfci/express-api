const express = require('express');

const apiRouter = express.Router();

const artistRouter = require('./artist.js');
const seriesRouter  = require('./series.js');

// all aritst related route will be mount in this 
apiRouter.use('/artists', artistRouter);
// all series related route will be mount in this 
apiRouter.use('/series', seriesRouter);

module.exports =  apiRouter;