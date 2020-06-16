const { Client } = require("pg");

let client = {};

function connect() {
  client = new Client({
    host: "streetlogixdev.cl4szaa1o9du.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "client_db",
    user: "streetlogix",
    password: "V0ters!23",
  });

  client.connect((error) => {
    console.log("connected");
    if (error) {
      throw error;
    }
  });
}

function query(query, values, resultCallback) {
  client.query(query, values, (error, result) => {
    if (error) {
      throw error;
    }
    resultCallback(result);
  });
}

function disconnect() {
  client.end();
}

module.exports = {
  connect: connect,
  disconnect: disconnect,
  query: query,
};
