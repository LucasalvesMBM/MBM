import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Header from "../componentes/header";
import DeleteIcon from '@mui/icons-material/Delete';
import ExclusionPersonModal from "../modals/personexclusionModal";

export default function People() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
const [pessoaSelecionada, setPessoaSelecionada] = useState<number | null>(null);

function abrirModal(id: number) {
  setPessoaSelecionada(id);
  setModalOpen(true);
}

function fecharModal() {
  setModalOpen(false);
  setPessoaSelecionada(null);
}

async function confirmarExclusao() {
    if (pessoaSelecionada === null) return;

  await deletarPessoa(pessoaSelecionada);
  fecharModal();
  carregarPessoas();
}


  // ----------------------------------------------------
  // Carregar pessoas
  // ----------------------------------------------------
  async function carregarPessoas() {
    try {
      const res = await fetch("http://localhost:5000/api/persons");
      const json = await res.json();
      setPessoas(json);
    } catch (err) {
      console.error("Erro ao carregar pessoas:", err);
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  // ----------------------------------------------------
  // Criar pessoa
  // ----------------------------------------------------
  async function criarPessoa() {
    try {
      const data = { nome, email };

      const res = await fetch("http://localhost:5000/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await res.json();
      carregarPessoas();

      setNome("");
    } catch (err) {
      console.error("Erro ao criar pessoa:", err);
    }
  }

  async function deletarPessoa(id: number) {
    try {
        const res = await fetch(`http://localhost:5000/api/persons/${id}`, {
        method: "DELETE",
        });

        if (!res.ok) {
        throw new Error("Erro ao deletar pessoa");
        }

        await carregarPessoas(); 
    } catch (err) {
        console.error("Erro ao deletar:", err);
    }
    }


  return (
    <Stack sx={{backgroundColor: "#393f8aff"}}>
      <Header />

      {/* FORM DE CRIAÇÃO */}
      <Box sx={{ padding: 7, width: "50%", margin: "auto" }}>
        <Box sx={{ backgroundColor: "#eef2ff", borderRadius: "20px", p: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Cadastrar Pessoa
          </Typography>

          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
              label="Email"
              value={email}
              onChange = {(e)=> setEmail(e.target.value)}
              fullWidth
              sx = {{
                backgroundColor: 'white', 
                borderRadius: 5, 
                "& fieldset": {
                borderRadius: 5,
                },
              }}
              />

            <Button
              variant="contained"
              sx={{ mt: 2, width: '100%' }}
              onClick={criarPessoa}
            >
              Cadastrar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* LISTAGEM */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white">
          PESSOAS CADASTRADAS
        </Typography>

        <Stack spacing={2} mt={3}>
          {pessoas.map((p) => (
            <Card key={p.id} sx={{ padding: 2, backgroundColor: "#eef2ff", borderRadius: 5  }}>
              <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",}}>
                <Box>
                <Typography variant="h6" fontWeight="bold">
                    {p.nome}
                </Typography>

                <Typography variant="body2">ID: {p.id}</Typography>
                <Typography variant="body2">Email: {p.email}</Typography>
                </Box>

                <IconButton color="error" onClick={() => abrirModal(p.id)}>
                <DeleteIcon sx={{fontSize: 27}} />
                </IconButton>
                
              </CardContent>
            </Card>
          ))}
          <ExclusionPersonModal 
                    open={modalOpen}
                    onClose={fecharModal}
                    onConfirm={confirmarExclusao}
                    />
        </Stack>
      </Box>
    </Stack>
  );
}
