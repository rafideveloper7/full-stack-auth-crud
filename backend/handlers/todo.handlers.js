const Todo = require("../models/todo.model");

// Get all todos for a user
const getTodos = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching todos for user:", userId);

    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      isSuccess: true,
      todos
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Failed to fetch todos" 
    });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    console.log("Creating todo for user:", userId, "title:", title);

    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        isSuccess: false, 
        message: "Todo title is required" 
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description || '',
      isCompleted: false,
      user: userId
    });

    console.log("Todo created:", todo._id);

    res.status(201).json({
      isSuccess: true,
      todo
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Failed to create todo" 
    });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    const userId = req.userId;

    console.log("Updating todo:", id, "for user:", userId);

    const todo = await Todo.findOne({ _id: id, user: userId });
    
    if (!todo) {
      return res.status(404).json({ 
        isSuccess: false, 
        message: "Todo not found" 
      });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (isCompleted !== undefined) todo.isCompleted = isCompleted;

    await todo.save();

    res.json({
      isSuccess: true,
      todo
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Failed to update todo" 
    });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log("Deleting todo:", id, "for user:", userId);

    const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
    
    if (!todo) {
      return res.status(404).json({ 
        isSuccess: false, 
        message: "Todo not found" 
      });
    }

    res.json({
      isSuccess: true,
      message: "Todo deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Failed to delete todo" 
    });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };