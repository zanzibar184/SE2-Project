class YoutubeAPI {

    constructor() {
        let youtube = require('youtube-finder');
        this.client = youtube.createClient({ key: 'AIzaSyANRHhDzlgjfF94-WVlP-5v1tvd3V9hGNk'})
    }

    find(searchQuery, callback) {
        let params = {
            part: 'snippet',
            type: 'video',
            q: searchQuery,
            maxResults: 4
        }
        this.client.search(params, function (err, data) {
            callback(data['items']);
            //callback("Hello world!");
            //var a = data['items'][0];
            //console.log(a['id']['videoId']);
            //console.log(a['snippet']['title']);
        })
    }

}

module.exports = YoutubeAPI;