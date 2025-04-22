import express from 'express'

import { Event, GameEvent, SpecialEvent } from '../models/Event.js'

const router = express.Router()

router.post('/game', async (req, res) => {
    const { homeTeam, awayTeam, date } = req.body

    const availableTips = ['1', '2']

    if (!homeTeam || !awayTeam || !date)
        return res.json({
            message: 'Please provide necessary event information!'
        })

    try {
        const data = await GameEvent.create({
            homeTeam,
            awayTeam,
            date,
            availableTips,
            award: 1,
            outcome: ''
        })

        res.json({ data })
    } catch (error) {
        return res.json({ error })
    }
})

router.post('/events', async (req, res) => {
    const { events } = req.body

    if (events?.length !== 0) {
        const filteredGames = events
            .filter(event => event?.type === 'game')
            .filter(game => game.homeTeam && game.awayTeam && game.date)

        const filteredSpecials = events
            .filter(event => event?.type === 'special')
            .filter(
                special =>
                    special.description &&
                    special.date &&
                    special.availableTips &&
                    special.award
            )

        try {
            if (filteredGames.length !== 0) {
                await GameEvent.insertMany(
                    filteredGames.map(({ homeTeam, awayTeam, date }) => ({
                        homeTeam,
                        awayTeam,
                        date,
                        availableTips,
                        award: 1,
                        outcome: ''
                    }))
                )
            }

            if (filteredSpecials.length !== 0) {
                await SpecialEvent.insertMany(
                    filteredSpecials.map(
                        ({ description, date, availableTips, award }) => ({
                            description,
                            date,
                            availableTips,
                            award,
                            outcome: ''
                        })
                    )
                )
            }

            res.json({ message: 'Successful!' })
        } catch (error) {
            res.json({ error })
        }
    }
})

router.get('/events', async (_, res) => {
    try {
        console.log('EVENTS ROUTE')
        const events = await Event.find({})

        console.log('Events', events)

        res.json({ events })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.post('/events-update', async (req, res) => {
    const { events } = req.body

    if (events?.length !== 0) {
        const filteredGames = events
            .filter(event => event?.type === 'game')
            .filter(game => game.homeTeam && game.awayTeam && game.date)

        const filteredSpecials = events
            .filter(event => event?.type === 'special')
            .filter(
                special =>
                    special.description &&
                    special.date &&
                    special.availableTips &&
                    special.award
            )

        try {
            if (filteredGames.length !== 0) {
                await GameEvent.insertMany(
                    filteredGames.map(({ homeTeam, awayTeam, date }) => ({
                        homeTeam,
                        awayTeam,
                        date,
                        availableTips,
                        award: 1
                    }))
                )
            }

            if (filteredSpecials.length !== 0) {
                await SpecialEvent.insertMany(
                    filteredSpecials.map(
                        ({ description, date, availableTips, award }) => ({
                            description,
                            date,
                            availableTips,
                            award
                        })
                    )
                )
            }

            res.json({ message: 'Successful!' })
        } catch (error) {
            res.json({ error })
        }
    }
})

router.post('/special', async (req, res) => {
    const { description, date, availableTips, award } = req.body

    if (!description || !date || !availableTips || !award)
        return res.json({
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
