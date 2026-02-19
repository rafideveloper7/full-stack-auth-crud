const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        // unique: true   
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {      
        type: String,
        default: ''       
    }
}, {
    timestamps: true  
});

module.exports = mongoose.model('User', userModel);