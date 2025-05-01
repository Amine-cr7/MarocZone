import axios from 'axios'
const API_URL = '/api/auth/'

const register = async(userData) => {
    const response = await axios.post(API_URL,userData)
    if(response.data && response.data.token){
        localStorage.setItem('user',JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
    }
    return response.data
}

const login = async(userData) => {
    const response = await axios.post(API_URL+'login',userData )
    if(response.data && response.data.token){
        localStorage.setItem('user',JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
    }
    return response.data
}
const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    logout,
    login
}
export default authService