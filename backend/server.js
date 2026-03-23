require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

const TodoSchema = new mongoose.Schema({
  text: String,
  isClicked: Boolean,
});

const TodoModel = mongoose.model("Todo", TodoSchema);

app.get("/todos", async (req, res) => {
  const todos = await TodoModel.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const newTodo = new TodoModel({
    text: req.body.text,
    isClicked: req.body.isClicked,
  });

  await newTodo.save();

  res.json({
    message: "Todo saved successfully",
  });
});

app.delete("/todos", async (req, res) => {
  await TodoModel.deleteMany({});
  res.send("all deleted");
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  await TodoModel.findByIdAndDelete(id);
  res.send("Todo Deleted");
});

app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  await TodoModel.findByIdAndUpdate(id, { isClicked: req.body.isClicked });
  res.send("Todo updated");
});

/* Start server */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
