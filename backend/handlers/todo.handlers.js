const Todo = require("../models/todo.model");


/*
GET /todos
Get all todos of logged-in user
*/
const getTodos = async (req, res) => {
  try {

    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });

    console.log("Found todos:", todos.length);
    console.log(
      "Todos found:",
      todos.map((t) => ({ id: t._id, title: t.title, user: t.user })),
    );

    res.status(200).json({
      isSuccess: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error("GET TODOS ERROR:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

/*
POST /todos
Create todo for logged-in user
*/
const createTodo = async (req, res) => {
  try {

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        isSuccess: false,
        message: "Title is required",
      });
    }

    const todo = await Todo.create({
      title,
      description,
      user: req.userId, // This attaches the user ID
    });

    console.log("Todo created:", {
      id: todo._id,
      title: todo.title,
      user: todo.user,
    });

    res.status(201).json({
      isSuccess: true,
      data: todo,
    });
  } catch (error) {
    console.error("CREATE TODO ERROR:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

/*
PUT /todos/:id
Update todo (only owner)
*/
const updateTodo = async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;
    const { id } = req.params;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, description, isCompleted },
      { new: true, runValidators: true },
    );

    if (!todo) {
      return res.status(404).json({
        isSuccess: false,
        message: "Todo not found or not authorized",
      });
    }

    res.json({
      isSuccess: true,
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

/*
DELETE /todos/:id
Delete todo (only owner)
*/
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!todo) {
      return res.status(404).json({
        isSuccess: false,
        message: "Todo not found or not authorized",
      });
    }

    res.json({
      isSuccess: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
