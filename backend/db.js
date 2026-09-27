const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tasks_system",
  password: "Leticia10@",
  port: 5432
});

module.exports = pool;
