const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    FullName: {
        type: "String",
        required: [true, 'Please Add A field name'],
        trim: true,
        maxlength: [50, 'name can not be more than 50 characters']
    },
    email: {
        type: "String",
        required: [true, 'Please Add A field Email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please add a valid email'
        ]
    },
    password: {
        type: "String",
        required: [true, 'Please Add A field Password']
    },
    phone: {
        type: "String",
        required: [true, 'Please Add A field Phone'],
        match: [
            /^(\+212|0)([ \-]?\d){9}$/
            , 'please add a valid phone']
    },
    // city: {
    //     type: "String",
    //     required: [true, 'Please Add A field City'],
    // },
    // adresse: {
    //     type: "String",
    //     required: [true, 'Please Add A field Adresse'],
    // },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

})
module.exports = mongoose.model('User',userSchema)