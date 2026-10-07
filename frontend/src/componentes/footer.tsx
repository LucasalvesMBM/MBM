import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#74baffb8",
        backdropFilter: 'blur(6px)',
        padding: "20px 0",
        marginTop: "40px",
        borderTop: "1px solid #ddd",
        textAlign: "center",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
        Precisa de ajuda?
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 1, flexDirection: 'column',}}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 , mt: 2}}>
        <Link href="#" underline="none" sx={{ fontWeight: 500, color: "black" }}>
          Suporte
        </Link>
        <Link href="#" underline="none" sx={{ fontWeight: 500, color: "black" }}>
          FAQ
        </Link>
        </Box>
        <Link href="#" underline="none" sx={{ fontWeight: 500, color: "black" }}>
            Telefone:
          (66)98436-0059
        </Link>
        <Link href="#" underline="none" sx={{ fontWeight: 500, color: "black" }}>
        email: lucasalves13042004@gmail.com
        </Link>
      </Box>

      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} MBM — Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
