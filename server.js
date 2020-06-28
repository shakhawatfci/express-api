const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000 ;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


// importing api router 
const apiRouter = require('./api/api');

app.use('/api',apiRouter);
app.get('/',(req, res, next) => {
	res.send('hello mothefucker');
})

app.use(errorHandler());

app.listen(PORT,() => {

  console.log(`server listening to port number ${PORT}`);

});

module.exports = app;

