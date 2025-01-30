# Playlist API Documentiation

## Endpoints

### GET /api/songs
- **Description** : Fetches all songs.
- **Example response**:
```json
[
    {"id": "cb42fe95-45ed-425c-8ff8-102a45881e75", "name": "Song 1", "songs": "Artist 1"}
    {"id": "eee6dc85-f4b4-4a75-903d-52f9dea42b02", "name": "Song 2", "songs": "Artist 2"}
]
```
### GET /api/songs/:id
 - **Description** : Fetches a song by ID
 - **Example Request**:
 ```http
GET /api/songs/"eee6dc85-f4b4-4a75-903d-52f9dea42b02"
Content-Type: application/json
```
- **Example Response**:
```json
{"id": "eee6dc85-f4b4-4a75-903d-52f9dea42b02", "name": "Song 2", "songs": "Artist 2"}
```
