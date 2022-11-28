const { Schema, model, ObjectId } = mongoose

const betScheme = new Schema({
    userId: {
        type: ObjectId,
        ref: 'Player',
        required: true
    },
    eventId: {
        type: ObjectId,
        ref: 'Event',
        required: true
    },
    outcome: {
        type: String,
        required: true
    }
})
