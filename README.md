# Flow Kanri - Team Flow Management System

A modern, minimal Next.js application for managing team flows with MongoDB integration.

## Features

- 🎨 **Modern UI Design** - Glassmorphism effects, smooth animations, and responsive layout
- 📱 **Mobile Responsive** - Collapsible sidebar for mobile devices
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences
- ⚡ **React Server Components** - Optimized performance with RSC
- 🔄 **Real-time Updates** - Dynamic flow status tracking
- 📊 **MongoDB Integration** - NoSQL database for teams and flows
- 📝 **Logging Page** - View all flows across teams with advanced filtering
- 🔍 **Advanced Filters** - Filter by team, status code, and date range
- 🗓️ **Date Tracking** - Timestamp tracking for all flow executions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB Atlas
- **Package Manager**: Yarn
- **React Compiler**: Enabled for optimized performance

## Project Structure

```
app/
  layout.tsx          # Root layout with metadata
  page.tsx            # Main page with team/flow display
  globals.css         # Global styles and Tailwind config
  api/
    teams/route.ts    # GET endpoint for fetching teams
    calculate/route.ts # POST endpoint for calculations
components/
  Sidebar.tsx         # Team navigation sidebar (client component)
  FlowList.tsx        # Flow display component (server component)
lib/
  mongodb.ts          # MongoDB connection and utilities
types/
  team.ts             # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 20+ installed
- Yarn package manager
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository** (if applicable)

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory (already created):

   ```env
   MONGODB_URI=your-mongodb-connection-string
   ```

   The current MongoDB URI is already configured. If you need to change it, update the `.env.local` file.

4. **Run the development server**:

   ```bash
   yarn dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## MongoDB Schema

### Collection: `teams`

```json
{
  "_id": "ObjectId",
  "name": "Team A",
  "flows": [
    {
      "id": "uuid",
      "flow-name": "report name",
      "status-code": 200,
      "error-message": ""
    }
  ]
}
```

## API Endpoints

### GET `/api/teams`

Fetches all teams with their flows.

**Response**:

```json
[
  {
    "_id": "string",
    "name": "Team A",
    "flows": [...]
  }
]
```

### POST `/api/calculate`

Performs calculations and updates flow status.

**Request Body**:

```json
{
  "teamId": "string",
  "flowId": "string",
  "params": {}
}
```

**Response**:

```json
{
  "success": true,
  "result": {
    "statusCode": 200,
    "errorMessage": ""
  }
}
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Design Features

- **Glassmorphism** - Translucent backgrounds with backdrop blur
- **Smooth Animations** - Hover effects and transitions
- **Color-Coded Status** - Visual status indicators (green for 2xx, red for 4xx, orange for 5xx)
- **Responsive Grid** - Adaptive layout for different screen sizes
- **Custom Scrollbar** - Styled scrollbars for better aesthetics

## Development Notes

- Uses **Server Components** by default for better performance
- **Client Components** (`"use client"`) only where interactivity is needed
- Import alias `@/` configured for clean imports
- React Compiler enabled for automatic optimizations
- Tailwind CSS v4 with custom theme configuration

## Future Enhancements

- Implement actual calculation logic in `/api/calculate`
- Add flow creation/editing functionality
- Add team management features
- Implement authentication
- Add real-time updates with WebSockets

## License

Private project for team flow management.
