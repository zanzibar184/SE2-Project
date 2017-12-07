import React from "react";

import "./Home.css";

import session from '../../SessionManager'

import kioku_logo from './kioku_logo_256x256.png';
import App from "../App/App";

class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            enabled: !session.getPatientID()
        };

        this.getPatientID = this.getPatientID.bind(this);
    }

    componentDidMount() {

    }

    getPatientID() {
        let patientID_input = document.getElementById('pIDInput').value;
        if(!patientID_input)
            return;
        session.setPatientID(patientID_input);
        this.setState({enabled: !session.getPatientID()});
    }

    render() {
        return (this.state.enabled) ?
            (    <div className="row flex-row rowKiokuStyle">
                    <div className="col-md-12 divKioku kiokuAnimation" >
                        <h2 style={{textAlign:'center', color:'#76767c'}}>Benvenuto in Kioku</h2>
                        <div className="center-block" style={{marginTop:'20px', maxWidth:'256px', maxHeight:'256px'}}>
                            <img className="App-logo" src={kioku_logo} alt="Kioku_logo" style={{width:'100%'}}/>
                        </div>
                        <div className="input-group" style={{marginTop:'30px', minWidth:'200px'}}>
                            <input id='pIDInput' type="text" className="form-control center-block" placeholder="Inserisci ID paziente..." style={{boxShadow: '2px 2px 8px #888888'}} onKeyDown={(event)=>{if(event.keyCode === 13) this.getPatientID()}}/>
                            <div className="input-group-btn">
                                <button className="btn btn-primary" onClick={this.getPatientID}>
                                    <i className="glyphicon glyphicon-chevron-right"/>
                                </button>
                            </div>
                        </div>
                        <h5 style={{textAlign:'center', color:'#7d6c6d', marginTop:'25px'}}>
                            Inserisci un identificatore da associare al tuo paziente
                            <br/>
                            Grazie ad esso potrai accedere ai contenuti multimediali che hai condiviso nelle varie sessioni
                        </h5>
                    </div>
                </div>  )

            : <App/>
    }
}

export default Home;