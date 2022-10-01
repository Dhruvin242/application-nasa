const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://nasa-api:BX8gtIZz6zPXTezZ@nasacluster.jjtzxtx.mongodb.net/nasa?retryWrites=true&w=majority";

const { loadPlanetData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);

mongoose.connection.once('open',() => {
  console.log('Mongodb connection ready..');
});

mongoose.connection.on('error',(err) => {
  console.log(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}...`);
  });
}

startServer();
