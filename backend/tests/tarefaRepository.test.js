const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const db = require("../db");
const tarefaRepository = require("../repositories/tarefaRepository");

const originalQuery = db.query;

beforeEach(() => {
  db.query = async () => ({
    rows: [{ id: 1, titulo: "Estudar", descricao: "Testes" }]
  });
});

afterEach(() => {
  db.query = originalQuery;
});

test("deve criar uma tarefa no banco", async () => {
  let parametros;

  db.query = async (sql, values) => {
    assert.match(sql, /INSERT INTO tarefas/i);
    assert.match(sql, /titulo, descricao/i);
    assert.match(sql, /VALUES \(\$1, \$2\)/i);
    assert.match(sql, /RETURNING \*/i);

    parametros = values;

    return {
      rows: [{ id: 1, titulo: values[0], descricao: values[1] }]
    };
  };

  const resultado = await tarefaRepository.criar("Estudar", "Testes");

  assert.deepEqual(parametros, ["Estudar", "Testes"]);
  assert.equal(resultado.titulo, "Estudar");
  assert.equal(resultado.descricao, "Testes");
});

test("deve listar as tarefas com seus responsáveis", async () => {
  db.query = async (sql) => {
    assert.match(sql, /SELECT t\.\*/i);
    assert.match(sql, /LEFT JOIN persons/i);
    assert.match(sql, /p\.nome AS responsavel/i);
    assert.match(sql, /ORDER BY t\.criada_em DESC/i);

    return {
      rows: [{ id: 1, titulo: "Estudar", responsavel: "Lucas" }]
    };
  };

  const resultado = await tarefaRepository.listar();

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, "Estudar");
  assert.equal(resultado[0].responsavel, "Lucas");
});

test("deve deletar uma tarefa pelo ID", async () => {
  let parametros;

  db.query = async (sql, values) => {
    assert.match(sql, /DELETE FROM tarefas/i);
    assert.match(sql, /WHERE id = \$1/i);
    assert.match(sql, /RETURNING \*/i);

    parametros = values;

    return { rows: [{ id: 1 }] };
  };

  const resultado = await tarefaRepository.deletar(1);

  assert.deepEqual(parametros, [1]);
  assert.equal(resultado.id, 1);
});

test("deve retornar undefined ao deletar tarefa inexistente", async () => {
  db.query = async (sql) => {
    assert.match(sql, /DELETE FROM tarefas/i);
    return { rows: [] };
  };

  const resultado = await tarefaRepository.deletar(999);

  assert.equal(resultado, undefined);
});

test("deve atribuir tarefa a uma pessoa existente", async () => {
  let chamadas = 0;

  db.query = async (sql, values) => {
    chamadas++;

    if (chamadas === 1) {
      assert.match(sql, /SELECT id FROM persons/i);
      assert.match(sql, /WHERE nome = \$1/i);
      assert.deepEqual(values, ["Lucas"]);

      return { rows: [{ id: 10 }] };
    }

    assert.match(sql, /UPDATE tarefas SET person_id = \$1/i);
    assert.match(sql, /WHERE id = \$2/i);
    assert.match(sql, /RETURNING \*/i);
    assert.deepEqual(values, [10, 1]);

    return { rows: [{ id: 1, person_id: 10 }] };
  };

  const resultado = await tarefaRepository.atribuir(1, "Lucas");

  assert.equal(chamadas, 2);
  assert.equal(resultado.person_id, 10);
});

test("deve lançar erro quando a pessoa não existe ao atribuir tarefa", async () => {
  db.query = async (sql, values) => {
    assert.match(sql, /SELECT id FROM persons/i);
    assert.match(sql, /WHERE nome = \$1/i);
    assert.deepEqual(values, ["Pessoa inexistente"]);

    return { rows: [] };
  };

  await assert.rejects(
    tarefaRepository.atribuir(1, "Pessoa inexistente"),
    (error) =>
      error.status === 404 &&
      error.message === "Pessoa não encontrada"
  );
});

test("deve atualizar o status de uma tarefa", async () => {
  let parametros;

  db.query = async (sql, values) => {
    assert.match(sql, /UPDATE tarefas SET status = \$1/i);
    assert.match(sql, /WHERE id = \$2/i);
    assert.match(sql, /RETURNING \*/i);

    parametros = values;

    return { rows: [{ id: 1, status: "concluida" }] };
  };

  const resultado = await tarefaRepository.atualizarStatus(1, "concluida");

  assert.deepEqual(parametros, ["concluida", 1]);
  assert.equal(resultado.status, "concluida");
});

test("deve contar tarefas agrupadas por status", async () => {
  db.query = async (sql) => {
    assert.match(sql, /SELECT status, COUNT\(\*\) AS total/i);
    assert.match(sql, /FROM tarefas/i);
    assert.match(sql, /GROUP BY status/i);

    return {
      rows: [
        { status: "pendente", total: "3" },
        { status: "concluida", total: "2" }
      ]
    };
  };

  const resultado = await tarefaRepository.contarPorStatus();

  assert.equal(resultado.length, 2);
  assert.equal(resultado[0].status, "pendente");
  assert.equal(resultado[0].total, "3");
});
