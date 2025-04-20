import { Schema, model } from 'mongoose'

const eventSchema = new Schema(
    {
        date: {
            type: Date,
            required: true
        },
        availableTips: {
            type: [String],
            required: true
        },
        outcome: String,
        award: {
            type: Number,
            required: true
        }
    },
    { discriminatorKey: 'type' }
)

export const Event = model('Event', eventSchema)

export const GameEvent = Event.discriminator(
    'Game',
    new Schema({
        homeTeam: {
            type: String,
            required: true
        },
        awayTeam: {
            type: String,
            required: true
        }
    })
)

export const SpecialEvent = Event.discriminator(
    'Special',
    new Schema({
        description: {
            type: String,
            required: true
        }
    })
)
