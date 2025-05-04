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
import { getOrderStatuses, createOrderStatus, updateOrderStatus, deleteOrderStatus } from './api';

const initialForm = { abbreviation: '', description: '', versionId: 1 };

export default function OrderStatusList() {
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrderStatuses();
      setOrderStatuses(data);
      setError('');
    } catch (e) {
      setError('Failed to load order statuses.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (orderStatus = initialForm) => {
    console.log('handleOpenDialog called with:', orderStatus);
    // Normalize property names for edit
    const normalized = {
      orderStatusId: orderStatus.orderStatusId ?? orderStatus.id ?? null,
      abbreviation: orderStatus.abbreviation,
      description: orderStatus.description,
      versionId: orderStatus.versionId ?? orderStatus.version ?? 1,
    };
    setForm(normalized);
    setEditId(normalized.orderStatusId);
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
        await updateOrderStatus(editId, form);
        setSnackbar({ open: true, message: 'Order status updated.', severity: 'success' });
      } else {
        await createOrderStatus(form);
        setSnackbar({ open: true, message: 'Order status added.', severity: 'success' });
      }
      fetchData();
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save order status.', severity: 'error' });
    }
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this order status?')) return;
    try {
      await deleteOrderStatus(id, versionId);
      setSnackbar({ open: true, message: 'Order status deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete order status.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Order Statuses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Order Status</Button>
      </Stack>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          orderStatuses.length === 0 ? (
            <Typography>No order statuses found.</Typography>
          ) : (
            <Stack spacing={1}>
              {orderStatuses.map((os) => (
                <Box key={os.orderStatusId ?? os.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography fontWeight={500}>{os.abbreviation}</Typography>
                    <Typography variant="body2" color="text.secondary">{os.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(os)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(os.orderStatusId ?? os.id, os.versionId ?? os.version)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Modify Order Status' : 'Add Order Status'}</DialogTitle>
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