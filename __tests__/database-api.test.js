const DatabaseAPI = require.requireActual( '../server/DatabaseAPI');

const db = new DatabaseAPI();

//-----------------------------------------------------

const dbData = {
    email: 'jest@kioku.com',        // Who shared the content
    patient_id: 'jest',             // Patient ID ( identifies the same conversation session )
    content_id: 'youtube',          // Shared content id (ex. 'youtube' identifies a youtube url)
    content: 'yP6wCjJab6M',         // Shared content (ex. for content_id==='youtube' is the youtube video id
    date: new Date().getTime()      // Number that identifies when the content was shared
};

//-----------------------------------------------------

describe('Server DatabaseAPI', () => {

    test('adds youtube content', done => {
        db.addSharedContent(dbData.email, dbData.patient_id, dbData.date, dbData.content_id, dbData.content, (success) => {
            expect(success).toBeTruthy();
            done();
        })
    });

    test('find patient content with login email', done => {

        db.getPatientContents(dbData.email,dbData.patient_id, (success, results) => {
            expect(results.length).toBeGreaterThan(0);
            done();
        });

    });

    test('find patient content without login email', done => {

        db.getPatientContents(null, dbData.patient_id, (success, results) => {
            expect(results.length).toBeGreaterThan(0);
            done();
        });

    });

    test('remove youtube content', done => {
        db.removeSharedContent(dbData.email, dbData.patient_id, dbData.date, (success) => {
            expect(success).toBeTruthy();
            done();
        })
    });

});