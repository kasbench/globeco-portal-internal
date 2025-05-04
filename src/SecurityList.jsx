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
import { getSecurities, createSecurity, updateSecurity, deleteSecurity, getSecurityTypes } from './api';

const initialForm = { ticker: '', description: '', securityTypeId: '', versionId: 1 };

export default function SecurityList() {
  const [securities, setSecurities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [securityTypes, setSecurityTypes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addErrors, setAddErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSecurities();
      setSecurities(data);
      setError('');
    } catch (e) {
      setError('Failed to load securities.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    getSecurityTypes().then(setSecurityTypes);
  }, []);

  const handleOpenDialog = (security = initialForm) => {
    console.log('handleOpenDialog called with:', security);
    // Normalize property names for edit
    const normalized = {
      securityId: security.securityId ?? security.id ?? null,
      ticker: security.ticker,
      description: security.description,
      securityTypeId: security.securityTypeId ?? security.securityType?.securityTypeId ?? '',
      versionId: security.versionId ?? security.version ?? 1,
    };
    setForm(normalized);
    setEditId(normalized.securityId);
    setAddErrors({});
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
    const errors = {};
    if (!form.ticker) errors.ticker = 'Ticker is required';
    if (!form.securityTypeId) errors.securityTypeId = 'Security type is required';
    if (!form.description) errors.description = 'Description is required';
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;
    console.log('Submitting form:', form);
    try {
      if (editId) {
        await updateSecurity(editId, form);
        setSnackbar({ open: true, message: 'Security updated.', severity: 'success' });
      } else {
        await createSecurity(form);
        setSnackbar({ open: true, message: 'Security added.', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save security.', severity: 'error' });
    }
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this security?')) return;
    try {
      await deleteSecurity(id, versionId);
      setSnackbar({ open: true, message: 'Security deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete security.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Securities</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Security</Button>
      </Stack>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          securities.length === 0 ? (
            <Typography>No securities found.</Typography>
          ) : (
            <Stack spacing={1}>
              {securities.map((s) => (
                <Box key={s.securityId ?? s.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography fontWeight={500}>{s.ticker}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(s)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(s.securityId ?? s.id, s.versionId ?? s.version)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Modify Security' : 'Add Security'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            fullWidth
            error={!!addErrors.ticker}
            helperText={addErrors.ticker}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            error={!!addErrors.description}
            helperText={addErrors.description}
          />
          <Box mt={2}>
            <Typography variant="body2">Security Type</Typography>
            <select name="securityTypeId" value={form.securityTypeId} onChange={handleChange} style={{ width: '100%', padding: 8 }}>
              <option value="">Select Security Type</option>
              {securityTypes.map(st => (
                <option key={st.securityTypeId ?? st.id} value={st.securityTypeId ?? st.id}>{st.abbreviation}</option>
              ))}
            </select>
            {addErrors.securityTypeId && <Typography color="error" variant="caption">{addErrors.securityTypeId}</Typography>}
          </Box>
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