const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { boolean, required, string } = require('joi');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
        // validate(value) {
        //     if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        //         throw new Error('Password must contain at least one letter and one number');
        //     }
        // }
    },
    userProfile: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png',
    },
    phone: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('Invalid phone number');
            }
        }
    },
    userStatus: {
        type: Boolean,
        default: false
    },

    device_token: {
        type: String,
        default: null,
        // required: true
    },
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    try {
        /* 
        Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
        */
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, salt)
            this.password = hashedPassword
        }
        next()
    } catch (error) {
        console.error('Error during password hashing:', error);
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user', userSchema)
module.exports = User