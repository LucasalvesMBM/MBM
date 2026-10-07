import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/logo.png';

const navItems = [
  { label: 'Tarefas', to: '/tarefas' },
  { label: 'Pessoas', to: '/pessoas' },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} role="presentation" sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box component="img" src={logo} alt="MBM logo" sx={{ width: 48 }} />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={RouterLink} to={item.to}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/sair">
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: '#74baffcc',
        backdropFilter: 'blur(6px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              edge="start"
              component={RouterLink}
              to="/"
              aria-label="home"
              sx={{ p: 0,
                ml: { xs: 0.5, md: 0 },
              }}
            >
              <Box component="img" src={logo} alt="MBM logo" sx={{ width: 80, height: 'auto' }} />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 6, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.to}
                color="inherit"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              onClick={() => navigate("/Login")}
              variant="contained"
              color="inherit"
              sx={{
                borderColor: 'text.primary',
                color: 'text.primary',
                fontWeight: 700,
                ml: 2,
                '&:hover': { borderColor: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              Sair
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton aria-label="open menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}
