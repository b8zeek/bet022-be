import { Schema, model } from 'mongoose'

const todoScheme = new Schema({
    description: {
        type: String,
        requied: true
    }
})

const Todo = model('Todo', todoScheme)

export default Todo
