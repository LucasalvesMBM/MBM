const personRepository = require("../repositories/personRepository");

const criar = async (nome, email) => {
  return personRepository.criar(nome, email);
};

const listar = async () => {
  return personRepository.listar();
};

const deletar = async (id) => {
  const pessoa = await personRepository.deletar(id);

  if (!pessoa) {
    const error = new Error("Pessoa não encontrada");
    error.status = 404;
    throw error;
  }

  return {
    message: "Pessoa deletada com sucesso"
  };
};

module.exports = {
  criar,
  listar,
  deletar
};