const express = require("express");
const cors = require("cors");

const tarefaRoutes = require("./routes/tarefaRoutes");
const personRoutes = require("./routes/personRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tarefas", tarefaRoutes);
app.use("/api/persons", personRoutes);

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});