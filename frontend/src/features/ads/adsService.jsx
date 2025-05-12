import axios from "axios";

const API_URL = '/api/ads';
const API = '/api/tools/populare';
const API_Fav = '/api/ads/favorites';

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

const getAdById = async (id, token) => {
    const config = token ? {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    } : {};
    
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
}

const getAdByUser = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(`${API_URL}/user`, config)
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

const updateAd = async ({ _id, adUpdate }, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.put(`${API_URL}/${_id}`, adUpdate, config);
    return response.data;
}

const deleteAd = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
}

const getPopulareAds = async () => {
    const response = await axios.get(API)
    return response.data
};

const searchAds = async ({ keyword, minPrice, maxPrice }) => {
    const response = await axios.get('/api/tools/search', {
        params: {
            keyword,
            minPrice,
            maxPrice
        }
    });
    return response.data;
};

const filterAds = async ({minPrice, maxPrice, location, dateFrom, dateTo, subCat, brand, model }) => {
    const response = await axios.get('/api/tools/filter', {
        params: {
            minPrice,
            maxPrice,
            location,
            dateFrom,
            dateTo,
            subCat,
            brand,
            model
        }
    });
    return response.data;
}

// Favorites functions
const getFavorites = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(API_Fav, config);
    return response.data;
};

const addFavorite = async (adId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.post(API_Fav, { adId }, config);
    return response.data;
};

const removeFavorite = async (adId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.delete(`${API_Fav}/${adId}`, config);
    return response.data;
};

const adsService = {
    getAllads,
    getAdById,
    uploadPhotos,
    createAd,
    getAdByUser,
    updateAd,
    deleteAd,
    getPopulareAds, 
    searchAds,
    filterAds,
    getFavorites,
    addFavorite,
    removeFavorite
}

export default adsService