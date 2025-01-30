document.addEventListener('DOMContentLoaded', () => {
    const viewAllSongsButton = document.getElementById('view-all-songs');
    const uploadSongsButton = document.getElementById('upload-songs');
    const viewPlaylistsButton = document.getElementById('view-playlists');

    const contentSection = document.getElementById('content');


    //Songs Section
    // Event listener for song buttons
    function attachSongButtonListeners() {
        //Finds all song buttons and attaches listeners to all of them
        const songButtons = document.querySelectorAll('.song-button');
        songButtons.forEach((button) => {
            button.addEventListener('click', () => {
                //Song data from the dataset
                const songId = button.dataset.id;
                const songTitle = button.dataset.title; 
                const songArtist = button.dataset.artist

                console.log(songId);

                // Display the song title and action buttons
                const content = document.getElementById('content');
                content.innerHTML = `
                    <h2>${songTitle}</h2>
                    <div class="action-buttons">
                        <button class="action-button" id="edit-song-${songId}">Edit Song</button>
                        <button class="action-button" id="delete-song-${songId}">Delete Song</button>
                    </div>
                `;

                // Add event listeners for the buttons
                document.getElementById(`edit-song-${songId}`).addEventListener('click', () => editSong(songId, songTitle, songArtist));
                document.getElementById(`delete-song-${songId}`).addEventListener('click', () => deleteSong(songId));
            });
        });
    }
    // Functions for the buttons
    function editSong(songId, songTitle, songArtist) {
        const content = document.getElementById('content');
        content.innerHTML = `
            <h2>Edit Song: ${songTitle}</h2>
            <form id="editForm">
                <label for="newTitle">New Title:</label>
                <input type="text" id="newTitle" value="${songTitle}" required>
                <label for="newTitle">New Artist:</label>
                <input type="text" id="newArtist" value="${songArtist}" required>
                <button type="submit">Save Changes</button>
            </form>
        `;

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newTitle = document.getElementById('newTitle').value;
            const newArtist = document.getElementById('newArtist').value;

            fetch(`/api/songs/${songId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle , artist : newArtist}),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(() => {
                    content.innerHTML = `<p>Song updated successfully!</p>`;
                })
                .catch((error) => {
                    console.error('Error updating song:', error);
                    content.innerHTML = '<p>Error updating song. Please try again later.</p>';
                });
        });
    }

    function deleteSong(songId) {
        if (confirm('Are you sure you want to delete this song?')) {
            fetch(`/api/songs/${songId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(() => {
                    const content = document.getElementById('content');
                    content.innerHTML = `<p>Song deleted successfully!</p>`;
                })
                .catch((error) => {
                    console.error('Error deleting song:', error);
                    const content = document.getElementById('content');
                    content.innerHTML = '<p>Error deleting song. Please try again later.</p>';
                });
        }
    }
    
    viewAllSongsButton.addEventListener('click', () => {
        //Add loading message
        const content = document.getElementById('content');
        content.innerHTML = '<h2>Loading songs...</h2>';
    
        //Fetch songs from the api and display them in content section
        fetch('/api/songs')
            .then(response => {
                if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //Clear content section
                content.innerHTML = '';

                // Add header for songs
                const header = document.createElement('h2');
                header.textContent = 'Songs:';
                content.appendChild(header);
    
                //Turn response into a list and display
                if (data.length === 0) {
                    content.innerHTML = '<h2>No songs available.</h2>';
                    return;
                }
    
                const songList = document.createElement('div');
                data.forEach(song => {
                    // Create a button for each song
                    const button = document.createElement('button');
                    button.textContent = `${song.title} by ${song.artist}`;
                    button.classList.add('song-button'); // Make it the song-button class
                    button.dataset.id = song.id; //Use dataset to keep song data after content changes
                    button.dataset.title = song.title;
                    button.dataset.artist = song.artist;

                    // Add a click event to the button
                    button.addEventListener('click', () => {
                        console.log(`clicked on ${song.title}`)
                        //Adds individual song listeners for each song on the page
                        attachSongButtonListeners()
                    }); 

                    // Append the button to the list
                    songList.appendChild(button);
                });

                // Append the list to the content section
                content.appendChild(songList);
                attachSongButtonListeners()
                
            })
            //Error handling
            .catch(error => {
                console.error('Error fetching songs:', error);
                content.innerHTML = '<h2>Error fetching songs. Please try again later.</h2>';
            });
    });
    


//Upload Section
    uploadSongsButton.addEventListener('click', () => {
        contentSection.innerHTML = `
            <h2>Upload Music</h2>
            <form id="uploadForm">
                <label for="songName">Song Name:</label>
                <input type="text" id="songName" name="songName" required><br><br>
                <label for="artistName">Artist Name:</label>
                <input type="text" id="artistName" name="artistName" required><br><br>
                <button type="submit">Upload</button>
            </form>
        `;

        //Form for title and artist
        const uploadForm = document.getElementById('uploadForm');
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const songName = document.getElementById('songName').value;
            const artistName = document.getElementById('artistName').value;

            //Add data to songs.json
            fetch('/api/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: songName,
                    artist: artistName
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                contentSection.innerHTML = `<p>Successfully uploaded "${data.data.title}" by "${data.data.artist}".</p>`;
            })
            .catch(error => {
                console.error('Error uploading song:', error);
                contentSection.innerHTML = '<p>Error uploading song. Please try again later.</p>';
            });
        });
    });
    

//Playlists Section

// Event listener for playlist buttons
function attachPlaylistButtonListeners() {
    // Finds all playlist buttons and attaches listeners to all of them
    const playlistButtons = document.querySelectorAll('.playlist-button');
    playlistButtons.forEach((button) => {
        button.addEventListener('click', () => {
            //PLaylist data from dataset
            const playlistId = button.dataset.id;
            
            //Fetch playlist data
            fetch(`/api/playlists/${playlistId}`)
                .then(response => response.json())
                .then(playlist => {
                    //Display playlist name and buttons
                    content.innerHTML = `
                        <h2>${playlist.name}</h2>
                        <div class="action-buttons">
                            <button class="action-button" id="edit-playlist-${playlist.id}">Edit Playlist</button>
                            <button class="action-button" id="delete-playlist-${playlist.id}">Delete Playlist</button>
                            <button class="action-button" id="add-song-${playlist.id}">Add Song</button>
                            <button class="action-button" id="remove-song-${playlist.id}">Remove Song</button>
                        </div>
                        <div id="playlist-songs-container">
                            <h3>Songs in this Playlist:</h3>
                            <ul id="playlist-songs-${playlist.id}" class="playlist-songs"></ul>
                        </div>
                    `;
        
                    //Display songs in the playlist
                    const songsContainer = document.getElementById(`playlist-songs-${playlist.id}`);
                    
                    //Fetch songs in playlsit by ID and display
                    playlist.songsInPlaylist.forEach(songId => {
                        fetch(`/api/songs/${songId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Song not found');
                                } 
                                return response.json();
                            })
                            .then(song => {
                                const songElement = document.createElement('li');
                                songElement.className = 'playlist-song-item';
                                songElement.innerHTML = `
                                    <div class="song-details">
                                        <span class="song-title">${song.title}</span>
                                        <span class="song-artist">by ${song.artist}</span>
                                    </div>
                                `;
                                songsContainer.appendChild(songElement);
                            })
                            .catch(error => {
                                const errorElement = document.createElement('li');
                                errorElement.className = 'song-error';
                                errorElement.textContent = `Error loading song: ${error.message}`;
                                songsContainer.appendChild(errorElement);
                            });
                    });
        
                    //Add event listeners for buttons
                    document.getElementById(`edit-playlist-${playlist.id}`).addEventListener('click', () => editPlaylist(playlistId, playlist.name));
                    document.getElementById(`delete-playlist-${playlist.id}`).addEventListener('click', () => deletePlaylist(playlistId));
                    document.getElementById(`add-song-${playlist.id}`).addEventListener('click', () => addSongToPlaylist(playlistId));
                    document.getElementById(`remove-song-${playlist.id}`).addEventListener('click', () => removeSongFromPlaylist(playlistId));
                });
            });
        });
    }

// Functions for the buttons
function editPlaylist(playlistId, playlistName) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Edit Playlist: ${playlistName}</h2>
        <form id="editForm">
            <label for="newName">New Name:</label>
            <input type="text" id="newName" value="${playlistName}" required>
            <button type="submit">Save Changes</button>
        </form>
    `;

    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('newName').value;

        fetch(`/api/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName}),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                content.innerHTML = `<p>Playlist updated successfully!</p>`;
            })
            .catch((error) => {
                console.error('Error updating playlist:', error);
                content.innerHTML = '<p>Error updating playlist. Please try again later.</p>';
            });
    });
}
function deletePlaylist(playlistId) {
    if (confirm('Are you sure you want to delete this playlist?')) {
        fetch(`/api/playlists/${playlistId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                const content = document.getElementById('content');
                content.innerHTML = `<p>Playlist deleted successfully!</p>`;
            })
            .catch((error) => {
                console.error('Error deleting playlist:', error);
                const content = document.getElementById('content');
                content.innerHTML = '<p>Error deleting playlist. Please try again later.</p>';
            });
    }
}

// Function to add song to playlist
function addSongToPlaylist(playlistId) {
    


    const content = document.getElementById('content');
    content.innerHTML = '<h2>Select a song to add:</h2>';

    // Fetch songs to let the user choose one
    fetch('/api/songs')
        .then(response => response.json())
        .then(songs => {
            if (songs.length === 0) {
                content.innerHTML += '<p>No songs available.</p>';
                return;
            }

            const songList = document.createElement('div');
            songs.forEach(song => {
                const button = document.createElement('button');
                button.textContent = `${song.title} by ${song.artist}`;
                button.classList.add('song-button');
                button.dataset.id = song.id;

                button.addEventListener('click', () => {
                    const songId = button.dataset.id; // Get the clicked song's ID

                    // Send a PUT request to add the selected song to the playlist
                    fetch(`/api/playlists/${playlistId}/add-song`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ songID: songId })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message)
                        viewPlaylistsButton.click(); // Refresh playlist view
                    })
                    .catch(error => {
                        console.log(`Error adding song: ${error.message}`)
                    });
                });

                songList.appendChild(button);
            });

            content.appendChild(songList);
        })
        .catch(error => {
            console.error('Error fetching songs:', error);
            content.innerHTML += '<p>Error loading songs. Please try again later.</p>';
        });
}
// Function to remove song from playlist
function removeSongFromPlaylist(playlistId) {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Select a song to remove:</h2>';
    
    fetch(`/api/playlists/${playlistId}`)
    .then(response => response.json())
    .then(async playlist => {
        if (!playlist.songsInPlaylist || playlist.songsInPlaylist.length === 0) {
            content.innerHTML += '<p>No songs in this playlist.</p>';
            return;
        }

        const songList = document.createElement('div');

        const songDetails = await Promise.all(playlist.songsInPlaylist.map(songId =>
            fetch(`/api/songs/${songId}`).then(res => res.json())
        ));

        songDetails.forEach(song => {
            const button = document.createElement('button');
            button.textContent = `${song.title} by ${song.artist}`;
            button.classList.add('song-button');
            button.dataset.id = song.id;

            button.addEventListener('click', () => {
                fetch(`/api/playlists/${playlistId}/remove-song`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ songID: song.id }) // Ensure the key is `songID`
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to remove song from playlist');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data.message);
                    viewPlaylistsButton.click(); // Refresh playlist view
                })
                .catch(error => {
                    console.error('Error removing song:', error);
                    content.innerHTML += `<p style="color:red;">Error: ${error.message}</p>`;
                });
            });

            songList.appendChild(button);
        });

        content.appendChild(songList);
    })
    .catch(error => {
        console.error('Error fetching playlist:', error);
        content.innerHTML += '<p style="color:red;">Error loading playlist. Please try again later.</p>';
    });
}


//View Playlists page
    viewPlaylistsButton.addEventListener('click', () => {
        //Add loading message
        const content = document.getElementById('content');
        content.innerHTML = '<h2>Loading playlists...</h2>';
    
        //Fetch playlists from the api and display them in content section
        fetch('/api/playlists')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //Clear content section
                content.innerHTML = '';

                // Add header for playlists
                const header = document.createElement('h2');
                header.textContent = 'Playlists:';
                content.appendChild(header);

                // Add button for creating a new playlist
                const createPlaylistButton = document.createElement('button');
                createPlaylistButton.textContent = 'Create New Playlist';
                createPlaylistButton.classList.add('create-playlist-button');
                content.appendChild(createPlaylistButton);

                //Create playlist section, similar to upload songs section
                createPlaylistButton.addEventListener('click', () => {
                    //Display on page
                    contentSection.innerHTML = `
                        <h2>Create new playlist</h2>
                        <form id="uploadForm">
                            <label for="playlistName">Playlist Name:</label>
                            <input type="text" id="playlistName" name="playlistName" required><br><br>
                            <button type="submit">Upload</button>
                        </form>
                    `;
            
                    //Form for new playlist
                    const uploadForm = document.getElementById('uploadForm');
                    uploadForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const playlistName = document.getElementById('playlistName').value;
            
                        //Add data to playlists.json
                        fetch('/api/playlists', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: playlistName,
                            })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            contentSection.innerHTML = `<p>Successfully created playlist: "${data.data.name}".</p>`;
                        })
                        .catch(error => {
                            console.error('Error created playlist:', error);
                            contentSection.innerHTML = '<p>Error creating playlist. Please try again later.</p>';
                        });
                    });
                });
    
                //Display all playlists
                //Turn response into a list and display
                if (data.length === 0) {
                    content.innerHTML = '<h2>No playlists available.</h2>';
                    return;
                }
    
                const playlistList = document.createElement('div');
                data.forEach(playlist => {
                    // Create a button for each song
                    const button = document.createElement('button');
                    button.textContent = `${playlist.name}: ${playlist.songsInPlaylist.length}`;
                    button.classList.add('playlist-button'); // Make it the playlist-button class
                    button.dataset.id = playlist.id; //Use dataset to keep song data after content changes
                    button.dataset.name = playlist.name;
                    button.dataset.playlistSongs = playlist.songsInPlaylist;
                    

                    // Add a click event to the button
                    button.addEventListener('click', () => {
                        attachPlaylistButtonListeners()
                    });

                    // Append the button to the list
                    playlistList.appendChild(button);
                });

                // Append the list to the content section
                content.appendChild(playlistList);
                attachPlaylistButtonListeners()
            })
            //Error handling
            .catch(error => {
                console.error('Error fetching playlists:', error);
                content.innerHTML = '<h2>Error fetching playlists. Please try again later.</h2>';
            });
    });
});
