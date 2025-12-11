# AI Code Editor Prompt: Minimal Modern Next.js Website with MongoDB

## Project Overview
You will build a **minimal, modern-designed Next.js website** using the following stack:

- **Next.js (App Router, TypeScript)**
- **Tailwind CSS**
- **React Compiler enabled**
- **Yarn**
- **No `src/` directory** — all code is in root `app/`, `components/`, etc.
- **Import alias:** `@/`
- **MongoDB Atlas** as the NoSQL database (teams + flows)
- **Flows nested inside teams** (document-based)

This project should include a clean UI with:
- A **sidebar** listing **team names**
- A **main content page** displaying a **list of flows** per team
- A **POST API endpoint** to receive a request and perform **calculations**
- Modern styling (glassmorphism / minimal spacing / soft shadows)

---

## MongoDB Schema
**Collection:** `teams`

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

- Each team has multiple flows
- `/api/calculate` can target a specific flow by `id`

---

## Requirements for the AI Coding Agent

### 1. Project Structure
Generate this structure:

```
app/
  layout.tsx
  page.tsx
  api/
    calculate/route.ts
components/
  Sidebar.tsx
  FlowList.tsx
lib/
  mongodb.ts
types/
  team.ts
public/
styles/
  globals.css
```

### 2. MongoDB Integration
- File: `lib/mongodb.ts`
- Connect using MongoDB URI (`process.env.MONGODB_URI`)
- Functions:
  - `getTeams()` — fetch all teams
  - `getTeamById(teamId)` — fetch single team and its flows
  - `updateFlow(teamId, flowId, data)` — update flow after calculation

### 3. Sidebar Component
- Fetch all teams (`getTeams()`)
- Display team names vertically
- Highlight selected team
- Sidebar should collapse on mobile
- Clicking a team updates main flow list

### 4. Flow List Component
- Props: `teamId`
- Fetch team data (`getTeamById(teamId)`)
- Display `flows` in clean card format
- Each card shows:
  - `flow-name`
  - `status-code` (color-coded, e.g., green 200, red 400)
  - `error-message` (if present)
- Responsive layout
- Smooth animations for hover/focus

### 5. API Endpoint (`/api/calculate`)
- Path: `app/api/calculate/route.ts`
- Must:
  1. Accept **POST** request with JSON: `{ teamId, flowId, params }`
  2. Run **calculation logic** (placeholder for now)
  3. Update the flow in MongoDB (`updateFlow`) with results
  4. Return JSON response `{ success: true/false, result }`

### 6. UI Design Requirements
- Minimal, modern, responsive
- Tailwind classes for rounded corners (`rounded-xl`), soft shadows (`shadow-md shadow-black/5`)
- Card-based layout for flows
- Sidebar fixed on desktop, collapsible on mobile
- Smooth transitions: opacity, translate, scale
- Adequate spacing: `p-4`, `m-4` etc.

### 7. Tailwind Config
- Enable custom colors, font presets, container centering
- Compatible with React Compiler
- Optional dark mode support

### 8. React Compiler / RSC
- Use **Server Components** for fetch-heavy components (`FlowList`, team data)
- Use **Client Components** for interactivity (`Sidebar`, buttons)
- Avoid global mutations
- Correct use of hooks

### 9. Additional Behavior
- Clicking a team updates flow list automatically
- `/api/calculate` can be called from the frontend when needed
- All MongoDB functions isolated in `lib/mongodb.ts`
- Fully typed with TypeScript interfaces

---

## TypeScript Types

**types/team.ts**

```ts
export interface Flow {
  id: string;
  "flow-name": string;
  "status-code": number;
  "error-message": string;
}

export interface Team {
  _id: string;
  name: string;
  flows: Flow[];
}
```

---

## Environment Variables

```
MONGODB_URI=your-mongodb-connection-string
```

---

## Expected Deliverables
The AI coding agent should produce:

- Full code files for **Next.js + MongoDB** app
- Components (`Sidebar`, `FlowList`)  
- API route `/api/calculate`  
- MongoDB integration (`lib/mongodb.ts`)  
- Types and interfaces  
- Tailwind minimal modern styling  
- Instructions for running locally with Yarn  

---

## Notes
- Placeholder logic for `/api/calculate` for now; to be filled later  
- Ensure responsiveness and minimal modern design  
- Use import alias `@/` for clean imports
- Everything should be **downloadable, ready-to-run**  
