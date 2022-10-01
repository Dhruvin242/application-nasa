const express = require("express");
const {
  getAllLaunches,
  httpCreateLaunch,
  httpLaunchAbort,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", httpCreateLaunch);
launchesRouter.delete("/:id", httpLaunchAbort);

module.exports = launchesRouter;
