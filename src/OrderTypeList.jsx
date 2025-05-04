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
import { getOrderTypes, createOrderType, updateOrderType, deleteOrderType } from './api';

const initialForm = { abbreviation: '', description: '', versionId: 1 };

export default function OrderTypeList() {
  const [orderTypes, setOrderTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrderTypes();
      setOrderTypes(data);
      setError('');
    } catch (e) {
      setError('Failed to load order types.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (orderType = initialForm) => {
    console.log('handleOpenDialog called with:', orderType);
    // Normalize property names for edit
    const normalized = {
      orderTypeId: orderType.orderTypeId ?? orderType.id ?? null,
      abbreviation: orderType.abbreviation,
      description: orderType.description,
      versionId: orderType.versionId ?? orderType.version ?? 1,
    };
    setForm(normalized);
    setEditId(normalized.orderTypeId);
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
        await updateOrderType(editId, form);
        setSnackbar({ open: true, message: 'Order type updated.', severity: 'success' });
      } else {
        await createOrderType(form);
        setSnackbar({ open: true, message: 'Order type added.', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save order type.', severity: 'error' });
    }
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this order type?')) return;
    try {
      await deleteOrderType(id, versionId);
      setSnackbar({ open: true, message: 'Order type deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete order type.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Order Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Order Type</Button>
      </Stack>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          orderTypes.length === 0 ? (
            <Typography>No order types found.</Typography>
          ) : (
            <Stack spacing={1}>
              {orderTypes.map((ot) => (
                <Box key={ot.orderTypeId ?? ot.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography fontWeight={500}>{ot.abbreviation}</Typography>
                    <Typography variant="body2" color="text.secondary">{ot.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(ot)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(ot.orderTypeId ?? ot.id, ot.versionId ?? ot.version)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Modify Order Type' : 'Add Order Type'}</DialogTitle>
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