class DatabaseAPI {

    constructor() {

        this.mongodb = require('mongodb');
        this.uri = 'mongodb://kio:kio@ds119446.mlab.com:19446/kioku_chatbot';
        
    }

    //scrive un nuovo elemento
    addSharedContent(email, id_patient, date, content_id, content){
        var seedData = [
          {
            email: email,
            id_patient: id_patient,
            date: date,
            content_id: content_id,
            content: content,

          }
        ];

        //apro la connessione
        this.mongodb.MongoClient.connect(this.uri, function(err, db) {

                //accedo alla tabella
                if(err) throw err;
                var table = db.collection('shared_content');

                //inserisco i dati nel db
                table.insert(seedData, function(err, result) {
                if(err) throw err;
                });

                //chiudo la connessione
                db.close(function (err) {
                if(err) throw err;
                });

                db.close();

             });
     }

    removeSharedContent(email_r, id_patient_r, date_r){

        this.mongodb.MongoClient.connect(this.uri, function(err, db) {

            if(err) throw err;
             var table = db.collection('shared_content');
                table.remove(

                    {email: email_r}, 
                    {id_patient: id_patient_r},
                    {date: date_r}, 

                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                        db.close();
                });
            
        });


     }


//-------PROBLEMA NEL SALVARE DOCS
    getPatientContents(email_f,id_patient_f,date_f) {

       

        this.mongodb.MongoClient.connect(this.uri, function(err, db) {

                if(err) throw err;
                var table = db.collection('shared_content');

                var find=table.find({
                                            email: email_f,
                                            id_patient: id_patient_f,
                                            date:date_f
                                        });

                find.toArray(function (err, docs) {
   
                        if(err) throw err;
                        docs.forEach(function (doc) {
                        // how to save          
                        console.log(docs);     
          
                    });

                   
                });

                    //console.log(find);     
                    db.close(function (err) {
                    if(err) throw err;
                    //console.log('chiuso db');
                    });
        });

    };
//-------------------------

     //stampa gli elementi della tabella
    print() {

        this.mongodb.MongoClient.connect(this.uri, function(err, db) {

                if(err) throw err;

                var utenti = db.collection('shared_content');

                utenti.find().toArray(function (err, docs) {

                if(err) throw err;
                
                docs.forEach(function (doc) {
                    console.log('email: ' + doc['email'] +
                                ' id_patient: ' + doc['id_patient'] +
                                 ' date: ' + doc['date']+
                                 ' content_id: ' + doc['content_id'] +
                                 ' content: ' + doc['content'] 
                                 );
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

module.exports = DatabaseAPI;