import { IncidentType } from "../types";

interface Incident {
  type: IncidentType;
  timestamp: Date;
  url: string;
}

export { Incident };
