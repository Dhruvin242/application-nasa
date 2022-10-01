const mongoose = require("mongoose");
const launchesRouter = require("../routes/launches/launches.routes");

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Planet',planetSchema);