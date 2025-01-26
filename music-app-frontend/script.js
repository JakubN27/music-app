document.addEventListener('DOMContentLoaded', () => {
    const viewAllSongsButton = document.getElementById('view-all-songs');
    const uploadSongsButton = document.getElementById('upload-songs');
    const viewPlaylistsButton = document.getElementById('view-playlists');

    const contentSection = document.getElementById('content');

    viewAllSongsButton.addEventListener('click', () => {
        // Simulate fetching song data
        contentSection.innerHTML = `
            <h2>All Songs</h2>
            <ul>
                <li>Song 1 - Artist A</li>
                <li>Song 2 - Artist B</li>
                <li>Song 3 - Artist C</li>
            </ul>
        `;
    });

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

            alert(`Uploaded: ${songName} by ${artistName}`);
            contentSection.innerHTML = `<p>Successfully uploaded "${songName}" by "${artistName}".</p>`;
        });
    });

    viewPlaylistsButton.addEventListener('click', () => {
        contentSection.innerHTML = 
        `<h2>Your Playlists</h2>
            <ul>
                <li>Workout Vibes</li>
                <li>Relaxing Tunes</li>
                <li>Party Hits</li>
            </ul>`;
    });
});
