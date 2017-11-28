import React from 'react';
import axios from 'axios';

import YoutubePlayer from 'react-youtube-player';

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

    displaySelectedVideo(id){
        this.componentList.addComponent(
            <div className="row thumbnail flex-row Container-multimedia Second-media-color center-block" style={{maxWidth:'823px', marginBottom:'5px'}}>
                <div className="col-lg-12 center-block">
                    <div className="Youtube-dim">
                        <YoutubePlayer videoId={id} />
                    </div>
                </div>
            </div>
        );
    };

    render() {
        let videodisplay = this.displaySelectedVideo;
        var videos = this.state.result.map(function(v, index) {
            var title = v.snippet.title;
            if(title.length > 40) title = title.substring(0, 40) + '...';
            var desc  = v.snippet.description;
            if(desc.length > 70)  desc  = desc.substring(0, 70) + '...';
            var id    = v.id.videoId;
            var th    = v.snippet.thumbnails.medium.url; // ['snippet']['thumbnails']['medium']['url'];
            var divStyle = "col-md-3 " + ((index%2) ? "Second-media-color" : "First-media-color");

            var snippet = (
                            <div className={divStyle} style={{height:"270px", minWidth:"205px", marginBottom:"5px", marginTop:'20px'}} key={index}>
                                <p style={{height:"50px"}}><b>{title}</b></p>
                                <div className="row" style={{position:"relative", display:"inline-block", textAlign:"center"}}>
                                    <img src={th} width='160' height='120' className='Youtube-preview' alt="thumbnail_image" onClick={() => videodisplay(id)} onMouseOver=""/> { /*Dentro className dovremo anche metterci center-block se vogliamo che l'immagine sia centrata*/ }
                                </div>
                                <p style={{marginTop:"10px"}}>{desc}</p>
                            </div>
            );

            return snippet;
        });

        return <div>{videos}</div>;
    }
}

export default YoutubeSearch;