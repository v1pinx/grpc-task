const gRPC = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./proto/question.proto", {});
const gRPCObject = gRPC.loadPackageDefinition(packageDefinition);

const questionPackage = gRPCObject.question;

const Question = require("./model");
require('dotenv').config();
const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

async function GetAllQuestions(call, callback) {
  const { page = 1, limit = 20 } = call.request;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Question.countDocuments();
    const questions = await Question.find({}).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalCount / limit);
    callback(null, { questions, totalPages, currentPage: page });
  } catch (err) {
    callback(err, null);
  }
}

async function GetQuestionByType(call, callback) {
  const { page = 1, limit = 20 } = call.request;
  const skip = (page - 1) * limit;
  try {
    const type = call.request.type;
    const totalCount = await Question.countDocuments({ type: type });
    const questionByType = await Question.find({ type: type })
      .skip(skip)
      .limit(20);
    const totalPages = Math.ceil(totalCount / limit);
    callback(null, {
      questions: questionByType,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    callback(err, null);
  }
}

async function GetQuestionBySearchString(call, callback) {
  const { page = 1, limit = 20, searchString } = call.request;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Question.countDocuments({
      title: { $regex: searchString, $options: "i" },
    });
    const questionBySearchString = await Question.find({
      title: { $regex: searchString, $options: "i" },
    })
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(totalCount / limit);
    callback(null, {
      questions: questionBySearchString,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    callback(err, null);
  }
}

async function GetQuestionByTypeAndSearchString(call, callback) {
  const { page = 1, limit = 20, type, searchString } = call.request;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Question.countDocuments({
      type,
      title: { $regex: searchString, $options: "i" },
    });
    const questionByTypeAndSearchString = await Question.find({
      type,
      title: { $regex: searchString, $options: "i" },
    })
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(totalCount / limit);
    callback(null, {
      questions: questionByTypeAndSearchString,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    callback(err, null);
  }
}

const server = new gRPC.Server();
server.addService(questionPackage.QuestionService.service, {
  GetAllQuestions,
  GetQuestionByType,
  GetQuestionBySearchString,
  GetQuestionByTypeAndSearchString,
});

server.bindAsync(
  `0.0.0.0:${process.env.PORT}`,
  gRPC.ServerCredentials.createInsecure(),
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
    server.start();
  }
);
