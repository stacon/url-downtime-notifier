import axios, { AxiosResponse } from "axios";
import notifier from "node-notifier";
import packageJson from "../package.json";

const urlsToCheck: string[] = packageJson.config.urlsToCheck;
const checkInterval: number = 60 * 1000; // Check every minute

// Define an enum for IncidentType
enum IncidentType {
  UP = "UP",
  DOWN = "DOWN",
}

interface Incident {
  type: IncidentType;
  timestamp: Date;
  url: string;
}

let incidents: Incident[] = [];

const checkUrl = async (url: string): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.get(url);

    if (response.status === 200) {
      console.log(`${url} is responding with a 200 status code.`);
      const previousIncident: Incident | undefined = incidents.find(
        (incident) => incident.url === url && incident.type === "DOWN"
      );

      if (previousIncident) {
        const incident: Incident = {
          type: IncidentType.UP,
          timestamp: new Date(),
          url,
        };
        incidents.push(incident);
        console.log("Incident:", incident);

        notifier.notify({
          title: "URL Check",
          message: `${url} is back up!`,
        });
      }
    } else {
      throw new Error(`Non-200 status code: ${response.status}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      const previousIncident: Incident | undefined = incidents.find(
        (incident) => incident.url === url && incident.type === IncidentType.UP
      );

      if (!previousIncident) {
        const incident: Incident = {
          type: IncidentType.DOWN,
          timestamp: new Date(),
          url,
        };
        incidents.push(incident);
        console.log("Incident:", incident);

        notifier.notify({
          title: "URL Check",
          message: `Error checking ${url}: ${error.message}`,
        });
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const startCheckingUrls = (): void => {
  urlsToCheck.forEach((url) => {
    checkUrl(url);
    setInterval(() => checkUrl(url), checkInterval);
  });
};

const getIncidents = (): Incident[] => incidents;

export = {
  startCheckingUrls,
  getIncidents,
};
