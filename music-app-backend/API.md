# Playlist API Documentiation

## Endpoints

### GET /api/playlists
- **Description** : Retrieve all plylists.
- **Response**:
```json
[
    {"id": "<uuid>", "name": "string", "songs": "array of songs"}
]