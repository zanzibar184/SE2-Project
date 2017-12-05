const DatabaseAPI = require.requireActual( '../server/DatabaseAPI');

const db = new DatabaseAPI();

describe('Server DatabaseAPI', () => {

    test('adds youtube content', () => {
        expect(db.addSharedContent('test@mail.com','jest',-1, 'youtube', 'youtube_url')).toBeTruthy();
    });

    test('find patient content with login email', () => {

        db.getPatientContents('test@mail.com','jest', (success, results) => {
            expect(success).toBeTruthy();
        });

    });

    test('find patient content without login email', () => {

        db.getPatientContents(null, 'jest', (success, results) => {
            expect(success).toBeTruthy();
        });

    });

    test('remove youtube content', () => {
        expect(db.removeSharedContent('test@mail.com','jest',-1)).toBeTruthy();
    });

});