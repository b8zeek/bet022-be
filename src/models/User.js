import { Schema, model } from 'mongoose'

const userScheme = new Schema({
    userName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    isAdmin: {
        type: Boolean
    }
})

export const User = model('User', userScheme)
