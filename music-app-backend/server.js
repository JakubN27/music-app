const express = require('express');
const fs = require('fs');
const{ v4: uuidv4 } = require('uuid');
const path = require('path');
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



//Songs
//Load songs from songs.json 
const songsFilePath = path.join(__dirname, 'songs.json');
let songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf8'));

//GET all songs
app.get('/api/songs', (req, res) => {
    res.json(songs);
});

//GET only song ids
app.get('/api/songs/ids', (req, res) =>{
    const songIds = songs.map((song) => song.id);
    res.json({ ids: songIds })
})


//POST to add a new song
app.post('/api/songs', (req, res) => {
    const {title, artist} = req.body;

    //Ensure title and artist are not null
    if(!title || !artist) {
        return res.status(400).json({message: 'Title and artist are required'});
    }

    // Check for duplicate title and artist
    const duplicate = songs.find(
        (song) => song.title.toLowerCase() === title.toLowerCase() && song.artist.toLowerCase() === artist.toLowerCase()
    );

    //Define new song
    const newSong = {
        id: uuidv4(),
        title,
        artist,
    };

    //Add new song to array
    songs.push(newSong);

    // Save the updated songs list back to the JSON file
    fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2), 'utf8')

    //Respond with success message
    res.status(201).json({message: 'Song created succesfully', data: newSong});
})





//Playlists
//Mock data
let playlists = [
    { id: uuidv4(), name: 'Chill Vibes', songs: ['Song 1', 'Song 2']},
    { id: uuidv4(), name: 'Workout Mix', songs: ['Song 3', 'Song 4']}
];

//GET all playlists
app.get('/api/playlists', (req, res) => {
    res.json(playlists);
});

//POST to add a new playlist
app.post('/api/playlists', (req, res) => {
    const {name, songIds = [] } = req.body; //access the data sent in request body

    if(!name) {
        return res.status(400).json({message: 'Playlist name ius required'});
    }
    //Validate songIds by checking agaisnt songs array
    const validSongs = songs.filter((song) => songsIds.includes(song.id));

    const newPlaylist = {
        id: uuidv4(), //Generate unique id
        name,
        songs : validSongs.map((song) => song.id) // only store song ids
    };

    //Save the new playlist
    playlists.push(newPlaylist)

    //Respond with new playlist and message
    res.status(201).json({
        message: 'Playlist created succesfully',
        data: newPlaylist
    }); 
});







