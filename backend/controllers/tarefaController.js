const tarefaService = require("../services/tarefaService");

const criar = async (req, res, next) => {
  try {
    const { titulo, descricao } = req.body;

    const tarefa = await tarefaService.criar(titulo, descricao);

    res.json(tarefa);
  } catch (error) {
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const tarefas = await tarefaService.listar();

    res.json(tarefas);
  } catch (error) {
    next(error);
  }
};

const deletar = async (req, res, next) => {
  try {
    const resultado = await tarefaService.deletar(req.params.id);

    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

const atribuir = async (req, res, next) => {
  try {
    const tarefa = await tarefaService.atribuir(
      req.params.id,
      req.body.nome
    );

    res.json(tarefa);
  } catch (error) {
    next(error);
  }
};

const atualizarStatus = async (req, res, next) => {
  try {
    const tarefa = await tarefaService.atualizarStatus(
      req.params.id,
      req.body.status
    );

    res.json(tarefa);
  } catch (error) {
    next(error);
  }
};

const contarPorStatus = async (req, res, next) => {
  try {
    const resultado = await tarefaService.contarPorStatus();

    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criar,
  listar,
  deletar,
  atribuir,
  atualizarStatus,
  contarPorStatus
};