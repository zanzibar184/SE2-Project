import axios from 'axios';

/*

Esempi di utilizzo in un altro modulo / componente:

    import Session from './SessionManager';

    let myContentList;
    Session.getSharedContents((list)=>{ myContentList = list; });

    Session.addSharedContent('youtube', 'url_del_video')

    Session.removeSharedContent(1511955620019);

    Session.setUserMail('pippo@gmail.com');

    Session.setPatientID('mio_paziente');

*/

class SessionManager {

    //-----------------------------------------------------------------

    constructor() {

       this.loginMail = null; // 'bloh2@hfs.it';

        // Attualmente, per semplicità, gestiamo un solo paziente per operatore ma
        // è possibile avere più pazienti assegnando valori diversi a questa variabile
       this.patientID = 'p0'; // 'pippo';

    }

    //-----------------------------------------------------------------

    setUserMail(email) { this.loginMail = email; }

    getUserMail() { return this.loginMail; }

    setPatientID(id) { this.patientID = id; }

    getPatientID() { return this.patientID; }

    reset() {
        this.setUserMail(null);
        this.setPatientID(null);
    }

   isLogged() { return this.loginMail && this.patientID; }

    //-----------------------------------------------------------------

    getSharedContents(callback) {

       if(!this.isLogged()) {
           if(callback) callback([]);
           return;
       }

       axios.get('/api/db?action=get&email='+this.loginMail+'&id_patient='+this.patientID)
           .then( (response) => {
               return response.data;
           })
           .then( (data) => {
               if(callback)
                   callback(data);
               else
                   console.log(data);
           })
           .catch( (error) => {
               console.log("Error: " + error);
               if(callback) callback([]);
           });
    }

    addSharedContent(id, url, callback) {

        if(!this.isLogged() || !id || !url) {
            if(callback) callback(false);
            return;
        }

        let time = new Date().getTime();
        axios.get('/api/db?action=add&email='+this.loginMail+'&id_patient='+this.patientID+'&date=' + time +'&content_id='+id+'&content='+url)
            .then( (response) => {
                return response.data;
            })
            .then( (data) => {
                console.log(data);
                if(callback) callback(true);
            })
            .catch( (error) => {
                console.log("Error: " + error);
                if(callback) callback(false);
            });
    }

    removeSharedContent(time, callback) {

        if(!this.isLogged() || !time) {
            if(callback) callback(false);
            return;
        }

        axios.get('/api/db?action=rem&email='+this.loginMail+'&id_patient='+this.patientID+'&date=' + time)
            .then( (response) => {
                return response.data;
            })
            .then( (data) => {
                console.log(data);
                if(callback) callback(true);
            })
            .catch( (error) => {
                console.log("Error: " + error);
                if(callback) callback(false);
            });
    }

    //-----------------------------------------------------------------

}

const session = new SessionManager();

export default session;