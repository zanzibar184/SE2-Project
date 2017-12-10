import React from 'react';
import {ApiAiClient} from "api-ai-javascript/es6/ApiAiClient";

import ComponentList from '../ComponentList';
import YoutubeSearch from "../YoutubeSearch";
import YoutubePlayer from 'react-youtube-player';

import session from '../../SessionManager';

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

    // Chiamato da React quando il componente è montato per la prima volta, da il benvenuto
    componentDidMount() {
        if(!session.isLogged()) return;
        let message = 'Benvenuto/a ' + session.getLoggedUser().getName() + '! Per iniziare scrivi inizio';
        this.messageList.addComponent(<a className='list-group-item Msj_server'><b><i>{message}</i></b></a>);
    }

    // Manda un messaggio scritto dall'utente a Dialogflow e ne legge la risposta
    sendInput() {

        // Ottengo l'istanza dell'input utente
        let input = document.getElementById('cbInput');

        // aggiunto da Vale: prende l'istanza del componente che poi passeremo come parametro a YoutubeSearch tramite ref
        let videoRef = (instance)=>{instance.multimediaContents = this.multimediaContents};

        // Controllo che il client sia inizializzato, e che l'input utente esista e non sia vuoto
        if(!this.client || !input || !input.value) return;

        // Disabilito l'input utente fino a che non ho finito di processare il messaggio
        input.disabled = true;

        // Mostro nella lista messaggi il testo scritto dall'utente (contenuto in 'input.value')
        // messageList: istanza di un componente 'ComponentList' che contiene i messaggi scambiati tra utente e Dialogflow
        if(this.messageList)
            this.messageList.addComponent(<a className='list-group-item Msj_client'>{input.value}</a>);

        // Easter egg
        if(input.value==='faaantastico') {
            let video = <div className="row thumbnail flex-row Second-media-color center-block" style={{maxWidth:'823px', marginBottom:'5px'}}>
                    <div className="col-lg-12 center-block">
                        <div className="Youtube-dim">
                            <YoutubePlayer videoId='nMZJKGyu-Kk' />
                        </div>
                    </div>
                </div>;
            this.multimediaContents.addComponent(video);
            return;
        }

        this.client
            // Mando il messaggio dell'utente al server di Dialogflow
            .textRequest(input.value)
            // Quando mi arriva una risposta da Dialogflow ('response' è il JSON di risposta) ...
            .then((response) => {

                // ... riporto nella console del browser il JSON di risposta
                console.log(response);/* do something */

                // 'this.multimediaContents' è l'istanza ad un componente 'ComponentList' che memorizza la lista
                // dei contenuti multimediali da mostrare sullo schermo (lato sinistro)
                if(this.multimediaContents) {

                    // Se nel JSON di risposta c'è un'azione collegata alla ricerca video..
                    if(response.result.action === "RicercaVideoYT.video-cerca" || response.result.action === "videoDiretto") {
                        //.. ottengo il video da cercare
                        let searchText = response.result.parameters.cercaVideo;
                        // e aggiungo i video trovati alla lista dei contenuti multimediali
                        if (searchText)
                            this.multimediaContents.addComponent(<YoutubeSearch ref={videoRef} search={searchText}/>); /*TODO: gestione errore*/
                    } // Se invece c'è un'azione collegata alla ricerca di una canzione
                    else if(response.result.action === "cercaCanzone.nomeCanzone") {
                            // Ottiene il nome dell'artista e/o della canzone
                            let searchArtista = response.result.parameters.cercaArtista;
                            let searchCanzone = response.result.parameters.cercaCanzone;
                            // Fa una ricerca in base alla presenza di questi parametri
                            if (searchArtista && !searchCanzone)
                                this.multimediaContents.addComponent(<YoutubeSearch
                                    ref={videoRef}
                                    search={"canzone di " + searchArtista}/>);
                            else if (!searchArtista && searchCanzone)
                                this.multimediaContents.addComponent(<YoutubeSearch ref={videoRef} search={"canzone " + searchCanzone}/>);
                            else if (searchArtista && searchCanzone)
                                this.multimediaContents.addComponent(<YoutubeSearch
                                    ref={videoRef}
                                    search={"canzone " + searchCanzone + " di " + searchArtista}/>);
                            /*TODO: gestione errore*/
                        }
                }

                // 'respMessages' contiene un array con i messaggi di risposta di Dialogflow
                let respMessages = response.result.fulfillment.messages;
                // messageList: istanza di un componente 'ComponentList' che contiene i messaggi scambiati tra utente e Dialogflow
                if(this.messageList){
                    // Per ogni messaggio di risposta preso singolarmente ('item')
                    respMessages.forEach((item)=> {
                        let messaggio =  item.speech;
                        if(response.result.action === "Aiuto.tipoAiuto" || response.result.action === "aiutoDiretto")
                        { //se e' una richiesta di aiuto
                            let cercaAiuto = response.result.parameters.Aiuto;
                                if (cercaAiuto === "video") //se ha bisogno di aiuto per i video
                                {
                                    messaggio = <p>Se vuoi cercare un video scrivi <em>"Voglio cercare un video"</em>. <br/> Alla risposta del chatbot <em>"Che video vuoi vedere?"</em> potrai rispondere direttamente con il testo che vuoi cercare su Youtube o con l'argomento di cui vuoi trovare il video. <br/>Appariranno alla tua sinistra i primi 4 risultati e potrai vedere i video cliccandoci sopra.</p>
                                }else if (cercaAiuto === "canzone") //se ha bisogno di aiuto per le canzoni
                                {
                                    messaggio = <p>Se vuoi cercare un video scrivi <em>"Voglio cercare una canzone"</em>. Alla risposta del chatbot <em>"Che canzone vuoi ascoltare?"</em> potrai rispondere con il titolo della canzone, con il nuome dell'artista o con entrambi. Appariranno alla tua sinistra i primi 4 risultati e potrai ascoltare la canzone cliccandoci sopra.</p>
                                }else if (cercaAiuto === "login") //se ha bisogno di aiuto per il login
                                {
                                    messaggio = <p>Per poter condividere i contenuti con un altro dispositivo è necessario fare il login. Per fare login clicca sul logo in alto a destra e segui le indicazioni. Il login potrà essere effettuato solo con un account Google.</p>
                                }else if (cercaAiuto === "condividere") //se ha bisogno di aiuto per la conivisione dei contenuti
                                {
                                    messaggio = <p>Per poter condividere i contenuti con un altro dispositivo devi avere eseguito il login.</p> /*TODO: da completare*/
                                }
                        }else if(response.result.action === "sceltaArgomento.tipoArgomento") //se ha bisogno di suggerimento sull'arogomento
                        {
                            let cercaArgomento = response.result.parameters.tipoArgomento;
                            if(cercaArgomento === "Tempo libero")
                            {
                                messaggio = <p>Potresti chiedergli/le cosa gli piaceva/piace fare nel suo tempo libero. Cosa fa oggi nel suo tempo libero. Se suona uno strumento. Se gioca a carte e che giochi conosce.</p>
                            }else if(cercaArgomento === "Viaggio")
                            {
                                messaggio = <p>Potresti a chiedergli/le se ha mai viaggiato (anche in Italia). Che città ha visitato? La motivazione del viaggio? Che monumenti ha visto? Con chi era? Potresti chiedergli di raccontarti qualche aneddoto.</p>
                            }else if(cercaArgomento === "Famiglia")
                            {
                                messaggio = <p>Potresti chiedergli/le della sua famiglia. Potresti chiedergli/le se ha avuto figli o nipoti. Per aiutarti su questo argomento chiedi al bot di accedere all'albero genealogico!</p>
                            }else if(cercaArgomento === "Cibo")
                            {
                                messaggio = <p>Potresti chidergli/le che cosa gli piace mangiare, il suo cibo preferito. Lo sa cucinare? Fatti raccontare la ricetta e se si ricorda di qualche aneddoto legato a questo piatto. E' un piatto che ha sempre mangiato? Quali piatti mangiava da ragazzo? Qualche specialità legata alla sua terra?</p>
                            }else if(cercaArgomento === "Lavoro")
                            {
                                messaggio = <p>Potresti chiedergli/le che lavoro faceva, se ha fatto solo quel lavoro e come mai ha iniziato a fare quel lavoro</p>
                            }else if(cercaArgomento === "Guerra")
                            {
                                messaggio = <p>Potresti chiedergli/le se si ricorda del periodo della guerra e se ha voglia di raccontarti qualche aneddoto. Fai attenzione perchè può essere un argomento difficile da affrontare</p>
                            }else if(cercaArgomento === "Poesia")
                            {
                                messaggio = <p>Potresti chiedergli/le se conosce qualche poesia o filastrocca e se ti può raccontare qualche aneddoto legato alla poesia o alla filastrocca. La raccontava a qualcuno? E' in dialetto? Se si, può tradurla?</p>
                            }else if(cercaArgomento === "Infanzia")
                            {
                                messaggio = <p>Potresti chiedergli/le di raccontare qualche aneddoto dell'infanzia. Se ha dei fratelli/sorelle magari ti puo' raccontare quando erano piccoli a cosa giocavano, se facevano qualche attivita' insieme.</p>
                            }else if(cercaArgomento === "Canzoni")
                            {
                                messaggio = <p>Potresti chiedergli/le della sua canzone preferita e del suo cantante preferito. Potresti chiedergli/le cosa ascoltava da ragazzo e se quella canzon gli/le ricorda qualche momento o evento della sua vita.</p>
                            }else if(cercaArgomento === "Danza")
                            {
                                messaggio = <p>Potresti cheidergli/le se gli piace/piaceva ballare e che ballo. Come ha imparato a ballare?</p>
                            }
                        }else if(response.result.action === "alberoGenealogico")
                        {
                            messaggio = <p>Potresti iniziare chiedendogli di suo/a marito/moglie per poi parlare dei figli e a loro volta se si sono sposati e se hanno avuto figli. <br/> Per ogni persona si può chiedere se ha qualche aneddoto o cosa gli/le piace/piaceva fare insieme.</p>
                        }

                        if(item.speech)// se non vuoto mostro il testo di quel messaggio aggiungendolo a messageList
                            this.messageList.addComponent(<a className='list-group-item Msj_server'><b>{messaggio}</b></a>);
                    })
                }

                // Forzo la scroll-bar dei messaggi utente/Dialogflow a scendere per mostrare il contenuto più recente
                // FIXME: Su Microsoft Edge non funziona 'scrollTo' (testato e funzionante su Safari e Firefox)
                let container = document.getElementById('cbMessageContainer');
                if(container && container.scrollTo)
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