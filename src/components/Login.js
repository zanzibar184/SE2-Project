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
        
        /*console.log('/db/write?name=' + profile.getName().split(' ').join('+') +
                    '&email=' + profile.getEmail() +
                    '&id=' +profile.getId());
        */
        

        axios.get('/db/write?name=' + profile.getName().split(' ').join('+') +
                    '&email=' + profile.getEmail() +
                    '&id=' +profile.getId())
              .then(function (response) {
                console.log('response' +response.data);
              })
              .catch(function (error) {
                console.log(error);
              });
    }




    render () {
        return (
            <div>

                <GoogleLogin socialId="627730180741-mnttqlpi0hcn1l5u6vrmhih3m370eldk.apps.googleusercontent.com" //id api google
                             className="google-login"
                             scope="profile"
                             fetchBasicProfile={true}
                             responseHandler={this.responseGoogle}
                             buttonText="Login With Google"/>
            </div>
        );
    }

}






export default Login;