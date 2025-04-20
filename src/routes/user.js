import express from 'express'

import { User } from '../models/User.js'
import { Event } from '../models/Event.js'
import { Bet } from '../models/Bet.js'

const router = express.Router()

router.get('/', async (req, res) => {
    res.json({ data: req.user })
})

router.get('/events', async (_, res) => {
    const events = await Event.find({ date: { $gte: Date.now() } })

    res.json({ events })
})

router.post('/bets', async (req, res) => {
    const { bets } = req.body

    const user = req.user

    if (bets?.length !== 0) {
        const filteredBets = bets.filter(
            ({ eventId, outcome }) => eventId && outcome
        )

        if (filteredBets.length !== 0) {
            const data = await Bet.bulkWrite(
                filteredBets.map(({ eventId, outcome }) => ({
                    updateOne: {
                        filter: { userId: user.id, eventId },
                        update: { outcome },
                        upsert: true
                    }
                }))
            )

            res.json({ data })
        }
    } else {
        return res.json({ message: 'Please provide valid bets information.' })
    }
})

router.get('/standings', async (_, res) => {
    try {
        const users = await User.find()

        res.json({ users })
    } catch (error) {
        return res.json({ error })
    }
})

export default router
