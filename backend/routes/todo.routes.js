const express = require('express');

const todoRouter = express.Router()

const {deleteTodo, updateTodo, createTodo, getTodos} = require('../handlers/todo.handlers.js');

todoRouter.get('/', getTodos);
todoRouter.post('/', createTodo);
todoRouter.put('/', updateTodo);
todoRouter.delete('/', deleteTodo);

module.exports = todoRouter;