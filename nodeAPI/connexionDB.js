const mysql = require("mysql2");

const conx = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "arch_rep",
});

module.exports = conx;
