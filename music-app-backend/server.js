const express = require('express');
const{ v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

//Middleware to parse json in the request body
app.use(express.json());

//Default route to confirm the server in working
app.get('/', (req, res) => {
    res.send('Server is running')
});

// Start the server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

//Mock data
let playlists = [
    { id: uuidv4(), name: 'Chill Vibes', songs: ['Song 1', 'Song 2']},
    { id: uuidv4(), name: 'Workout Mix', songs: ['Song 3', 'Song 4']}
];

//Routes
//GET all playlists
app.get('/api/playlists', (req, res) => {
    res.json(playlists);
});

//POST to add a new playlist
app.post('/api/playlists', (req, res) => {
    const {name, songs} = req.body; //access the data sent in request body
    const newPlaylist = {
        id: uuidv4(), //Generate unique id
        name,
        songs
    };

    //Save the new playlist
    playlists.push(newPlaylist)

    //Respond with new playlist and message
    res.status(201).json({
        message: 'Playlist created succesfully',
        data: newPlaylist
    }); 
});





