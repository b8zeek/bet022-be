import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import Todo from './models/Todo.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb+srv://bejzik8:Bet022SidCaffe@cluster0.whedoef.mongodb.net/new?retryWrites=true&w=majority')
  .then(() => console.log('Connected to database...'))
}

app.get('/', (_, res) => {
    res.json({ message: 'Welcome!' })
})

app.post('/todo', async (req, res) => {
    const { description } = req.body

    console.log('DESC', description)

    if (!description) return res.json({ message: 'Please add description for your Todo.' })

    try {
        const createdTodo = await Todo.create({ description })

        res.json({ data: createdTodo })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
