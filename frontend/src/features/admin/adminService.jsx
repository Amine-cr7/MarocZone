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

const updateUserRole = async ({ _id, role }, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}users/${_id}/role`, { role }, config);
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




const adminService = {
  getAdsPerDay,
  getDashboardStats,
  getAdsBySubCategory,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllAds,
  deleteAd,
};

export default adminService;
