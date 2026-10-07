const db = require("../db");

const criar = async (titulo, descricao) => {
  const result = await db.query(
    "INSERT INTO tarefas (titulo, descricao) VALUES ($1, $2) RETURNING *",
    [titulo, descricao]
  );

  return result.rows[0];
};

const listar = async () => {
  const result = await db.query(`
    SELECT t.*, p.nome AS responsavel
    FROM tarefas t
    LEFT JOIN persons p ON p.id = t.person_id
    ORDER BY t.criada_em DESC
  `);

  return result.rows;
};

const deletar = async (id) => {
  const result = await db.query(
    "DELETE FROM tarefas WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

const atribuir = async (id, nome) => {
  const personResult = await db.query(
    "SELECT id FROM persons WHERE nome = $1",
    [nome]
  );

  if (personResult.rows.length === 0) {
    const error = new Error("Pessoa não encontrada");
    error.status = 404;
    throw error;
  }

  const personId = personResult.rows[0].id;

  const result = await db.query(
    "UPDATE tarefas SET person_id = $1 WHERE id = $2 RETURNING *",
    [personId, id]
  );

  return result.rows[0];
};

const atualizarStatus = async (id, status) => {
  const result = await db.query(
    "UPDATE tarefas SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  return result.rows[0];
};

const contarPorStatus = async () => {
  const result = await db.query(`
    SELECT status, COUNT(*) AS total
    FROM tarefas
    GROUP BY status
  `);

  return result.rows;
};

module.exports = {
  criar,
  listar,
  deletar,
  atribuir,
  atualizarStatus,
  contarPorStatus
};