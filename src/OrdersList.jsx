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
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getOrders, deleteOrder, getBlotters, getOrderStatuses, getOrderTypes, getSecurities, createOrder } from './api';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view'); // 'view' or 'edit'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({
    blotterId: '',
    ticker: '',
    orderStatusId: '',
    orderTypeId: '',
    quantity: '',
  });
  const [addErrors, setAddErrors] = useState({});
  const [blotters, setBlotters] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [securities, setSecurities] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
      setError('');
    } catch (e) {
      setError('Failed to load orders.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Preload dropdowns
    getBlotters().then(setBlotters);
    getOrderStatuses().then(setStatuses);
    getOrderTypes().then(setTypes);
    getSecurities().then(setSecurities);
  }, []);

  const handleView = (order) => {
    setSelectedOrder(order);
    setDialogType('view');
    setOpenDialog(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleDelete = async (id, versionId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id, versionId);
      setSnackbar({ open: true, message: 'Order deleted.', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete order.', severity: 'error' });
    }
  };

  const handleOpenAddDialog = () => {
    setAddForm({
      blotterId: '',
      ticker: '',
      orderStatusId: '',
      orderTypeId: '',
      quantity: '',
    });
    setAddErrors({});
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddErrors({});
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const validateAddForm = () => {
    const errors = {};
    if (!addForm.blotterId) errors.blotterId = 'Required';
    if (!addForm.ticker || addForm.ticker.length < 1 || addForm.ticker.length > 12) errors.ticker = 'Ticker required (1-12 chars)';
    if (!addForm.orderStatusId) errors.orderStatusId = 'Required';
    if (!addForm.orderTypeId) errors.orderTypeId = 'Required';
    if (!addForm.quantity || isNaN(Number(addForm.quantity)) || Number(addForm.quantity) <= 0) errors.quantity = 'Quantity must be a positive number';
    // Validate ticker exists
    if (addForm.ticker && !securities.some(s => s.ticker === addForm.ticker)) errors.ticker = 'Ticker does not exist in security table';
    return errors;
  };

  const handleAddOrder = async () => {
    const errors = validateAddForm();
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;
    // Find security by ticker
    const security = securities.find(s => s.ticker === addForm.ticker);
    const now = new Date().toISOString();
    console.log('Submitting order form:', addForm); // Debug log
    try {
      await createOrder({
        blotterId: addForm.blotterId,
        securityId: security.id || security.securityId,
        quantity: Number(addForm.quantity),
        orderTimestamp: now,
        orderTypeId: addForm.orderTypeId,
        orderStatusId: addForm.orderStatusId,
      });
      setSnackbar({ open: true, message: 'Order added.', severity: 'success' });
      setOpenAddDialog(false);
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to add order.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Orders</Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>Add Order</Button>
      </Stack>
      <Paper sx={{ maxHeight: 500, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Blotter</TableCell>
                  <TableCell>Ticker</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId ?? order.id}>
                    <TableCell>{order.blotter?.name || ''}</TableCell>
                    <TableCell>{order.security?.ticker || ''}</TableCell>
                    <TableCell>{order.security?.description || ''}</TableCell>
                    <TableCell>{order.orderStatus?.abbreviation || ''}</TableCell>
                    <TableCell>{order.orderType?.abbreviation || ''}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.orderTimestamp}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleView(order)}><VisibilityIcon /></IconButton>
                      <IconButton onClick={() => handleEdit(order)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(order.orderId ?? order.id, order.versionId ?? order.version)} color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogType === 'view' ? 'View Order' : 'Modify Order'}</DialogTitle>
        <DialogContent>
          {/* Placeholder: Display order details here. Implement edit form as needed. */}
          <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Order</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Box>
              <Typography variant="body2">Blotter</Typography>
              <select name="blotterId" value={addForm.blotterId} onChange={handleAddChange} style={{ width: '100%', padding: 8 }}>
                <option value="">Select Blotter</option>
                {blotters.map(b => <option key={b.blotterId ?? b.id} value={b.blotterId ?? b.id}>{b.name}</option>)}
              </select>
              {addErrors.blotterId && <Typography color="error" variant="caption">{addErrors.blotterId}</Typography>}
            </Box>
            <Box>
              <Typography variant="body2">Ticker</Typography>
              <input name="ticker" value={addForm.ticker} onChange={handleAddChange} style={{ width: '100%', padding: 8 }} maxLength={12} />
              {addErrors.ticker && <Typography color="error" variant="caption">{addErrors.ticker}</Typography>}
            </Box>
            <Box>
              <Typography variant="body2">Status</Typography>
              <select name="orderStatusId" value={addForm.orderStatusId} onChange={handleAddChange} style={{ width: '100%', padding: 8 }}>
                <option value="">Select Status</option>
                {statuses.map(s => <option key={s.orderStatusId ?? s.id} value={s.orderStatusId ?? s.id}>{s.abbreviation}</option>)}
              </select>
              {addErrors.orderStatusId && <Typography color="error" variant="caption">{addErrors.orderStatusId}</Typography>}
            </Box>
            <Box>
              <Typography variant="body2">Type</Typography>
              <select name="orderTypeId" value={addForm.orderTypeId} onChange={handleAddChange} style={{ width: '100%', padding: 8 }}>
                <option value="">Select Type</option>
                {types.map(t => <option key={t.orderTypeId ?? t.id} value={t.orderTypeId ?? t.id}>{t.abbreviation}</option>)}
              </select>
              {addErrors.orderTypeId && <Typography color="error" variant="caption">{addErrors.orderTypeId}</Typography>}
            </Box>
            <Box>
              <Typography variant="body2">Quantity</Typography>
              <input name="quantity" value={addForm.quantity} onChange={handleAddChange} style={{ width: '100%', padding: 8 }} type="number" min={1} />
              {addErrors.quantity && <Typography color="error" variant="caption">{addErrors.quantity}</Typography>}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddOrder} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 