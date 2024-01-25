const express = require("express");
const app = express();
const cors = require("cors");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Joi = require("joi");

const port = process.env.PORT || 3001;

//middleware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

// /contact

//connect to mongodb
mongoose.connect("mongodb://localhost/ssda").then(() => {
  console.log("Connected to MongoDB...");
});

//model and schema
const emailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  company: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 455,
  },
});

const Email = mongoose.model("Email", emailSchema);

//Function to validate email
function validateFormData(email) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    company: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(255).required().email(),
    message: Joi.string().min(5).max(455).required(),
  });
  return schema.validate(email);
}

// API endpoint to handle form submissions
app.post("/submit-email", async (req, res) => {
  const { error } = validateFormData(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let newEmail = new Email({
      name: req.body.name,
      company: req.body.company,
      email: req.body.email,
      message: req.body.message,
    });
    newEmail = await newEmail.save();
    res.status(200).json({ message: "Email saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`listening on port ${port}`));
