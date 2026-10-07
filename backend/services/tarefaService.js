const tarefaRepository = require("../repositories/tarefaRepository");

const criar = async (titulo, descricao) => {
  return tarefaRepository.criar(titulo, descricao);
};

const listar = async () => {
  return tarefaRepository.listar();
};

const deletar = async (id) => {
  const tarefa = await tarefaRepository.deletar(id);

  if (!tarefa) {
    const error = new Error("Tarefa não encontrada");
    error.status = 404;
    throw error;
  }

  return {
    message: "Tarefa deletada com sucesso"
  };
};

const atribuir = async (id, nome) => {
  return tarefaRepository.atribuir(id, nome);
};

const atualizarStatus = async (id, status) => {
  return tarefaRepository.atualizarStatus(id, status);
};

const contarPorStatus = async () => {
  const tarefas = await tarefaRepository.contarPorStatus();

  const resposta = {
    pendente: 0,
    em_andamento: 0,
    concluida: 0
  };

  tarefas.forEach((tarefa) => {
    resposta[tarefa.status] = Number(tarefa.total);
  });

  return resposta;
};

module.exports = {
  criar,
  listar,
  deletar,
  atribuir,
  atualizarStatus,
  contarPorStatus
};