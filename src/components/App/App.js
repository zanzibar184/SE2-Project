import React from "react";
import ChatBot from 'react-simple-chatbot';
import Login from '../Login';

import "./App.css";

// Questa è la nostra app di esempio. Prima include il codice html contenuto nel componente Header e poi
// include il contenuto del componente Main
const App = () => (
    <div className="App">
        <div className="row">
            <div className="col-md-8 Scrollbar Vertical-fit">

            
            </div>
            
            <div className="col-md-4 Chat-col-background Vertical-fit" >
                <div align="center" style={{paddingTop:'20px'}}>
                    <Login/>
                    <ChatBot
                        steps={[
                            {
                                id: 'hello-world',
                                message: 'Hello World!',
                                end: true,
                            },
                        ]}
                    />
                </div>
            </div>

        </div>

    </div>

);

export default App;