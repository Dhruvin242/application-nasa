const {
  sendGetLaunches,
  createLaunch,
  checkLaunch,
  abortLaunch,
} = require("../../models/launches.model");

const { getPagenation } = require("../../service/query");

async function getAllLaunches(req, res) {
  const { skip, limit } = getPagenation(req.query);
  const launches = await sendGetLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpCreateLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Data is missing!",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Date!.",
    });
  }
  await createLaunch(launch);
  return res.status(201).json(launch);
}

async function httpLaunchAbort(req, res) {
  const launchid = Number(req.params.id);

  const exitsLaunch = await checkLaunch(launchid);
  if (!exitsLaunch) {
    return res.status(404).json({
      error: "Launch not found!",
    });
  }
  const aborted = await abortLaunch(launchid);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch is not aborted!...",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  getAllLaunches,
  httpCreateLaunch,
  httpLaunchAbort,
};
