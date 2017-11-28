import React from 'react';
import { GoogleLogin } from 'react-google-login-component';
import axios from 'axios';

import googleIcon from './google_icon_32x32.png';


class Login extends React.Component{
 
  constructor (props, context) {
    super(props, context);
  }
    
        // Make a request for a user with a given ID
        
            
    


    responseGoogle (googleUser) {

        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;


        //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //console.log('Name: ' + profile.getName());
        //console.log('Email: ' + profile.getEmail());
        //console.log({accessToken: id_token});
  
        /*axios.get('/db/add?name=' + profile.getName().split(' ').join('+') +
                    '&email=' + profile.getEmail() +
                    '&id=' +profile.getId())
              .then(function (response) {
                console.log('response' +response.data);
              })
              .catch(function (error) {
                console.log(error);
              });*/
    }




  render () {
    return (
      <div>
        <GoogleLogin socialId="521032149458-2uuccstqvqe6iepohkl0kdoh8jpd32q1.apps.googleusercontent.com"
                     className="google-login"
                     scope="profile"
                     fetchBasicProfile={false}
                     responseHandler={this.responseGoogle}
                     style={{border:'none', background:'transparent'}}>
            <div className="input-group">
                <button className="btn btn-danger" style={{padding:'3px'}}>
                    <img src={googleIcon} alt='google_icon' width='32px' height='32px' style={{marginRight:'2px'}}/>
                    <b>Login con Google</b>
                </button>
            </div>
        </GoogleLogin>
      </div>
    );
  }
 
}
 
export default Login;





 



