import React from 'react';
import { GoogleLogin } from 'react-google-login-component';
import axios from 'axios';


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
                     buttonText="Login With Google"/>
      </div>
    );
  }
 
}
 
export default Login;





 



