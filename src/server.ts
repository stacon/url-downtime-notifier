import express, { Request, Response } from "express";
import urlChecker = require("./urlChecker");

const app = express();
const port: number = 3000;

// Expose an endpoint for retrieving incidents
app.get("/incidents", (req: Request, res: Response) => {
  res.json(urlChecker.getIncidents());
});

const startServer = (): void => {
  app.listen(port, () => {
    console.log(
      `Incidents information server is running at http://localhost:${port}`
    );
  });
};

export = {
  startServer,
};
