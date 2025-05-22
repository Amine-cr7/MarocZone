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

const adminService = {
  getAdsPerDay,
};

export default adminService;
