const getTodos = async (req, res) => {
  try {

    const Todos = todoModel.find();
    console.log("🚀 ~ getTodos ~ Todos:", Todos)

    
    res.send({
      isSuccess: true,
      message: "Get todos route handler",
      data: Todos
    });
  } catch (error) {}
};

const createTodo = async (req, res) => {
  res.send({
    isSuccess: true,
    message: "Create todos route handler",
  });
};

const updateTodo = async (req, res) => {
  res.send({
    isSuccess: true,
    message: "Update todos route handler",
  });
};

const deleteTodo = async (req, res) => {
  res.send({
    isSuccess: true,
    message: "Delete todos route handler",
  });
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
