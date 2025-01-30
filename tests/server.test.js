const request = require('supertest');
const app = require('../server');
const fs = require ('fs')
const path = require('path')

//Clear files before testing
const songsFilePath = path.join(__dirname, '../songs.json');
const playlistsFilePath = path.join(__dirname, '../playlists.json');
const resetData = () => {
    fs.writeFileSync(songsFilePath, JSON.stringify([], null, 2), 'utf8');
    fs.writeFileSync(playlistsFilePath, JSON.stringify([], null, 2), 'utf8');
};


describe('Music App API', () => {
    beforeEach(() => {
        resetData();
    });
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
            // Log the initial state of the songs array
            const initialResponse = await request(app).get('/api/songs');
            console.log('Initial songs:', initialResponse.body); // Debugging
        
            // Create a song
            await request(app).post('/api/songs').send({ title: 'Song 2', artist: 'Artist 2' });
        
            // Log the state of the songs array after creating a song
            const response = await request(app).get('/api/songs');
            console.log('Songs after creation:', response.body); // Debugging
        
            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2); // Ensure only two songs exist
        });

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
            // Create a song
            const songRes = await request(app)
                .post('/api/songs')
                .send({title: 'Song 3', artist: 'Artist 3'});
            console.log('Song response:', songRes.body); // Debugging
        
            // Ensure the song was created successfully
            expect(songRes.status).toBe(201);
            expect(songRes.body.data).toBeDefined(); // Ensure the `data` field exists
            const songId = songRes.body.data.id; // Access the `id` field
        
            // Create a playlist
            const playlistRes = await request(app)
                .post('/api/playlists')
                .send({ name: 'Playlist 2' });
            console.log('Playlist response:', playlistRes.body); // Debugging
        
            // Ensure the playlist was created successfully
            expect(playlistRes.status).toBe(201);
            expect(playlistRes.body.data).toBeDefined(); // Ensure the `data` field exists
            const playlistId = playlistRes.body.data.id; // Access the `id` field
        
            // Add the song to the playlist
            const response = await request(app)
                .put(`/api/playlists/${playlistId}/add-song`)
                .send({ songID: songId });
            console.log('Add song to playlist response:', response.body); // Debugging
        
            // Assertions
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
