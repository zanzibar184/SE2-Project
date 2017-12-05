import React from "react";

import ChatBot from '../ChatBot/ChatBot';
import session from '../../SessionManager';

import "./App.css";
import MultimediaContents from "../MultimediaContents";

// path="/:myvalue" -> this.props.match.params.myvalue

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            enabled: session.isLogged()
        };

        session.addLoginCallback((logged)=> {
            this.setState({enabled: logged});
        });
    }

    render() {

        let view;

        if (this.state.enabled) {
            view = <div className="App">
                        <div className="row backgroundStyle">
                            <div className="col-md-8 Vertical-fit" style={{padding: '0'}}>
                                <MultimediaContents ref={(instance) => {
                                    this.multimediaContents = instance;
                                }}/>
                            </div>
                            <div className="col-md-4 Chat-col-background Vertical-fit">
                                <div align="center" style={{paddingTop: '20px'}}>
                                    <ChatBot ref={(instance) => {
                                        if (instance)
                                            instance.multimediaContents = this.multimediaContents;
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>;
        } else {
            view = <div className="App">
                        <div className="row backgroundStyle">
                            <div className="col-md-12 Vertical-fit" style={{padding: '0'}}>
                                <MultimediaContents/>
                            </div>
                        </div>
                    </div>;
        }

        return view;
    }
}

export default App;