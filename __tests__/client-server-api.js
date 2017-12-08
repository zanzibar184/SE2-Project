const request = require('supertest');
const app = require('../server/app')

describe('Client <-> Server API', () => {

    test('search and retrieve 4 youtube videos', () => {

        return request(app).get('/api/youtube?search=mozart').then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toEqual(4);
        });

    });

    test('does not add youtube content without email and patientID', () => {

        return request(app).get('/api/db?action=add&date=-1&content_id=youtube&content=youtube_url').then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("Parametri errati nella chiamata API.");
        });

    });

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
