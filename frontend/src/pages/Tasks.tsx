import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import Header from "../componentes/header";
import ExclusionPersonModal from "../modals/taskExclusionModal";
import DeleteIcon from '@mui/icons-material/Delete';


export default function Tarefas() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [personId, setPersonId] = useState("");
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false); 
  const [taskToExclude, setTaskToExclude] = useState<number | null>(null); 

  // ----------------------------------------------------
  // Buscar tarefas
  // ----------------------------------------------------
  async function carregarTarefas() {
    try {
      const res = await fetch("http://localhost:5000/api/tarefas");
      const json = await res.json();
      setTarefas(json || []);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    }
  }

  // ----------------------------------------------------
  // Buscar pessoas
  // ----------------------------------------------------
  async function carregarPessoas() {
    try {
      const res = await fetch("http://localhost:5000/api/persons");
      const json = await res.json();
      setPessoas(json || []);
    } catch (err) {
      console.error("Erro ao carregar pessoas:", err);
    }
  }

  // Carrega tudo ao abrir
  useEffect(() => {
    carregarTarefas();
    carregarPessoas();
  }, []);

  // ----------------------------------------------------
  // Criar tarefa
  // ----------------------------------------------------
  async function criarTarefa() {
    try {
      const data = { titulo, descricao, person_id: personId || null };

      const res = await fetch("http://localhost:5000/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await res.json();
      carregarTarefas();

      setTitulo("");
      setDescricao("");
      setPersonId("");
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  }

  // ----------------------------------------------------
  // Atribuir pessoa
  // ----------------------------------------------------
  async function atribuirPessoa(tarefaId: number, nomePessoa: string | number) {
    try {
      await fetch(`http://localhost:5000/api/tarefas/${tarefaId}/atribuir`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomePessoa }),
      });

      carregarTarefas();
    } catch (err) {
      console.error("Erro ao atribuir pessoa:", err);
    }
  }

  // ----------------------------------------------------
  // Excluir tarefa
  // ----------------------------------------------------
  async function excluirTarefa(id: number) {
    try {
      await fetch(`http://localhost:5000/api/tarefas/${id}`, {
        method: "DELETE",
      });
      carregarTarefas();
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  }

  // ----------------------------------------------------
  // Lógica do modal
  // ----------------------------------------------------
  const confirmarExclusao = () => {
    if (taskToExclude !== null) {
      excluirTarefa(taskToExclude);
      setTaskToExclude(null);
      setModalOpen(false);
    }
  };
  // ----------------------------------------------------
  // Atualização status
  // ----------------------------------------------------
  async function atualizarStatus(tarefaId: number, novoStatus: string) {
  try {
    await fetch(`http://localhost:5000/api/tarefas/${tarefaId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });

    carregarTarefas(); 
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
  }
}


  return (
    <Stack sx={{backgroundColor: "#393f8aff"}}>
      <Header />

      {/* FORM DE CRIAÇÃO */}
      <Box sx={{ padding: 7, width: "50%", margin: "auto"}}>
        <Box sx={{ backgroundColor: "#eef2ff", borderRadius: "20px", p: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Criar Tarefa
          </Typography>

          <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 5,
                "& fieldset": {
                borderRadius: 5,
                },
            }}
            />

            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 5,
                "& fieldset": {
                borderRadius: 5,
                },
            }}
            />

            <TextField
              label="ID da Pessoa (opcional)"
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 5,
                "& fieldset": {
                borderRadius: 5,
                },
            }}
            />

            <Button variant="contained" sx={{ mt: 2, width: 'full', fontWeight: 'bold' }} onClick={criarTarefa}>
              Criar
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="#ffffffff">
          TAREFAS CADASTRADAS
        </Typography>

        <Stack spacing={3} mt={4}>
                {tarefas.map((t: any) => (
                    <Card 
                    key={t.id} 
                    sx={{ 
                        padding: 2, 
                        backgroundColor: "#eef2ff",  
                        borderRadius: '20px'
                    }}
                    >
                    <CardContent>

                        <Typography variant="h6" fontWeight="bold">
                        {t.titulo}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                        <Typography fontWeight="bold" color="Black">
                            Status:
                        </Typography>

                        <Select
                            value={t.status || "pendente"}
                            onChange={(e) => atualizarStatus(t.id, e.target.value)}
                            variant="standard" 
                            disableUnderline 
                            sx={{
                            minWidth: 90,
                            padding: "2px 6px",
                            borderRadius: 2,
                            fontWeight: 600,
                            backgroundColor: "transparent",

                            color:
                                t.status === "concluida"
                                ? "#22c55e" 
                                : t.status === "em_andamento"
                                ? "#facc15" 
                                : "#d1d5db", 

                            "& .MuiSelect-standard:focus": {
                                backgroundColor: "transparent",
                            },
                            }}

                            IconComponent={(props) => (
                            <svg
                                {...props}
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="white"
                            >
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                            )}
                        >
                            <MenuItem value="pendente" sx={{ color: "#6b7280", fontWeight: 600 }}>
                            pendente
                            </MenuItem>

                            <MenuItem
                            value="em_andamento"
                            sx={{ color: "#facc15", fontWeight: 600 }}
                            >
                            em andamento
                            </MenuItem>

                            <MenuItem value="concluida" sx={{ color: "#22c55e", fontWeight: 600 }}>
                            concluída
                            </MenuItem>
                        </Select>
                        </Box>


                        <Typography variant="body1" sx={{ mb: 1 }}>
                        {t.descricao}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Responsável:</strong> {t.responsavel || "Ninguém"}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 3 }}>
                        <strong>Criada em:</strong> {new Date(t.criada_em).toLocaleString("pt-BR")}
                        </Typography>

                        <Box 
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,            
                            mt: 2
                        }}
                        >
                        <FormControl fullWidth>
                            <InputLabel>Atribuir Pessoa</InputLabel>
                            <Select
                            value={t.responsavel || ""}
                            label="Atribuir Pessoa"
                            onChange={(e) => atribuirPessoa(t.id, e.target.value)}
                            sx={{ background: "white", borderRadius: 2 }}
                            >
                            <MenuItem value="">Nenhum</MenuItem>

                            {pessoas.map((p) => (
                                <MenuItem key={p.id} value={p.nome}>
                                {p.nome}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>

                        <IconButton 
                            color="error"
                            onClick={() => {
                            setTaskToExclude(t.id);
                            setModalOpen(true);
                            }}
                            sx={{
                            backgroundColor: "#ffe5e5",
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#ffcccc" }
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 27 }} />
                        </IconButton>
                        </Box>
                    </CardContent>
                    </Card>


          ))}
        </Stack>
      </Box>

      <ExclusionPersonModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onExclude={confirmarExclusao}
      />
    </Stack>
  );
}
