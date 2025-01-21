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

//GET a song by id
app.get('/api/songs/:id', (req, res) =>{
    const{id} = req.params;

    const song = songs.find((song) => song.id === id);

    //Return 404 error if song not found
    if(!song) {
        return res.status(404).json({ message: 'Song not found'});
    }

    //Return song by ID
    res.status(200).json(song)
})

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

    if (duplicate) {
        return res.status(409).json({message: "Song already exists"})
    }

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

//DELETE song
app.delete('/api/songs/:id', (req,res) => {
    const {id} = req.params;

    //Find song by ID
    const songIndex = songs.findIndex((song) => song.id === id);

    //If it doesnt exist, return 404 error
    if (songIndex === -1){
        return res.status(404).json({message: 'song not found'});
    }
    //Remove and return song from array
    const deletedSong = songs.splice(songIndex, 1)[0];

    //Update songs file
    fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2), 'utf8')

    res.status(200).json({message: 'Song deleted succesfully', data: deletedSong});

})

//PUT to update an existing song
app.put('/api/songs/:id', (req, res) => {
    const {id} = req.params
    const {title, artist} = req.body

    //Find song by ID
    const songIndex = songs.findIndex((song) => song.id === id);

    //If it doesnt exist, return 404 error
    if (songIndex === -1){
        return res.status(404).json({message: 'song not found'});
    }

    //Update the song if new title or artist are given
    if (title){
        songs[songIndex].title = title;
    }
    if (artist){
        songs[songIndex].artist = artist;
    }

    fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2), 'utf8');

    res.status(200).json({message: 'Song updated succesfully', data: songs[songIndex]});
})



//Playlists

//Songs
//Load songs from songs.json 

const playlistsFilePath = path.join(__dirname, 'playlists.json');
let playlists = JSON.parse(fs.readFileSync(playlistsFilePath, 'utf8'));

//GET all playlists
app.get('/api/playlists', (req, res) => {
    res.json(playlists);
});

//GET playlist by ID
app.get('/api/playlists/:id', (req, res) =>{
    const{id} = req.params;

    const playlist = playlists.find((playlist) => playlist.id === id);

    //Return 404 error if playlist not found
    if(!playlist) {
        return res.status(404).json({ message: 'Playlist not found'});
    }

    //Return playlist by ID
    res.status(200).json(playist)
})

//POST to add a new playlist
app.post('/api/playlists', (req, res) => {
    const {name} = req.body;

    //Ensure title and artist are not null
    if(!name) {
        return res.status(400).json({message: 'Playlist name is required'});
    }

    // Check for duplicate playlist name
    const duplicate = playlists.find(
        (playlist) => playlist.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({message: "Playlist already exists"})
    }

    //Define new playlist
    const newPlaylist = {
        id: uuidv4(),
        name,
        songsInPlaylist: [],
    };

    //Add new playlist to array
    playlists.push(newPlaylist);

    // Save the updated playlists list back to the JSON file
    fs.writeFileSync(playlistsFilePath, JSON.stringify(playlists, null, 2), 'utf8')

    //Respond with success message
    res.status(201).json({message: 'Playlist created succesfully', data: newPlaylist});
})

//PUT to add new song to playlist
app.put('/api/playlists/:id/add-song', (req,res) => {
    const{id} = req.params; //Get playlist ID from URL
    const{songID} = req.body //Get song ID from body

    //Validate song ID is given
    if(!songID) {
        return res.status(400).json({message: 'Song ID is required'});
    }

    //Find playlist by ID
    const playlist = playlists.find((playlist) => playlist.id === id);

    //If it doesnt exist, return 404 error
    if(!playlist){
        return res.status(404).json({ message: 'Playlist not found' });
    }

    //Check if the song exists
    const song = songs.find((song) => song.id === songID);

    if(!song){
        return res.status(404).json({ message: 'Song not found' });
    }

    //Add song to playlist
    playlist.songsInPlaylist.push(songID)

    //Return success message and updated playlist
    res.status(200).json({
        message: '"${song.name}" added to "${playlist.name}"',
        data: playlist
    })


})







