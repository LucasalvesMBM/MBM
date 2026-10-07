const express = require("express");
const tarefaController = require("../controllers/tarefaController");

const router = express.Router();

router.post("/", tarefaController.criar);
router.get("/", tarefaController.listar);
router.delete("/:id", tarefaController.deletar);
router.put("/:id/atribuir", tarefaController.atribuir);
router.put("/:id/status", tarefaController.atualizarStatus);
router.get("/status/count", tarefaController.contarPorStatus);

module.exports = router;