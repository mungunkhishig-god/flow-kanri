export interface Flow {
  id: string;
  "flow-name": string;
  "status-code": number;
  "error-message": string;
  timestamp?: string; // ISO date string
  lastUpdated?: string; // ISO date string
}

export interface Team {
  _id: string;
  name: string;
  flows: Flow[];
}

export interface LogEntry extends Flow {
  teamId: string;
  teamName: string;
}
