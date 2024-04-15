
const express = require('express');                //express package to render HTML pages using JS 
const morgan = require('morgan');                  //Morgan is used for logging request details
const bodyParser = require('body-parser');         //body-parser to parse the JSON Data 
const mongoose = require('mongoose');              //Mongoose package to connect to back-end mongoDB
const cors = require('cors');                      //Package to connect middle-ware or cross-platform applications
const config = require('./config');
const path = require("path");
const fileUpload = require('express-fileupload');
const app = express();                             

mongoose.set("strictQuery", true);
mongoose.connect(config.database, {
  useNewUrlParser: true
}, () =>
  console.log("Mongo DB connected"));

//express application using required packages 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(fileUpload({useTempFiles : true}));
const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

//express application using Routes from this application
app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoutes);


//Setting up the port for server to run on 
app.listen(config.port, err => {
  console.log('Server connected at port: ' + config.port);
});
