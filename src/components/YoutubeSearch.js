import React from 'react';
import axios from 'axios';

import YoutubePlayer from 'react-youtube-player';
import Shareable from './Shareable';

class YoutubeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: []
        };
        this.displaySelectedVideo = this.displaySelectedVideo.bind(this);
    }

    componentDidMount() {
        axios.get('/api/youtube?search='+this.props.search)
            .then( (response) => {
                // console.log(response);
                this.setState({
                    result:  response.data
                });
            })
            .catch( (error) => {
                console.log(error);
            });
    }

    static createYoutubeElement(videoId, date) {
        return <div className="row thumbnail flex-row Second-media-color center-block" style={{marginLeft:'5px', marginRight:'5px', marginBottom:'5px', height:'280px'}}>
                    <div className="col-lg-12 center-block">
                        <div className="Youtube-dim">
                            <Shareable type='youtube' content={videoId} date={date}>
                                <YoutubePlayer videoId={videoId}/>
                            </Shareable>
                        </div>
                    </div>
                </div>
    }

    displaySelectedVideo(videoCode){
        this.multimediaContents.addComponent( YoutubeSearch.createYoutubeElement(videoCode, null), 'youtube.'+videoCode );
    }

    render() {
        let videodisplay = this.displaySelectedVideo;
        let videos = this.state.result.map(function(v, index) {
            let title = v.snippet.title;
            if(title.length > 40) title = title.substring(0, 40) + '...';
            let desc  = v.snippet.description;
            if(desc.length > 70)  desc  = desc.substring(0, 70) + '...';
            let id    = v.id.videoId;
            let th    = v.snippet.thumbnails.medium.url; // ['snippet']['thumbnails']['medium']['url'];
            let divStyle = "col-xs-3 " + ((index%2) ? "Second-media-color" : "First-media-color");

            let snippet = (
                            <div className={divStyle} key={index}>
                                <div style={{padding:'2px'}}>
                                    <div style={{maxHeight:'75px', lineHeight: '75px', textAlign: 'center'}}>
                                        <span style={{display: 'inline-block', verticalAlign: 'middle', lineHeight: 'normal', marginTop:'5px'}}><b>{title}</b></span>
                                    </div>

                                    <img style={{marginTop:'10px', display:'block', maxWidth:'100%'}} src={th} className='Youtube-preview' alt="thumbnail_image" onClick={() => videodisplay(id)} /> { /*Dentro className dovremo anche metterci center-block se vogliamo che l'immagine sia centrata*/ }

                                    <div style={{height:'85px', lineHeight: '85px', textAlign: 'center', maxWidth:'100%'}}>
                                        <span style={{display: 'inline-block', verticalAlign: 'middle', lineHeight: 'normal'}}>{desc}</span>
                                    </div>
                                </div>
                            </div>
            );

            return snippet;
        });

        return <div className="row flex-row center-block" style={{display:'inline-flex', height:'270px', marginLeft:'5px', marginRight:'5px', marginBottom:'0'}}>
                    {videos}
                </div>;
    }
}

export default YoutubeSearch;