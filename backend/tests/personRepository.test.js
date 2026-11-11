const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const db = require("../db");
const personRepository = require("../repositories/personRepository");

const originalQuery = db.query;

beforeEach(() => {
  db.query = async () => ({
    rows: [{ id: 1, nome: "Lucas", email: "lucas@email.com" }]
  });
});

afterEach(() => {
  db.query = originalQuery;
});

test("deve criar uma pessoa no banco", async () => {
  let parametros;

  db.query = async (sql, values) => {
    assert.match(sql, /INSERT INTO persons/i);
    assert.match(sql, /nome, email/i);
    assert.match(sql, /VALUES \(\$1, \$2\)/i);
    assert.match(sql, /RETURNING \*/i);

    parametros = values;

    return {
      rows: [{ id: 1, nome: values[0], email: values[1] }]
    };
  };

  const resultado = await personRepository.criar("Lucas", "lucas@email.com");

  assert.deepEqual(parametros, ["Lucas", "lucas@email.com"]);
  assert.equal(resultado.nome, "Lucas");
  assert.equal(resultado.email, "lucas@email.com");
});

test("deve listar todas as pessoas", async () => {
  db.query = async (sql) => {
    assert.match(sql, /SELECT \* FROM persons/i);

    return {
      rows: [{ id: 1, nome: "Lucas", email: "lucas@email.com" }]
    };
  };

  const resultado = await personRepository.listar();

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nome, "Lucas");
});

test("deve deletar uma pessoa pelo ID", async () => {
  let parametros;

  db.query = async (sql, values) => {
    assert.match(sql, /DELETE FROM persons/i);
    assert.match(sql, /WHERE id = \$1/i);
    assert.match(sql, /RETURNING \*/i);

    parametros = values;

    return { rows: [{ id: 1 }] };
  };

  const resultado = await personRepository.deletar(1);

  assert.deepEqual(parametros, [1]);
  assert.equal(resultado.id, 1);
});

test("deve retornar undefined ao deletar pessoa inexistente", async () => {
  db.query = async (sql) => {
    assert.match(sql, /DELETE FROM persons/i);
    return { rows: [] };
  };

  const resultado = await personRepository.deletar(999);

  assert.equal(resultado, undefined);
});

