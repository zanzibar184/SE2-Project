var mongo = require('mongoose');


mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    user: 'prova',
    pass: 'prova'
};
mongoose.connect('mongodb://prova:prova@ds259855.mlab.com:59855/proviamo', options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);
/*
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

*/

module.exports = mongo;