const axios = require("axios");
const launchesDataBase = require("./launches.mongo");

const DEFAULT_NUMBER = 100;

const SPACE_URL = "https://api.spacexdata.com/v5/launches/query";

async function populateLaunch() {
  console.log("We are Downloading the data...!");
  const response = await axios.post(SPACE_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("problem in downloading data");
    throw new Error("Launch Data download Failed..");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstlaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstlaunch) {
    console.log("Launch Data is already loaded!!!....");
  } else {
    await populateLaunch();
  }
}

async function sendGetLaunches(skip, limit) {
  return await launchesDataBase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({
      flightNumber: 1,
    })
    .skip(skip)
    .limit(limit);
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}

async function checkLaunch(launchid) {
  return await findLaunch({
    flightNumber: launchid,
  });
}

async function getLatestFN() {
  const latest_launch = await launchesDataBase.findOne().sort("-flightNumber");

  if (!latest_launch) {
    return DEFAULT_NUMBER;
  }

  return latest_launch.flightNumber;
}

async function createLaunch(launch) {
  const newFN = (await getLatestFN()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFN,
    success: true,
    upcoming: true,
    customers: ["NASA", "HASA"],
  });

  await saveLaunch(newLaunch);
}

async function abortLaunch(launchid) {
  const aborted = await launchesDataBase.updateOne(
    {
      flightNumber: launchid,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

async function saveLaunch(launch) {
  await launchesDataBase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

module.exports = {
  loadLaunchData,
  createLaunch,
  sendGetLaunches,
  checkLaunch,
  abortLaunch,
};
