import * as dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from './models/User.js'
import { GameEvent, SpecialEvent } from './models/Event.js'
import { Bet } from './models/Bet.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb+srv://bejzik8:Bet022SidCaffe@cluster0.whedoef.mongodb.net/new?retryWrites=true&w=majority')
  .then(() => console.log('Connected to database...'))
}

app.post('/register', async (req, res) => {
    const { error } = Joi.object({
        userName: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(1024).required(),
        passwordConfirmed: Joi.string().min(6).max(1024).required()
    }).validate(req.body)

    if (error) return res.json({ message: 'Please provide valid registration information!' })

    const userNameExists = await User.findOne({ userName: req.body.userName })

    if (userNameExists) return res.json({ message: 'Username is taken.'})

    if (req.body.password !== req.body.passwordConfirmed) return res.json({
        message: 'Please provide valid password confirmation.'
    })

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        userName: req.body.userName,
        password
    })

    try {
        const data = await user.save()

        res.json({ data })
    } catch (error) {
        return res.json({ error })
    }
})

app.post('/login', async (req, res) => {
    const { error } = Joi.object({
        userName: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(1024).required()
    }).validate(req.body)

    if (error) return res.json({ message: 'Please provide valid login information!' })

    const user = await User.findOne({ userName: req.body.userName })

    if (!user) return res.json({ message: 'User with this username doesn\'t exist.'})

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) return res.json({ message: 'Invalid password!' })

    const token = jwt.sign({
        id: user._id,
        userName: user.userName
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        data: {
            userName: user.userName,
            token
        }
    })
})

app.post('/user', async (req, res) => {
    const { userName } = req.body

    if (!userName) return res.json({ message: 'Username is required.' })

    try {
        const data = await User.create({ userName })

        res.json({ data })
    } catch (error) {
        return res.json({ error })
    }
})

app.post('/game', async (req, res) => {
    const {
        homeTeam,
        awayTeam,
        date
    } = req.body

    if (!homeTeam || !awayTeam || !date) return res.json({
        message: 'Please provide necessary event information!'
    })

    try {
        const data = await GameEvent.create({
            homeTeam,
            awayTeam,
            date,
            availableTips: ['1', 'x', '2'],
            award: 1
        })

        res.json({ data })
    } catch (error) {
        return res.json({ error })
    }
})

app.post('/special', async (req, res) => {
    const {
        description,
        date,
        availableTips,
        award
    } = req.body

    if (!description || !date || !availableTips || !award) return res.json({
        message: 'Please provide necessary event information!'
    })

    try {
        const data = await SpecialEvent.create({
            description,
            date,
            availableTips,
            award
        })

        res.json({ data })
    } catch (error) {
        return res.json({ error })
    }
})

app.post('/:userName/bets', async (req, res) => {
    const { bets } = req.body
    const { userName } = req.params

    console.log('BETS ', bets)

    const user = await User.findOne({ userName })

	if (!user) return res.json({ message: 'No user with this username.' })

    if (bets?.length !== 0) {
        const filteredBets = bets.filter(({ eventId, outcome }) => eventId && outcome)

        if (filteredBets.length !== 0) {
            const data = await Bet.bulkWrite(filteredBets.map(({ eventId, outcome }) => ({
                updateOne: {
                    filter: { userId: user._id, eventId },
                    update: { outcome },
                    upsert: true
                }
            })))
    
            res.json({ data })
        }
    } else {
        return res.json({ message: 'Please provide valid bets information.' })
    }

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
