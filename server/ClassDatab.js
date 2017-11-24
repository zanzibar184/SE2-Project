class ClassDatab {

    constructor() {

        this.mongodb = require('mongodb');
        this.uri = 'mongodb://prova:prova@ds259855.mlab.com:59855/proviamo';
        
    }
    //scrive un nuovo elemento
    write(name,email,age) {
        //console.log('write');
        var seedData = [
          {
            mail: email,
            nome: name,
            eta: age,

          }
        ];
        this.mongodb.MongoClient.connect(this.uri, function(err, db) {

                if(err) throw err;
                var utenti = db.collection('shared_content');

                utenti.insert(seedData, function(err, result) {
                if(err) throw err;
                });

                db.close(function (err) {
                if(err) throw err;
                });

             });
     }
     //stampa gli elementi della tabella
     print() {

        this.mongodb.MongoClient.connect(this.uri, function(err, db) {

                if(err) throw err;

                var utenti = db.collection('shared_content');

                utenti.find().toArray(function (err, docs) {

                if(err) throw err;

                docs.forEach(function (doc) {
                    console.log('Nome: ' + doc['nome'] + ' email: ' + doc['mail'] + ' età: ' + doc['eta']);
                    });

                   
                });


                    db.close(function (err) {
                    if(err) throw err;
                    });

                });

             };
     
    //cancella la tabella 
    drop() {
        this.mongodb.MongoClient.connect(this.uri, function(err, db) {
        if(err) throw err;
        var utenti = db.collection('shared_content');    
        utenti.drop(function (err) {
            if(err) throw err;
            });

        });
    }


}

module.exports = ClassDatab;