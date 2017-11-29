import React from 'react';
import {ApiAiClient} from "api-ai-javascript/es6/ApiAiClient";

import ComponentList from '../ComponentList';
import YoutubeSearch from "../YoutubeSearch";

import "./ChatBot.css";


class ChatBot extends React.Component {
    constructor(props) {
        super(props);
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

                    if(response.result.action === "RicercaVideoYT.video-cerca") {
                        let searchText = response.result.parameters.cercaVideo;
                        if (searchText)
                            this.componentList.addComponent(<YoutubeSearch search={searchText}/>); /*TODO: gestione errore*/
                    } else if(response.result.action === "cercaCanzone.nomeCanzone") {
                        let searchArtista = response.result.parameters.cercaArtista;
                        let searchCanzone = response.result.parameters.cercaCanzone;
                        if (searchArtista && !searchCanzone)
                            this.componentList.addComponent(<YoutubeSearch
                                search={"canzone di " + searchArtista}/>);
                        else if (!searchArtista && searchCanzone)
                            this.componentList.addComponent(<YoutubeSearch search={"canzone " + searchCanzone}/>);
                        else if (searchArtista && searchCanzone)
                            this.componentList.addComponent(<YoutubeSearch
                                search={"canzone " + searchCanzone + " di " + searchArtista}/>);
                        /*TODO: gestione errore*/
                    }
                }

                // Riporto i messaggi di risposta del bot
                let respMessages = response.result.fulfillment.messages;
                if(this.messageList){
                    respMessages.forEach((item)=> {
                        if(response.result.action === "Aiuto.tipoAiuto" || response.result.action === "aiutoDiretto") {
                            let cercaAiuto = response.result.parameters.Aiuto;
                            if (cercaAiuto === "video")
                            {
                                item.speech="Se vuoi cercare un video scrivi -Voglio cercare un video-. Alla risposta del chatbot -Che video vuoi vedere?- potrai rispondere direttamente con il testo che vuoi cercare su youtube o con l'argomento di cui vuoi trovare il video. Appariranno alla tua sinistra i primi 4 risultati e potrai vedere i video cliccandoci sopra."
                            }else if (cercaAiuto === "canzone")
                            {
                                item.speech = "Se vuoi cercare un video scrivi -Voglio cercare una canzone-. Alla risposta del chatbot -Che canzone vuoi ascoltare?- potrai rispondere con il titolo della canzone, con il nuome dell'artista o con entrambi. Appariranno alla tua sinistra i primi 4 risultati e potrai ascoltare la canzone cliccandoci sopra."
                            }else if (cercaAiuto === "login")
                            {
                                item.speech = "Per poter condividere i contenuti con un altro dispositivo è necessario fare il login. Per fare login clicca sul logo in alto a destra e segui le indicazioni. Il login potrà essere effettuato solo con un account Google."
                            }else if (cercaAiuto === "condividere")
                            {
                                item.speech = "Per poter condividere i contenuti con un altro dispositivo devi avere eseguito il login." /*TODO: da completare*/
                            }
                        }
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
                <input id='cbInput' type="text" className="form-control" placeholder="Scrivi al bot..." style={{boxShadow: '2px 2px 8px #888888'}} onKeyDown={(event)=>{if(event.keyCode === 13) this.sendInput()}}/> {/*13 invio*/}
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