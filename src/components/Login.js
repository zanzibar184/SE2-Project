import React from 'react';
import { GoogleLogin } from 'react-google-login-component';

class Login extends React.Component{

    constructor (props, context) {
        super(props, context);
    }

    responseGoogle (googleUser) {

        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Email: ' + profile.getEmail());

        var id_token = googleUser.getAuthResponse().id_token;
        console.log({accessToken: id_token});
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