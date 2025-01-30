# Playlist API Documentiation

## Endpoints

### GET /api/songs
- **Description** : Fetches all songs.
- **Example response**:
```json
[
    {"id": "eee6dc85-f4b4-4a75-903d-52f9dea42b02", "name": "Song 1", "songs": "Artist 1"}
    {"id": "eee6dc85-f4b4-4a75-903d-52f9dea42b02", "name": "Song 2", "songs": "Artist 2"}
]
```
### GET /api/songs/:id
 - **Description** : Fetches a song by ID
 - **Example Call**:
 ```http
GET /api/songs/123 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```
