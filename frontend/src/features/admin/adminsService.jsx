
import axios from "axios";

const API_URL = "/api/admin/";

const getAdsPerDay = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/ads-per-day`, config);
  return response.data;
};

const getDashboardStats = async (token) => {
  const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
  const response = await axios.get(`${API_URL}/stats`, config);
  return response.data
};

const getAdsBySubCategory = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/ads-by-subcategory`, config);
  return response.data;
};

const getAllUsers = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}users`, config);
  return response.data;
};

const deleteUser = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(`${API_URL}users/${id}`, config);
};


const updateUserRole = async (id, role, token) => { 
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}users/${id}/role`, { role }, config);
  return response.data;
};

const getAllAds = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}ads`, config);
  return response.data;
};

const deleteAd = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(`${API_URL}ads/${id}`, config);
};


// reports 
const createReport = async (reportData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(`${API_URL}/report`, reportData, config);
  return response.data;
};


const getAllReports = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/reports`, config);
  return response.data;
};

const acceptReport = async (reportId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${reportId}/accept`, {}, config);
  return response.data;
};


const deleteReport = async (reportId, token) => {
    const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(`${API_URL}${reportId}`, config);
  return res.data;
};



const adminService = {
  getAdsPerDay,
  getDashboardStats,
  getAdsBySubCategory,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllAds,
  deleteAd,
  getAllReports,
  createReport,
  acceptReport,
  deleteReport
};

export default adminService;
