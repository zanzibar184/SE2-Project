import React from 'react';
import {ApiAiClient} from "api-ai-javascript/es6/ApiAiClient";

import ComponentList from '../ComponentList';
import YoutubeSearch from "../YoutubeSearch";

// Importa lo stile CSS per il componente
import "./ChatBot.css";


class ChatBot extends React.Component {

    // Inizializzazione del componente
    constructor(props) {
        super(props);

        // Inizializzo il client di Dialogflow
        this.client = new ApiAiClient({accessToken: '550a9943389e4b4197850ec1b0b9758d'});

        // Bind del metodo sendInput per poterlo utilizzare all'interno del metodo render()
        this.sendInput = this.sendInput.bind(this);
    }

    // Chiamato da React quando il componente è montato per la prima volta
    componentDidMount() {

    }

    // Manda un messaggio scritto dall'utente a Dialogflow e ne legge la risposta
    sendInput() {

        // Ottengo l'istanza dell'input utente
        let input = document.getElementById('cbInput');

        // aggiunto da Vale: prende l'istanza del componente che poi passeremo come parametro a YoutubeSearch tramite ref
        let videoRef = (instance)=>{instance.componentList = this.componentList};

        // Controllo che il client sia inizializzato, e che l'input utente esista e non sia vuoto
        if(!this.client || !input || !input.value) return;

        // Disabilito l'input utente fino a che non ho finito di processare il messaggio
        input.disabled = true;

        // Mostro nella lista messaggi il testo scritto dall'utente (contenuto in 'input.value')
        // messageList: istanza di un componente 'ComponentList' che contiene i messaggi scambiati tra utente e Dialogflow
        if(this.messageList)
            this.messageList.addComponent(<a className='list-group-item Msj_client'>{input.value}</a>);

        this.client
            // Mando il messaggio dell'utente al server di Dialogflow
            .textRequest(input.value)
            // Quando mi arriva una risposta da Dialogflow ('response' è il JSON di risposta) ...
            .then((response) => {

                // ... riporto nella console del browser il JSON di risposta
                console.log(response);/* do something */

                // 'this.componentList' è l'istanza ad un componente 'ComponentList' che memorizza la lista
                // dei contenuti multimediali da mostrare sullo schermo (lato sinistro)
                if(this.componentList) {

                    // Se nel JSON di risposta c'è un'azione collegata alla ricerca video..
                    if(response.result.action === "RicercaVideoYT.video-cerca") {
                        //.. ottengo il video da cercare
                        let searchText = response.result.parameters.cercaVideo;
                        // e aggiungo i video trovati alla lista dei contenuti multimediali
                        if (searchText)
                            this.componentList.addComponent(<YoutubeSearch ref={videoRef} search={searchText}/>); //TODO: se c'è errore?
                    } // Se invece c'è un'azione collegata alla ricerca di una canzione
                    else if(response.result.action === "cercaCanzone.nomeCanzone") {
                            // Ottiene il nome dell'artista e/o della canzone
                            let searchArtista = response.result.parameters.cercaArtista;
                            let searchCanzone = response.result.parameters.cercaCanzone;
                            // Fa una ricerca in base alla presenza di questi parametri
                            if (searchArtista && !searchCanzone)
                                this.componentList.addComponent(<YoutubeSearch
                                    ref={videoRef}
                                    search={"canzone di " + searchArtista}/>);
                            else if (!searchArtista && searchCanzone)
                                this.componentList.addComponent(<YoutubeSearch ref={videoRef} search={"canzone " + searchCanzone}/>);
                            else if (searchArtista && searchCanzone)
                                this.componentList.addComponent(<YoutubeSearch
                                    ref={videoRef}
                                    search={"canzone " + searchCanzone + " di " + searchArtista}/>);
                        }
                }

                // 'respMessages' contiene un array con i messaggi di risposta di Dialogflow
                let respMessages = response.result.fulfillment.messages;
                // messageList: istanza di un componente 'ComponentList' che contiene i messaggi scambiati tra utente e Dialogflow
                if(this.messageList){
                    // Per ogni messaggio di risposta preso singolarmente ('item')
                    respMessages.forEach((item)=> {
                        // e se il contenuto di questo messaggio ('item.speech') non è vuoto ..
                        if(item.speech) // .. mostro il testo di quel messaggio aggiungendolo a messageList
                            this.messageList.addComponent(<a className='list-group-item Msj_server'><b><i>{item.speech}</i></b></a>);
                    })
                }

                // Forzo la scroll-bar dei messaggi utente/Dialogflow a scendere per mostrare il contenuto più recente
                let container = document.getElementById('cbMessageContainer');
                container.scrollTo(0,container.scrollHeight);

            }) // Poi: elimino il testo contenuto nell'input utente (dal momento che è già stato processato)
            .then(()=>{ input.value = ''; })
            .catch((error) => { console.log("ChatBot Error: " + error);/* do something here too */}) // Se c'è un errore lo riporto
            .then(() => input.disabled = false)  // Infine: abilito nuovamente l'input per permettere all'utente di scrivere un nuovo messaggio
    }

    // Metodo chiamato durante il render del componente ( lista dei messaggi + input utente )
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
        </div>;

        return htmlCode;
    }
}

export default ChatBot;