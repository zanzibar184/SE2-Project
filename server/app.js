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
//db.write('gian','gian.luca',90);
db.print();



// Setup del server minimale, andrà ampliato per una maggiore robustezza

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

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

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});





module.exports = app;