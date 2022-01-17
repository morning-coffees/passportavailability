var http = require("https");
var FormData = require("form-data");
var data = new FormData();
data.append("fromDate", "2022-01-19");
data.append("toDate", "2022-07-31");
data.append("siteId", "486");
data.append("requestedSlots", "1");
var options = {
  method: "POST",
  host: "203.177.56.122",
  path: "/appointment/timeslot/available",
  headers: {
    __requestverificationtoken:
      "ZcHJ05jGAVlecKNmgvAgF-nbjzGyymkC0dK79HWMebVdC9cbuK4MHQLf_6tM36EP_m2ylHyUGPwUYZSYgi3oeeZLx3E1",
    cookie:
      "cf_chl_2=81247ed8148f54f; cf_chl_prog=x11; cf_clearance=VSg6O6C2mlLj9.2lTyFac9SGo0A0XC0fo8UjT7558x0-1642349763-0-150; BIGipServerpool_OAS=369889452.20480.0000; __cf_bm=j7IczJKd_Ed7kXqv9stm0VLxpUmjzBxpWlkKsfonP3U-1642349763-0-AcE80NIe/McUMZpCkUUBGMJh2f8bi+SPCoOLf3l2gGPmsAvjKHSg/4nSypGMP747xGV+WdBZGtnr7YHLgBx3nwE=; ASP.NET_SessionId=qtbwpca0mj0ele0xmsucpm4i; __RequestVerificationToken=vIXF97wfftA1a_yk9xTiam7oejmG5xNPrJOWwIufw0hVt0sNg3js0nUA9xt5KNgYhUSHVoNutro1SP7ncuxnvozYrRw1; TS015a4cf5=01c23a1d8b67f0b9bbf1bef1ed2c2ad15820b52087f6e8463e3c2b4e7c68ddf86210d5a71a98b6dd5fc8ba3d4fbe8b487cb169c00b6691e91ac39d5743da34057d852c96320e2cc4df69edc7bdb3758ac25cca1cca737e0973d68e49a6dcd957334798d9b9",
    ...data.getHeaders(),
  },
  rejectUnauthorized: false,
};

console.log("started..");
var req = http.request(options, (res) => {
  let responseBody = "";
  console.log("STATUS: " + res.statusCode);
  console.log("HEADERS: " + JSON.stringify(res.headers));
  res.setEncoding("utf8");
  res.on("data", function (chunk) {
    responseBody += chunk;
  });
  res.on("end", function () {
    console.log(responseBody);
  });
});
req.on("error", (err) => {
  console.log(err);
});

data.pipe(req);
req.end();
console.log("ended..");
