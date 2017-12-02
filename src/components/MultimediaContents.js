import React from 'react';
import YoutubePlayer from 'react-youtube-player';

import ComponentList from './ComponentList';
import session from '../SessionManager';
import Shareable from "./Shareable";

class MultimediaContents extends React.Component {

    constructor(props) {
        super(props);

        this.addComponent = this.addComponent.bind(this);

    }

    componentDidMount() {
        if(!session.patientID) return;
        session.getPatientContents((results)=> {
            console.log(results);
            results.forEach((element) => {

                switch(element.content_id) {
                    case 'youtube':
                        this.addComponent(
                            <div className="row thumbnail flex-row Container-multimedia Second-media-color center-block" style={{marginLeft:'5px', marginRight:'5px', marginBottom:'5px', height:'280px'}}>
                                <div className="col-lg-12 center-block">
                                    <div className="Youtube-dim">
                                        <Shareable type='youtube' content={element.content} date={element.date}>
                                            <YoutubePlayer videoId={element.content}/>
                                        </Shareable>
                                    </div>
                                </div>
                            </div>
                        );
                        break;
                }

            })
        });
    }

    addComponent(component) {
        this.componentList.addComponent(component);
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