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
import { getSecurityTypes, createSecurityType, updateSecurityType, deleteSecurityType } from './api';

const initialForm = { abbreviation: '', description: '', versionId: 1 };

export default function SecurityTypeList() {
  const [securityTypes, setSecurityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSecurityTypes();
      setSecurityTypes(data);
      setError('');
    } catch (e) {
      setError('Failed to load security types.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (securityType = initialForm) => {
    console.log('handleOpenDialog called with:', securityType);
    // Normalize property names for edit
    const normalized = {
      securityTypeId: securityType.securityTypeId ?? securityType.id ?? null,
      abbreviation: securityType.abbreviation,
      description: securityType.description,
      versionId: securityType.versionId ?? securityType.version ?? 1,
    };
    setForm(normalized);
    setEditId(normalized.securityTypeId);
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
        await updateSecurityType(editId, form);
        setSnackbar({ open: true, message: 'Security type updated.', severity: 'success' });
      } else {
        await createSecurityType(form);
        setSnackbar({ open: true, message: 'Security type added.', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save security type.', severity: 'error' });
    }
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this security type?')) return;
    try {
      await deleteSecurityType(id, versionId);
      setSnackbar({ open: true, message: 'Security type deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete security type.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Security Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Security Type</Button>
      </Stack>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          securityTypes.length === 0 ? (
            <Typography>No security types found.</Typography>
          ) : (
            <Stack spacing={1}>
              {securityTypes.map((st) => (
                <Box key={st.securityTypeId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography fontWeight={500}>{st.abbreviation}</Typography>
                    <Typography variant="body2" color="text.secondary">{st.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(st)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(st.securityTypeId, st.versionId)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Modify Security Type' : 'Add Security Type'}</DialogTitle>
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