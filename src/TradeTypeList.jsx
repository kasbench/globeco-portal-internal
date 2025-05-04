import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getTradeTypes, createTradeType, updateTradeType, deleteTradeType } from './api';

const initialForm = { abbreviation: '', description: '', versionId: 1 };

export default function TradeTypeList() {
  const [tradeTypes, setTradeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTradeTypes();
      setTradeTypes(data);
      setError('');
    } catch (e) {
      setError('Failed to load trade types.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (tradeType = initialForm) => {
    console.log('handleOpenDialog called with:', tradeType);
    // Normalize property names for edit
    const normalized = {
      tradeTypeId: tradeType.tradeTypeId ?? tradeType.id ?? null,
      abbreviation: tradeType.abbreviation,
      description: tradeType.description,
      versionId: tradeType.versionId ?? tradeType.version ?? 1,
    };
    setForm(normalized);
    setEditId(normalized.tradeTypeId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await updateTradeType(editId, form);
        setSnackbar({ open: true, message: 'Trade type updated.', severity: 'success' });
      } else {
        await createTradeType(form);
        setSnackbar({ open: true, message: 'Trade type added.', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save trade type.', severity: 'error' });
    }
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this trade type?')) return;
    try {
      await deleteTradeType(id, versionId);
      setSnackbar({ open: true, message: 'Trade type deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete trade type.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Trade Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Trade Type</Button>
      </Stack>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          tradeTypes.length === 0 ? (
            <Typography>No trade types found.</Typography>
          ) : (
            <Stack spacing={1}>
              {tradeTypes.map((tt) => (
                <Box key={tt.tradeTypeId ?? tt.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography fontWeight={500}>{tt.abbreviation}</Typography>
                    <Typography variant="body2" color="text.secondary">{tt.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(tt)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(tt.tradeTypeId ?? tt.id, tt.versionId ?? tt.version)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Modify Trade Type' : 'Add Trade Type'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Abbreviation"
            name="abbreviation"
            value={form.abbreviation}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 