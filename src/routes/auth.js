import express from 'express'
import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../models/User.js'

const router = express.Router()

router.get('/', async (_, res) => {
    res.json({ message: 'Server Works!' })
})

router.post('/register', async (req, res) => {
    console.log('BODY', req.body)
    const { error } = Joi.object({
        userName: Joi.string().min(3).max(32).required(),
        firstName: Joi.string().min(3).max(32).required(),
        lastName: Joi.string().min(3).max(32).required(),
        password: Joi.string().min(6).max(1024).required(),
        passwordConfirmed: Joi.string().min(6).max(1024).required()
    }).validate(req.body)

    if (error)
        return res.json({
            message: 'Please provide valid registration information!'
        })

    const userNameExists = await User.findOne({ userName: req.body.userName })

    if (userNameExists)
        return res.json({ message: 'Username is already taken.' })

    if (req.body.password !== req.body.passwordConfirmed)
        return res.json({
            message: 'Please provide valid password confirmation.'
        })

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password,
        isAdmin: false
    })

    try {
        const newUser = await user.save()

        const token = jwt.sign(
            {
                id: newUser._id,
                userName: newUser.userName,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                isAdmin: newUser.isAdmin
            },
            process.env.TOKEN_SECRET
        )

        res.set({
            'Access-Control-Expose-Headers': 'auth-token',
            'auth-token': token
        }).json({ data: newUser })
    } catch (error) {
        return res.json({ error })
    }
})

router.post('/login', async (req, res) => {
    const { error } = Joi.object({
        userName: Joi.string().min(3).max(32).required(),
        password: Joi.string().min(6).max(1024).required()
    }).validate(req.body)

    if (error)
        return res.json({ message: 'Please provide valid login information!' })

    const user = await User.findOne({ userName: req.body.userName })

    if (!user)
        return res.json({ message: "User with this username doesn't exist." })

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) return res.json({ message: 'Invalid password!' })

    const token = jwt.sign(
        {
            id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        },
        process.env.TOKEN_SECRET
    )

    res.set({
        'Access-Control-Expose-Headers': 'auth-token',
        'auth-token': token
    }).json({
        data: {
            id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        }
    })
})

export default router
