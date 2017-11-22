/*
 * Copyright (c) 2017 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Written with: mongodb@2.2.21
 * Documentation: http://docs.mongodb.org/ecosystem/drivers/node-js/
 * A Node script connecting to a MongoDB database given a MongoDB Connection URI.
*/

var mongodb = require('mongodb');

// Create seed data

var seedData = [
  {
    mail: 'gianluca.pessotto',
    nome: 'Debby Boone',
    eta: 20,

  },
{
    mail: 'soledad.pavan',
    nome: 'Bloh',
    eta: 28,

  }
];

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://prova:prova@ds259855.mlab.com:59855/proviamo';

mongodb.MongoClient.connect(uri, function(err, db) {

  if(err) throw err;

  /*
   * First we'll add a few songs. Nothing is required to create the
   * songs collection; it is created automatically when we insert.
   */

  var utenti = db.collection('utenti');

   // Note that the insert method can take either an array or a dict.

  utenti.insert(seedData, function(err, result) {

    if(err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    utenti.update(
      { mail: 'soledad.pavan' },
      { $set: { nome: 'solei' } },
      function (err, result) {

        if(err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        utenti.find(/*{  eta: { $gte: 20 } }).sort({ mail: 1 }*/).toArray(function (err, docs) {

          if(err) throw err;

          docs.forEach(function (doc) {
            console.log(
              'Nome ' + doc['nome'] + ', ' + doc['mail'] + ' by ' + doc['eta']
            );
          });

           //Since this is an example, we'll clean up after ourselves.
          utenti.drop(function (err) {
            if(err) throw err;

            // Only close the connection when your app is terminating.
            db.close(function (err) {
              if(err) throw err;
            });
          });
        });
      }
    );
  });
});
