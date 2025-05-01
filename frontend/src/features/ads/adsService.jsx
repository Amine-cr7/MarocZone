import axios from "axios";

const API_URL = '/api/ads';

const getAllads = async() => {
    const response = await axios.get(API_URL)
    return response.data
}
const getAdById = async(id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
}
const createAd = async (adData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        }
    };
    const response = await axios.post(API_URL, adData, config);
    return response.data;
}



const adsService = {
    getAllads,
    getAdById,
    createAd
}
export default adsService 