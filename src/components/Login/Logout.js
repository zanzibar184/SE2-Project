import React from 'react';
import { GoogleLogin } from 'react-google-login-component';

import session from '../../SessionManager';


class Logout extends React.Component{

    constructor (props, context) {
        super(props, context);
    }

    responseGoogleLogout () {

        session.logout();

    }

    render () {
        return (
            <div>
                <GoogleLogin socialId="521032149458-2uuccstqvqe6iepohkl0kdoh8jpd32q1.apps.googleusercontent.com"
                              className="google-logout"
                              scope="profile"
                              fetchBasicProfile={true}
                              responseHandler={this.responseGoogleLogout}
                              style={{border:'none', background:'transparent'}}>
                    <div className="input-group">
                        <button className="btn btn-danger glyphicon glyphicon-log-out" style={{height:'40px'}}/>
                    </div>
                </GoogleLogin>
            </div>
        );
    }

}

export default Logout;