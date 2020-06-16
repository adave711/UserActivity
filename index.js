var express = require("express"); // use npm install express
var http = require("http");
const dao = require("./dao");
const bodyParser = require("body-parser");
//const uuidv4 = require("uuid/v4");
var cors = require("cors");
module.exports = dao;
var uuid = require("./user_session_gen");

var app = express();

app.use(
  cors({
    origin: ["http://gis.streetlogix.com", (Credential = true)],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://gis.streetlogix.com");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // res.header(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  // );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/", function (req, res, next) {
  res.send("api is running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Application running on Port number" + process.env.PORT);
});
