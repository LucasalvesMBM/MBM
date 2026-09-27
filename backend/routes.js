const express = require("express");
const router = express.Router();
const db = require("./db");


// -------------------------------------------------------------------
// Deletar tarefa
// -------------------------------------------------------------------
router.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// Criar pessoa
// -------------------------------------------------------------------
router.post("/persons", async (req, res) => {
  const { nome, email } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO persons (nome, email) VALUES ($1, $2) RETURNING *",
      [nome, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// Criar tarefa
// -------------------------------------------------------------------
router.post("/tarefas", async (req, res) => {
  const { titulo, descricao } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO tarefas (titulo, descricao) VALUES ($1, $2) RETURNING *",
      [titulo, descricao]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// Atribuir tarefa a uma pessoa (usando o NOME da pessoa)
// -------------------------------------------------------------------
router.put("/tarefas/:id/atribuir", async (req, res) => {
  const { nome } = req.body;
  const { id } = req.params;

  try {
    // 1. Buscar ID da pessoa pelo nome
    const personResult = await db.query(
      "SELECT id FROM persons WHERE nome = $1",
      [nome]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    const personId = personResult.rows[0].id;

    // 2. Atribuir tarefa
    const result = await db.query(
      "UPDATE tarefas SET person_id = $1 WHERE id = $2 RETURNING *",
      [personId, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------------------------
// Atualizar status
// -------------------------------------------------------------------
router.put("/tarefas/:id/status", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE tarefas SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// Listar tarefas
// -------------------------------------------------------------------
router.get("/tarefas", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, p.nome AS responsavel
      FROM tarefas t
      LEFT JOIN persons p ON p.id = t.person_id
      ORDER BY t.criada_em DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// Listar todas as pessoas
// -------------------------------------------------------------------
router.get("/persons", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM persons");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// Deletar pessoa
// -------------------------------------------------------------------
router.delete("/persons/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM persons WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    res.json({ message: "Pessoa deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Atualizar status da tarefa
// ----------------------------------------------------
router.put("/tarefas/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      `UPDATE tarefas SET status = $1 WHERE id = $2`,
      [status, id]
    );

    res.json({ message: "Status atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// ----------------------------------------------------
// Conta tarefas com determinados Status
// ----------------------------------------------------
router.get("/tarefas/status/count", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT status, COUNT(*) AS total
      FROM tarefas
      GROUP BY status;
    `);

    const resposta = {
      pendente: 0,
      em_andamento: 0,
      concluida: 0
    };

    result.rows.forEach(r => {
      resposta[r.status] = Number(r.total);
    });

    res.json(resposta);
  } catch (error) {
    console.error("Erro ao contar tarefas:", error);
    res.status(500).json({ error: "Erro ao contar tarefas" });
  }
});


module.exports = router;
