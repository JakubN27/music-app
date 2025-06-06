const express = require('express');
const fs = require('fs');
const{ v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();  
const PORT = 3000;

//Middleware to parse json in the request body
app.use(express.json());
//Connect frontend requests
app.use(express.static(path.join(__dirname, 'music-app-frontend')));

//Default route to confirm the server in working
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

module.exports = app; // Export both app and server


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
    res.status(200).json(songs);
});

//GET only song ids
app.get('/api/songs/ids', (req, res) =>{
    const songIds = songs.map((song) => song.id);
    res.json({ ids: songIds })
})


app.post('/api/songs', (req, res) => {
    const { title, artist } = req.body;

    // Ensure title and artist are provided
    if (!title || !artist) {
        return res.status(400).json({ message: 'Title and artist are required' });
    }

    // Create a new song
    const newSong = {
        id: uuidv4(), // Generate a unique ID
        title,
        artist,
    };

    // Add the new song to the songs array
    songs.push(newSong);

    // Save the updated songs list back to the JSON file
    fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2), 'utf8');

    // Respond with success message and the new song
    res.status(201).json({ message: 'Song created successfully', data: newSong });
});

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
    res.status(200).json(playlist)
})

//POST to add a new playlist
app.post('/api/playlists', (req, res) => {
    const {name} = req.body;

    //Ensure name is not null
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

//PUT to update an existing playlist name
app.put('/api/playlists/:id', (req, res) => {
    const {id} = req.params
    const {name} = req.body

    //Find plauylist by ID
    const playlistIndex = playlists.findIndex((playlist) => playlist.id === id);

    //If it doesnt exist, return 404 error
    if (playlistIndex === -1){
        return res.status(404).json({message: 'playlist not found'});
    }

    //Update the song if new name given
    if (name){
        playlists[playlistIndex].name = name;
    }

    fs.writeFileSync(playlistsFilePath, JSON.stringify(playlists, null, 2), 'utf8');

    res.status(200).json({message: 'Playlist updated succesfully', data: playlists[playlistIndex]});
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
    fs.writeFileSync(playlistsFilePath, JSON.stringify(playlists, null, 2), 'utf8');

    //Return success message and updated playlist
    res.status(200).json({
        message: `"${song.title}" added to "${playlist.name}"`,
        data: playlist
    })


})

//PUT to remove a song from playlist
app.put('/api/playlists/:id/remove-song', (req,res) => {
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

    console.log('Playlist Songs:', playlist.songsInPlaylist);
    console.log('Song ID to remove:', songID);

    //Find song index
    const songIndex = playlist.songsInPlaylist.findIndex((songId) => songId === songID);
    //Check if song in playlist
    if (songIndex === -1){
        return res.status(404).json({message: "Song not found in playlsit"});
    }
    //Remove song from playlist
    playlist.songsInPlaylist.splice(songIndex, 1)

    //Return success message and updated playlist
    res.status(200).json({
        message: `"${song.name}" removed from "${playlist.name}"`,
        data: playlist
    })
})

//DELETE playlist
app.delete('/api/playlists/:id', (req,res) => {
    const {id} = req.params;

    //Find song by ID
    const playlistIndex = playlists.findIndex((playlist) => playlist.id === id);

    //If it doesnt exist, return 404 error
    if (playlistIndex === -1){
        return res.status(404).json({message: 'playlist not found'});
    }
    //Remove and return song from array
    const deletedPlaylist = playlists.splice(playlistIndex, 1)[0];

    //Update songs file
    fs.writeFileSync(playlistsFilePath, JSON.stringify(playlists, null, 2), 'utf8')

    res.status(200).json({message: 'Playlist deleted succesfully', data: deletedPlaylist});

})







