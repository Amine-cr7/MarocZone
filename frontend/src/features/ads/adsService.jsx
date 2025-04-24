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



const adsService = {
    getAllads,
    getAdById
}
export default adsService 