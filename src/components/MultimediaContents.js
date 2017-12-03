import React from 'react';
import YoutubePlayer from 'react-youtube-player';

import ComponentList from './ComponentList';
import session from '../SessionManager';
import Shareable from "./Shareable";

import openSocket from 'socket.io-client';
import YoutubeSearch from "./YoutubeSearch";

class MultimediaContents extends React.Component {

    constructor(props) {
        super(props);

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
        }
    }

    remShareableContent(date) {
        this.componentList.remComponent(date);
    }

    addComponent(component, key) {
        this.componentList.addComponent(component, key);
    }

    static onListUpdated() {
        let domElement = document.getElementById('multimediaContents');
        if(domElement && domElement.scrollTo)
            domElement.scrollTo(0, domElement.scrollHeight);
    }

    render() {
        return  <ComponentList id='multimediaContents' className='Scrollbar Vertical-fit' onUpdate={MultimediaContents.onListUpdated} ref={(instance) => {
                    this.componentList = instance;
                }}/>
    }

}

export default MultimediaContents;