const db = require("../db");

const criar = async (nome, email) => {
  const result = await db.query(
    "INSERT INTO persons (nome, email) VALUES ($1, $2) RETURNING *",
    [nome, email]
  );

  return result.rows[0];
};

const listar = async () => {
  const result = await db.query("SELECT * FROM persons");

  return result.rows;
};

const deletar = async (id) => {
  const result = await db.query(
    "DELETE FROM persons WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  criar,
  listar,
  deletar
};