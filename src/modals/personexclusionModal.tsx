import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


interface ExclusionPersonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}   

export default function ExclusionPersonModal({
  open,
  onClose,
  onConfirm,
}: ExclusionPersonModalProps) {
  if (!open) return null;
  return (
    <Dialog 
    open={open} 
    onClose={onClose} 
    maxWidth="sm" 
    fullWidth
    PaperProps={{sx:{borderRadius: 5,}}}
    >
      <DialogContent>
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Excluir Pessoa
          </Typography>

          <Typography variant="body1">
            Tem certeza que deseja excluir esta pessoa?  
            <br />
            Esta ação não pode ser desfeita.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          color="inherit"
          onClick={onClose}
          startIcon={<KeyboardArrowLeftIcon/>}
        >
          Voltar
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
