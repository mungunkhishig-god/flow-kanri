# Testing the /api/calculate Endpoint

## Overview

The `/api/calculate` endpoint is used to update flow status after performing calculations. When you POST to this endpoint, it will update the flow in MongoDB and the changes will appear in the UI within 5-10 seconds due to auto-refresh.

## Endpoint Details

- **URL**: `http://localhost:3000/api/calculate`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Request Format

### Required Fields

```json
{
  "teamId": "string", // MongoDB ObjectId of the team
  "flowId": "string", // Flow ID (e.g., "khadaan-flow-001")
  "params": {} // Optional: calculation parameters
}
```

### Example Request

```json
{
  "teamId": "675a1234567890abcdef1234",
  "flowId": "khadaan-flow-001",
  "params": {
    "calculation_type": "daily_report",
    "data_source": "mining_sensors"
  }
}
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "result": {
    "statusCode": 200,
    "errorMessage": ""
  }
}
```

### Error Response (400)

```json
{
  "success": false,
  "error": "teamId and flowId are required"
}
```

### Error Response (404)

```json
{
  "success": false,
  "error": "Flow not found or not updated"
}
```

## How to Test

### Method 1: Using curl (Command Line)

First, get your team IDs from the database or API:

```bash
# Get all teams to find team IDs
curl http://localhost:3000/api/teams
```

Then test the calculate endpoint:

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "YOUR_TEAM_ID_HERE",
    "flowId": "khadaan-flow-001"
  }'
```

### Method 2: Using PowerShell

```powershell
# Get teams first
Invoke-RestMethod -Uri "http://localhost:3000/api/teams" -Method Get

# Test calculate endpoint
$body = @{
    teamId = "YOUR_TEAM_ID_HERE"
    flowId = "khadaan-flow-001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/calculate" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Method 3: Using Postman or Insomnia

1. **Create a new POST request**
2. **URL**: `http://localhost:3000/api/calculate`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "teamId": "675a1234567890abcdef1234",
     "flowId": "khadaan-flow-001"
   }
   ```
5. **Send** the request

### Method 4: Using the Browser Console

1. Open your app at `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this JavaScript:

```javascript
// First, get a team ID
fetch("/api/teams")
  .then((r) => r.json())
  .then((teams) => {
    console.log("Teams:", teams);
    const teamId = teams[0]._id;
    const flowId = teams[0].flows[0].id;

    // Now test the calculate endpoint
    return fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, flowId }),
    });
  })
  .then((r) => r.json())
  .then((result) => console.log("Result:", result));
```

## Getting Team IDs and Flow IDs

### Quick Reference Script

Run this in your terminal to get all team and flow IDs:

```bash
curl http://localhost:3000/api/teams | jq '.[] | {teamId: ._id, teamName: .name, flows: [.flows[].id]}'
```

Or in PowerShell:

```powershell
$teams = Invoke-RestMethod -Uri "http://localhost:3000/api/teams"
$teams | ForEach-Object {
    [PSCustomObject]@{
        TeamId = $_._id
        TeamName = $_.name
        FlowIds = $_.flows.id -join ", "
    }
} | Format-Table
```

## Current Flow IDs in Database

Based on the seed data, here are the available flow IDs:

### ハダーン (Khadaan)

- `khadaan-flow-001` - Daily Mining Report
- `khadaan-flow-002` - Equipment Status

### ノマッズ (Nomads)

- `nomads-flow-001` - Travel Logistics
- `nomads-flow-002` - Route Planning

### テンゲル (Tenger)

- `tenger-flow-001` - Sky Monitoring
- `tenger-flow-002` - Weather Analysis
- `tenger-flow-003` - Satellite Data

### カシミア (Cashmere)

- `cashmere-flow-001` - Production Report
- `cashmere-flow-002` - Quality Check

### バヤン (Bayan)

- `bayan-flow-001` - Resource Allocation
- `bayan-flow-002` - Budget Review
- `bayan-flow-003` - Financial Summary

## What Happens When You POST

1. **Request Received**: The endpoint receives your POST request
2. **Validation**: Checks that `teamId` and `flowId` are provided
3. **Calculation** (Placeholder): Currently returns status 200 with no error
4. **Database Update**: Updates the flow's `status-code` and `error-message` in MongoDB
5. **Response**: Returns success/failure result
6. **Auto-Refresh**: Within 5-10 seconds, the UI will automatically refresh and show the updated status

## Testing Real-time Updates

To see the real-time update in action:

1. **Open the app** at `http://localhost:3000`
2. **Select a team** from the sidebar
3. **Note the current status** of a flow
4. **In another terminal/tool**, send a POST request to update that flow
5. **Watch the UI** - within 5-10 seconds, you should see the status update automatically!

## Customizing the Calculation Logic

Currently, the `/api/calculate` endpoint has placeholder logic. To customize it:

1. Open `app/api/calculate/route.ts`
2. Find the calculation logic section (around line 18-23)
3. Replace with your actual calculation logic
4. Update the `statusCode` and `errorMessage` based on your calculation results

Example:

```typescript
// Your custom calculation logic
const calculationResult = await performYourCalculation(params);

const updated = await updateFlow(teamId, flowId, {
  "status-code": calculationResult.success ? 200 : 500,
  "error-message": calculationResult.error || "",
});
```

## Tips

- **Team IDs change** each time you re-seed the database, so always fetch fresh IDs
- **Flow IDs are stable** as defined in the seed script
- **Auto-refresh** means you don't need to manually reload the page to see changes
- **Check the logs page** (`/logs`) to see all flow updates with timestamps
- **Status codes** are color-coded in the UI (green=2xx, red=4xx, orange=5xx)

## Troubleshooting

**404 Error**: The team ID or flow ID doesn't exist

- Solution: Fetch current team IDs from `/api/teams`

**400 Error**: Missing required fields

- Solution: Ensure both `teamId` and `flowId` are in the request body

**500 Error**: Server error

- Solution: Check the terminal logs for detailed error messages
