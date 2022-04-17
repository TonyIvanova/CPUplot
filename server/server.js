const express = require("express");
const app = express();
const port = 3300;
const getMetrics = require("./getMetricStatistics.js");
const cors = require("cors");

// setting cors to allow cross-origin requests
const corsOptions = {
  origin: "*",
  credentials: true, 
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.get("/api/metrics", async (req, res) => {
  let timePeriod;
  let period;
  let privateIP;
  if (req.query.timePeriod && req.query.period && req.query.privateIP) {
    timePeriod = req.query.timePeriod;
    period = req.query.period;
    privateIP = req.query.privateIP;

    try {
      const metrics = await getMetrics(timePeriod, period, privateIP);
      res.status(200).send(metrics);
    } catch (err) {
      res.status(400).send("Please, provide correct parameters!");
    }
  } else {
    res.status(400).send("Please, provide all parameters!");
  }
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
