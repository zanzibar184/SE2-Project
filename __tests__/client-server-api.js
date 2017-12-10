const request = require('supertest');
const app = require('../server/app');

//----------------------------------------------------------------------------

// equivalent to fetch with method: 'GET'
const youtubeSearch = function(searchString) {
    let url               = '/api/youtube';
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

        return dbCall('add', null, dbData.date, dbData.content_id, dbData.content, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe(errorParameterMessage);
        });

    });

    test('does not add youtube content without youtube_identifier and youtbe video url', () => {

        return dbCall('add', dbData.patient_id, dbData.date, null, null, dbData.email).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content with youtube_identifier but without youtube video url', () => {

        return dbCall('add', dbData.patient_id, dbData.date, dbData.content_id, null, dbData.email).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content with youtbe video url but without youtube_identifier', () => {

        return dbCall('add', dbData.patient_id, dbData.date, null, dbData.content, dbData.email).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content without email', () => {

        return dbCall('add', dbData.patient_id, dbData.date, dbData.content_id, dbData.content, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add youtube content without patientID', () => {

        return dbCall('add', null, dbData.date, dbData.content_id, dbData.content, dbData.email).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('adds youtube content', () => {

        return dbCall('add', dbData.patient_id, dbData.date, dbData.content_id, dbData.content, dbData.email).then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });

    test('find patient content with e-mail', () => {

        return dbCall('get', dbData.patient_id, null, null, null, dbData.email).then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toBeGreaterThan(0);
        });

    });

    test('find patient content without e-mail', () => {

        return dbCall('get', dbData.patient_id, null, null, null, null).then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toBeGreaterThan(0);
        });

    });

    test('does not add patient content with e-mail but without patientID', () => {

        return dbCall('get', null, null, null, null, dbData.email).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not add patient content without e-mail and patientID', () => {

        return dbCall('get', null, null, null, null, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('remove youtube content', () => {

        return dbCall('rem', dbData.patient_id, dbData.date, null, null, dbData.email).then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });

    test('does not remove youtube content without both email and patientID', () => {

        return dbCall('rem', null, dbData.date, null, null, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('does not remove youtube content without email but with patientID', () => {

        return dbCall('rem', dbData.patient_id, dbData.date, null, null, null).then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });

    test('does not remove youtube content with email but without patientID', () => {

        return dbCall('rem', null, dbData.date, null, null, dbData.email).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('adds nothing without other parameters', () => {

        return dbCall('add', null, null, null, null, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('removes nothing without other parameters', () => {

        return dbCall('rem', null, null, null, null, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

    test('gets nothing without other parameters', () => {

        return dbCall('get', null, null, null, null, null).then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

});
