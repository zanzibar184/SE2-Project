const YoutubeAPI = require.requireActual( '../server/YoutubeAPI');

const youtube = new YoutubeAPI();

describe('Server YoutubeAPI', () => {
    test('search and retrieve 4 youtube videos', () => {
        youtube.find('mozart', (results) => {
            expect(results.length).toEqual(4);
        });
    });
});