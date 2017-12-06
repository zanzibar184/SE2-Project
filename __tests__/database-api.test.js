const DatabaseAPI = require.requireActual( '../server/DatabaseAPI');

const db = new DatabaseAPI();

describe('Server DatabaseAPI', () => {

    test('adds youtube content', done => {
        db.addSharedContent('test@mail.com','jest',123, 'youtube', 'youtube_url', (success) => {
            expect(success).toBeTruthy();
            done();
        })
    });

    test('find patient content with login email', done => {

        db.getPatientContents('test@mail.com','jest', (success, results) => {
            expect(results.length).toBeGreaterThan(0);
            done();
        });

    });

    test('find patient content without login email', done => {

        db.getPatientContents(null, 'jest', (success, results) => {
            expect(results.length).toBeGreaterThan(0);
            done();
        });

    });

    test('remove youtube content', done => {
        db.removeSharedContent('test@mail.com','jest',123, (success) => {
            expect(success).toBeTruthy();
            done();
        })
    });

});