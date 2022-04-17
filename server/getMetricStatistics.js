//Load .env
require("dotenv").config();
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

const getMetrics = (timePeriod, period, privateIP) => {
  // Set the region and credentials
  AWS.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  //getting instance ID by IP
  const getInstanceID = (pIP) => {
    // Create EC2 service object
    var ec2 = new AWS.EC2({ region: process.env.REGION });

    var params = {
      Filters: [
        {
          Name: "private-ip-address",
          Values: [pIP], //private IP value
        },
      ],
    };

    return new Promise(function (resolve, reject) {
      ec2.describeInstances(params, function (err, data) {
        if (err) reject(err);
        else {
          try {
            let instanceId = data.Reservations[0].Instances[0].InstanceId;
            resolve(instanceId);
          } catch {
            reject("IP is not correct");
          }
        }
      });
    });
  };

  // getting metrics, with recived instance ID 
  const getMetrics = async (timePeriod, period, privateIP) => {
    // Create CloudWatch service object
    let instanceIDfor = await getInstanceID(privateIP);

    var cw = new AWS.CloudWatch({ apiVersion: "2010-08-01" });
    //setting EndTime to current date
    const endDate = new Date(Date.now()).toISOString();
    //setting startTime, where time Period is a time interval (day, week or month) in ms
    const startDate = new Date(Date.now() - timePeriod).toISOString();

    var params = {
      EndTime: endDate,
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      Period: period,
      StartTime: startDate,
      Dimensions: [
        {
          Name: "InstanceId",
          Value: instanceIDfor 
        },
      ],
      Statistics: ["Average"], //to use other type of statistics, change here and in App.js in SetDataAPI function
      
    };

    return new Promise(function (resolve, reject) {
      cw.getMetricStatistics(params, function (err, data) {
        if (err) {
          console.log("Error:", err);
          reject(err);
        } else {
          console.log("Metrics sent");

          resolve(data);
        }
      });
    });
  };

  return getMetrics(timePeriod, period, privateIP);
};

module.exports = getMetrics;
