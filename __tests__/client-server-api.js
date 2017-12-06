const request = require('supertest');
const app = require('../server/app')

describe('Client <-> Server API', () => {

    test('search and retrieve 4 youtube videos', () => {

        return request(app).get('/api/youtube?search=mozart').then(response => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text).length).toEqual(4);
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

    test('remove youtube content', () => {

        return request(app).get('/api/db?action=rem&email=test@mail.com&id_patient=jest&date=-1').then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBeTruthy();
        });

    });


});
