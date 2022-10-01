const planets = require("./planet.mongo");

const fs = require("fs");
const csv = require("csv-parse");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream("data1.csv")
      .pipe(
        csv.parse({
          comment: "#",
          columns: true,
          relax_quotes: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      })
      .on("end", async () => {
        const countplanet = (await sendPlanets()).length;
        console.log(`${countplanet} habitable planets found!`);
        resolve();
      });
  });
}

async function sendPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanets(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetData,
  sendPlanets,
};
