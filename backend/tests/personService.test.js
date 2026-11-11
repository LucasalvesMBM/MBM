
const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const personRepository = require("../repositories/personRepository");
const personService = require("../services/personService");

const original = { ...personRepository };

beforeEach(() => {
  personRepository.criar = async (nome, email) => ({ id: 1, nome, email });
  personRepository.listar = async () => [];
  personRepository.deletar = async () => ({ id: 1 });
});

afterEach(() => {
  Object.assign(personRepository, original);
});

test("deve criar uma pessoa", async () => {
  const resultado = await personService.criar("Lucas", "lucas@email.com");

  assert.equal(resultado.nome, "Lucas");
  assert.equal(resultado.email, "lucas@email.com");
});

test("deve listar as pessoas", async () => {
  personRepository.listar = async () => [
    { id: 1, nome: "Lucas", email: "lucas@email.com" }
  ];

  const resultado = await personService.listar();

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nome, "Lucas");
});

test("deve deletar uma pessoa existente", async () => {
  const resultado = await personService.deletar(1);

  assert.equal(resultado.message, "Pessoa deletada com sucesso");
});

test("deve lançar erro ao deletar pessoa inexistente", async () => {
  personRepository.deletar = async () => undefined;

  await assert.rejects(
  personService.deletar(999),
  (error) =>
    error.status === 404 &&
    error.message === "Pessoa não encontrada"
);
});
