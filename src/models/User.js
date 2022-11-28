import { Schema, model } from 'mongoose'

const userScheme = new Schema({
    userName: {
        type: String,
        required: true
    }
})

export const User = model('User', userScheme)
