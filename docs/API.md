# API Documentation

## Base URL
`/api` (e.g., `https://api.floodguard.example.com/prod/api`)

## Authentication
Most endpoints require a valid JWT passed in the `Authorization` header:
`Authorization: Bearer <token>`

## Error Format
```json
{
  "error": "Error Message",
  "code": 400
}
```

## Endpoints

### GET /api/risk/zones
Get current flood risk zones.
- **Response:** Array of zone objects.

### GET /api/risk/assessment/{id}
Get detailed assessment for a specific zone.

### POST /api/reports
Submit a crowdsourced report.
- **Body:** `{ location: {lat, lng}, severity: "HIGH", description: "Water rising rapidly", image: "base64..." }`
- **Response:** 201 Created

### GET /api/reports
Retrieve recent reports.

### POST /api/routes/compare
Compare multiple routes for safety.
- **Body:** `{ origin: {lat, lng}, destination: {lat, lng} }`
- **Response:** Array of evaluated routes with safety scores.

### GET /api/alerts
Get recent alerts for the user.

## Rate Limits
Global: 100 requests burst, 50 requests per second rate.
