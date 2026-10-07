import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Header from "../componentes/header";
import Footer from "../componentes/footer";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

  const [grafico, setGrafico] = useState({
    pendente: 0,
    em_andamento: 0,
    concluida: 0
  });

  async function carregarGrafico() {
    try {
      const res = await fetch("http://localhost:5000/api/tarefas/status/count");
      const dados = await res.json();

      setGrafico({
        pendente: dados.pendente,
        em_andamento: dados.em_andamento,
        concluida: dados.concluida,
      });
    } catch (err) {
      console.error("Erro ao carregar gráfico:", err);
    }
  }

  useEffect(() => {
    carregarGrafico();
  }, []);

  const data = [
  { name: "Pendente", value: grafico.pendente, fill: "#9ca3af" }, 
  { name: "Em andamento", value: grafico.em_andamento, fill: "#facc15" }, 
  { name: "Concluída", value: grafico.concluida, fill: "#22c55e" } 

  ]
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    padding: 2,
    mt: 4,
  }}
>
<Box
  sx={{
    display: "flex",
    width: "100%",
    padding: 2,
    mt: 4,
  }}
>
  <Box sx={{ width: "65%", flexDirection: "column" }}>
    <Typography variant="h5" fontWeight="bold" mb={4} ml={8} color="#1d4f95ff">
      Bem Vindo ao, Dashboard de Tarefas!
    </Typography>

    <BarChart width= '100%' height={450} data={data}>
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Bar dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Bar>
    </BarChart>
  </Box>

  <Box
    sx={{
      width: "35%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      paddingLeft: 3,
    }}
  >
    <Card
      sx={{
        height: "50%",
        borderRadius: 4,
        backgroundColor: "#f0df3fff",
        transition: "0.2s",
        display: "flex",
        "&:hover": { transform: "scale(1.03)", cursor: "pointer" }
      }}
      onClick={() => navigate("/tarefas")}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Gerenciar Tarefas
          </Typography>
          <Typography variant="body2">
            Crie, edite e acompanhe suas tarefas.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card
      sx={{
        height: "50%",
        borderRadius: 4,
        backgroundColor: "#d29fcbff",
        transition: "0.2s",
        display: "flex",
        mt: 3,
        "&:hover": { transform: "scale(1.03)", cursor: "pointer" }
      }}
      onClick={() => navigate("/pessoas")}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Cadastro de Pessoas
          </Typography>
          <Typography variant="body2">
             Adicione ou edite pessoas que ficaram responsáveis pelas tarefas designadas por você.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Box>
</Box>
</Box>
      <Footer />
    </Box>
  );
}
