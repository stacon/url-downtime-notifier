import axios, { AxiosResponse } from "axios";
import notifier from "node-notifier";
import packageJson from "../package.json";
import incidents from "./incidents";
import { Incident } from "./interfaces";
import { IncidentType } from "./types";

const urlsToCheck: string[] = packageJson.config.urlsToCheck;
const SECOND = 1000;
const incidentsState = incidents();
let checkInterval: number = 60 * SECOND; // Check every minute

const checkUrl = async (url: string): Promise<void> => {
  const currentIncidents: Incident[] = incidentsState.get();
  const lastIncident: Incident | undefined =
    currentIncidents.filter((incident) => incident.url === url)[
      currentIncidents.length - 1
    ] ?? undefined;

  try {
    const response: AxiosResponse = await axios.get(url);

    if (response.status === 200) {
      checkInterval = 60 * SECOND; // Reset check interval to 1 minute
      console.log(`${url} is responding with a 200 status code.`);

      if (lastIncident?.type === IncidentType.DOWN) {
        incidentsState.addUPIncident(url);

        notifier.notify({
          title: "URL Check",
          message: `${url} is back up!`,
        });
      }
    } else {
      throw new Error(`Non-200 status code: ${response.status}`);
    }
  } catch (error: unknown) {
    checkInterval = 5 * SECOND; // Check every 5 seconds if there's an error
    if (error instanceof Error) {
      if (lastIncident?.type === IncidentType.UP) {
        incidentsState.addDOWNIncident(url);

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

const getIncidents = (): Incident[] => incidentsState.get();

export = {
  startCheckingUrls,
  getIncidents,
};
