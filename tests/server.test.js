const request = require('supertest');
const app = require('../server');


describe('Music App API', () => {
    describe('Songs API', () => {
        test('Should create a new song', async () => {
            const response = await request(app)
                .post('/api/songs')
                .send({ title: 'Song 1', artist: 'Artist 1' });
            expect(response.status).toBe(201);
            expect(response.body.data.title).toBe('Song 1');
            expect(response.body.data.artist).toBe('Artist 1');
        });

        test('Should not create a song without title or artist', async () => {
            const response = await request(app).post('/api/songs').send({ title: '' });
            expect(response.status).toBe(400);
        });

        test('Should fetch all songs', async () => {
            const initialResponse = await request(app).get('/api/songs');
            await request(app).post('/api/songs').send({ title: 'Song 2', artist: 'Artist 2' });
            const response = await request(app).get('/api/songs');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

        test('Should return 404 for non-existent song', async () => {
            const response = await request(app).get('/api/songs/invalid-id');
            expect(response.status).toBe(404);
        });
    });

    describe('Playlists API', () => {
        test('Should create a new playlist', async () => {
            const response = await request(app)
                .post('/api/playlists')
                .send({ name: 'My Playlist' });
            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe('My Playlist');
        });

        test('Should not create a playlist without a name', async () => {
            const response = await request(app).post('/api/playlists').send({});
            expect(response.status).toBe(400);
        });

        test('Should not create a duplicate playlist', async () => {
            await request(app).post('/api/playlists').send({ name: 'Playlist 1' });
            const response = await request(app).post('/api/playlists').send({ name: 'Playlist 1' });
            expect(response.status).toBe(409);
        });

        test('Should return 404 when fetching a non-existent playlist', async () => {
            const response = await request(app).get('/api/playlists/invalid-id');
            expect(response.status).toBe(404);
        });

        test('Should add a song to a playlist', async () => {
            const songRes = await request(app)
                .post('/api/songs')
                .send({title: 'Song 3', artist: 'Artist 3'});
            expect(songRes.status).toBe(201);
            expect(songRes.body.data).toBeDefined();
            const songId = songRes.body.data.id;
            const playlistRes = await request(app)
                .post('/api/playlists')
                .send({ name: 'Playlist 2' });
            console.log('Playlist response:', playlistRes.body);
            expect(playlistRes.status).toBe(201);
            expect(playlistRes.body.data).toBeDefined(); 
            const playlistId = playlistRes.body.data.id;
            const response = await request(app)
                .put(`/api/playlists/${playlistId}/add-song`)
                .send({ songID: songId });
            console.log('Add song to playlist response:', response.body); 
            expect(response.status).toBe(200);
            expect(response.body.message).toBeDefined();
            expect(response.body.data).toBeDefined();
        });

        test('Should return 404 when adding a song to a non-existent playlist', async () => {
            const response = await request(app).put('/api/playlists/invalid-id/add-song').send({ songID: 'some-song-id' });
            expect(response.status).toBe(404);
        });
    });
});
