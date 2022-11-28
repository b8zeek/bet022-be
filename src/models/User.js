import { Schema, model } from 'mongoose'

const userScheme = new Schema({
    userName: {
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
    }
})

export const User = model('User', userScheme)
