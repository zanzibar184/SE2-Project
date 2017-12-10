const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const YoutubeAPI= require('./YoutubeAPI');
const youtube = new YoutubeAPI();

const DatabaseAPI = require('./DatabaseAPI');
const db = new DatabaseAPI();


// Setup del server minimale, andrà ampliato per una maggiore robustezza

//----------------------------------------------------------------------------------------------

const io = require('./SocketIO');
io.start();

//----------------------------------------------------------------------------------------------

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
            return db.addSharedContent(
                req.query.email,
                req.query.id_patient,
                req.query.date,
                req.query.content_id,
                req.query.content,
                (result) => {
                    if(result) {
                        io.notify(req.query.id_patient,'add',{date: req.query.date, content_id: req.query.content_id, content: req.query.content});
                        res.status(200).send(true);
                        return true;
                    }
                    res.status(404).send(false);
                }
            );
        case 'rem':
            return db.removeSharedContent(
                req.query.email,
                req.query.id_patient,
                req.query.date,
                (result) => {
                    if(result) {
                        io.notify(req.query.id_patient,'rem',{date: req.query.date});
                        res.status(200).send(true);
                        return true;
                    }
                    res.status(404).send(false);
                }
            );
        case 'get':
            return db.getPatientContents(req.query.email, req.query.id_patient, (success, results) => {
                if(success) res.send(results);
                else res.status(404).send([]);
            });
        case 'print':
            db.print();
            res.status(200).send('OK');
            return true;
        case 'remall':
            db.removeAll();
            res.status(200).send('OK');
            return true;
        case 'drop':
            db.drop();
            res.status(200).send('OK');
            return true;
    }
    return false;
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

function handleAPISaint(req, res) {
    return db.getSaint(parseInt(req.query.day), parseInt(req.query.month), (success, results) => {
                if(success) res.send(results);
                else res.status(404).send([]);
            });

}

//----------------------------------------------------------------------------------------------

function handleAPIRequest(req, res) {
    switch (req.params.id) {
        case 'youtube':
            return handleAPIYoutube(req, res);
        case 'db':
            return handleAPIDatabase(req,res);
        case 'saint':
            return handleAPISaint(req,res);
        default:
            res.status(404).send("Chiamata API non riconosciuta.");
    }
    return true;
}

//----------------------------------------------------------------------------------------------

app.get('/api/:id', (req, res) => {
    if(!handleAPIRequest(req,res))
        res.status(404).send("Parametri errati nella chiamata API.");
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

//-----------------------------------------------------------------------------------------------

module.exports = app;