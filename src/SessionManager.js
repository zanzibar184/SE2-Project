import axios from 'axios';

/*

Esempi di utilizzo in un altro modulo / componente:

    import Session from './SessionManager';


    Session.addLoginCallback( (isLogged) => {
        if(isLogged) console.log("Qualcuno si è loggato!");
        else         console.log("Qualcuno ha fatto il logout!");
        });

    // ... una volta ottenuto il profilo dell'utente loggato da google (es. 'loginUserProfile') ( vedi Login.js )
    Session.login(loginUserProfile);

    let myContentList;
    Session.getSharedContents((list)=>{ myContentList = list; });

    Session.addSharedContent('youtube', 'url_del_video')

    Session.removeSharedContent(1511955620019);

    Session.logout();

*/

class SessionManager {

    //-----------------------------------------------------------------

    constructor() {

        this.loginUserProfile = null;

        // Attualmente, per semplicità, gestiamo un solo paziente per operatore ma
        // è possibile avere più pazienti assegnando valori diversi a questa variabile
        this.patientID = 'p0'; // 'pippo';

        this.onLoginEventCallbacks = [];

        this.addLoginCallback = this.addLoginCallback.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getLoggedUser = this.getLoggedUser.bind(this);
        this.getPatientID = this.getPatientID.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.getSharedContents = this.getSharedContents.bind(this);
        this.addSharedContent = this.addSharedContent.bind(this);
        this.removeSharedContent = this.removeSharedContent.bind(this);

    }

    //-----------------------------------------------------------------

    addLoginCallback(callback) {
        this.onLoginEventCallbacks.push(callback);
    }

    //-----------------------------------------------------------------

    login(loggedUserProfile/*, patientId*/) {
        if(!loggedUserProfile) return;
        this.loginUserProfile = loggedUserProfile;
        //if(patientId)
        //    this.patientID = patientId;
        this.onLoginEventCallbacks.forEach((c) => c(true));
    }

    logout() {
        this.loginUserProfile = null;
        // this.patientID = null;
        this.onLoginEventCallbacks.forEach((c) => c(false));
    }

    //-----------------------------------------------------------------

    getLoggedUser() { return this.loginUserProfile; }

    getPatientID() { return this.patientID; }

    isLogged() { return this.loginUserProfile && this.patientID; }

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
                if(callback) callback(true, time);
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