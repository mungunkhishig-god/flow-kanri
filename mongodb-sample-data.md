# MongoDB Sample Data for Flow Kanri

Use this data to populate your MongoDB `flow-kanri` database with the `teams` collection.

## Teams Data

Copy and paste each of these documents into your MongoDB Atlas collection:

### 1. Khadaan (ハダーン)

```json
{
  "name": "ハダーン",
  "flows": [
    {
      "id": "khadaan-flow-001",
      "flow-name": "Daily Mining Report",
      "status-code": 200,
      "error-message": ""
    },
    {
      "id": "khadaan-flow-002",
      "flow-name": "Equipment Status",
      "status-code": 200,
      "error-message": ""
    }
  ]
}
```

### 2. Nomads (ノマッズ)

```json
{
  "name": "ノマッズ",
  "flows": [
    {
      "id": "nomads-flow-001",
      "flow-name": "Travel Logistics",
      "status-code": 200,
      "error-message": ""
    },
    {
      "id": "nomads-flow-002",
      "flow-name": "Route Planning",
      "status-code": 404,
      "error-message": "Route data not found"
    }
  ]
}
```

### 3. Tenger (テンゲル)

```json
{
  "name": "テンゲル",
  "flows": [
    {
      "id": "tenger-flow-001",
      "flow-name": "Sky Monitoring",
      "status-code": 200,
      "error-message": ""
    },
    {
      "id": "tenger-flow-002",
      "flow-name": "Weather Analysis",
      "status-code": 200,
      "error-message": ""
    },
    {
      "id": "tenger-flow-003",
      "flow-name": "Satellite Data",
      "status-code": 500,
      "error-message": "Connection timeout to satellite API"
    }
  ]
}
```

### 4. Cashmere (カシミア)

```json
{
  "name": "カシミア",
  "flows": [
    {
      "id": "cashmere-flow-001",
      "flow-name": "Production Report",
      "status-code": 200,
      "error-message": ""
    },
    {
      "id": "cashmere-flow-002",
      "flow-name": "Quality Check",
      "status-code": 200,
      "error-message": ""
    }
  ]
}
```

### 5. Bayan (バヤン)

```json
{
  "name": "バヤン",
  "flows": [
    {
      "id": "bayan-flow-001",
      "flow-name": "Resource Allocation",
      "status-code": 200,
      "error-message": ""
    },
    {
      "id": "bayan-flow-002",
      "flow-name": "Budget Review",
      "status-code": 403,
      "error-message": "Access denied - insufficient permissions"
    },
    {
      "id": "bayan-flow-003",
      "flow-name": "Financial Summary",
      "status-code": 200,
      "error-message": ""
    }
  ]
}
```

## How to Import to MongoDB Atlas

### Method 1: Using MongoDB Atlas UI

1. Go to your MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select database `flow-kanri`
4. Create collection `teams` if it doesn't exist
5. Click "Insert Document"
6. Paste each JSON document above (one at a time)
7. Click "Insert"

### Method 2: Using MongoDB Compass

1. Connect to your cluster using the connection string
2. Navigate to `flow-kanri` database
3. Create `teams` collection
4. Click "Add Data" → "Insert Document"
5. Paste each JSON document
6. Click "Insert"

### Method 3: Using mongosh (MongoDB Shell)

```javascript
use flow-kanri

db.teams.insertMany([
  {
    "name": "ハダーン",
    "flows": [
      {
        "id": "khadaan-flow-001",
        "flow-name": "Daily Mining Report",
        "status-code": 200,
        "error-message": ""
      },
      {
        "id": "khadaan-flow-002",
        "flow-name": "Equipment Status",
        "status-code": 200,
        "error-message": ""
      }
    ]
  },
  {
    "name": "ノマッズ",
    "flows": [
      {
        "id": "nomads-flow-001",
        "flow-name": "Travel Logistics",
        "status-code": 200,
        "error-message": ""
      },
      {
        "id": "nomads-flow-002",
        "flow-name": "Route Planning",
        "status-code": 404,
        "error-message": "Route data not found"
      }
    ]
  },
  {
    "name": "テンゲル",
    "flows": [
      {
        "id": "tenger-flow-001",
        "flow-name": "Sky Monitoring",
        "status-code": 200,
        "error-message": ""
      },
      {
        "id": "tenger-flow-002",
        "flow-name": "Weather Analysis",
        "status-code": 200,
        "error-message": ""
      },
      {
        "id": "tenger-flow-003",
        "flow-name": "Satellite Data",
        "status-code": 500,
        "error-message": "Connection timeout to satellite API"
      }
    ]
  },
  {
    "name": "カシミア",
    "flows": [
      {
        "id": "cashmere-flow-001",
        "flow-name": "Production Report",
        "status-code": 200,
        "error-message": ""
      },
      {
        "id": "cashmere-flow-002",
        "flow-name": "Quality Check",
        "status-code": 200,
        "error-message": ""
      }
    ]
  },
  {
    "name": "バヤン",
    "flows": [
      {
        "id": "bayan-flow-001",
        "flow-name": "Resource Allocation",
        "status-code": 200,
        "error-message": ""
      },
      {
        "id": "bayan-flow-002",
        "flow-name": "Budget Review",
        "status-code": 403,
        "error-message": "Access denied - insufficient permissions"
      },
      {
        "id": "bayan-flow-003",
        "flow-name": "Financial Summary",
        "status-code": 200,
        "error-message": ""
      }
    ]
  }
])
```

## Verification

After importing, you should have:

- **5 teams** with Japanese names
- **12 total flows** across all teams
- Various status codes (200, 403, 404, 500) for testing the UI

Once imported, restart your Next.js dev server and visit http://localhost:3000 to see your teams!
