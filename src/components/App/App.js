import React from "react";

import ComponentList from '../ComponentList';
import ChatBot from '../ChatBot/ChatBot';
import session from '../../SessionManager';

import "./App.css";

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

        if(this.state.enabled){
            view = <div className="App">
                        <div className="row">
                            <div className="col-md-8 Scrollbar Vertical-fit">
                                <ComponentList ref={(instance) => {
                                    this.componentList = instance;
                                }}/>
                            </div>
                            <div className="col-md-4 Chat-col-background Vertical-fit">
                                <div align="center" style={{paddingTop: '20px'}}>
                                    <ChatBot ref={(instance) => {
                                        instance.componentList = this.componentList;
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>;
        } else {
            view = <div className="App">
                        <div className="row">
                            <div className="col-md-12 Scrollbar Vertical-fit">
                                <ComponentList ref={(instance) => {
                                    this.componentList = instance;
                                }}/>
                            </div>
                        </div>
                    </div>;
        }

        return view;

    }

}

export default App;