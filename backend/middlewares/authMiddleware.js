const asynchandler = require('express-async-handler')

const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = asynchandler(async (req,res,next) => {
    let token ;
    console.log(req.headers.authorization)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch(err){
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('No Token')
    }
})
const authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            res.status(401)
            throw new Error(`User Role ${req.user.role} not Authorized to this route `) 
        }
        next()
    }
}
module.exports = {protect,authorize}