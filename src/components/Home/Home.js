import React from "react";

import "./Home.css";

import session from '../../SessionManager'

import kioku_logo from './kioku_logo_256x256.png';

class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            enabled: session.isLogged(),
            patientID: null
        };

        session.addLoginCallback((logged)=> {
            this.setState({enabled: logged});
        });

        this.getPatientID = this.getPatientID.bind(this);

    }

    getPatientID() {

        let patientID_input = document.getElementById('pIDInput').value;
        this.state.patientID = patientID_input;
        console.log(this.state.patientID);

    }

    render() {

        return (
            <div className="row rowKiokuStyle">
                <div className="col-md-12 divKioku kiokuAnimation" >
                    <h2 style={{textAlign:'center', color:'#76767c'}}>Benvenuto in Kioku</h2>
                    <img className="App-logo center-block" src={kioku_logo} alt="Kioku_logo" style={{marginTop:'20px'}}/>
                    <div className="input-group" style={{marginTop:'30px'}}>
                        <input id='pIDInput' type="text" className="form-control" placeholder="Inserisci ID paziente..." style={{boxShadow: '2px 2px 8px #888888'}} onKeyDown={(event)=>{if(event.keyCode === 13) this.getPatientID()}}/>
                        <div className="input-group-btn">
                            <button className="btn btn-primary" onClick={this.getPatientID}>
                                <i className="glyphicon glyphicon-chevron-right"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )

    }


}

export default Home;