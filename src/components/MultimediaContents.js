import React from 'react';

import ComponentList from './ComponentList';
import session from '../SessionManager';

import openSocket from 'socket.io-client';
import YoutubeSearch from "./YoutubeSearch";

// -----------------------------------------------------------------------------------------------------------------

const introMessage = <div className="row flex-row backgroundStyle" style={{height:0}}>
                        <div className="col-md-12 divMessageIntro ">
                            <h2 style={{textAlign: 'center', color: '#76767c'}}>Benvenuto in Kioku</h2>
                            <h5 style={{textAlign: 'center', color: '#56565c', marginTop: '20px'}}>
                                Con l'ID paziente che hai inserito qui puoi vedere i contenuti multimediali che hai condiviso
                                con l'interlocutore.
                                <br/>
                                Se fai il login, puoi accedere al chatbot che verrà mostrato qui a destra, i contenuti
                                multimediali verrano spostati a sinistra
                            </h5>
                        </div>
                    </div>;

// -----------------------------------------------------------------------------------------------------------------

class MultimediaContents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            intro: true
        };

        if(session.patientID) {
            this.socket = openSocket(':3002/');
            this.socket.emit('subscribeToPatient', session.patientID);

            this.socket.on('add', (element) => {
                // Controlla che l'elelemento non sia già stato aggiunto ( il client che ha condiviso un elemento lo ha già mostrato in lista )
                if(this.componentList && this.componentList.state.list.some( (e) => e.key === element.content_id+'.'+element.content ) )
                    return;
                this.addShareableContent(element.content_id, element.content, element.date);
            });

            this.socket.on('rem', (element) => {
               this.remShareableContent(element.date);
            });
        }

        this.addComponent = this.addComponent.bind(this);

    }

    componentDidMount() {
        if(!session.patientID) return;
        session.getPatientContents((results)=> {
            console.log(results);
            results.forEach((element) => {
                this.addShareableContent(element.content_id, element.content, element.date);
            })
        });
    }

    addShareableContent(content_id, content, date) {
        switch(content_id) {
            case 'youtube':
                this.addComponent( YoutubeSearch.createYoutubeElement(content, date), date );
                break;
            default:
                console.log("addShareableComponent > unknown content_id: " + content_id);
                break;
        }
    }

    remShareableContent(date) {
        this.componentList.remComponent(date);
    }

    addComponent(component, key) {
        if(this.state.intro) this.setState({intro:false});
        this.componentList.addComponent(component, key);
    }

    static onListUpdated() {
        let domElement = document.getElementById('multimediaContents');
        if(domElement && domElement.scrollTo)
            domElement.scrollTo(0, domElement.scrollHeight);
    }

    render() {
        return  <div>
                    <ComponentList id='multimediaContents' className='Scrollbar Vertical-fit' onUpdate={MultimediaContents.onListUpdated}
                                   ref={(instance) => {this.componentList = instance;}}/>
                    {(this.state.intro)?introMessage:null}
                </div>
    }

}

export default MultimediaContents;