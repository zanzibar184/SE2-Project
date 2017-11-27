import React from 'react';
import {ApiAiClient} from "api-ai-javascript/es6/ApiAiClient";

import ComponentList from '../ComponentList';
import YoutubeSearch from "../YoutubeSearch";

import "./ChatBot.css";


class ChatBot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.client = new ApiAiClient({accessToken: '550a9943389e4b4197850ec1b0b9758d'});
        this.sendInput = this.sendInput.bind(this);
    }

    componentDidMount() {

    }

    sendInput() {
        var input = document.getElementById('cbInput');
        if(!this.client || !input || !input.value) return;

        input.disabled = true;

        if(this.messageList)
            this.messageList.addComponent(<a className='list-group-item Msj_client'>{input.value}</a>);

        this.client
            .textRequest(input.value)
            .then((response) => {

                    console.log(response);/* do something */

                    // Posso agire in base a uno specifico context
                    if(this.componentList) {
                        response.result.contexts.forEach((ctx) => {

                            if (ctx.name === "richiesta-youtube-followup") {

                                let searchText = ctx.parameters.cercaVideo;
                                if(searchText)
                                    this.componentList.addComponent(<YoutubeSearch search={searchText}/>);
                            }
                        });
                    }

                    // Riporto i messaggi di risposta del bot
                    let respMessages = response.result.fulfillment.messages;
                    if(this.messageList){
                        respMessages.forEach((item)=> {
                            if(item.speech)
                                this.messageList.addComponent(<a className='list-group-item Msj_server'><b><i>{item.speech}</i></b></a>);
                        })
                    }

                    let container = document.getElementById('cbMessageContainer');
                    container.scrollTo(0,container.scrollHeight);
            })
            .then(()=>{ input.value = ''; })
            .catch((error) => { console.log("ChatBot Error: " + error);/* do something here too */})
            .then(() => input.disabled = false)
    }
    render() {
        let htmlCode =  <div>
                            <div id='cbMessageContainer' className='list-group Scrollbar_chatbot ChatBot_background Chatbot_dim' style={{marginBottom:'10px', boxShadow: '2px 2px 8px #888888'}}>
                                <ComponentList ref={(instance)=>{this.messageList=instance;}}/>
                            </div>
                            <div className="input-group">
                                <input id='cbInput' type="text" className="form-control" placeholder="Scrivi al bot..." style={{boxShadow: '2px 2px 8px #888888'}} onKeyDown={(event)=>{if(event.keyCode === 13) this.sendInput()}}/>
                                <div className="input-group-btn">
                                    <button className="btn btn-success" onClick={this.sendInput}>
                                        <i className="glyphicon glyphicon-play"/>
                                    </button>
                                </div>
                            </div>
                        </div>

        return htmlCode;
    }
}

export default ChatBot;