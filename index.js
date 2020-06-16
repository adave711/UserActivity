var express = require("express"); // use npm install express
var http = require("http");
const dao = require("./dao");
const bodyParser = require("body-parser");
//const uuidv4 = require("uuid/v4");
var cors = require("cors");
module.exports = dao;
var uuid = require("./user_session_gen");

var app = express();

//app.use(cors());

app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  var allowedOrigins = [
    "http://desktop-9v12mp8:3344",
    "https://desktop-9v12mp8:3344",
    "http://gis.streetlogix.com",
    "https://gis.streetlogix.com",
  ];
  if (allowedOrigins.indexOf(req.headers.origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
// parse application/json
app.use(bodyParser.json());

app.post("/api/users/add_activities", function (req, res, next) {
  var sessionid = uuid.genUuid().substring(0, 8);

  dao.connect();
  dao.query(
    "insert into user_activities (jwt,sessionid,sessionstart,online,userId)values($1,$2,$3,$4,$5)",
    [
      req.body.jwt,
      sessionid,
      req.body.sessionstart,
      req.body.online,
      req.body.userId,
    ],
    (result) => {
      console.log(result.rowCount);
      if (result.rowCount > 0) {
        res.status(200).json({
          message: "User records added successfully",
          sessionid: sessionid,
        });
      } else {
        res.status(500).send("something went wrong");
      }
      dao.disconnect();
    }
  );
  next();
});

// app.post("/api/users/update_activities", function (req, res) {
//   var sessionid = uuid.genUuid().substring(0, 8);

//   dao.connect();
//   dao.query(
//     "update user_activities set ",
//     [
//       req.body.jwt,
//       sessionid,
//       req.body.sessionstart,
//       req.body.online,
//       req.body.userId,
//     ],
//     (result) => {
//       console.log(result.rowCount);
//       if (result.rowCount > 0) {
//         res.status(200).json({
//           data: "User records added successfully",
//           sessionid: sessionid,
//         });
//       } else {
//         res.status(500).send("something went wrong");
//       }
//       dao.disconnect();
//     }
//   );
// });

app.get("/", function (req, res) {
  res.send("api is running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Application running on Port 5000 number" + process.env.PORT);
});
