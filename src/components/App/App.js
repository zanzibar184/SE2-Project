import React from "react";

// import YoutubePlayer from 'react-youtube-player';

import YoutubeSearch from '../YoutubeSearch';
import ComponentList from '../ComponentList';
import Login from '../Login';
import "./App.css";

var componentList;

const App = () => (
    <div className="App">
        <div className="row">
            <Login/>
            <div className="col-md-8 Scrollbar Vertical-fit" >

                <ComponentList ref={(instance)=>{componentList = instance;}} />

                {/*
                <div className="row thumbnail flex-row Container-multimedia First-media-color">
                    <YoutubeSearch search="reminiscence therapy"/>
                </div>

                <div className="row thumbnail flex-row Container-multimedia First-media-color">
                    <YoutubeSearch search="memory loss"/>
                </div>
                */}
                {/*
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
*/}
            </div>

            <div className="col-md-4 Chat-col-background Vertical-fit" >
                <div align="center" style={{paddingTop:'20px'}}>

                    <div className="input-group">
                        <input id="name" type="text" className="form-control" placeholder="Search"/>
                        <div className="input-group-btn">
                            <button className="btn btn-default" onClick={()=>{componentList.addComponent(<YoutubeSearch search={document.getElementById('name').value}/>);}}>
                                <i className="glyphicon glyphicon-search"/>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>

);

export default App;