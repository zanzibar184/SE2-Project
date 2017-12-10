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
    Session.getPatientContents((list)=>{ myContentList = list; });

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
        this.patientID = null; // 'p0';

        this.onLoginEventCallbacks = [];

        this.addLoginCallback = this.addLoginCallback.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getLoggedUser = this.getLoggedUser.bind(this);
        this.getPatientID = this.getPatientID.bind(this);
        this.setPatientID = this.setPatientID.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.getPatientContents = this.getPatientContents.bind(this);
        this.addSharedContent = this.addSharedContent.bind(this);
        this.removeSharedContent = this.removeSharedContent.bind(this);
        this.getSaintContent = this.getSaintContent.bind(this);

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

    setPatientID(patientId) { this.patientID = patientId; }

    isLogged() { return this.loginUserProfile && this.patientID; }

    //-----------------------------------------------------------------

    // Non serve essere loggati per questo metodo
    getPatientContents(callback) {

        if(!this.patientID) {
            if(callback) callback([]);
            return;
        }

       // axios.get('/api/db?action=get&email='+this.loginUserProfile.getEmail()+'&id_patient='+this.patientID)
       axios.get('/api/db?action=get&id_patient='+this.patientID)
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
        axios.get('/api/db?action=add&email='+this.loginUserProfile.getEmail()+'&id_patient='+this.patientID+'&date=' + time +'&content_id='+id+'&content='+url)
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

        //axios.get('/api/db?action=rem&email='+this.loginMail+'&id_patient='+this.patientID+'&date=' + time)
        axios.get('/api/db?action=rem&id_patient='+this.patientID+'&date=' + time)
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
    getSaintContent(day,month,callback) {
      
       axios.get('/api/saint?day='+day+'&month='+month)
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
               console.log("Error on getSaintContent: " + error);
               if(callback) callback([]);
           });
    }

}

const session = new SessionManager();

export default session;