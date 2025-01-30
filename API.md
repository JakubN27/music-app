# Music App API Documentation

## Endpoints

## Songs

### GET /api/songs
- **Description**: Fetches all songs.
- **Responses**:
  - `200 OK`: Returns all songs.

#### **Example Response**:
```json
[
    {"id": "<uuidv4>", "title": "Song 1", "artist": "Artist 1"},
    {"id": "<uuidv4>", "title": "Song 2", "artist": "Artist 2"}
]
```

---

### GET /api/songs/:id
- **Description**: Fetches a song by ID.
- **Example Request**:
```http
GET /api/songs/<uuidv4>
Content-Type: application/json
```
- **Responses**:
  - `200 OK`: Returns song with given ID.
  - `404 Not Found`: Song with given ID doesn't exist.

#### **Example Response**:
```json
{"id": "<uuidv4>", "title": "Song 2", "artist": "Artist 2"}
```

---

### GET /api/songs/ids
- **Description**: Fetches all song IDs.
- **Responses**:
  - `200 OK`: Returns all song IDs.

#### **Example Response**:
```json
{
  "ids": ["<uuidv4>", "<uuidv4>"]
}
```

---

### POST /api/songs
- **Description**: Creates a new song.
- **Example Request**:
```http
POST /api/songs
Content-Type: application/json

{
  "title": "Song 3",
  "artist": "Artist 3"
}
```
- **Responses**:
  - `201 Created`: Song successfully created.
  - `400 Bad Request`: Missing required fields.

#### **Example Response**:
```json
{
  "message": "Song created successfully",
  "data": {
    "id": "<uuidv4>",
    "title": "Song 3",
    "artist": "Artist 3"
  }
}
```

---

### DELETE /api/songs/:id
- **Description**: Deletes a song by ID.
- **Example Request**:
```http
DELETE /api/songs/<uuidv4>
Content-Type: application/json
```
- **Responses**:
  - `200 OK`: Song successfully deleted.
  - `404 Not Found`: Song not found.

#### **Example Response**:
```json
{
  "message": "Song deleted successfully"
}
```

---

### PUT /api/songs/:id
- **Description**: Updates a song's details.
- **Example Request**:
```http
PUT /api/songs/<uuidv4>
Content-Type: application/json

{
  "title": "New Title",
  "artist": "New Artist"
}
```
- **Responses**:
  - `200 OK`: Song successfully updated.
  - `404 Not Found`: Song not found.

#### **Example Response**:
```json
{
  "message": "Song updated successfully",
  "data": {
    "id": "<uuidv4>",
    "title": "New Title",
    "artist": "New Artist"
  }
}
```
## Playlists
---

### GET /api/playlists
- **Description**: Fetches all playlists.
- **Responses**:
  - `200 OK`: Returns all playlists.

#### **Example Response**:
```json
[
    {"id": "<uuidv4>", "name": "Playlist 1", "songs": []},
    {"id": "<uuidv4>", "name": "Playlist 2", "songs": ["<uuidv4>"]}
]
```

---

### GET /api/playlists/:id
- **Description**: Fetches a playlist by ID.
- **Example Request**:
```http
GET /api/playlists/<uuidv4>
Content-Type: application/json
```
- **Responses**:
  - `200 OK`: Returns playlist with the given ID.
  - `404 Not Found`: Playlist not found.

#### **Example Response**:
```json
{
  "id": "<uuidv4>",
  "name": "My Playlist",
  "songs": ["<uuidv4>"]
}
```

---

### PUT /api/songs/:id
- **Description**: Updates a playlists details.
- **Example Request**:
```http
PUT /api/playlists/<uuidv4>
Content-Type: application/json

{
  "name": "New name",
}
```
- **Responses**:
  - `200 OK`: Playlist successfully updated.
  - `404 Not Found`: Playlist not found.

#### **Example Response**:
```json
{
  "message": "Playlist updated successfully",
  "data": {
    "id": "<uuidv4>",
    "name": "New name",
  }
}
```

---

### PUT /api/playlists/:id/add-song
- **Description**: Adds a song to a playlist.
- **Example Request**:
```http
PUT /api/playlists/<uuidv4>/add-song
Content-Type: application/json

{
  "songID": "<uuidv4>"
}
```
- **Responses**:
  - `200 OK`: Song successfully added.
  - `404 Not Found`: Playlist or song does not exist.

#### **Example Response**:
```json
{
  "message": "Song added to playlist successfully",
  "data": {
    "id": "<uuidv4>",
    "name": "My Playlist",
    "songs": ["<uuidv4>"]
  }
}
```

---

### PUT /api/playlists/:id/remove-song
- **Description**: Removes a song from a playlist.
- **Example Request**:
```http
PUT /api/playlists/<uuidv4>/remove-song
Content-Type: application/json

{
  "songID": "<uuidv4>"
}
```
- **Responses**:
  - `200 OK`: Song removed succesfully.
  - `404 Not Found`: Playlist or song not found.

#### **Example Response**:
```json
{
  "message": "Song removed from playlist successfully",
  "data": {
    "id": "<uuidv4>",
    "name": "My Playlist",
    "songs": []
  }
}
```

---

### DELETE /api/playlists/:id
- **Description**: Deletes a playlist by ID.
- **Example Request**:
```http
DELETE /api/playlists/<uuidv4>
Content-Type: application/json
```
- **Responses**:
  - `200 OK`: Playlist deleted succesfully
  - `404 Not Found`: Playlist not found.

#### **Example Response**:
```json
{
  "message": "Playlist deleted successfully"
}
```

