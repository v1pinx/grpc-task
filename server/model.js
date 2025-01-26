const mongoose = require("mongoose");
const { Schema } = mongoose;

const blockSchema = new Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, default: true },
  isAnswer: { type: Boolean, default: false },
});

const optionSchema = new Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, required: true },
});

const questionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["ANAGRAM", "MCQ", "READ_ALONG", "CONTENT_ONLY"],
    },
    anagramType: {
      type: String,
      enum: ["WORD", "SENTENCE"],
    },
    blocks: [blockSchema],
    options: [optionSchema],
    solution: { type: String },
    title: { type: String, required: true },
    siblingId: { type: Schema.Types.ObjectId, ref: "Sibling", required: true },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
