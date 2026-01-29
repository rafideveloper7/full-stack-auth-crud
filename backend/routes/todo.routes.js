const express = require('express');

const todoRouter = express.Router()
const {deleteTodo, updateTodo, createTodo, getTodos} = require('../handlers/todo.handlers.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');

todoRouter.get('/',  authMiddleware, getTodos);
todoRouter.post('/',  authMiddleware, createTodo);
todoRouter.put('/:id',  authMiddleware, updateTodo);
todoRouter.delete('/:id',  authMiddleware, deleteTodo);

module.exports = todoRouter;