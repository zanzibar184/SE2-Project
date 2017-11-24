// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
//const mongo = require('./data.js');
const app = express();

const YoutubeFinder = require('./YoutubeFinder');
const ytfinder = new YoutubeFinder();

const Datab = require('./ClassDatab');
const db = new Datab();


// Setup del server minimale, andrà ampliato per una maggiore robustezza

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));




// richiamo ytfinder-server
app.get('/api/:id', (req, res) => {
    switch (req.params.id) {
        case 'youtube':
            var searchString = req.query.search;
            if(searchString) {
                ytfinder.find(searchString, (result) => {
                    res.send(result);
                });
                return;
            }
    }
    res.status(404).send('Comando non riconsciuto');
});



//richiamo db-server
app.get('/db/:id', (req, res) => {

   // console.log('params:' + req.params.id);
    //console.log('query:' + req.query.a);

       switch (req.params.id) {
        case 'write':
           console.log('write');
           db.write(req.query.name,req.query.email,req.query.id);
           //console.log('dati inviati:' +req.query.name,req.query.email,req.query.id);
           //db.print();
           res.send('true');
           //db.drop();
           return;
           break;
        case 'print':
            console.log('print');
            //db.print();
            break;
        case 'delete':
            console.log('delete');
            //db.drop();
            break;
        default:
            console.log('ERROR 404 this is not fantastic');
    }   
});
















// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});





module.exports = app;