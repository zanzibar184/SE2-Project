class DatabaseAPI {

    constructor() {

        this.mongodb = require('mongodb');
        this.uri = 'mongodb://kio:kio@ds119446.mlab.com:19446/kioku_chatbot';

        
    }

    //scrive un nuovo elemento
    addSharedContent(email, id_patient, date, content_id, content, callback) {

        if(!email || !id_patient || !date || !content_id || !content || !callback)
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

        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('shared_content');
            })
            .then((table) => {
                return table.insert(seedData);
            })
            .then((result)=> {
                callback(true);
                //console.log(result);
            })
            .catch((err) => {
                callback(false);
                console.log("Error: database.addSharedContent > " + err);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return true;
     }

     removeAll() {

         let database = null;


         this.mongodb.MongoClient.connect(this.uri)
             .then((db) => {
                 database = db;
                 return db.collection('shared_content');
             })
             .then((table) => {
                 return table.deleteMany({});
             })
             .then((doc, result)=> {
                 console.log(result);
             })
             .catch((err) => {
                 console.log("Error: database.removeAll > " + err);
             })
             .then(() => {
                 if(database) {
                     database.close();
                 }
             });

         return true;
     }

    // rimuove un elemento esistente
    removeSharedContent(email_r, id_patient_r, date_r, callback) {

        if(!id_patient_r || !date_r || !callback)
            return false;

        let database = null;


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
                        date: date_r}, {justOne: false } )
                    : table.remove(
                        { id_patient: id_patient_r,
                          date: date_r}, {justOne: false })
            })
            .then((result)=> {
                callback(true);
                //console.log(result);
            })
            .catch((err) => {
                console.log("Error: database.removeSharedContent > " + err);
                callback(false);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return true;
    }

    getPatientContents(email_f,id_patient_f, callback) {

       if(!id_patient_f || !callback) return false;

        let database = null;
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
                callback(true, results);
            })
            .catch((err) => {
                console.log("Error: database.getPatientContents " + err);
                callback(false);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return true;
    };

    //----------------------------------------------------------------------------
      insertSaint(day, month, saint) {

        if(!day || !month || !saint)
            return false;

        let seedData = [
          {
            giorno: day,
            mese: month,
            santo: saint,
          }
        ];

        let database = null;

        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('daily_saint');
            })
            .then((table) => {
                return table.insert(seedData);
            })
            .catch((err) => {
                console.log("Error: database.newSanto > " + err);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return true;
     }

    printSaint() {

        let database = null;
        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('daily_saint');
            })
            .then((table) => {
                return table.find({
                  mese: 12,
                  giorno: 31
                });

            }).then((cursor) => {
               return cursor.toArray();
            })
            .then((array) => {
                //console.log(array);
                let results = [];
                array.forEach( (element) => {
                    results.push({giorno: element.giorno, mese: element.mese, santo: element.santo});
                });
                console.log(results);
            })
            .catch((err) => {
                console.log("Error: database.printSaint" + err);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return true;

             };


      getSaint(day,month, callback) {

        let database = null;
        this.mongodb.MongoClient.connect(this.uri)
            .then((db) => {
                database = db;
                return db.collection('daily_saint');
            })
            .then((table) => {
                  return table.find({
                      mese: month,
                      giorno: day
                  });
            }).then((cursor) => {
               return cursor.toArray();
            })
            .then((array) => {
                //console.log(array);
                let results = [];
                array.forEach( (element) => {
                    results.push({giorno: element.giorno, mese: element.mese, santo: element.santo});
                });
                callback(true, results);
            })
            .catch((err) => {
                console.log("Error: database.getPatientContents " + err);
                callback(false);
            })
            .then(() => {
                if(database) {
                    database.close();
                }
            });

        return true;
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
