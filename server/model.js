const mongoose = require('mongoose');
const { Schema } = mongoose;

// Block Schema for "ANAGRAM" type questions
const blockSchema = new Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, default: true },
  isAnswer: { type: Boolean, default: false },
});

// Option Schema for "MCQ" type questions
const optionSchema = new Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, required: true },
});

// Question Schema
const questionSchema = new Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['ANAGRAM', 'MCQ', 'READ_ALONG', 'CONTENT_ONLY'],  // Added the new types here
  },
  anagramType: { 
    type: String, 
    enum: ['WORD', 'SENTENCE'],
  },
  blocks: [blockSchema],  // Only for "ANAGRAM" type
  options: [optionSchema],  // Only for "MCQ" type
  solution: { type: String }, 
  title: { type: String, required: true },
  siblingId: { type: Schema.Types.ObjectId, ref: 'Sibling', required: true },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
