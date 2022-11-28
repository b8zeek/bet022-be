import express from 'express'

import { GameEvent, SpecialEvent } from '../models/Event.js'

const router = express.Router()

router.post('/game', async (req, res) => {
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

router.post('/special', async (req, res) => {
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

export default router
