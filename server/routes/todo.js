const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Todo = require("../models/Todo");
const authenticate = require("../middlewares/authenticate");

// Create new todo
router.post(
  "/",
  [body("title").trim().notEmpty().withMessage("Title is required")],
  authenticate,
  async (req, res) => {
    const { title } = req.body;
    const userId = req.user.userId;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: "Insufficient data provided",
      });
    }

    try {
      // Create a new todo with the user ID
      const newTodo = new Todo({ title, isCompleted: false, userId });
      const resposne = await newTodo.save();

      return res.status(201).json({
        status: true,
        data: resposne,
        message: "Todo created successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong, please try again",
      });
    }
  }
);

// Get todos endpoint with search and pagination
router.get("/", authenticate, async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const userId = req.user.userId;

  try {
    // search todos with the userId
    // adding limit to avoid large data
    const todos = await Todo.find({
      $and: [{ title: { $regex: search, $options: "i" } }, { userId: userId }],
    })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    // Get total count for pagination
    const totalCount = await Todo.countDocuments({
      $and: [{ title: { $regex: search, $options: "i" } }, { userId: userId }],
    }).exec();

    return res.status(200).json({
      status: true,
      todos,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Cannot get todos, please try again",
    });
  }
});

// Get single todo with :id
router.get("/:id", authenticate, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.userId;

  try {
    // get the the todo with it's id and userId
    const todo = await Todo.findOne({ _id: todoId, userId: userId });
    if (!todo) {
      return res.status(404).json({ status: false, message: "Todo not found" });
    }

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Cannot get todo, please try again",
    });
  }
});

// Update todo
router.put(
  "/:id",
  [body("title").notEmpty().withMessage("Title is required")],
  authenticate,
  async (req, res) => {
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    const userId = req.user.userId;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: "Insufficient data provided",
      });
    }

    try {
      // Update  todo by matching todo id and userId
      const response = await Todo.findOneAndUpdate(
        { _id: id, userId: userId },
        { title, isCompleted },
        { new: true } // this will return the updated document
      );

      return res.status(200).json({
        status: true,
        message: "Todo updated successfully",
        data: response,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Cannot update todos, please try again",
      });
    }
  }
);

// Delete todo
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // delete to do by matching todo id and userId
    await Todo.findOneAndDelete({ _id: id, userId: userId });

    return res
      .status(200)
      .json({ status: true, message: "Todo deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Cannot delete todo, please try again",
    });
  }
});

module.exports = router;
