import React from 'react';
import {GoogleLogin} from 'react-google-login';

import session from '../../SessionManager';
import googleIcon from './google_icon2_32x32.png';
// import GoogleLogout from "react-google-login/src/GoogleLogout";

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            logged: false,
        };

        this.switchButton = this.switchButton.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.onLogoutSuccess = this.onLogoutSuccess.bind(this);

    }

    switchButton() {
        this.setState((prevState, props) => {
            return {logged: !prevState.logged}
        });
    }

    onLogoutSuccess() {
        session.logout();
        this.switchButton();
    }

    // Make a request for a user with a given ID

    onLoginSuccess(googleUser) {

        let profile = googleUser.getBasicProfile();
        // var id_token = googleUser.getAuthResponse().id_token;

        session.login(profile);

        this.switchButton();

        //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //console.log('Name: ' + profile.getName());
        //console.log('Email: ' + profile.getEmail());
        //console.log({accessToken: id_token});

    }

    render() {

        if (!this.state.logged) {

            return <GoogleLogin
                clientId="1028425913205-j5sbr85488id2mosjc5fj68mgb1usmrg.apps.googleusercontent.com"
                onSuccess={this.onLoginSuccess}
                onFailure={(response) => console.error(response)}
                onRequest={() => console.log('loading')}
                offline={false}
                approvalPrompt="force"
                responseType="id_token"
                isSignedIn
                className='btn btn-danger'
                style={{padding: '3px'}}
                // disabled
                // prompt="consent"
            >
                <img src={googleIcon} alt='google_icon' width='32px' height='32px' style={{marginRight: '2px'}}/>
                <b>Login con Google</b>
            </GoogleLogin>;

        } else {

            //document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost/application-name/logoutUser";
            //return <button className="btn btn-danger glyphicon glyphicon-log-out" style={{height:'40px'}} onClick={()=>{document.location.href = "https://www.google.com/accounts/Logout"; this.onLogoutSuccess(); }}/>;

            return <button className="btn btn-danger glyphicon glyphicon-log-out" style={{height: '40px'}}
                           onClick={() => {
                               //let win = window.open("http://accounts.google.com/logout", '', "width=550,height=570");
                               let win = window.open("http://accounts.google.com/logout", '_blank', 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=0, top=0, width=550, height=570, visible=none', '');
                               window.focus();
                               setTimeout(() => {
                                   win.close();
                                   this.onLogoutSuccess();
                               }, 2000);
                           }}/>;

            //HACK: Il componente GoogleLogout sembra non funzionare. Leggendo dai forum può essere che inizi a funzionare una volta che il front-end non è piu eseguito in localhost
            //TODO: Provare a ripristinare il componente prima di metterlo su heroku
            /*
                            return <GoogleLogout style={{border:'none', background:'transparent'}}>
                                                 onLogoutSuccess={this.onLogoutSuccess}>
                                        { <button className="btn btn-danger glyphicon glyphicon-log-out" style={{height:'40px'}}/> }
                                   </GoogleLogout>
            */

        }
    }
}

export default Login;





 



