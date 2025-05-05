import React, { useState } from 'react';
import { Box, Typography, Stack, Button, TextField } from '@mui/material';

export default function OrderForm({
  mode = 'add',
  order = {},
  blotters = [],
  statuses = [],
  types = [],
  securities = [],
  onSubmit,
  onClose,
}) {
  // Normalize mode to lowercase and add debug log
  const normalizedMode = (mode || 'add').toLowerCase();
  // console.log('OrderForm mode:', normalizedMode);
  const isView = normalizedMode === 'view';
  const isEdit = normalizedMode === 'edit';

  // Initialize form state based on mode and order
  const initialForm = normalizedMode === 'add'
    ? { blotterId: '', ticker: '', orderStatusId: '', orderTypeId: '', quantity: '' }
    : {
        blotterId: order.blotter?.id || order.blotterId || '',
        ticker: order.security?.ticker || order.ticker || '',
        orderStatusId: order.orderStatus?.id || order.orderStatusId || '',
        orderTypeId: order.orderType?.id || order.orderTypeId || '',
        quantity: order.quantity || '',
      };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.blotterId) errs.blotterId = 'Required';
    if (!form.ticker || form.ticker.length < 1 || form.ticker.length > 12) errs.ticker = 'Ticker required (1-12 chars)';
    if (!form.orderStatusId) errs.orderStatusId = 'Required';
    if (!form.orderTypeId) errs.orderTypeId = 'Required';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) errs.quantity = 'Quantity must be a positive number';
    if (form.ticker && !securities.some(s => s.ticker === form.ticker)) errs.ticker = 'Ticker does not exist in security table';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isView) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // Find securityId from ticker
    const security = securities.find(s => s.ticker === form.ticker);
    const payload = {
      ...form,
      securityId: security ? (security.id || security.securityId) : undefined,
    };
    delete payload.ticker;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} mt={1}>
        <Box>
          <Typography variant="body2">Blotter</Typography>
          <select
            name="blotterId"
            value={form.blotterId}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            disabled={isView}
          >
            <option value="">Select Blotter</option>
            {blotters.map(b => (
              <option key={b.blotterId ?? b.id} value={b.blotterId ?? b.id}>{b.name}</option>
            ))}
          </select>
          {errors.blotterId && <Typography color="error" variant="caption">{errors.blotterId}</Typography>}
        </Box>
        <Box>
          <Typography variant="body2">Ticker</Typography>
          <input
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            maxLength={12}
            disabled={isView}
          />
          {errors.ticker && <Typography color="error" variant="caption">{errors.ticker}</Typography>}
        </Box>
        <Box>
          <Typography variant="body2">Status</Typography>
          <select
            name="orderStatusId"
            value={form.orderStatusId}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            disabled={isView}
          >
            <option value="">Select Status</option>
            {statuses.map(s => (
              <option key={s.orderStatusId ?? s.id} value={s.orderStatusId ?? s.id}>{s.abbreviation}</option>
            ))}
          </select>
          {errors.orderStatusId && <Typography color="error" variant="caption">{errors.orderStatusId}</Typography>}
        </Box>
        <Box>
          <Typography variant="body2">Type</Typography>
          <select
            name="orderTypeId"
            value={form.orderTypeId}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            disabled={isView}
          >
            <option value="">Select Type</option>
            {types.map(t => (
              <option key={t.orderTypeId ?? t.id} value={t.orderTypeId ?? t.id}>{t.abbreviation}</option>
            ))}
          </select>
          {errors.orderTypeId && <Typography color="error" variant="caption">{errors.orderTypeId}</Typography>}
        </Box>
        <Box>
          <Typography variant="body2">Quantity</Typography>
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            type="number"
            min={1}
            disabled={isView}
          />
          {errors.quantity && <Typography color="error" variant="caption">{errors.quantity}</Typography>}
        </Box>
        {!isView && (
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Save' : 'Add'}
          </Button>
        )}
        <Button onClick={onClose} color="secondary" variant="outlined" type="button">
          Close
        </Button>
      </Stack>
    </form>
  );
} 