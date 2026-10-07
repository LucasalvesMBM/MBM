const personService = require("../services/personService");

const criar = async (req, res, next) => {
  try {
    const { nome, email } = req.body;

    const pessoa = await personService.criar(nome, email);

    res.json(pessoa);
  } catch (error) {
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const pessoas = await personService.listar();

    res.json(pessoas);
  } catch (error) {
    next(error);
  }
};

const deletar = async (req, res, next) => {
  try {
    const resultado = await personService.deletar(req.params.id);

    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criar,
  listar,
  deletar
};