const Todo = require('../../model/todo');

const rootResolver = {
  todos: async () => {
    try {
      const todos = await Todo.find().sort({created:-1});
      return todos;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  addTodo: async (args, request) => {
    const todo = new Todo({
      task: args.task,
      isCompleted: false,
    });

    try {
      const result = await todo.save();
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  completeTodo: async (args, request) => {
    try {
      const result = await Todo.findOneAndUpdate(
        {_id: args.todoId},
        {
          $set: {
            isCompleted: args.isCompleted,
            updated: new Date()
          },
        },
        {
          new: true,
        },
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  },
  deleteTodo: async (args, request) => {
    try {
      const result = await Todo.deleteOne({_id: args.todoId});
      return args.todoId;
    } catch (error) {
      console.log(error);
    }
  },
  editTodo: async (args, request) => {
    try {
      const result = await Todo.findOneAndUpdate(
        {_id: args.todoId},
        {
          $set: {
            task: args.task,
            updated: new Date()
          },
        },
        {
          new: true,
        },
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = rootResolver;