// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require("aws-sdk");
var ses = new aws.SES({ region: "ap-southeast-1" });
var http = require("https");
var FormData = require("form-data");

exports.handler = async function (event) {
  var passportHost = process.env.passportHost;
  var passportPath = process.env.passportPath;
  var passportVerificationToken = process.env.passportVerificationToken;
  var passportCookie = process.env.passportCookie;
  var requestedSlots = process.env.requestedSlots;
  var siteIds = process.env.siteIds.split(",");

  var currentDate = new Date().toISOString().split("T")[0];
  var date1YearAfter = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  )
    .toISOString()
    .split("T")[0];
  const promisesToAwait = [];
  for (const siteId of siteIds) {
    console.log("Search initiated for site " + siteId);
    var data = new FormData();
    data.append("fromDate", currentDate);
    data.append("toDate", date1YearAfter);
    data.append("siteId", siteId);
    data.append("requestedSlots", requestedSlots);
    var options = {
      method: "POST",
      host: passportHost,
      path: passportPath,
      headers: {
        __requestverificationtoken: passportVerificationToken,
        cookie: passportCookie,
        ...data.getHeaders(),
      },
      rejectUnauthorized: false,
    };
    promisesToAwait.push(requestPromise(options, data, siteId));
  }
  await Promise.all(promisesToAwait);

  async function requestPromise(options, data, siteId) {
    return new Promise((resolve, reject) => {
      var req = http.request(options, (res) => {
        let responseBody = "";
        console.log("STATUS: " + res.statusCode);
        console.log("HEADERS: " + JSON.stringify(res.headers));
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
          responseBody += chunk;
        });
        res.on("end", async function () {
          console.log(responseBody);
          if (responseBody.search("true") > 0) {
            await sendEmail(
              "There is a slot available at " + siteId,
              responseBody
            );
            console.log("There is available");
          } else {
            await sendEmail("No slot available at " + siteId, responseBody);
            console.log("No Available");
          }
        });
      });
      req.on("error", (err) => {
        console.log(err);
      });

      data.pipe(req);
      req.end();
    });
  }
  async function sendEmail(body, result) {
    var params = {
      Destination: {
        ToAddresses: ["garillo.cl@gmail.com"],
      },
      Message: {
        Body: {
          Text: {
            Data: body + "\n\nSee result: \n" + result,
          },
        },

        Subject: { Data: "PASSPORT SLOT CHECKED" },
      },
      Source: "christianlucenogarillo@gmail.com",
    };

    return ses.sendEmail(params).promise();
  }
};
