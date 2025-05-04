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
import { getDestinations, createDestination, updateDestination, deleteDestination } from './api';

const initialForm = { abbreviation: '', description: '', versionId: 1 };

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
      setError('');
    } catch (e) {
      setError('Failed to load destinations.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (destination = initialForm) => {
    console.log('handleOpenDialog called with:', destination);
    // Normalize property names for edit
    const normalized = {
      destinationId: destination.destinationId ?? destination.id ?? null,
      abbreviation: destination.abbreviation,
      description: destination.description,
      versionId: destination.versionId ?? destination.version ?? 1,
    };
    setForm(normalized);
    setEditId(normalized.destinationId);
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
        await updateDestination(editId, form);
        setSnackbar({ open: true, message: 'Destination updated.', severity: 'success' });
      } else {
        await createDestination(form);
        setSnackbar({ open: true, message: 'Destination added.', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save destination.', severity: 'error' });
    }
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await deleteDestination(id, versionId);
      setSnackbar({ open: true, message: 'Destination deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete destination.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Destinations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Destination</Button>
      </Stack>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          destinations.length === 0 ? (
            <Typography>No destinations found.</Typography>
          ) : (
            <Stack spacing={1}>
              {destinations.map((d) => (
                <Box key={d.destinationId ?? d.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography fontWeight={500}>{d.abbreviation}</Typography>
                    <Typography variant="body2" color="text.secondary">{d.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(d)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(d.destinationId ?? d.id, d.versionId ?? d.version)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Modify Destination' : 'Add Destination'}</DialogTitle>
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