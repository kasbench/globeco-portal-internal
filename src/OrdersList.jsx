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
  Checkbox,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getOrders, deleteOrder, getBlotters, getOrderStatuses, getOrderTypes, getSecurities, createOrder, updateOrder, createBlock, createBlockAllocation, createTrade } from './api';
import OrderForm from './OrderForm';

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
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      // Normalize security object
      const normalized = data.map(order => ({
        ...order,
        security: order.security
          ? { ...order.security, securityId: order.security.securityId ?? order.security.id }
          : (order.securityId ? { securityId: order.securityId } : undefined),
      }));
      setOrders(normalized);
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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedOrders(orders.map(order => order.orderId ?? order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (orderId) => (event) => {
    if (event.target.checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(order => (order.orderStatus?.id ?? order.orderStatusId) === Number(statusFilter))
    : orders;

  // Find the selected status object
  const selectedStatus = statuses.find(s => (s.id ?? s.orderStatusId) === Number(statusFilter));
  const isNew = selectedStatus?.abbreviation?.toLowerCase() === 'new';
  const isCancel = selectedStatus?.abbreviation?.toLowerCase() === 'cancel';

  // Find the 'open' status id for updating orders
  const openStatus = statuses.find(s => s.abbreviation?.toLowerCase() === 'open');

  const handleSubmitOrders = async () => {
    if (selectedOrders.length === 0) {
      setSnackbar({ open: true, message: 'No orders selected.', severity: 'warning' });
      setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 4000);
      return;
    }
    for (const orderId of selectedOrders) {
      const order = orders.find(o => (o.orderId ?? o.id) === orderId);
      if (!order) continue;
      try {
        console.log('[DEBUG] order object:', order);
        // 1. Create block
        const blockData = {
          securityId: order.security?.securityId ?? order.security?.id ?? order.securityId,
          orderTypeId: order.orderType?.id ?? order.orderTypeId,
        };
        console.log('[DEBUG] POST /block', blockData);
        const block = await createBlock(blockData);
        // 2. Create block allocation
        const blockAllocData = {
          orderId: order.orderId ?? order.id,
          blockId: block.id,
          quantity: order.quantity,
          filledQuantity: 0,
        };
        console.log('[DEBUG] POST /blockAllocation', blockAllocData);
        await createBlockAllocation(blockAllocData);
        // 3. Create trade
        const tradeData = {
          destinationId: null,
          blockId: block.id,
          quantity: order.quantity,
          tradeTypeId: null,
          filledQuantity: 0,
          version: 1,
        };
        console.log('[DEBUG] POST /trade', tradeData);
        await createTrade(tradeData);
        // 4. Update order status to 'open'
        if (openStatus) {
          const updateOrderData = {
            blotterId: order.blotter?.id ?? order.blotterId,
            securityId: order.security?.securityId ?? order.security?.id ?? order.securityId,
            quantity: order.quantity,
            orderTimestamp: order.orderTimestamp,
            orderTypeId: order.orderType?.id ?? order.orderTypeId,
            orderStatusId: openStatus.id ?? openStatus.orderStatusId,
            version: order.version ?? order.versionId,
          };
          console.log(`[DEBUG] PUT /order/${order.orderId ?? order.id}`, updateOrderData);
          await updateOrder(order.orderId ?? order.id, updateOrderData);
        }
      } catch (e) {
        setSnackbar({ open: true, message: `Failed to submit order ${orderId}.`, severity: 'error' });
        return;
      }
    }
    setSnackbar({ open: true, message: 'Orders submitted successfully.', severity: 'success' });
    fetchData();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Orders</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ marginRight: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 140 }}
          >
            {statuses.map(s => (
              <option key={s.id ?? s.orderStatusId} value={s.id ?? s.orderStatusId}>{s.abbreviation}</option>
            ))}
          </select>
          <Button variant="contained" onClick={handleOpenAddDialog} sx={{ mr: 2 }}>Add Order</Button>
          <Button variant="outlined" sx={{ mr: 2 }} disabled={!isNew} onClick={handleSubmitOrders}>Submit</Button>
          <Button variant="outlined" color="secondary" disabled={isNew || isCancel}>Cancel</Button>
        </Box>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length}
                      checked={orders.length > 0 && selectedOrders.length === orders.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
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
                {filteredOrders.map((order) => (
                  <TableRow key={order.orderId ?? order.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedOrders.includes(order.orderId ?? order.id)}
                        onChange={handleSelectOne(order.orderId ?? order.id)}
                      />
                    </TableCell>
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
          <OrderForm
            mode={dialogType}
            order={selectedOrder}
            blotters={blotters}
            statuses={statuses}
            types={types}
            securities={securities}
            onSubmit={async (form) => {
              // Only allow submit in edit mode
              if (dialogType === 'edit') {
                try {
                  console.log('Submitting update order form:', form); // Debug log
                  await updateOrder(selectedOrder.id || selectedOrder.orderId, {
                    blotterId: form.blotterId,
                    securityId: form.securityId,
                    quantity: Number(form.quantity),
                    orderTimestamp: selectedOrder.orderTimestamp,
                    orderTypeId: form.orderTypeId,
                    orderStatusId: form.orderStatusId,
                    version: selectedOrder.version || selectedOrder.versionId,
                  });
                  setSnackbar({ open: true, message: 'Order updated.', severity: 'success' });
                  setOpenDialog(false);
                  fetchData();
                } catch (e) {
                  setSnackbar({ open: true, message: 'Failed to update order.', severity: 'error' });
                }
              }
            }}
            onClose={handleCloseDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Order</DialogTitle>
        <DialogContent>
          <OrderForm
            mode="add"
            blotters={blotters}
            statuses={statuses}
            types={types}
            securities={securities}
            onSubmit={handleAddOrder}
            onClose={handleCloseAddDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 