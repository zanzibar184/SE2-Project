const request = require('supertest');
const app = require('../server/app');

//----------------------------------------------------------------------------

// equivalent to fetch with method: 'GET'
const youtubeSearch = function(searchString) {
    let url               = '/api/youtube?';
    if(searchString) url += '?search='+ searchString;
    return request(app).get(url);
};

//----------------------------------------------------------------------------

const dbData = {
    email: 'jest@kioku.com',        // Who shared the content
    patient_id: 'jest',             // Patient ID ( identifies the same conversation session )
    content_id: 'youtube',          // Shared content id (ex. 'youtube' identifies a youtube url)
    content: 'yP6wCjJab6M',         // Shared content (ex. for content_id==='youtube' is the youtube video id
    date: new Date().getTime()      // Number that identifies when the content was shared
};

// equivalent to fetch with method: 'GET'
const dbCall = function (action, patient_id, date, content_id, content, email) {
    let url             = '/api/db?';
    if(action)     url += 'action=' + action + '&';
    if(patient_id) url += 'id_patient=' + patient_id + '&';
    if(date)       url += 'date=' + date + '&';
    if(content_id) url += 'content_id=' + content_id + '&';
    if(content)    url += 'content=' + content + '&';
    if(email)      url += 'email=' + email;
    return request(app).get(url);
};

//----------------------------------------------------------------------------

const errorParameterMessage = 'Parametri errati nella chiamata API.';

//----------------------------------------------------------------------------

describe('Client <-> Server API', () => {

    test('search and retrieve 4 youtube videos', () => {

        return youtubeSearch('mozart').then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toEqual(4);
        });

    });

    test('call youtube api without search parameter', () => {

        return youtubeSearch(null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe(errorParameterMessage);
        });

    });

    test('does not add youtube content without email and patientID', () => {

        // Per Valentina: l'originale era: request(app).get('/api/db?action=add&date=-1&content_id=youtube&content=youtube_url')
        return dbCall('add', null, dbData.date, dbData.content_id, dbData.content, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe(errorParameterMessage);
        });

    });

    // Per Valentina: sostituire da qui
    test('does not add youtube content without youtube_identifier and youtbe video url', () => {

        return request(app).get('/api/db?action=add&email=test@mail.com&id_patient=jest&date=-1').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content with youtube_identifier but without youtube video url', () => {

        return request(app).get('/api/db?action=add&email=test@mail.com&id_patient=jest&date=-1&content_id=youtube').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content with youtbe video url but without youtube_identifier', () => {

        return request(app).get('/api/db?action=add&email=test@mail.com&id_patient=jest&date=-1&content=youtube_url').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content without email', () => {

        return request(app).get('/api/db?action=add&id_patient=jest&date=-1&content_id=youtube&content=youtube_url').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content without patientID', () => {

        return request(app).get('/api/db?action=add&email=test@mail.com&date=-1&content_id=youtube&content=youtube_url').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('adds youtube content', () => {

        return request(app).get('/api/db?action=add&email=test@mail.com&id_patient=jest&date=-1&content_id=youtube&content=youtube_url').then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });

    test('find patient content with e-mail', () => {

        return request(app).get('/api/db?action=get&email=test@mail.com&id_patient=jest').then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toBeGreaterThan(0);
        });

    });

    test('find patient content without e-mail', () => {

        return request(app).get('/api/db?action=get&id_patient=jest').then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toBeGreaterThan(0);
        });

    });

    test('does not add patient content with e-mail but without patientID', () => {

        return request(app).get('/api/db?action=get&email=test@mail.com').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add patient content without e-mail and patientID', () => {

        return request(app).get('/api/db?action=get').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('remove youtube content', () => {

        return request(app).get('/api/db?action=rem&email=test@mail.com&id_patient=jest&date=-1').then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });

    test('does not remove youtube content without both email and patientID', () => {

        return request(app).get('/api/db?action=rem&date=-1').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not remove youtube content without email but with patientID', () => {

        return request(app).get('/api/db?action=rem&id_patient=jest&date=-1').then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });

    test('does not remove youtube content with email but without patientID', () => {

        return request(app).get('/api/db?action=rem&email=test@mail.com&date=-1').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('adds nothing without other parameters', () => {

        return request(app).get('/api/db?action=add').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('removes nothing without other parameters', () => {

        return request(app).get('/api/db?action=rem').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('gets nothing without other parameters', () => {

        return request(app).get('/api/db?action=get').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

});
