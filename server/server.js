import express from 'express'
const path =require('path');
const app = express();
const cors = require('cors');
const https = require('https')
const compression = require('compression')
const promBundle = require("express-prom-bundle");
const fs=require('fs')
// must be first
app.use(promBundle({includeMethod: true, includePath:true}))

app.use(cors());

app.use(compression())
app.use(express.static(path.join(__dirname, './analyzerDashboard/build/')))

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: 1024 * 1024 * 20, type: 'application/json'});
const urlencodedParser = bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 20,
    type: 'application/x-www-form-urlencoding'
})
app.use(jsonParser);
app.use(urlencodedParser);
const cert_folder = path.join(__dirname, 'security/');
const httpsOptions = {
    key: fs.readFileSync(cert_folder+'key.pem'),
    cert: fs.readFileSync(cert_folder+'cert.pem'),
    rejectUnauthorized:false // in order to do request from fake ssl react js camera caputure
}

// const server = https.createServer(httpsOptions, app);
const server=app;


// app.use(express.static('../client//public/'));
app.use(express.static('../client/build/'));
const logger = function(req, res, next) {
    const log={headers:req.headers,params:req.params,body:req.body,originalUrl:req.originalUrl}
    console.log("GOT REQUEST !=>" + JSON.stringify(log.originalUrl) );
    // console.log("GOT REQUEST !=>" + JSON.stringify(log) );
    next(); // Passing the request to the next handler in the stack.
}
app.use(logger);

const port =3000;


    try{
        server.listen(port, () => console.log('<------------UP------------------------->'+'Listening on port ' + port));
        }
        catch(e){
            console.error(e);
        }


