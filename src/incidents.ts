import { Incident } from "./interfaces";
import { IncidentType } from "./types";

const incidents = () => {
  const incidents: Incident[] = [];

  const addIncident = (incidentType: IncidentType) => (url: string) => {
    incidents.push({
      type: incidentType,
      timestamp: new Date(),
      url,
    });
  };

  const addUPIncident = addIncident(IncidentType.UP);
  const addDOWNIncident = addIncident(IncidentType.DOWN);
  const get = () => [...incidents];

  return {
    get,
    addUPIncident,
    addDOWNIncident,
  };
};

export default incidents;
