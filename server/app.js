const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const YoutubeAPI= require('./YoutubeAPI');
const youtube = new YoutubeAPI();



const DatabaseAPI = require('./DatabaseAPI');
const db = new DatabaseAPI();


// Setup del server minimale, andrà ampliato per una maggiore robustezza

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

//----------------------------------------------------------------------------------------------

function handleAPIDatabase(req,res) {
    // console.log('params:' + req.params.id);
    // console.log('query:' + req.query.a);

    switch (req.query.action) {

        case 'add':
            console.log('write');
            db.addSharedContent(  req.query.email,
                req.query.id_patient,
                req.query.date,
                req.query.content_id,
                req.query.content
            );
            break;

        case 'print':
            db.print();
            break;

        case 'remove':
            db.removeSharedContent(
                req.query.email,
                req.query.id_patient,
                req.query.date
            );

            break;

        case 'drop':
            db.drop();
            break;

        default:
            return false;
    }

    return true;
}


//----------------------------------------------------------------------------------------------


function handleAPIYoutube(req, res) {
    let searchString = req.query.search;
    if(searchString) {
        youtube.find(searchString, (result) => {
            res.send(result);
        });
        return true;
    }
    return false;
}

//----------------------------------------------------------------------------------------------

function handleAPIRequest(req, res) {
    switch (req.params.id) {
        case 'youtube':
            return handleAPIYoutube(req, res);
        case 'db':
            return handleAPIDatabase(req,res);
        default:
            res.status(404).send("Chiamata API non riconosciuta.");
    }
    return true;
}

//----------------------------------------------------------------------------------------------

app.get('/api/:id', (req, res) => {
    if(!handleAPIRequest(req,res))
        res.status(404).send("Chiamata API fallita");
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

//-----------------------------------------------------------------------------------------------

module.exports = app;