
const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const tarefaRepository = require("../repositories/tarefaRepository");
const tarefaService = require("../services/tarefaService");

const original = { ...tarefaRepository };

beforeEach(() => {
  tarefaRepository.criar = async (...args) => ({ id: 1, titulo: args[0], descricao: args[1] });
  tarefaRepository.listar = async () => [];
  tarefaRepository.deletar = async () => ({ id: 1 });
  tarefaRepository.atribuir = async (id, nome) => ({ id, responsavel: nome });
  tarefaRepository.atualizarStatus = async (id, status) => ({ id, status });
  tarefaRepository.contarPorStatus = async () => [];
});

afterEach(() => {
  Object.assign(tarefaRepository, original);
});

test("deve criar uma tarefa", async () => {
  const resultado = await tarefaService.criar("Estudar", "Estudar testes");

  assert.equal(resultado.titulo, "Estudar");
  assert.equal(resultado.descricao, "Estudar testes");
});

test("deve listar as tarefas", async () => {
  tarefaRepository.listar = async () => [{ id: 1, titulo: "Estudar" }];

  const resultado = await tarefaService.listar();

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, "Estudar");
});

test("deve deletar uma tarefa existente", async () => {
  const resultado = await tarefaService.deletar(1);

  assert.equal(resultado.message, "Tarefa deletada com sucesso");
});

test("deve lançar erro ao deletar tarefa inexistente", async () => {
  tarefaRepository.deletar = async () => undefined;

  await assert.rejects(
  tarefaService.deletar(999),
  (error) =>
    error.status === 404 &&
    error.message === "Tarefa não encontrada"
  );
});

test("deve atribuir uma tarefa a uma pessoa", async () => {
  const resultado = await tarefaService.atribuir(1, "Lucas");

  assert.equal(resultado.id, 1);
  assert.equal(resultado.responsavel, "Lucas");
});

test("deve atualizar o status de uma tarefa", async () => {
  const resultado = await tarefaService.atualizarStatus(1, "concluida");

  assert.equal(resultado.status, "concluida");
});

test("deve retornar contagem zerada quando não existem tarefas", async () => {
  const resultado = await tarefaService.contarPorStatus();

  assert.deepEqual(resultado, {
    pendente: 0,
    em_andamento: 0,
    concluida: 0
  });
});

test("deve contar tarefas por status", async () => {
  tarefaRepository.contarPorStatus = async () => [
    { status: "pendente", total: "3" },
    { status: "em_andamento", total: "2" },
    { status: "concluida", total: "5" }
  ];

  const resultado = await tarefaService.contarPorStatus();

  assert.deepEqual(resultado, {
    pendente: 3,
    em_andamento: 2,
    concluida: 5
  });
});
