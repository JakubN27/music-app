document.addEventListener('DOMContentLoaded', () => {
    const viewAllSongsButton = document.getElementById('view-all-songs');
    const uploadSongsButton = document.getElementById('upload-songs');
    const viewPlaylistsButton = document.getElementById('view-playlists');

    const contentSection = document.getElementById('content');


//Songs Section
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

                    // Add a click event to the button
                    button.addEventListener('click', () => {
                        alert(`You clicked on "${song.title}" by ${song.artist}`);
                    });

                    // Append the button to the list
                    songList.appendChild(button);
                });

            // Append the list to the content section
            content.appendChild(songList);
    
                // Append the list to the content section
                content.appendChild(songList);
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
                        contentSection.innerHTML = `<h2>Created new playlist: "${playlistName}".</h2>`;
                    });
                });
    
                //Turn response into a list and display
                if (data.length === 0) {
                    content.innerHTML = '<h2>No playlists available.</h2>';
                    return;
                }
    
                const songList = document.createElement('ul');
                data.forEach(playlist => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${playlist.name} : ${playlist.songsInPlaylist.length} songs`;
                    songList.appendChild(listItem);
                });
    
                // Append the list to the content section
                content.appendChild(songList);
            })
            //Error handling
            .catch(error => {
                console.error('Error fetching songs:', error);
                content.innerHTML = '<h2>Error fetching songs. Please try again later.</h2>';
            });
    });
});
