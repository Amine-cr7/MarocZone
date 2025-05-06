import axios from "axios";

const API_URL = '/api/ads';

const getAllads = async () => {
    const response = await axios.get(API_URL)
    return response.data
}
const uploadPhotos = async (id, photos, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };
    const response = await axios.put(`${API_URL}/${id}/photo`, photos, config);
    return response.data;
}
const getAdById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
}

const getAdByUser = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(`${API_URL}/user`,config)
    return response.data
}


const createAd = async (adData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.post(API_URL, adData, config);
    return response.data;
}



const adsService = {
    getAllads,
    getAdById,
    uploadPhotos,
    createAd,
    getAdByUser
}
export default adsService 