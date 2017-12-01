import React from "react";

import ComponentList from '../ComponentList';
import ChatBot from '../ChatBot/ChatBot';

import "./App.css";

// path="/:myvalue" -> this.props.match.params.myvalue

const App = () => (
    <div className="App">
        <div className="row">
            <div className="col-md-8 Scrollbar Vertical-fit" >
                <ComponentList ref={(instance)=>{this.componentList = instance;}} />
            </div>
            <div className="col-md-4 Chat-col-background Vertical-fit" >
                <div align="center" style={{paddingTop:'20px'}}>
                    <ChatBot ref={(instance)=> { instance.componentList = this.componentList; }}/>
                </div>
            </div>
        </div>
    </div>
);

export default App;