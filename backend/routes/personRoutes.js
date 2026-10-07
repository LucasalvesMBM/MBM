const express = require("express");
const personController = require("../controllers/personController");

const router = express.Router();

router.post("/", personController.criar);
router.get("/", personController.listar);
router.delete("/:id", personController.deletar);

module.exports = router;