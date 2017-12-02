class DatabaseAPI {

    constructor() {

        this.mongodb = require('mongodb');
        this.uri = 'mongodb://kio:kio@ds119446.mlab.com:19446/kioku_chatbot';
        
    }

    //scrive un nuovo elemento
    addSharedContent(email, id_patient, date, content_id, content) {

        if(!email || !id_patient || !date || !content_id || !content)
            return false;

        let seedData = [
          {
            email: email,
            id_patient: id_patient,
            date: date,
            content_id: content_id,
            content: content,

          }
        ];

        let database = null;
        let retValue = true;

        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('shared_content');
            })
            .then((table) => {
                return table.insert(seedData);
            })
            .then((result)=> {
                console.log(result);
            })
            .catch((err) => {
                retValue = false;
                console.log("Error: database.addSharedContent > " + err);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return retValue;
     }

    // rimuove un elemento esistente
    removeSharedContent(email_r, id_patient_r, date_r) {

        if(!id_patient_r || !date_r)
            return false;

        let database = null;
        let retValue = true;

        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('shared_content');
            })
            .then((table) => {
                return (email_r) ?
                      table.remove(
                        { email: email_r,
                        id_patient: id_patient_r,
                        date: date_r})
                    : table.remove(
                        { id_patient: id_patient_r,
                          date: date_r})
            })
            .then((result)=> {
                //console.log(result);
            })
            .catch((err) => {
                retValue = false;
                console.log("Error: database.removeSharedContent > " + err);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return retValue;
    }

getPatientContents(email_f,id_patient_f, res) {

       if(!id_patient_f || !res) return false;

        let database = null;
        let retValue = true;
        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('shared_content');
            })
            .then((table) => {
            	if(!email_f)
	                return table.find({
	                    id_patient: id_patient_f
	                });
	            else
	            	return table.find({
	                    email: email_f,
	                    id_patient: id_patient_f
	                });

            }).then((cursor) => {
               return cursor.toArray();
            })
            .then((array) => {
                //console.log(array);
                let results = [];
                array.forEach( (element) => {
                    results.push({content: element.content, content_id: element.content_id, date: element.date});
                });
                res.send(results);
            })
            .catch((err) => {
                retValue = false;
                res.status(404).send([]);
                console.log("Error: database.getPatientContents " + err);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return retValue;
    };

    //----------------------------------------------------------------------------

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
