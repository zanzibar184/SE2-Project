import React from "react";
import YoutubePlayer from 'react-youtube-player';
import Chatbot from '../Chatbot';


import "./App.css";

// Questa è la nostra app di esempio. Prima include il codice html contenuto nel componente Header e poi
// include il contenuto del componente Main
const App = () => (
    <div className="App">
        <div className="row">
            <div className="col-md-8 Scrollbar Vertical-fit">

                <div className="row thumbnail flex-row Container-multimedia First-media-color">
                    <div className="col-lg-8">
                        <div className="Youtube-dim">
                            <YoutubePlayer videoId='hVwgHLGmqi4' />
                        </div>
                    </div>
                    <div className="col-lg-4" />
                </div>

                <div className="row thumbnail flex-row Container-multimedia Second-media-color">
                    <div className="col-lg-4"/>
                    <div className="col-lg-8">
                        <div className="Youtube-dim">
                            <YoutubePlayer videoId='QTDmgsTLeTc' />
                        </div>
                    </div>
                </div>

                <div className="row thumbnail flex-row Container-multimedia First-media-color">
                    <div className="col-lg-8">
                        <div className="Youtube-dim">
                            <YoutubePlayer videoId='yP6wCjJab6M' />
                        </div>
                    </div>
                    <div className="col-lg-4" />
                </div>

                <div className="row thumbnail flex-row Container-multimedia Second-media-color">
                    <div className="col-lg-4"/>
                    <div className="col-lg-8">
                        <div className="Youtube-dim">
                            <YoutubePlayer videoId='k1-TrAvp_xs' />
                        </div>
                    </div>
                </div>

            </div>

            <div className="col-md-4 Chat-col-background Vertical-fit" >
                <div align="center" style={{paddingTop:'20px'}}>
                    <Chatbot/>
                </div>
            </div>

        </div>

    </div>

);

export default App;