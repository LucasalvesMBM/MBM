import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isInvalid = password.length > 0 && password.length < 8;

  const navigate = useNavigate(); 

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ height: '100vh', backgroundColor: '#718ee785' }}
    >
      <Box component="img" src={logo} alt="Logo" sx={{ width: 200, height: 'auto', mb: 2 }} />
      <Typography component="h1" sx={{ fontSize: '28px', fontWeight: 400, mb: 1 }}>
        LOGIN
      </Typography>

      <Stack spacing={3} alignItems="center">
        <Box sx={{ width: '500px', height: '1px', mb: 5 }} />

        <TextField
          id="username"
          label="Usuário"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            width: '450px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              '& fieldset': { borderColor: 'black' },
              '&:hover fieldset': { borderColor: 'black' },
              '&.Mui-focused fieldset': { borderColor: 'black', borderWidth: '2px' },
            },
            '& .MuiInputLabel-root': { color: 'black' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
          }}
        />

        <TextField
          id="password"
          label="Senha"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={isInvalid}
          helperText={isInvalid ? "A senha deve ter no mínimo 8 caracteres" : ""}
          sx={{
            width: '450px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              '& fieldset': { borderColor: 'black' },
              '&:hover fieldset': { borderColor: 'black' },
              '&.Mui-focused fieldset': { borderColor: 'black', borderWidth: '2px' },
            },
            '& .MuiInputLabel-root': { color: 'black' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
          }}
        />

        <Button
          variant="contained"
          sx={{ width: '200px', height: '50px', mb: 5 }}
          onClick={handleLogin}
          disabled={isInvalid}
        >
          Entrar
        </Button>
        <Box />
      </Stack>
    </Grid>
  );
}
