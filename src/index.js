import * as dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import { User } from './models/User.js'
import { GameEvent, SpecialEvent } from './models/Event.js'

import authRoutes from './routes/auth.js'
import betRoutes from './routes/bet.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect(
        `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.whedoef.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log('Connected to database...'))
}

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')

    if (!token) return res.json({ error: 'Access denied!' })

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = verified

        next()
    } catch (error) {
        res.json({ error: 'Token isn\'t valid!' })
    }
}

app.use('/', authRoutes)
app.use('/user', verifyToken, betRoutes)

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

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
