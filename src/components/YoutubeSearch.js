import React from 'react';
import axios from 'axios';

class YoutubeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: []
        };
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

    render() {
        var videos = this.state.result.map(function(v, index) {

            var title = v.snippet.title;
            if(title.length > 40) title = title.substring(0, 40) + '...';
            var desc  = v.snippet.description;
            if(desc.length > 70)  desc  = desc.substring(0, 70) + '...';
            // var id    = v['id']['videoId'];
            var th    = v.snippet.thumbnails.medium.url; // ['snippet']['thumbnails']['medium']['url'];
            var divStyle = (index%2) ? "col-lg-3 Second-media-color" : "col-lg-3 ";

            var snippet = ( <div className={divStyle} key={index}>
                             <p><b><small>{title}</small></b></p>
                             <img src={th} width='160' height='120' className='Youtube-preview center-block' alt='video_thumbnail'/>
                             <p><small>{desc}</small></p>
                            </div>
            );

            return snippet;
        });

        return <div>{videos}</div>;
    }
}

export default YoutubeSearch;