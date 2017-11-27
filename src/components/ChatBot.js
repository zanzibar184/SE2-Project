import React from 'react';
import {ApiAiClient} from "api-ai-javascript/es6/ApiAiClient";

import ComponentList from './ComponentList';
import YoutubeSearch from "./YoutubeSearch";


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

        if(this.messageList)
            this.messageList.addComponent(<a className='list-group-item' style={{textAlign: 'left', borderStyle: 'none', background: 'linear-gradient(to right, #e7dbce , #d0c4ba)'}}>{input.value}</a>);

        this.client
            .textRequest(input.value)
            .then((response) => {

                    console.log(response);/* do something */

                    // Posso agire in base a uno specifico context
                    if(this.componentList) {
                        response.result.contexts.forEach((ctx) => {

                            if (ctx.name === "richiesta-youtube-followup") {
                                let searchText = ctx.parameters['cercaVideo.original'];
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
                                this.messageList.addComponent(<a className='list-group-item' style={{textAlign: 'right', borderStyle: 'none', background: 'linear-gradient(to right, #d0c4ba, #e7dbce)'}}><b><i>{item.speech}</i></b></a>);
                        })
                    }

                    let container = document.getElementById('cbMessageContainer');
                    container.scrollTo(0,container.scrollHeight);
            })
            .then(()=>{ input.value = ''; })
            .catch((error) => { console.log("ChatBot Error: " + error);/* do something here too */})
    }
    render() {
        let htmlCode =  <div>
                            <div id='cbMessageContainer' className='list-group Scrollbar Second-media-color Chatbot' style={{marginTop:'10px'}}>
                                <ComponentList ref={(instance)=>{this.messageList=instance;}}/>
                            </div>
                            <div className="input-group">
                                <input id='cbInput' type="text" className="form-control" placeholder="Scrivi al bot..." onKeyDown={(event)=>{if(event.keyCode === 13) this.sendInput()}}/>
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