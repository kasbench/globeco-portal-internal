import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const getSecurityTypes = async () => {
  const url = `${API_BASE}/securityType`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createSecurityType = async (data) => {
  const url = `${API_BASE}/securityType`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateSecurityType = async (id, data) => {
  const url = `${API_BASE}/securityType/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteSecurityType = async (id, versionId) => {
  const url = `${API_BASE}/securityType/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/securityType/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const getOrderStatuses = async () => {
  const url = `${API_BASE}/orderStatus`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createOrderStatus = async (data) => {
  const url = `${API_BASE}/orderStatus`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id, data) => {
  const url = `${API_BASE}/orderStatus/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteOrderStatus = async (id, versionId) => {
  const url = `${API_BASE}/orderStatus/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/orderStatus/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const getTradeTypes = async () => {
  const url = `${API_BASE}/tradeType`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createTradeType = async (data) => {
  const url = `${API_BASE}/tradeType`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateTradeType = async (id, data) => {
  const url = `${API_BASE}/tradeType/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteTradeType = async (id, versionId) => {
  const url = `${API_BASE}/tradeType/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/tradeType/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const getDestinations = async () => {
  const url = `${API_BASE}/destination`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createDestination = async (data) => {
  const url = `${API_BASE}/destination`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateDestination = async (id, data) => {
  const url = `${API_BASE}/destination/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteDestination = async (id, versionId) => {
  const url = `${API_BASE}/destination/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/destination/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const getOrderTypes = async () => {
  const url = `${API_BASE}/orderType`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createOrderType = async (data) => {
  const url = `${API_BASE}/orderType`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateOrderType = async (id, data) => {
  const url = `${API_BASE}/orderType/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteOrderType = async (id, versionId) => {
  const url = `${API_BASE}/orderType/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/orderType/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const getOrders = async () => {
  const url = `${API_BASE}/order`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createOrder = async (data) => {
  const url = `${API_BASE}/order`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateOrder = async (id, data) => {
  const url = `${API_BASE}/order/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteOrder = async (id, versionId) => {
  const url = `${API_BASE}/order/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/order/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const getBlotters = async () => {
  const url = `${API_BASE}/blotter`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const getSecurities = async () => {
  const url = `${API_BASE}/security`;
  console.log(`[API] GET ${url}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${url}`, error);
    throw error;
  }
};

export const createSecurity = async (data) => {
  const url = `${API_BASE}/security`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const updateSecurity = async (id, data) => {
  const url = `${API_BASE}/security/${id}`;
  console.log(`[API] PUT ${url}`);
  try {
    const res = await axios.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] PUT ${url}`, error);
    throw error;
  }
};

export const deleteSecurity = async (id, versionId) => {
  const url = `${API_BASE}/security/${id}?versionId=${versionId}`;
  console.log(`[API] DELETE ${url}`);
  try {
    return await axios.delete(`${API_BASE}/security/${id}`, { params: { versionId } });
  } catch (error) {
    console.error(`[API ERROR] DELETE ${url}`, error);
    throw error;
  }
};

export const createBlock = async (data) => {
  const url = `${API_BASE}/block`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const createBlockAllocation = async (data) => {
  const url = `${API_BASE}/blockAllocation`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
};

export const createTrade = async (data) => {
  const url = `${API_BASE}/trade`;
  console.log(`[API] POST ${url}`);
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${url}`, error);
    throw error;
  }
}; 